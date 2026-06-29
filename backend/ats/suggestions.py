"""Rule-based resume improvement recommendations."""
import re

from ats.skill_bank import ACTION_VERBS_STRONG, ACTION_VERBS_WEAK

PRIORITY_HIGH = "high"
PRIORITY_MEDIUM = "medium"
PRIORITY_LOW = "low"


def _suggestion(title, description, reason, priority):
    return {
        "title": title,
        "description": description,
        "reason": reason,
        "priority": priority,
    }


def _check_contact_links(resume_data):
    suggestions = []
    contact = resume_data["contact"]

    if not contact.get("github"):
        suggestions.append(_suggestion(
            "Add a GitHub profile link",
            "Include a link to your GitHub profile near your contact details.",
            "Recruiters and ATS systems use GitHub links to verify hands-on coding experience.",
            PRIORITY_MEDIUM,
        ))
    if not contact.get("linkedin"):
        suggestions.append(_suggestion(
            "Add a LinkedIn profile link",
            "Include your LinkedIn profile URL in the header of your resume.",
            "A LinkedIn link increases recruiter trust and is commonly expected on professional resumes.",
            PRIORITY_MEDIUM,
        ))
    if not contact.get("phone"):
        suggestions.append(_suggestion(
            "Add a phone number",
            "Make sure a reachable phone number appears in your contact section.",
            "Missing contact details can cause ATS parsing errors and recruiter friction.",
            PRIORITY_HIGH,
        ))
    if not contact.get("email"):
        suggestions.append(_suggestion(
            "Add an email address",
            "Add a professional email address to your contact section.",
            "An email address is a required field for nearly all ATS systems.",
            PRIORITY_HIGH,
        ))
    return suggestions


def _check_certifications(resume_data, jd_data):
    if resume_data["certifications"]:
        return []
    if jd_data["certifications"]:
        return [_suggestion(
            "Add relevant certifications",
            f"Consider adding certifications such as: {', '.join(jd_data['certifications'][:3])}.",
            "The job description explicitly references certifications that are missing from your resume.",
            PRIORITY_HIGH,
        )]
    return [_suggestion(
        "Consider adding certifications",
        "Add any relevant industry certifications to strengthen your credibility.",
        "Certifications help differentiate candidates and are scanned for by many ATS systems.",
        PRIORITY_LOW,
    )]


def _check_projects(resume_data):
    suggestions = []
    projects = resume_data["projects"]

    if not projects:
        suggestions.append(_suggestion(
            "Add a projects section",
            "Include 2-3 relevant projects with technologies used and measurable outcomes.",
            "A dedicated projects section helps demonstrate applied, hands-on experience.",
            PRIORITY_HIGH,
        ))
        return suggestions

    has_metrics = any(re.search(r"\d+%|\d+x|\$\d+|\d+\s*(users|requests|records)", p.lower())
                       for p in projects)
    if not has_metrics:
        suggestions.append(_suggestion(
            "Quantify your project impact",
            "Add measurable outcomes to your projects, e.g. 'reduced load time by 40%' or "
            "'served 1,000+ daily users'.",
            "Quantified achievements are significantly more persuasive to both ATS keyword "
            "scanners and human reviewers than generic descriptions.",
            PRIORITY_MEDIUM,
        ))
    return suggestions


def _check_action_verbs(resume_data):
    text = resume_data["raw_text"].lower()
    weak_hits = [v for v in ACTION_VERBS_WEAK if v in text]
    strong_hits = [v for v in ACTION_VERBS_STRONG if v in text]

    if weak_hits and len(strong_hits) < 3:
        return [_suggestion(
            "Use stronger action verbs",
            f"Replace weak phrases like '{weak_hits[0]}' with strong action verbs such as "
            "'led', 'built', 'optimized', or 'delivered'.",
            "Strong action verbs make accomplishments sound more impactful and are favored "
            "by recruiters skimming resumes quickly.",
            PRIORITY_MEDIUM,
        )]
    return []


def _check_missing_skills(skills_detail):
    if not skills_detail["missing"]:
        return []
    top_missing = skills_detail["missing"][:5]
    return [_suggestion(
        "Add missing technical skills",
        f"Consider adding these skills if you have experience with them: {', '.join(top_missing)}.",
        "These skills appear in the job description but were not found in your resume, "
        "which lowers your keyword match score.",
        PRIORITY_HIGH,
    )]


def _check_missing_keywords(keywords_detail):
    if not keywords_detail["missing"]:
        return []
    top_missing = keywords_detail["missing"][:5]
    return [_suggestion(
        "Incorporate more keywords from the job description",
        f"Try naturally weaving in terms such as: {', '.join(top_missing)}.",
        "ATS systems rank resumes partly by keyword overlap with the job description.",
        PRIORITY_MEDIUM,
    )]


def _check_formatting(resume_data):
    suggestions = []
    word_count = resume_data["word_count"]

    if word_count < 150:
        suggestions.append(_suggestion(
            "Expand your resume content",
            "Your resume appears very short. Add more detail to your experience and projects.",
            "Resumes that are too short often fail to demonstrate sufficient depth of experience.",
            PRIORITY_HIGH,
        ))
    elif word_count > 1200:
        suggestions.append(_suggestion(
            "Tighten your resume length",
            "Your resume is quite long. Aim for a concise 1-2 page document.",
            "Overly long resumes dilute key achievements and may be truncated by some ATS parsers.",
            PRIORITY_LOW,
        ))

    missing_sections = [s for s, present in resume_data["has_section"].items()
                         if not present and s in ("experience", "education", "skills")]
    if missing_sections:
        suggestions.append(_suggestion(
            "Add clearly labeled section headers",
            f"Add standard section headers for: {', '.join(missing_sections)}.",
            "ATS parsers rely on clearly labeled section headers to correctly categorize content.",
            PRIORITY_HIGH,
        ))

    long_lines = [l for l in resume_data["raw_text"].split("\n") if len(l) > 220]
    if long_lines:
        suggestions.append(_suggestion(
            "Break up long paragraphs",
            "Convert long paragraphs into concise bullet points (1-2 lines each).",
            "Bullet points are easier for both ATS systems and recruiters to scan quickly.",
            PRIORITY_LOW,
        ))

    return suggestions


def _check_summary(resume_data):
    summary = resume_data.get("summary", "")
    if not summary or len(summary.split()) < 15:
        return [_suggestion(
            "Strengthen your professional summary",
            "Add a 2-3 sentence summary highlighting your role, key skills, and top achievement.",
            "A strong summary gives recruiters immediate context and improves keyword density "
            "at the top of the resume, where ATS parsers and recruiters look first.",
            PRIORITY_MEDIUM,
        )]
    return []


def generate_suggestions(resume_data, jd_data, score_result):
    suggestions = []
    suggestions += _check_contact_links(resume_data)
    suggestions += _check_certifications(resume_data, jd_data)
    suggestions += _check_projects(resume_data)
    suggestions += _check_action_verbs(resume_data)
    suggestions += _check_missing_skills(score_result["skills_detail"])
    suggestions += _check_missing_keywords(score_result["keywords_detail"])
    suggestions += _check_formatting(resume_data)
    suggestions += _check_summary(resume_data)

    priority_order = {PRIORITY_HIGH: 0, PRIORITY_MEDIUM: 1, PRIORITY_LOW: 2}
    suggestions.sort(key=lambda s: priority_order[s["priority"]])
    return suggestions
