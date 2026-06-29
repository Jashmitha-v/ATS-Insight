/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#7C3AED",
          purpleDark: "#5B21B6",
          blue: "#2563EB",
          blueDark: "#1D4ED8",
        },
        surface: {
          DEFAULT: "#0B0F19",
          card: "#111827",
          border: "#1F2937",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
        "brand-radial": "radial-gradient(circle at top, rgba(124,58,237,0.25), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 58, 237, 0.35)",
        card: "0 8px 30px rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
