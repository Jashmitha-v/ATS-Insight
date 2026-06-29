import { AlertTriangle, Info, Lightbulb } from "lucide-react";

import GlassCard from "../common/GlassCard.jsx";

const PRIORITY_STYLES = {
  high: { badge: "bg-red-500/15 text-red-300 border-red-500/30", icon: AlertTriangle },
  medium: { badge: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30", icon: Info },
  low: { badge: "bg-blue-500/15 text-blue-300 border-blue-500/30", icon: Lightbulb },
};

export default function SuggestionsList({ suggestions }) {
  if (!suggestions?.length) {
    return (
      <GlassCard className="p-6 text-center text-gray-400 text-sm">
        Great work — no major issues detected.
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((s, idx) => {
        const style = PRIORITY_STYLES[s.priority] || PRIORITY_STYLES.medium;
        const Icon = style.icon;
        return (
          <GlassCard key={idx} hover className="p-5">
            <div className="flex items-start gap-4">
              <div className={`shrink-0 w-9 h-9 rounded-lg grid place-items-center border ${style.badge}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-white font-semibold text-sm">{s.title}</h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${style.badge}`}>
                    {s.priority}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-2">{s.description}</p>
                <p className="text-gray-500 text-xs mt-2 italic">Why: {s.reason}</p>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
