import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import GlassCard from "../common/GlassCard.jsx";

const FAQS = [
  {
    question: "Does ATS Insight use AI or send my resume to a third party?",
    answer:
      "No. ATS Insight performs all parsing and scoring locally on the server using deterministic, rule-based Python logic (regex, fuzzy matching, and a curated skill dictionary). No resume data is sent to OpenAI, Gemini, or any other LLM provider.",
  },
  {
    question: "What file formats are supported?",
    answer: "PDF and DOCX files up to 5 MB. Scanned image-only PDFs without selectable text cannot be parsed.",
  },
  {
    question: "How is the ATS score calculated?",
    answer:
      "The score is a weighted average across seven categories: Skills (35%), Keywords (20%), Experience (15%), Projects (10%), Education (10%), Formatting (5%), and Certifications (5%).",
  },
  {
    question: "Is my data stored permanently?",
    answer:
      "Analysis results are cached temporarily in memory only to support PDF report downloads, and are not persisted to a database or shared externally.",
  },
  {
    question: "Can I use this for any job, not just tech roles?",
    answer:
      "The skill dictionary is currently weighted toward technical and software roles, but keyword, formatting, and structural analysis apply to any resume.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 px-6 lg:px-10 bg-surface-card/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-purple-300 uppercase tracking-wider">FAQ</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <GlassCard key={faq.question} className="overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                >
                  <span className="text-white font-medium text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
