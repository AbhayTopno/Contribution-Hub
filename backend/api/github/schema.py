import strawberry
from typing import List, Optional
from .utils import fetch_all_org_repos

@strawberry.type
class Language:
    name: str
    color: Optional[str] = "#000000"

@strawberry.type
class Repository:
    name: str
    url: str
    description: Optional[str]
    stars: int
    forks: int
    last_commit_date: str
    languages: List[Language]

@strawberry.type
class Query:
    @strawberry.field
    def github_repos(self, org_name: str) -> List[Repository]:
        repos_data = fetch_all_org_repos(org_name)
        
        repositories = []
        for repo in repos_data:
            languages = []
            for edge in repo.get("languages", {}).get("edges", []):
                node = edge.get("node", {})
                if node.get("name"):
                    languages.append(Language(
                        name=node["name"],
                        color=node.get("color", "#000000")
                    ))
            
            if not languages:
                continue
            
            commit_date = None
            if repo.get("defaultBranchRef", {}).get("target"):
                commit_date = repo["defaultBranchRef"]["target"].get("committedDate")
            if not commit_date:
                commit_date = repo.get("pushedAt")
            if not commit_date:
                continue
            
            repositories.append(Repository(
                name=repo["name"],
                url=repo["url"],
                description=repo.get("description"),
                stars=repo.get("stargazerCount", 0),
                forks=repo.get("forkCount", 0),
                last_commit_date=commit_date,
                languages=languages
            ))
        
        return repositories

schema = strawberry.Schema(query=Query)