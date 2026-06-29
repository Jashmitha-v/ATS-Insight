import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 px-6 lg:px-10">
      <div className="absolute inset-0 bg-brand-radial pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 -right-20 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl animate-float" />

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
        >
          Beat the ATS.
          <br />
          <span className="text-gradient">Land the Interview.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto"
        >
          Upload your resume and a job description to get an instant, detailed ATS
          compatibility score with skill gaps, keyword analysis, and actionable
          recommendations — powered entirely by deterministic, rule-based analysis.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/upload"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-gradient font-semibold text-white shadow-glow hover:scale-105 transition-transform"
          >
            Analyze My Resume Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="px-7 py-3.5 rounded-xl glass-card font-semibold text-gray-200 hover:text-white transition-colors"
          >
            See How It Works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
