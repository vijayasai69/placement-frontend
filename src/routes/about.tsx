import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { Users, Target, Zap, Shield, Globe } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const values = [
    { icon: Target, title: "Mission-Driven", desc: "We believe everyone deserves a career they love. We're here to make that a reality using AI." },
    { icon: Zap, title: "Innovation First", desc: "We constantly push the boundaries of machine learning to provide the most accurate career insights." },
    { icon: Shield, title: "Data Privacy", desc: "Your career data is yours. We employ military-grade encryption to keep your resumes and profiles safe." },
    { icon: Globe, title: "Accessibility", desc: "Premium career guidance shouldn't be a luxury. We're democratizing access to expert-level advice." }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between transition-colors duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-20 flex-1">
        {/* Header */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-600 dark:text-purple-400 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
            <Users className="w-10 h-10 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-white dark:to-white/60">
            About Us
          </h1>
          <p className="text-lg text-slate-600 dark:text-white/60 font-light leading-relaxed">
            We are a passionate team on a mission to democratize career success. By bridging the gap between academic achievements and industry demands, we aim to help professionals land their dream roles.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-slate-700 dark:text-white/80 leading-relaxed font-light">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Our Story</h2>
            <p>
              Founded on June 1st, 2026, Placement Recommendation was born out of a simple observation: the job market is incredibly opaque. Brilliant candidates are constantly filtered out by rigid ATS systems, while companies struggle to find the right talent.
            </p>
            <p>
              We decided to build an intelligence layer that understands both the candidate's true potential and the market's evolving requirements. Today, our predictive models analyze thousands of data points to provide actionable, personalized career pathways.
            </p>
          </div>
          <div className="glass-card p-8 flex items-center justify-center relative overflow-hidden min-h-[300px] rounded-3xl border-slate-200 dark:border-white/10">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5 mix-blend-overlay"></div>
             <div className="w-full h-full border border-slate-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center shadow-sm">
                <span className="text-5xl font-bold text-slate-900 dark:text-white mb-2">1,000+</span>
                <span className="text-sm text-slate-500 dark:text-white/60 uppercase tracking-widest font-medium">Data Points Analyzed</span>
             </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="glass-card p-6 space-y-4 hover:border-purple-500/30 dark:hover:border-purple-500/30 border-slate-200 dark:border-white/10 transition-colors bg-white/50 dark:bg-transparent shadow-sm hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
