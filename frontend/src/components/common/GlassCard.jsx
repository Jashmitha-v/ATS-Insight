export default function GlassCard({ children, className = "", hover = false }) {
  return (
    <div
      className={`glass-card rounded-2xl shadow-card ${
        hover ? "transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
