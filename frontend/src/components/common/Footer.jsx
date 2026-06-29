import { Github, Linkedin, Mail, ScanSearch } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-surface-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-white mb-3">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-gradient">
              <ScanSearch className="w-5 h-5 text-white" />
            </span>
            ATS Insight
          </div>
          <p className="text-gray-400 text-sm max-w-sm">
            ATS Insight helps job seekers understand exactly how applicant tracking
            systems read their resume — and how to fix it, instantly and offline.
          </p>
          <div className="flex items-center gap-4 mt-5">
            <a
              href="mailto:jashmithavellore@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/jashmitha-vellore-802431377"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="mailto:jashmithavellore@gmail.com" className="hover:text-white transition-colors">
                jashmithavellore@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/jashmitha-vellore-802431377"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                linkedin.com/in/jashmitha-vellore-802431377
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-border py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ATS Insight. All processing happens offline — no resume data is ever sold or shared.
      </div>
    </footer>
  );
}
