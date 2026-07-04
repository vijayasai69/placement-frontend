import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { HeroSection } from "../features/landing/components/HeroSection";
import { StatsSection } from "../features/landing/components/StatsSection";
import { HowItWorksSection } from "../features/landing/components/HowItWorksSection";
import { FeaturesSection } from "../features/landing/components/FeaturesSection";
import { CtaSection } from "../features/landing/components/CtaSection";
import { Footer } from "../features/landing/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div
      className="min-h-screen noise-overlay selection:bg-blue-600 selection:text-slate-900 dark:text-white pt-20"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
