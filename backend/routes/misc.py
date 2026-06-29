"""Health check and sample job description endpoints."""
from flask import Blueprint, jsonify

misc_bp = Blueprint("misc", __name__)

SAMPLE_JOB_DESCRIPTION = """\
We are looking for a Software Engineer (Full Stack) to join our growing \
engineering team.

Responsibilities:
- Design, build, and maintain scalable web applications using React and Python.
- Collaborate with product and design teams in an Agile/Scrum environment.
- Build and consume RESTful APIs and integrate with relational and NoSQL databases.
- Write clean, well-tested code and participate in code reviews.
- Deploy and monitor services on AWS or similar cloud platforms.

Requirements:
- 2+ years of professional software development experience.
- Strong proficiency in Python, JavaScript, and SQL.
- Experience with React, Flask or Django, and REST APIs.
- Familiarity with Docker, Git, and CI/CD pipelines.
- Experience with PostgreSQL or MongoDB.
- Strong communication, teamwork, and problem-solving skills.

Nice to have:
- Experience with AWS, Kubernetes, or Terraform.
- AWS Certified Developer or similar certification.
- Exposure to data analysis or machine learning projects.
"""


@misc_bp.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"success": True, "status": "ok"})


@misc_bp.route("/api/sample-job-description", methods=["GET"])
def sample_job_description():
    return jsonify({"success": True, "data": SAMPLE_JOB_DESCRIPTION})
