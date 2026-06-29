import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAnalysisContext } from "../hooks/useAnalysisContext.jsx";
import { analyzeResume, fetchSampleJobDescription } from "../utils/api.js";

const MIN_LENGTH = 30;

export default function JobDescriptionPage() {
  const { resumeFile, jobDescription, setJobDescription, setResult } = useAnalysisContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSample = async () => {
    setSampleLoading(true);
    try {
      const sample = await fetchSampleJobDescription();
      setJobDescription(sample);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSampleLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      navigate("/upload");
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < MIN_LENGTH) {
      setError(`Job description must be at least ${MIN_LENGTH} characters.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await analyzeResume(resumeFile, jobDescription);
      setResult(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-20 px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Step 2 of 3</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">Paste the Job Description</h1>
          <p className="text-gray-400 mt-3">
            We'll extract required skills, keywords, and experience requirements automatically.
          </p>
        </motion.div>

        <div className="glass-card rounded-2xl p-6">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={14}
            className="w-full bg-transparent text-gray-100 placeholder:text-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-border">
            <span className="text-xs text-gray-500">{jobDescription.length} characters</span>
            <div className="flex gap-3">
              <button
                onClick={() => setJobDescription("")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white border border-surface-border hover:border-gray-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
              <button
                onClick={handleSample}
                disabled={sampleLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-purple-200 border border-brand-purple/40 hover:bg-brand-purple/10 transition-colors disabled:opacity-50"
              >
                {sampleLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Sample Job Description
              </button>
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => navigate("/upload")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card text-gray-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-gradient font-semibold text-white shadow-glow hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                Analyze Resume <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
