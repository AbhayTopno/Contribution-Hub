import os
import time
from datetime import datetime, timedelta
from typing import List, Dict
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from api.common.cache import redis_cached

load_dotenv()

TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

def extract_org_from_github_url(github_url: str) -> str:
    path = urlparse(github_url).path.strip("/")       
    return path.split("/")[0] or github_url


def _get_cache_key() -> str:
    now = datetime.now()
    return f"{now:%Y%m%d%H}{now.minute // 10}"

def _fetch_repos(org_name: str) -> List[Dict]:
    one_month_ago = datetime.utcnow() - timedelta(days=30)

    gql = """
    query($login: String!, $after: String) {
      organization(login: $login) {
        repositories(first: 100, after: $after,
                     orderBy: {field: PUSHED_AT, direction: DESC}) {
          pageInfo { hasNextPage endCursor }
          nodes {
            name url description stargazerCount forkCount pushedAt
            defaultBranchRef { target { ... on Commit { committedDate } } }
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges { node { name color } }
            }
          }
        }
      }
    }
    """

    repos: List[Dict] = []
    after = None
    session = requests.Session()
    session.headers.update(HEADERS)

    try:
        while True:
            r = session.post(
                "https://api.github.com/graphql",
                json={"query": gql, "variables": {"login": org_name, "after": after}},
                timeout=15,
            )

            # secondary‑rate‑limit: wait ≤ 5 min then retry
            if r.status_code == 403 and (reset := r.headers.get("X-RateLimit-Reset")):
                wait = int(reset) - int(time.time())
                if wait > 0:
                    time.sleep(min(wait, 300))
                    continue

            if r.status_code != 200:
                break

            data = r.json().get("data", {}).get("organization")
            if not data:
                break

            for repo in data["repositories"]["nodes"]:
                pushed = repo.get("pushedAt")
                if not pushed:
                    continue
                pushed_dt = datetime.fromisoformat(pushed.rstrip("Z") + "+00:00")

                if pushed_dt < one_month_ago.replace(tzinfo=pushed_dt.tzinfo):
                    return repos

                repos.append(repo)
                if len(repos) >= 100:
                    return repos

            page = data["repositories"]["pageInfo"]
            if not page["hasNextPage"]:
                break
            after = page["endCursor"]

    finally:
        session.close()

    return repos

@redis_cached()
def _cached_fetch(org_name: str, _placeholder: str) -> List[Dict]:
    return _fetch_repos(org_name)

def fetch_all_org_repos(github_url_or_org: str) -> List[Dict]:
    org = extract_org_from_github_url(github_url_or_org)
    return _cached_fetch(org, _get_cache_key())
