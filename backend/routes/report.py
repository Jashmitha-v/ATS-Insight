"""PDF report generation endpoint."""
from flask import Blueprint, jsonify, send_file
import io

from reports.pdf_report import generate_pdf_report
from services.cache_store import get_analysis

report_bp = Blueprint("report", __name__)


@report_bp.route("/api/report/<analysis_id>", methods=["GET"])
def download_report(analysis_id):
    cached = get_analysis(analysis_id)
    if cached is None:
        return jsonify({
            "success": False,
            "error": {
                "code": "ANALYSIS_NOT_FOUND",
                "message": "This analysis has expired or could not be found. Please re-run the analysis.",
            },
        }), 404

    pdf_bytes = generate_pdf_report(
        cached["resume_data"], cached["jd_data"], cached["score_result"], cached["suggestions"]
    )
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name="ATS_Insight_Report.pdf",
    )
