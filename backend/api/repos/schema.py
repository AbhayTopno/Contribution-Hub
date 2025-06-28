import strawberry
from typing import List, Optional
from collections import Counter
from enum import Enum
from .utils import split_github_url
from .github import open_issues, top_contributors, repo_stats

@strawberry.type
class Label:
    name: str

@strawberry.type
class Assignee:
    login: str
    url: str
    avatarUrl: str

@strawberry.type
class Issue:
    title: str
    url: str
    created_at: str
    labels: List[Label]
    assignees: List[Assignee]

@strawberry.type
class Contributor:
    login: str
    commits: int
    url: str
    avatarUrl: str

@strawberry.type
class Language:
    name: str
    color: str
    percentage: float

@strawberry.type
class LabelCount:
    name: str
    count: int

@strawberry.type
class RepoStats:
    stars: int
    forks: int
    languages: List[Language]

@strawberry.type
class IssueCounts:
    total_open: int
    unassigned: int
    assigned: int
    by_label: List[LabelCount]

@strawberry.enum
class ContributorPeriodEnum(Enum):
    ALL_TIME = "all_time"
    THIS_MONTH = "this_month"

@strawberry.type
class RepoInfo:
    def __init__(self, owner: str, name: str):
        self._owner = owner
        self._name = name

    @strawberry.field
    def issues(self, info, issue_type: Optional[str] = None) -> List[Issue]:
        raw = open_issues(self._owner, self._name)
        unassigned, assigned = [], []

        for node in raw:
            label_objs = [Label(name=l["name"]) for l in node.get("labels", {}).get("nodes", [])]
            assignee_objs = [
                Assignee(
                    login=a["login"], 
                    url=a["url"],
                    avatarUrl=a.get("avatarUrl", f"https://github.com/{a['login']}.png?size=100")
                ) 
                for a in node.get("assignees", {}).get("nodes", [])
            ]

            if issue_type and not any(lbl.name.lower() == issue_type.lower() for lbl in label_objs):
                continue

            issue_obj = Issue(
                title=node["title"],
                url=node["url"],
                created_at=node["createdAt"],
                labels=label_objs,
                assignees=assignee_objs,
            )

            (unassigned if not assignee_objs else assigned).append(issue_obj)

        return unassigned + assigned

    @strawberry.field
    def contributors(self, info, limit: int = 25, period: Optional[ContributorPeriodEnum] = None) -> List[Contributor]:
        period_str = period.value if period else None
        contributors = top_contributors(self._owner, self._name, limit, period_str)
        return [
            Contributor(
                login=c["login"],
                commits=c["commits"],
                url=c["url"],
                avatarUrl=c["avatarUrl"]
            )
            for c in contributors
        ]

    @strawberry.field
    def issue_counts(self, info) -> IssueCounts:
        raw = open_issues(self._owner, self._name)
        unassigned_count = assigned_count = 0
        label_counter = Counter()
        
        for node in raw:
            assignees = node.get("assignees", {}).get("nodes", [])
            if assignees:
                assigned_count += 1
            else:
                unassigned_count += 1
            
            for label in node.get("labels", {}).get("nodes", []):
                label_counter[label["name"]] += 1
        
        label_counts = [LabelCount(name=name, count=count) for name, count in label_counter.most_common()]
        
        return IssueCounts(
            total_open=len(raw),
            unassigned=unassigned_count,
            assigned=assigned_count,
            by_label=label_counts
        )

    @strawberry.field
    def stats(self, info) -> RepoStats:
        raw = repo_stats(self._owner, self._name)
        languages = [
            Language(name=lang["name"], color=lang["color"], percentage=lang["percentage"])
            for lang in raw["languages"]
        ]
        return RepoStats(
            stars=raw["stars"],
            forks=raw["forks"],
            languages=languages
        )

@strawberry.type
class Query:
    @strawberry.field
    def repo_info(self, info, url: str) -> RepoInfo:
        owner, repo = split_github_url(url)
        return RepoInfo(owner=owner, name=repo)

schema = strawberry.Schema(query=Query)