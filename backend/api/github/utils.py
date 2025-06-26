import requests
import os
from datetime import datetime, timedelta
from typing import List, Dict
from dotenv import load_dotenv
from functools import lru_cache
import time
import re

load_dotenv()

TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

def extract_org_from_github_url(github_url: str) -> str:
    """Extract organization name from GitHub URL"""
    # Handle various GitHub URL formats
    patterns = [
        r'github\.com/([^/]+)',  # https://github.com/org or http://github.com/org
        r'github\.com/([^/]+)/',  # https://github.com/org/
        r'github\.com/([^/]+)/.*',  # https://github.com/org/repo
    ]
    
    for pattern in patterns:
        match = re.search(pattern, github_url, re.IGNORECASE)
        if match:
            return match.group(1)
    
    # If no pattern matches, assume it's already an org name
    return github_url

@lru_cache(maxsize=16)
def _cached_fetch(org_name: str, cache_key: str) -> List[Dict]:
    return _fetch_repos(org_name)

def _get_cache_key() -> str:
    now = datetime.now()
    return now.replace(minute=(now.minute // 10) * 10, second=0, microsecond=0).isoformat()

def _fetch_repos(org_name: str) -> List[Dict]:
    one_month_ago = datetime.now() - timedelta(days=30)
    
    query = """
    query($login: String!, $after: String) {
      organization(login: $login) {
        repositories(first: 100, after: $after, orderBy: {field: PUSHED_AT, direction: DESC}) {
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
    
    all_repos = []
    after_cursor = None
    session = requests.Session()
    session.headers.update(HEADERS)
    
    try:
        while len(all_repos) < 100:
            response = session.post(
                "https://api.github.com/graphql",
                json={"query": query, "variables": {"login": org_name, "after": after_cursor}},
                timeout=15
            )
            
            if response.status_code == 403:
                reset_time = response.headers.get('X-RateLimit-Reset')
                if reset_time:
                    wait = int(reset_time) - int(time.time())
                    if 0 < wait < 300:
                        time.sleep(wait)
                        continue
                break
            
            if response.status_code != 200:
                break
                
            data = response.json()
            if "errors" in data or not data.get("data", {}).get("organization"):
                break
            
            repos = data["data"]["organization"]["repositories"]["nodes"]
            
            for repo in repos:
                pushed_at = repo.get("pushedAt")
                if pushed_at:
                    try:
                        pushed_date = datetime.fromisoformat(pushed_at.replace('Z', '+00:00'))
                        if pushed_date >= one_month_ago.replace(tzinfo=pushed_date.tzinfo):
                            all_repos.append(repo)
                        else:
                            return all_repos
                    except:
                        continue
            
            page_info = data["data"]["organization"]["repositories"]["pageInfo"]
            if not page_info["hasNextPage"]:
                break
            after_cursor = page_info["endCursor"]
    
    finally:
        session.close()
    
    return all_repos

def fetch_all_org_repos(github_url_or_org: str) -> List[Dict]:
    org_name = extract_org_from_github_url(github_url_or_org)
    return _cached_fetch(org_name, _get_cache_key())