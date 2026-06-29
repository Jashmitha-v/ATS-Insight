import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function scoreColor(score) {
  if (score >= 80) return "#34D399";
  if (score >= 60) return "#FBBF24";
  return "#F87171";
}

export default function CircularProgress({ score = 0, size = 160, label = "ATS Score" }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = scoreColor(score);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1F2937" strokeWidth="10" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display font-extrabold text-white">{Math.round(animatedScore)}</span>
        <span className="text-xs text-gray-400 mt-1">{label}</span>
      </div>
    </div>
  );
}
