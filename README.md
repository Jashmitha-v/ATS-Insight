# ATS Insight — Professional Resume ATS Analyzer

ATS Insight is a full-stack web application that analyzes how well a resume matches a job
description, the same way an Applicant Tracking System (ATS) would — entirely offline,
using deterministic, rule-based Python analysis. No LLM or third-party AI API is used
anywhere in this project.

## Overview

Upload a resume (PDF or DOCX) and paste a job description. ATS Insight extracts structured
data from both documents, computes a weighted 0–100 ATS compatibility score across seven
categories, highlights matched/missing/partial keywords, and generates prioritized,
rule-based improvement recommendations — plus a downloadable PDF report.

## Features

- **Drag-and-drop resume upload** with client + server-side validation (format, size, empty file)
- **Resume parsing**: name, email, phone, LinkedIn, GitHub, skills, experience, education,
  certifications, projects, languages, achievements
- **Job description parsing**: required skills, frameworks, soft skills, certifications,
  experience requirement
- **Weighted ATS scoring engine**:
  - Skills 35% · Keywords 20% · Experience 15% · Projects 10% · Education 10% ·
    Formatting 5% · Certifications 5%
- **Fuzzy keyword matching** via RapidFuzz (matched / partial / missing / additional)
- **Rule-based recommendation engine** — each suggestion includes a title, description,
  reason, and priority
- **Analytics dashboard** with circular progress, bar chart, pie chart, and animated counters
- **Downloadable PDF report** (ReportLab) with full score breakdown and recommendations
- **Animated, glassmorphic dark-mode SaaS landing page** (Hero, Features, How It Works,
  Stats, Testimonials, Pricing, FAQ, Footer)
- Elegant error handling for invalid uploads, empty files, unsupported formats, and missing
  job descriptions

## Architecture

```
[Browser] → React SPA (Vite) → REST API (Flask) → Parser/ATS Engine (Python) → PDF Report
```

<!-- Architecture diagram placeholder: docs/architecture.png -->

## Screenshots

<!-- Screenshot placeholders -->
<!-- docs/screenshots/landing.png -->
<!-- docs/screenshots/upload.png -->
<!-- docs/screenshots/dashboard.png -->

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router, Chart.js, Lucide Icons

**Backend:** Python, Flask, REST API

**Parsing & Scoring:** pdfplumber, PyPDF2, python-docx, RapidFuzz, Regex, ReportLab

**Deployment:** GitHub, Render

> **Design note:** spaCy/NLTK were intentionally omitted. Keyword and entity extraction is
> done with a curated skill dictionary + regex, which keeps the backend lightweight,
> deterministic, and free of large model downloads at build time — important for reliable
> deploys on Render's free tier.

## Folder Structure

```
ats-insight/
├── backend/
│   ├── app.py                  # Flask app entry point
│   ├── routes/                 # analyze, report, health endpoints
│   ├── services/                # analysis orchestration + in-memory cache
│   ├── parser/                  # file extraction, resume parser, JD parser
│   ├── ats/                     # skill bank, fuzzy matcher, scoring engine, suggestions
│   ├── reports/                  # PDF report generator
│   ├── utils/                    # validators, text cleaning
│   ├── uploads/                  # reserved (uploads are processed in-memory, not persisted)
│   ├── requirements.txt
│   ├── Procfile
│   └── runtime.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/          # Hero, Features, HowItWorks, FAQ
│   │   │   ├── upload/           # FileDropzone
│   │   │   ├── dashboard/        # ScoreCard, ScoreCharts, KeywordChips, SuggestionsList
│   │   │   └── common/           # Navbar, Footer, GlassCard, CircularProgress, Skeleton
│   │   ├── pages/                # LandingPage, UploadPage, JobDescriptionPage, DashboardPage
│   │   ├── hooks/                 # AnalysisContext (shared upload/JD/result state)
│   │   └── utils/                 # api.js
│   ├── package.json
│   └── vite.config.js
├── Dockerfile                     # multi-stage build: Node (frontend) → Python (backend + API)
├── render.yaml
└── README.md
```

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
python app.py                 # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env           # set VITE_API_BASE_URL if backend isn't on localhost:5000
npm run dev                    # runs on http://localhost:5173
```

## Usage

1. Open the app and click **Analyze Resume**.
2. Drag and drop a PDF or DOCX resume (max 5 MB).
3. Paste a job description, or click **Sample Job Description**.
4. Click **Analyze Resume** to view your ATS score, keyword breakdown, and recommendations.
5. Click **Download PDF Report** to export a shareable report.

## Deployment on Render

The app deploys as a **single Docker-based web service**: a multi-stage `Dockerfile` builds
the React frontend, then copies the static build into the Flask backend image. Flask serves
the REST API under `/api/*` and the built SPA for every other route — one service, one URL,
no CORS hop between frontend and backend.

Steps:
1. Push this repository to GitHub.
2. In Render, choose **New > Blueprint** and point it at the repository — Render reads
   `render.yaml` and creates a single `ats-insight` web service using the root `Dockerfile`.
3. Click **Deploy Blueprint**. Render builds the Docker image (Node stage → Python stage) and
   starts the service.
4. Once live, open the service URL — both the landing page and the API are served from it.

No environment variables or code changes are required for a working deploy. `CORS_ORIGINS`
is only needed if you ever split the frontend back out into its own separate origin.

## Future Enhancements

- User accounts with resume version history
- Multi-resume comparison against a single job description
- Industry-specific skill dictionaries (legal, healthcare, finance)
- Export analysis history as CSV
- Resume template suggestions based on detected formatting issues

## License

MIT License — free to use, modify, and distribute for personal or commercial purposes.
