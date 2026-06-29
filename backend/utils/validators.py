"""Upload validation and filename sanitization helpers."""
import os
import re
import uuid

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


class ValidationError(Exception):
    """Raised when an uploaded file or request payload fails validation."""

    def __init__(self, message, code="VALIDATION_ERROR", status_code=400):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code


def get_extension(filename: str) -> str:
    return os.path.splitext(filename)[1].lower()


def sanitize_filename(filename: str) -> str:
    """Strip path components and unsafe characters, return a unique safe filename."""
    base = os.path.basename(filename)
    base = re.sub(r"[^A-Za-z0-9_.-]", "_", base)
    ext = get_extension(base)
    unique_id = uuid.uuid4().hex[:12]
    return f"{unique_id}{ext}"


def validate_resume_file(file_storage) -> None:
    """Validate an uploaded resume file (Flask FileStorage-like object)."""
    if file_storage is None or file_storage.filename == "":
        raise ValidationError("No resume file was uploaded.", code="EMPTY_UPLOAD")

    filename = file_storage.filename
    ext = get_extension(filename)

    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError(
            f"Unsupported file format '{ext}'. Please upload a PDF or DOCX file.",
            code="UNSUPPORTED_FORMAT",
        )

    file_storage.stream.seek(0, os.SEEK_END)
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)

    if size == 0:
        raise ValidationError("The uploaded file is empty.", code="EMPTY_FILE")

    if size > MAX_FILE_SIZE_BYTES:
        raise ValidationError(
            "File is too large. Maximum allowed size is 5 MB.",
            code="FILE_TOO_LARGE",
        )


def validate_job_description(text: str) -> None:
    if text is None or not text.strip():
        raise ValidationError(
            "Job description cannot be empty.", code="MISSING_JOB_DESCRIPTION"
        )
    if len(text.strip()) < 30:
        raise ValidationError(
            "Job description is too short to analyze meaningfully. Please provide more detail.",
            code="JOB_DESCRIPTION_TOO_SHORT",
        )
