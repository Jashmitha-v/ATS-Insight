import { AnimatePresence, motion } from "framer-motion";
import { Menu, ScanSearch, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Features", hash: "#features" },
  { label: "How It Works", hash: "#how-it-works" },
  { label: "FAQ", hash: "#faq" },
  { label: "Contact", hash: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToSection = (hash) => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/${hash}`);
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-surface/80 backdrop-blur-xl border-b border-surface-border" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-white">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-gradient shadow-glow">
            <ScanSearch className="w-5 h-5 text-white" />
          </span>
          ATS Insight
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          {NAV_LINKS.map((link) => (
            <button
              key={link.hash}
              onClick={() => goToSection(link.hash)}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/upload"
            className="px-5 py-2.5 rounded-xl bg-brand-gradient text-sm font-semibold text-white shadow-glow hover:scale-105 transition-transform"
          >
            Analyze Resume
          </Link>
        </div>

        <button
          className="md:hidden text-gray-200"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-surface/95 backdrop-blur-xl border-b border-surface-border"
          >
            <div className="flex flex-col px-6 py-4 gap-4 text-gray-300">
              {NAV_LINKS.map((link) => (
                <button key={link.hash} onClick={() => goToSection(link.hash)} className="text-left">
                  {link.label}
                </button>
              ))}
              <Link
                to="/upload"
                onClick={() => setMenuOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-brand-gradient text-sm font-semibold text-white text-center"
              >
                Analyze Resume
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
