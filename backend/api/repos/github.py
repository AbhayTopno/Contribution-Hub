import os, requests, collections

GQL_URL = "https://api.github.com/graphql"
HEADERS = {
    "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
    "Accept": "application/vnd.github+json",
}

def _run(query: str, variables: dict):
    r = requests.post(GQL_URL, json={"query": query, "variables": variables}, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return r.json()["data"]

ISSUES_Q = """
query($owner:String!,$name:String!,$cursor:String){
  repository(owner:$owner, name:$name){
    issues(first:100, after:$cursor, states:OPEN, orderBy:{field:CREATED_AT, direction:DESC}){
      nodes{
        title url createdAt state
        labels(first:20){ nodes{ name } }
        assignees(first:10){ nodes{ login url } }
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
query($owner:String!,$name:String!,$cursor:String){
  repository(owner:$owner,name:$name){
    defaultBranchRef{
      target{ ... on Commit{
        history(first:100, after:$cursor){
          nodes{ author{ user{login url} } }
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

def top_contributors(owner: str, repo: str, limit: int = 25) -> list[dict]:
    cursor, counts = None, collections.Counter()
    while True:
        data = _run(TOP_CONTRIB_Q, {"owner": owner, "name": repo, "cursor": cursor})
        hist = data["repository"]["defaultBranchRef"]["target"]["history"]
        for node in hist["nodes"]:
            user = node["author"]["user"]
            if user and not _is_bot(user["login"]):
                counts[user["login"]] += 1
        if not hist["pageInfo"]["hasNextPage"] or sum(counts.values()) >= 3000:
            break
        cursor = hist["pageInfo"]["endCursor"]

    return [
        {"login": login, "commits": n, "url": f"https://github.com/{login}"}
        for login, n in counts.most_common(limit)
    ]