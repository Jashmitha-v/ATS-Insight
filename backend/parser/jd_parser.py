"""Rule-based extraction of structured requirements from a job description."""
import re

from ats.skill_bank import (
    ALL_SKILLS,
    CERTIFICATIONS,
    FRAMEWORKS_LIBRARIES,
    PROGRAMMING_LANGUAGES,
    SOFT_SKILLS,
)
from utils.text_cleaner import normalize_whitespace

EXPERIENCE_RE = re.compile(
    r"(\d+)\s*\+?\s*(?:-|to)?\s*(\d+)?\s*\+?\s*years?", re.I
)


def _find_matches(text: str, vocabulary: list) -> list:
    lower_text = text.lower()
    found = []
    for term in vocabulary:
        pattern = r"(?<![a-zA-Z0-9])" + re.escape(term) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, lower_text):
            found.append(term)
    return sorted(set(found))


def extract_required_experience(text: str) -> dict:
    match = EXPERIENCE_RE.search(text)
    if not match:
        return {"min_years": 0, "raw": None}
    min_years = int(match.group(1))
    return {"min_years": min_years, "raw": match.group(0)}


def extract_keywords(text: str, top_n: int = 40) -> list:
    """Extract significant noun-like tokens/phrases as general keywords,
    beyond the curated skill vocabulary, using frequency + capitalization cues.
    """
    from utils.text_cleaner import STOPWORDS, tokenize_words

    words = tokenize_words(text)
    freq = {}
    for w in words:
        if w in STOPWORDS or len(w) < 3:
            continue
        freq[w] = freq.get(w, 0) + 1

    ranked = sorted(freq.items(), key=lambda kv: kv[1], reverse=True)
    return [w for w, _ in ranked[:top_n]]


def parse_job_description(raw_text: str) -> dict:
    text = normalize_whitespace(raw_text)

    skills = _find_matches(text, ALL_SKILLS)
    programming_languages = _find_matches(text, PROGRAMMING_LANGUAGES)
    frameworks = _find_matches(text, FRAMEWORKS_LIBRARIES)
    soft_skills = _find_matches(text, SOFT_SKILLS)
    certifications = _find_matches(text, CERTIFICATIONS)
    experience = extract_required_experience(text)
    general_keywords = extract_keywords(text)

    return {
        "raw_text": text,
        "skills": skills,
        "programming_languages": programming_languages,
        "frameworks": frameworks,
        "soft_skills": soft_skills,
        "certifications": certifications,
        "experience_requirement": experience,
        "keywords": sorted(set(skills + general_keywords)),
        "word_count": len(text.split()),
    }
