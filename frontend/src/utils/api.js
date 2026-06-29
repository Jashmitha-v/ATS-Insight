import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

function unwrapError(error) {
  const payload = error?.response?.data?.error;
  if (payload) {
    return new ApiError(payload.message, payload.code);
  }
  if (error?.code === "ECONNABORTED") {
    return new ApiError("The request timed out. Please try again.", "TIMEOUT");
  }
  return new ApiError(
    "Could not reach the server. Please check your connection and try again.",
    "NETWORK_ERROR"
  );
}

export async function analyzeResume(file, jobDescription) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);

  try {
    const response = await api.post("/api/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error) {
    throw unwrapError(error);
  }
}

export async function fetchSampleJobDescription() {
  try {
    const response = await api.get("/api/sample-job-description");
    return response.data.data;
  } catch (error) {
    throw unwrapError(error);
  }
}

export function getReportDownloadUrl(analysisId) {
  return `${API_BASE_URL}/api/report/${analysisId}`;
}
