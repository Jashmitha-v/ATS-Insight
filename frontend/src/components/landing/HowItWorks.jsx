import { motion } from "framer-motion";
import { ClipboardList, FileUp, Gauge, Rocket } from "lucide-react";

const STEPS = [
  {
    icon: FileUp,
    title: "Upload Your Resume",
    description: "Drag and drop your resume in PDF or DOCX format. We validate format and size instantly.",
  },
  {
    icon: ClipboardList,
    title: "Paste the Job Description",
    description: "Paste the target job posting, or try a sample. We extract required skills and keywords.",
  },
  {
    icon: Gauge,
    title: "Get Your ATS Score",
    description: "Our rule-based engine scores your resume across 7 weighted categories in seconds.",
  },
  {
    icon: Rocket,
    title: "Apply With Confidence",
    description: "Follow prioritized, actionable suggestions and download a polished PDF report.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-10 bg-surface-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-blue-300 uppercase tracking-wider">How It Works</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            From upload to insight in under a minute
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-gradient grid place-items-center shadow-glow mb-5">
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full text-xs font-display font-bold text-purple-300">
                STEP {idx + 1}
              </div>
              <h3 className="text-white font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed px-2">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
