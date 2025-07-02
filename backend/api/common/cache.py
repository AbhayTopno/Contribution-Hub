"""common/cache.py – tiny Redis‑caching helper used across the project."""
from __future__ import annotations

import hashlib
import json
from datetime import datetime
from functools import wraps
from typing import Any, Callable

from django.core.cache import cache
from django.db.models import QuerySet

__all__ = ["redis_cached"]


def _jsonable(x: Any) -> str:
    """Fallback serializer for non‑JSON types (e.g. datetime)."""
    return x.isoformat() if isinstance(x, datetime) else str(x)


def redis_cached(*, ttl: int | None = None, prefix: str = "gql") -> Callable:
    """
    Decorator that caches a pure function’s return value in Redis.

    • ``ttl=None`` – use global ``CACHES['default']['TIMEOUT']`` (300 s).
    • Works with any arguments that are JSON‑serialisable (plus datetime).
    • QuerySets are evaluated to lists so they pickle cleanly.

    Example
    -------
    >>> @redis_cached()          # 5‑minute default
    ... def get_data(x): ...

    >>> @redis_cached(ttl=900)   # explicit 15‑minute TTL
    ... def get_slow(): ...
    """

    def decorator(fn: Callable):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            key_material = json.dumps(
                [fn.__name__, args, kwargs],
                default=_jsonable,
                sort_keys=True,
            ).encode()
            cache_key = f"{prefix}:{hashlib.sha1(key_material).hexdigest()}"

            if (cached := cache.get(cache_key)) is not None:
                return cached

            result = fn(*args, **kwargs)
            if isinstance(result, QuerySet):
                result = list(result)  # force evaluation for safe pickling
            cache.set(cache_key, result, timeout=ttl)
            return result

        return wrapper

    return decorator
