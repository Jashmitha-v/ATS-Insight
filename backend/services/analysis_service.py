"""Orchestrates parsing + scoring + suggestion generation for a single analysis."""
from ats.scoring import compute_ats_score
from ats.suggestions import generate_suggestions
from parser.file_extractor import extract_text
from parser.jd_parser import parse_job_description
from parser.resume_parser import parse_resume
from services.cache_store import save_analysis


def run_analysis(filename: str, file_bytes: bytes, job_description: str) -> dict:
    raw_resume_text = extract_text(filename, file_bytes)
    resume_data = parse_resume(raw_resume_text)
    jd_data = parse_job_description(job_description)

    score_result = compute_ats_score(resume_data, jd_data)
    suggestions = generate_suggestions(resume_data, jd_data, score_result)

    analysis_id = save_analysis({
        "resume_data": resume_data,
        "jd_data": jd_data,
        "score_result": score_result,
        "suggestions": suggestions,
    })

    return {
        "analysis_id": analysis_id,
        "resume": _serialize_resume(resume_data),
        "job_description": _serialize_jd(jd_data),
        "score": score_result,
        "suggestions": suggestions,
    }


def _serialize_resume(resume_data: dict) -> dict:
    data = dict(resume_data)
    data.pop("raw_text", None)
    return data


def _serialize_jd(jd_data: dict) -> dict:
    data = dict(jd_data)
    data.pop("raw_text", None)
    return data
