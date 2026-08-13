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
class RepositoryPage:
    repositories: List[Repository]
    total_count: int
    has_next_page: bool
    total_stars: int
    total_forks: int


@strawberry.type
class Query:
    @strawberry.field
    def github_repos(
        self, github_url: str, limit: int = 9, offset: int = 0
    ) -> RepositoryPage:
        data = fetch_all_org_repos(github_url)

        repos: List[Repository] = []
        for r in data:
            langs = [
                Language(name=e["node"]["name"], color=e["node"].get("color", "#000000"))
                for e in r.get("languages", {}).get("edges", [])
                if e.get("node", {}).get("name")
            ]
            if not langs:
                continue

            commit_date = (
                r.get("defaultBranchRef", {}).get("target", {}).get("committedDate")
                or r.get("pushedAt")
            )
            if not commit_date:
                continue

            repos.append(
                Repository(
                    name=r["name"],
                    url=r["url"],
                    description=r.get("description"),
                    stars=r.get("stargazerCount", 0),
                    forks=r.get("forkCount", 0),
                    last_commit_date=commit_date,
                    languages=langs,
                )
            )

        # Return biggest-to-smallest by stargazer count
        repos.sort(key=lambda repo: repo.stars, reverse=True)

        total_count = len(repos)
        page = repos[offset : offset + limit]

        return RepositoryPage(
            repositories=page,
            total_count=total_count,
            has_next_page=offset + limit < total_count,
            total_stars=sum(repo.stars for repo in repos),
            total_forks=sum(repo.forks for repo in repos),
        )


schema = strawberry.Schema(query=Query)
