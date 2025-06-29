import os
import time
from datetime import datetime, timedelta
from functools import lru_cache
from typing import List, Dict
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv

load_dotenv()

TOKEN   = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"Bearer {TOKEN}"}


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────
def extract_org_from_github_url(github_url: str) -> str:
    """
    Return the organisation / user segment of a GitHub URL, e.g.
    ➜  "https://github.com/OWASP/NVD" -> "OWASP"
    """
    path = urlparse(github_url).path.strip("/")          # → "OWASP/NVD"
    return path.split("/")[0] or github_url              # fallback: raw arg


def _get_cache_key() -> str:
    # One entry per (org, 10‑minute window)
    now = datetime.now()
    return f"{now:%Y%m%d%H}{now.minute // 10}"           # compact string


@lru_cache(maxsize=32)
def _cached_fetch(org_name: str, cache_key: str) -> List[Dict]:
    # cache_key is only to bust the cache; it is ignored inside
    return _fetch_repos(org_name)


# ──────────────────────────────────────────────────────────────────────────────
# Network layer
# ──────────────────────────────────────────────────────────────────────────────
def _fetch_repos(org_name: str) -> List[Dict]:
    """Return ≤ 100 repos pushed within the last 30 days (fast‑exit once older)."""
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

            # Handle secondary‑rate‑limit gently (wait ≤ 5 min)
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

                # Because results are already push‑date‑DESC, we can exit early
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


# ──────────────────────────────────────────────────────────────────────────────
# Public entry point
# ──────────────────────────────────────────────────────────────────────────────
def fetch_all_org_repos(github_url_or_org: str) -> List[Dict]:
    org = extract_org_from_github_url(github_url_or_org)
    return _cached_fetch(org, _get_cache_key())
