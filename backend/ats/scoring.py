"""Modular, weighted ATS scoring engine.

Final score is a weighted sum of sub-scores (each 0-100):
    Skills          35%
    Keywords        20%
    Experience      15%
    Projects        10%
    Education       10%
    Formatting       5%
    Certifications   5%
"""
from ats.matcher import match_keyword_sets

WEIGHTS = {
    "skills": 0.35,
    "keywords": 0.20,
    "experience": 0.15,
    "projects": 0.10,
    "education": 0.10,
    "formatting": 0.05,
    "certifications": 0.05,
}


def _ratio_score(matched_count: int, total_count: int) -> float:
    if total_count == 0:
        return 100.0
    return round(min(matched_count / total_count, 1.0) * 100, 1)


def score_skills(resume_skills, jd_skills):
    result = match_keyword_sets(jd_skills, resume_skills)
    score = _ratio_score(len(result["matched"]) + 0.5 * len(result["partial"]), len(jd_skills))
    return score, result


def score_keywords(resume_data, jd_data):
    resume_terms = set(resume_data["skills"]) | set(
        w for w in resume_data["raw_text"].lower().split()
    )
    result = match_keyword_sets(jd_data["keywords"], list(resume_terms))
    score = _ratio_score(
        len(result["matched"]) + 0.5 * len(result["partial"]), len(jd_data["keywords"])
    )
    return score, result


def score_experience(resume_data, jd_data):
    required_years = jd_data["experience_requirement"]["min_years"]
    candidate_years = resume_data["years_of_experience"]

    if required_years == 0:
        score = 100.0 if resume_data["experience"] else 60.0
    elif candidate_years >= required_years:
        score = 100.0
    elif candidate_years == 0:
        score = 30.0 if resume_data["experience"] else 0.0
    else:
        score = round((candidate_years / required_years) * 100, 1)

    return min(score, 100.0)


def score_projects(resume_data, jd_data):
    projects = resume_data["projects"]
    if not projects:
        return 0.0

    base = min(len(projects) / 3, 1.0) * 70
    project_text = " ".join(projects).lower()
    relevant_hits = sum(1 for skill in jd_data["skills"] if skill in project_text)
    relevance_bonus = min(relevant_hits / max(len(jd_data["skills"]), 1), 1.0) * 30
    return round(min(base + relevance_bonus, 100.0), 1)


def score_education(resume_data):
    if resume_data["education"]:
        return 100.0
    return 40.0


def score_certifications(resume_data, jd_data):
    required_certs = jd_data["certifications"]
    candidate_certs = resume_data["certifications"]

    if not required_certs:
        return 100.0 if candidate_certs else 70.0

    matched = match_keyword_sets(required_certs, candidate_certs)
    return _ratio_score(len(matched["matched"]), len(required_certs))


def score_formatting(resume_data):
    score = 100.0
    word_count = resume_data["word_count"]

    if word_count < 150:
        score -= 30
    elif word_count > 1200:
        score -= 15

    contact = resume_data["contact"]
    if not contact.get("email"):
        score -= 15
    if not contact.get("phone"):
        score -= 10

    required_sections = ["experience", "education", "skills"]
    missing_sections = [s for s in required_sections if not resume_data["has_section"].get(s)]
    score -= len(missing_sections) * 10

    return max(round(score, 1), 0.0)


def compute_ats_score(resume_data: dict, jd_data: dict) -> dict:
    skills_score, skills_detail = score_skills(resume_data["skills"], jd_data["skills"])
    keywords_score, keywords_detail = score_keywords(resume_data, jd_data)
    experience_score = score_experience(resume_data, jd_data)
    projects_score = score_projects(resume_data, jd_data)
    education_score = score_education(resume_data)
    certifications_score = score_certifications(resume_data, jd_data)
    formatting_score = score_formatting(resume_data)

    sub_scores = {
        "skills": skills_score,
        "keywords": keywords_score,
        "experience": experience_score,
        "projects": projects_score,
        "education": education_score,
        "formatting": formatting_score,
        "certifications": certifications_score,
    }

    overall = sum(sub_scores[key] * WEIGHTS[key] for key in WEIGHTS)

    return {
        "overall_score": round(overall, 1),
        "sub_scores": sub_scores,
        "weights": WEIGHTS,
        "skills_detail": skills_detail,
        "keywords_detail": keywords_detail,
    }
