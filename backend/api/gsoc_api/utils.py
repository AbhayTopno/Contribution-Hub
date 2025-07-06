import urllib.parse
from typing import List, Optional
import requests
from django.conf import settings

GOOGLE_API = "https://www.googleapis.com/customsearch/v1"

def google_items(query: str) -> List[dict]:
    params = {
        "q": query,
        "key": settings.GOOGLE_CSE_API_KEY,
        "cx": settings.GOOGLE_CSE_ID,
        "num": 10,
        "siteSearch": "github.com",
        "siteSearchFilter": "i",
    }
    r = requests.get(GOOGLE_API, params=params, timeout=5)
    r.raise_for_status()
    return r.json().get("items", [])

def first_github_url(items: List[dict]) -> Optional[str]:
    for item in items:
        url = item.get("link", "")
        parsed_url = urllib.parse.urlparse(url)
        
        if parsed_url.netloc == "github.com":
            path_parts = parsed_url.path.strip('/').split('/')
            if len(path_parts) >= 1 and path_parts[0]:
                return f"https://github.com/{path_parts[0]}"
    return None
