export function SkeletonLine({ className = "" }) {
  return <div className={`skeleton rounded-lg h-4 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-3">
      <SkeletonLine className="w-1/3" />
      <SkeletonLine className="w-2/3 h-8" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-5/6" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
