import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Download,
  FileCheck2,
  Layers,
  RotateCcw,
  Tags,
  Target,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CircularProgress from "../components/common/CircularProgress.jsx";
import GlassCard from "../components/common/GlassCard.jsx";
import { SkeletonDashboard } from "../components/common/Skeleton.jsx";
import KeywordChips from "../components/dashboard/KeywordChips.jsx";
import ScoreCard from "../components/dashboard/ScoreCard.jsx";
import ScoreCharts from "../components/dashboard/ScoreCharts.jsx";
import SuggestionsList from "../components/dashboard/SuggestionsList.jsx";
import { useAnalysisContext } from "../hooks/useAnalysisContext.jsx";
import { getReportDownloadUrl } from "../utils/api.js";

const CATEGORY_ICONS = {
  skills: Target,
  keywords: Tags,
  experience: Briefcase,
  projects: Layers,
  education: BookOpen,
  formatting: FileCheck2,
  certifications: Award,
};

export default function DashboardPage() {
  const { result, reset } = useAnalysisContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!result) {
      navigate("/upload");
    }
  }, [result, navigate]);

  if (!result) {
    return (
      <section className="min-h-screen pt-32 pb-20 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <SkeletonDashboard />
        </div>
      </section>
    );
  }

  const { score, suggestions, resume, analysis_id } = result;
  const { overall_score, sub_scores, skills_detail, keywords_detail } = score;

  const handleStartOver = () => {
    reset();
    navigate("/upload");
  };

  return (
    <section className="min-h-screen pt-32 pb-20 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Step 3 of 3</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
              {resume.contact.name ? `${resume.contact.name}'s ` : "Your "}ATS Report
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleStartOver}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-card text-gray-200 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
            <a
              href={getReportDownloadUrl(analysis_id)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-gradient font-semibold text-white shadow-glow hover:scale-105 transition-transform"
            >
              <Download className="w-4 h-4" /> Download PDF Report
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <GlassCard className="p-8 flex flex-col items-center justify-center lg:col-span-1">
            <CircularProgress score={overall_score} size={180} label="Overall ATS Score" />
            <p className="text-gray-400 text-sm mt-4 text-center">
              {overall_score >= 80
                ? "Excellent match — you're highly likely to pass ATS screening."
                : overall_score >= 60
                ? "Decent match — a few improvements could significantly boost your score."
                : "Needs work — follow the recommendations below to improve your chances."}
            </p>
          </GlassCard>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(sub_scores).map(([key, value]) => (
              <ScoreCard
                key={key}
                icon={CATEGORY_ICONS[key] || Target}
                label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                score={value}
              />
            ))}
          </div>
        </div>

        <div className="mb-10">
          <ScoreCharts subScores={sub_scores} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <KeywordChips detail={skills_detail} title="Skill Match Analysis" />
          <KeywordChips detail={keywords_detail} title="Keyword Match Analysis" />
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-5">Recommendations</h2>
          <SuggestionsList suggestions={suggestions} />
        </div>
      </div>
    </section>
  );
}
