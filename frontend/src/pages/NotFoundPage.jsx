import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-7xl font-display font-extrabold text-gradient mb-4">404</p>
        <h1 className="text-2xl font-semibold text-white mb-3">Page not found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gradient font-semibold text-white shadow-glow"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </section>
  );
}
