import FAQ from "../components/landing/FAQ.jsx";
import Features from "../components/landing/Features.jsx";
import Hero from "../components/landing/Hero.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
    </>
  );
}
