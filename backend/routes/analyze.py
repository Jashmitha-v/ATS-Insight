"""Resume analysis endpoint."""
from flask import Blueprint, jsonify, request

from services.analysis_service import run_analysis
from utils.validators import (
    ValidationError,
    sanitize_filename,
    validate_job_description,
    validate_resume_file,
)

analyze_bp = Blueprint("analyze", __name__)


@analyze_bp.route("/api/analyze", methods=["POST"])
def analyze():
    resume_file = request.files.get("resume")
    job_description = request.form.get("job_description", "")

    validate_resume_file(resume_file)
    validate_job_description(job_description)

    safe_filename = sanitize_filename(resume_file.filename)
    file_bytes = resume_file.read()

    result = run_analysis(safe_filename, file_bytes, job_description)
    return jsonify({"success": True, "data": result})


@analyze_bp.errorhandler(ValidationError)
def handle_validation_error(error: ValidationError):
    response = jsonify({
        "success": False,
        "error": {"code": error.code, "message": error.message},
    })
    response.status_code = error.status_code
    return response
