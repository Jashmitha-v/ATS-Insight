"""Simple in-memory store for recent analysis results, keyed by analysis id.

This is intentionally process-local (no external DB/Redis) to keep the
project deployable as a single free-tier Render web service. Entries are
capped to avoid unbounded memory growth.
"""
import uuid
from collections import OrderedDict

_MAX_ENTRIES = 200
_store: "OrderedDict[str, dict]" = OrderedDict()


def save_analysis(payload: dict) -> str:
    analysis_id = uuid.uuid4().hex
    _store[analysis_id] = payload
    while len(_store) > _MAX_ENTRIES:
        _store.popitem(last=False)
    return analysis_id


def get_analysis(analysis_id: str):
    return _store.get(analysis_id)
