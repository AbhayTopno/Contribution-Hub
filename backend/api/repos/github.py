import os, requests, collections
from datetime import datetime, timedelta
from typing import Optional

GQL_URL = "https://api.github.com/graphql"
HEADERS = {
    "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
    "Accept": "application/vnd.github+json",
}

def _run(query: str, variables: dict):
    r = requests.post(GQL_URL, json={"query": query, "variables": variables}, headers=HEADERS, timeout=20)
    r.raise_for_status()
    response_data = r.json()
    
    if "errors" in response_data:
        error_messages = [error.get("message", "Unknown error") for error in response_data["errors"]]
        raise Exception(f"GraphQL errors: {'; '.join(error_messages)}")
    
    if "data" not in response_data:
        raise Exception(f"No data in response: {response_data}")
    
    return response_data["data"]

ISSUES_Q = """
query($owner:String!,$name:String!,$cursor:String){
  repository(owner:$owner, name:$name){
    issues(first:100, after:$cursor, states:OPEN, orderBy:{field:CREATED_AT, direction:DESC}){
      nodes{
        title url createdAt state
        labels(first:20){ nodes{ name } }
        assignees(first:10){ 
          nodes{ 
            login 
            url 
            avatarUrl(size: 100)
          } 
        }
      }
      pageInfo{ hasNextPage endCursor }
    }
  }
}
"""

def open_issues(owner: str, repo: str) -> list[dict]:
    cursor, acc = None, []
    while True:
        data = _run(ISSUES_Q, {"owner": owner, "name": repo, "cursor": cursor})
        page = data["repository"]["issues"]
        acc += page["nodes"]
        if not page["pageInfo"]["hasNextPage"]:
            break
        cursor = page["pageInfo"]["endCursor"]
    return acc

TOP_CONTRIB_Q = """
query($owner:String!,$name:String!,$cursor:String,$since:GitTimestamp){
  repository(owner:$owner,name:$name){
    defaultBranchRef{
      target{ ... on Commit{
        history(first:100, after:$cursor, since:$since){
          nodes{ 
            author{ 
              user{
                login 
                url
                avatarUrl(size: 100)
              } 
            }
            committedDate
          }
          pageInfo{ hasNextPage endCursor }
        }
      } }
    }
  }
}
"""

REPO_STATS_Q = """
query($owner:String!,$name:String!){
  repository(owner:$owner, name:$name){
    stargazerCount
    forkCount
    languages(first: 10, orderBy: {field: SIZE, direction: DESC}){
      edges{
        size
        node{
          name
          color
        }
      }
    }
  }
}
"""

def _is_bot(login: str) -> bool:
    login = login.lower()
    return login.endswith(("[bot]", "-bot", "bot"))

def top_contributors(owner: str, repo: str, limit: int = 25, period: Optional[str] = None) -> list[dict]:
    cursor, counts = None, collections.Counter()
    
    since = None
    if period == "this_month":
        since = (datetime.now() - timedelta(days=30)).isoformat() + "Z"
    
    while True:
        data = _run(TOP_CONTRIB_Q, {"owner": owner, "name": repo, "cursor": cursor, "since": since})
        hist = data["repository"]["defaultBranchRef"]["target"]["history"]
        
        for node in hist["nodes"]:
            user = node["author"]["user"]
            if user and not _is_bot(user["login"]):
                counts[(user["login"], user["avatarUrl"])] += 1
        
        if not hist["pageInfo"]["hasNextPage"] or sum(counts.values()) >= 3000:
            break
        cursor = hist["pageInfo"]["endCursor"]

    return [
        {
            "login": login, 
            "commits": n, 
            "url": f"https://github.com/{login}",
            "avatarUrl": avatar_url or f"https://github.com/{login}.png?size=100"
        }
        for (login, avatar_url), n in counts.most_common(limit)
    ]

def repo_stats(owner: str, repo: str) -> dict:
    data = _run(REPO_STATS_Q, {"owner": owner, "name": repo})
    repo_data = data["repository"]
    
    languages = []
    total_size = sum(edge["size"] for edge in repo_data["languages"]["edges"])
    
    for edge in repo_data["languages"]["edges"]:
        languages.append({
            "name": edge["node"]["name"],
            "color": edge["node"]["color"],
            "percentage": round((edge["size"] / total_size) * 100, 1) if total_size > 0 else 0
        })
    
    return {
        "stars": repo_data["stargazerCount"],
        "forks": repo_data["forkCount"],
        "languages": languages
    }