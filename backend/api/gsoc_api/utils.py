import time
from typing import Optional
import requests
from django.conf import settings

GITHUB_SEARCH_API = "https://api.github.com/search/users"


class GitHubSearchError(RuntimeError):
    def __init__(
        self,
        status_code: int,
        message: str,
        reason: str | None = None,
        retry_after_seconds: int | None = None,
    ):
        self.status_code = status_code
        self.reason = reason
        self.retry_after_seconds = retry_after_seconds
        detail = f" ({reason})" if reason else ""
        super().__init__(f"GitHub Search returned HTTP {status_code}: {message}{detail}")

    @property
    def retryable(self) -> bool:
        return self.retry_after_seconds is not None or self.status_code == 429 or self.status_code >= 500


def search_github_organization(name: str) -> Optional[str]:
    token = getattr(settings, "GITHUB_TOKEN", None)
    if not token:
        raise RuntimeError("GITHUB_TOKEN is required to search GitHub organizations.")

    params = {
        "q": f"{name} type:org",
        "per_page": 1,
    }
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    r = requests.get(GITHUB_SEARCH_API, params=params, headers=headers, timeout=10)
    if not r.ok:
        try:
            error = r.json()
        except ValueError:
            error = {}

        message = error.get("message") or r.reason or "Unknown GitHub Search error"
        rate_limit_reset = r.headers.get("X-RateLimit-Reset")
        rate_limit_exhausted = r.headers.get("X-RateLimit-Remaining") == "0"
        retry_after_seconds = None
        if rate_limit_reset and rate_limit_exhausted:
            retry_after_seconds = max(1, int(rate_limit_reset) - int(time.time()))

        raise GitHubSearchError(r.status_code, message, retry_after_seconds=retry_after_seconds)

    items = r.json().get("items", [])
    return items[0].get("html_url") if items else None
