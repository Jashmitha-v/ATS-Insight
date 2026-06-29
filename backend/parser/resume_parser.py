"""Rule-based extraction of structured fields from raw resume text."""
import re

from ats.skill_bank import ALL_SKILLS, CERTIFICATIONS, SKILL_CATEGORIES
from utils.text_cleaner import normalize_whitespace, split_lines, strip_bullets

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(
    r"(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{0,4}"
)
LINKEDIN_RE = re.compile(r"(https?://)?(www\.)?linkedin\.com/[A-Za-z0-9_/\-]+", re.I)
GITHUB_RE = re.compile(r"(https?://)?(www\.)?github\.com/[A-Za-z0-9_/\-]+", re.I)

SECTION_HEADERS = {
    "experience": ["experience", "work experience", "professional experience", "employment history"],
    "education": ["education", "academic background", "educational qualification"],
    "projects": ["projects", "personal projects", "academic projects"],
    "skills": ["skills", "technical skills", "core competencies", "skill set"],
    "certifications": ["certifications", "certificates", "licenses & certifications"],
    "languages": ["languages", "language proficiency"],
    "achievements": ["achievements", "awards", "honors", "accomplishments"],
    "summary": ["summary", "professional summary", "objective", "profile"],
}

DEGREE_KEYWORDS = [
    "bachelor", "master", "b.tech", "m.tech", "btech", "mtech", "b.sc", "m.sc",
    "bsc", "msc", "phd", "ph.d", "mba", "bca", "mca", "diploma", "associate degree",
    "b.e.", "m.e.", "be ", "me ",
]


def _find_section_bounds(lines):
    """Map section name -> (start_idx, end_idx) based on header detection."""
    bounds = {}
    indices = []
    for i, line in enumerate(lines):
        clean = line.strip().lower().rstrip(":")
        for section, headers in SECTION_HEADERS.items():
            if clean in headers or (len(clean.split()) <= 4 and clean in headers):
                indices.append((i, section))
                break

    for idx, (start, section) in enumerate(indices):
        end = indices[idx + 1][0] if idx + 1 < len(indices) else len(lines)
        bounds[section] = (start + 1, end)
    return bounds


def _extract_name(lines, email):
    """Best-effort: the name is usually the first non-empty, non-contact line."""
    for line in lines[:6]:
        candidate = line.strip()
        if not candidate or EMAIL_RE.search(candidate) or PHONE_RE.search(candidate):
            continue
        if "@" in candidate or "linkedin" in candidate.lower() or "github" in candidate.lower():
            continue
        words = candidate.split()
        if 1 <= len(words) <= 4 and all(w.replace(".", "").isalpha() for w in words):
            return candidate.title()
    return None


def extract_contact_info(text: str) -> dict:
    email_match = EMAIL_RE.search(text)
    linkedin_match = LINKEDIN_RE.search(text)
    github_match = GITHUB_RE.search(text)

    phone = None
    for match in PHONE_RE.finditer(text):
        digits = re.sub(r"\D", "", match.group())
        if 7 <= len(digits) <= 15:
            phone = match.group().strip()
            break

    lines = split_lines(text)
    name = _extract_name(lines, email_match.group() if email_match else None)

    return {
        "name": name,
        "email": email_match.group() if email_match else None,
        "phone": phone,
        "linkedin": linkedin_match.group() if linkedin_match else None,
        "github": github_match.group() if github_match else None,
    }


def extract_skills(text: str) -> list:
    lower_text = text.lower()
    found = []
    for skill in ALL_SKILLS:
        pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, lower_text):
            found.append(skill)
    return sorted(set(found))


def extract_skills_by_category(text: str) -> dict:
    lower_text = text.lower()
    categorized = {}
    for category, skills in SKILL_CATEGORIES.items():
        matches = [
            s for s in skills
            if re.search(r"(?<![a-zA-Z0-9])" + re.escape(s) + r"(?![a-zA-Z0-9])", lower_text)
        ]
        if matches:
            categorized[category] = sorted(set(matches))
    return categorized


def extract_certifications(text: str) -> list:
    lower_text = text.lower()
    found = [cert for cert in CERTIFICATIONS if cert in lower_text]
    return sorted(set(found))


def extract_section_text(text: str, section: str) -> str:
    lines = split_lines(text)
    bounds = _find_section_bounds(lines)
    if section not in bounds:
        return ""
    start, end = bounds[section]
    return "\n".join(lines[start:end]).strip()


def extract_education(text: str) -> list:
    section_text = extract_section_text(text, "education") or text
    lines = split_lines(section_text)
    entries = []
    for line in lines:
        lower = line.lower()
        if any(keyword in lower for keyword in DEGREE_KEYWORDS):
            entries.append(line)
    return entries[:6]


def extract_experience_entries(text: str) -> list:
    section_text = extract_section_text(text, "experience")
    if not section_text:
        return []
    lines = split_lines(section_text)
    return lines[:30]


def extract_years_of_experience(text: str) -> float:
    matches = re.findall(r"(\d+(?:\.\d+)?)\s*\+?\s*years?", text.lower())
    years = [float(m) for m in matches if float(m) < 50]
    return max(years) if years else 0.0


def extract_projects(text: str) -> list:
    section_text = extract_section_text(text, "projects")
    if not section_text:
        return []
    lines = split_lines(section_text)
    return lines[:20]


def extract_languages(text: str) -> list:
    section_text = extract_section_text(text, "languages")
    if not section_text:
        return []
    raw = re.split(r"[,\n|•]", section_text)
    return [strip_bullets(l).strip() for l in raw if l.strip()][:10]


def extract_achievements(text: str) -> list:
    section_text = extract_section_text(text, "achievements")
    if not section_text:
        return []
    return split_lines(section_text)[:10]


def extract_summary(text: str) -> str:
    return extract_section_text(text, "summary")


def parse_resume(raw_text: str) -> dict:
    text = normalize_whitespace(raw_text)
    contact = extract_contact_info(text)

    return {
        "raw_text": text,
        "contact": contact,
        "skills": extract_skills(text),
        "skills_by_category": extract_skills_by_category(text),
        "certifications": extract_certifications(text),
        "education": extract_education(text),
        "experience": extract_experience_entries(text),
        "years_of_experience": extract_years_of_experience(text),
        "projects": extract_projects(text),
        "languages": extract_languages(text),
        "achievements": extract_achievements(text),
        "summary": extract_summary(text),
        "word_count": len(text.split()),
        "has_section": {
            section: bool(extract_section_text(text, section))
            for section in SECTION_HEADERS
        },
    }
