import re, urllib.parse as up

_GITHUB_RE = re.compile(r"^/([^/]+)/([^/]+?)(?:\.git)?/?$")

def split_github_url(url: str) -> tuple[str, str]:
    url = url.strip()
    path = url.split(":", 1)[1] if url.startswith("git@") else up.urlparse(url).path
    m = _GITHUB_RE.match(path)
    if not m:
        raise ValueError("Invalid GitHub repository URL")
    return m.group(1), m.group(2)