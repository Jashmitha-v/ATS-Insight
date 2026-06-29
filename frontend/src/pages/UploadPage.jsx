import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FileDropzone from "../components/upload/FileDropzone.jsx";
import { useAnalysisContext } from "../hooks/useAnalysisContext.jsx";

export default function UploadPage() {
  const { resumeFile, setResumeFile } = useAnalysisContext();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!resumeFile) {
      setError("Please upload a resume before continuing.");
      return;
    }
    navigate("/job-description");
  };

  return (
    <section className="min-h-screen pt-32 pb-20 px-6 lg:px-10">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Step 1 of 3</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">Upload Your Resume</h1>
          <p className="text-gray-400 mt-3">We support PDF and DOCX files up to 5 MB.</p>
        </motion.div>

        <FileDropzone file={resumeFile} onFileSelect={setResumeFile} error={error} onError={setError} />

        <div className="flex justify-end mt-8">
          <button
            onClick={handleContinue}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-gradient font-semibold text-white shadow-glow hover:scale-105 transition-transform disabled:opacity-50"
          >
            Continue
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
