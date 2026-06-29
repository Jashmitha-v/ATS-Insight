import { motion } from "framer-motion";
import {
  FileSearch,
  Gauge,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import GlassCard from "../common/GlassCard.jsx";

const FEATURES = [
  {
    icon: Gauge,
    title: "Weighted ATS Scoring",
    description:
      "A transparent 0-100 score built from 7 weighted categories: skills, keywords, experience, projects, education, formatting, and certifications.",
  },
  {
    icon: Target,
    title: "Fuzzy Keyword Matching",
    description:
      "RapidFuzz-powered matching catches near-matches and synonyms, not just exact string matches — fewer false negatives than naive keyword scanners.",
  },
  {
    icon: ListChecks,
    title: "Actionable Recommendations",
    description:
      "Every suggestion includes a title, description, the reasoning behind it, and a priority level — no vague advice.",
  },
  {
    icon: FileSearch,
    title: "Deep Resume Parsing",
    description:
      "Extracts contact details, skills, experience, education, certifications, projects, languages, and achievements from PDF or DOCX files.",
  },
  {
    icon: ShieldCheck,
    title: "Private & Offline",
    description:
      "No third-party AI APIs. Every byte of analysis happens on this server using deterministic, auditable Python logic.",
  },
  {
    icon: Sparkles,
    title: "Downloadable PDF Report",
    description:
      "Export a polished, recruiter-style PDF report with your score breakdown, keyword analysis, and recommendations.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Features</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            Everything you need to pass the screen
          </h2>
          <p className="text-gray-400 mt-4">
            A complete, rule-based ATS simulation — built for accuracy, transparency, and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard hover className="p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-brand-gradient grid place-items-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
