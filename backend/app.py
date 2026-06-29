"""ATS Insight backend entry point.

Serves both the REST API (/api/*) and the pre-built React frontend
(frontend/dist) from a single Flask process, so the whole app lives behind
one origin/URL with no CORS hop between frontend and backend.
"""
import os

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from routes.analyze import analyze_bp
from routes.misc import misc_bp
from routes.report import report_bp
from utils.validators import MAX_FILE_SIZE_BYTES, ValidationError

FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "static_frontend")


def create_app() -> Flask:
    # static_folder=None disables Flask's automatic static route, which would
    # otherwise collide with the catch-all SPA route registered below.
    app = Flask(__name__, static_folder=None)
    app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE_BYTES + (1024 * 1024)

    cors_origins = os.environ.get("CORS_ORIGINS")
    if cors_origins:
        CORS(app, resources={r"/api/*": {"origins": cors_origins}})

    app.register_blueprint(analyze_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(misc_bp)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        """Serve the built React SPA for any non-API route, so client-side
        routing (React Router) works on full page loads/refreshes."""
        if path.startswith("api/"):
            return jsonify({
                "success": False,
                "error": {"code": "NOT_FOUND", "message": "The requested API endpoint was not found."},
            }), 404

        full_path = os.path.join(FRONTEND_DIST, path)
        if path and os.path.isfile(full_path):
            return send_from_directory(FRONTEND_DIST, path)
        return send_from_directory(FRONTEND_DIST, "index.html")

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
