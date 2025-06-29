import os
import requests
import collections
from datetime import datetime, timedelta
from typing import Optional

GQL_URL = "https://api.github.com/graphql"
HEADERS = {
    "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
    "Accept": "application/vnd.github+json",
}


def _run(query: str, variables: dict) -> dict:
    response = requests.post(GQL_URL, json={"query": query, "variables": variables}, headers=HEADERS, timeout=20)
    response.raise_for_status()
    data = response.json()

    if "errors" in data:
        messages = "; ".join(error.get("message", "Unknown error") for error in data["errors"])
        raise Exception(f"GraphQL errors: {messages}")

    if "data" not in data:
        raise Exception(f"No data in response: {data}")

    return data["data"]


ISSUES_Q = """
query($owner:String!,$name:String!,$cursor:String){
  repository(owner:$owner, name:$name){
    issues(first:100, after:$cursor, states:OPEN, orderBy:{field:CREATED_AT, direction:DESC}){
      nodes{
        title url createdAt state
        labels(first:20){ nodes{ name } }
        assignees(first:10){ nodes{ login url avatarUrl(size: 100) } }
      }
      pageInfo{ hasNextPage endCursor }
    }
  }
}
"""


def open_issues(owner: str, repo: str) -> list[dict]:
    cursor, issues = None, []
    while True:
        data = _run(ISSUES_Q, {"owner": owner, "name": repo, "cursor": cursor})
        page = data["repository"]["issues"]
        issues.extend(page["nodes"])
        if not page["pageInfo"]["hasNextPage"]:
            break
        cursor = page["pageInfo"]["endCursor"]
    return issues


TOP_CONTRIB_Q = """
query($owner:String!,$name:String!,$cursor:String,$since:GitTimestamp){
  repository(owner:$owner,name:$name){
    defaultBranchRef{
      target{ ... on Commit{
        history(first:100, after:$cursor, since:$since){
          nodes{ 
            author{ user{ login url avatarUrl(size: 100) } }
            committedDate
          }
          pageInfo{ hasNextPage endCursor }
        }
      } }
    }
  }
}
"""


def _is_bot(login: str) -> bool:
    login = login.lower()
    return login.endswith(("[bot]", "-bot", "bot"))


def top_contributors(owner: str, repo: str, limit: int = 25, period: Optional[str] = None) -> list[dict]:
    cursor, counts = None, collections.Counter()
    since = (datetime.utcnow() - timedelta(days=30)).isoformat() + "Z" if period == "this_month" else None

    while True:
        data = _run(TOP_CONTRIB_Q, {"owner": owner, "name": repo, "cursor": cursor, "since": since})
        history = data["repository"]["defaultBranchRef"]["target"]["history"]

        for node in history["nodes"]:
            user = node["author"]["user"]
            if user and not _is_bot(user["login"]):
                counts[(user["login"], user["avatarUrl"])] += 1

        if not history["pageInfo"]["hasNextPage"] or sum(counts.values()) >= 3000:
            break
        cursor = history["pageInfo"]["endCursor"]

    return [
        {
            "login": login,
            "commits": commits,
            "url": f"https://github.com/{login}",
            "avatarUrl": avatar or f"https://github.com/{login}.png?size=100"
        }
        for (login, avatar), commits in counts.most_common(limit)
    ]


REPO_STATS_Q = """
query($owner:String!,$name:String!){
  repository(owner:$owner, name:$name){
    stargazerCount
    forkCount
    languages(first: 10, orderBy: {field: SIZE, direction: DESC}){
      edges{
        size
        node{ name color }
      }
    }
  }
}
"""


def repo_stats(owner: str, repo: str) -> dict:
    data = _run(REPO_STATS_Q, {"owner": owner, "name": repo})["repository"]
    total_size = sum(edge["size"] for edge in data["languages"]["edges"])

    languages = [
        {
            "name": edge["node"]["name"],
            "color": edge["node"]["color"],
            "percentage": round((edge["size"] / total_size) * 100, 1) if total_size else 0
        }
        for edge in data["languages"]["edges"]
    ]

    return {
        "stars": data["stargazerCount"],
        "forks": data["forkCount"],
        "languages": languages
    }
