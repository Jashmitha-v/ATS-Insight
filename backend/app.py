"""ATS Insight backend entry point."""
import os

from flask import Flask, jsonify
from flask_cors import CORS

from routes.analyze import analyze_bp
from routes.misc import misc_bp
from routes.report import report_bp
from utils.validators import MAX_FILE_SIZE_BYTES, ValidationError


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE_BYTES + (1024 * 1024)

    cors_origins = os.environ.get("CORS_ORIGINS", "*")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})

    app.register_blueprint(analyze_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(misc_bp)

    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError):
        return jsonify({
            "success": False,
            "error": {"code": error.code, "message": error.message},
        }), error.status_code

    @app.errorhandler(413)
    def handle_too_large(_error):
        return jsonify({
            "success": False,
            "error": {
                "code": "FILE_TOO_LARGE",
                "message": "File is too large. Maximum allowed size is 5 MB.",
            },
        }), 413

    @app.errorhandler(404)
    def handle_not_found(_error):
        return jsonify({
            "success": False,
            "error": {"code": "NOT_FOUND", "message": "The requested resource was not found."},
        }), 404

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.exception("Unhandled exception")
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "Something went wrong while processing your request. Please try again.",
            },
        }), 500

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
