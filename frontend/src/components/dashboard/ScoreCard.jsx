import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import GlassCard from "../common/GlassCard.jsx";

function scoreColor(score) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function barColor(score) {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 60) return "bg-yellow-400";
  return "bg-red-400";
}

export default function ScoreCard({ icon: Icon, label, score }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1000;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(progress * score));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, score]);

  return (
    <GlassCard hover className="p-5" >
      <div ref={ref} className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm flex items-center gap-2">
          <Icon className="w-4 h-4" /> {label}
        </span>
        <span className={`font-display font-bold text-xl ${scoreColor(score)}`}>{count}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-surface-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor(score)}`}
        />
      </div>
    </GlassCard>
  );
}
