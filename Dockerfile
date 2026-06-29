# Stage 1: build the React frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend serving the API + built frontend
FROM python:3.11-slim AS runtime
WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./static_frontend

EXPOSE 5000
ENV PORT=5000
CMD gunicorn app:app --bind 0.0.0.0:${PORT} --workers 2 --timeout 60
