import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { Compass, Hammer } from "lucide-react";

export const Route = createFileRoute("/career-guide")({
  component: CareerGuidePage,
});

function CareerGuidePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-32 space-y-12 flex-1 flex flex-col items-center justify-center text-center">
        {/* Header */}
        <div className="space-y-6">
          <div className="inline-flex p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
            <Compass className="w-10 h-10 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            Career Guide
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-white/50 max-w-xl mx-auto font-light leading-relaxed">
            Comprehensive guides to navigate your career path.
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card p-8 md:p-12 space-y-6 max-w-2xl w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-2">
            <Hammer className="w-8 h-8 text-slate-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Under Construction
          </h2>
          <p className="text-sm text-slate-500 dark:text-white/60">
            We're working hard to bring you this page. Check back soon for updates!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
