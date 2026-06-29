"""Fuzzy keyword/skill matching using RapidFuzz."""
from rapidfuzz import fuzz, process

FUZZY_THRESHOLD = 85


def fuzzy_match_one(term: str, candidates: list) -> tuple:
    """Return (best_match_or_None, score) for `term` against `candidates`."""
    if not candidates:
        return None, 0
    result = process.extractOne(term, candidates, scorer=fuzz.WRatio)
    if result is None:
        return None, 0
    match, score, _ = result
    return (match, score) if score >= FUZZY_THRESHOLD else (None, score)


def match_keyword_sets(required: list, present: list) -> dict:
    """Classify required keywords as matched / partial / missing against the
    candidate's present keywords, using fuzzy matching for near-matches.
    """
    matched, partial, missing = [], [], []
    present_lower = [p.lower() for p in present]

    for term in required:
        term_lower = term.lower()
        if term_lower in present_lower:
            matched.append(term)
            continue

        match, score = fuzzy_match_one(term_lower, present_lower)
        if match and score >= FUZZY_THRESHOLD:
            matched.append(term)
        elif match and score >= 65:
            partial.append(term)
        else:
            missing.append(term)

    additional = [
        p for p in present
        if p.lower() not in [r.lower() for r in required]
        and not any(p.lower() == m.lower() for m in matched + partial)
    ]

    return {
        "matched": sorted(set(matched)),
        "partial": sorted(set(partial)),
        "missing": sorted(set(missing)),
        "additional": sorted(set(additional)),
    }
