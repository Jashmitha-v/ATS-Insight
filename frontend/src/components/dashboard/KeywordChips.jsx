import GlassCard from "../common/GlassCard.jsx";

const STYLES = {
  matched: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  partial: "bg-orange-500/10 text-orange-300 border border-orange-500/30",
  missing: "bg-red-500/10 text-red-300 border border-red-500/30",
  additional: "bg-blue-500/10 text-blue-300 border border-blue-500/30",
};

const LABELS = {
  matched: "Matched Keywords",
  partial: "Partial Matches",
  missing: "Missing Keywords",
  additional: "Additional Keywords",
};

function ChipGroup({ type, items }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-sm text-gray-400 mb-2">{LABELS[type]} ({items.length})</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`px-3 py-1 rounded-full text-xs font-medium ${STYLES[type]}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function KeywordChips({ detail, title }) {
  return (
    <GlassCard className="p-6">
      <h3 className="text-white font-semibold mb-4 text-sm">{title}</h3>
      <div className="space-y-5">
        <ChipGroup type="matched" items={detail.matched} />
        <ChipGroup type="partial" items={detail.partial} />
        <ChipGroup type="missing" items={detail.missing} />
        <ChipGroup type="additional" items={detail.additional} />
      </div>
    </GlassCard>
  );
}
