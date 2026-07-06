import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { Compass, BookText, Code, MessageSquare, LineChart, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/career-guide")({
  component: CareerGuidePage,
});

function CareerGuidePage() {
  const chapters = [
    { icon: BookText, title: "1. Resume Optimization", desc: "Learn how to format, structure, and word your resume to pass ATS filters." },
    { icon: Code, title: "2. Technical Interviews", desc: "Master system design, algorithms, and live coding assessments." },
    { icon: MessageSquare, title: "3. Behavioral Interviews", desc: "Using the STAR method to tell compelling professional stories." },
    { icon: LineChart, title: "4. Salary Negotiation", desc: "Strategies to value your skills and negotiate the best compensation package." },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-16 flex-1">
        {/* Header */}
        <div className="space-y-6 text-center">
          <div className="inline-flex p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
            <Compass className="w-10 h-10 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            Ultimate Career Guide
          </h1>
          <p className="text-lg text-slate-500 dark:text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Your comprehensive, step-by-step manual to navigating the modern tech landscape and securing your dream role.
          </p>
        </div>

        {/* Chapters */}
        <div className="space-y-6">
          {chapters.map((chapter, i) => (
            <div key={i} className="glass-card p-6 md:p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors cursor-pointer rounded-2xl">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <chapter.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-bold text-white">{chapter.title}</h3>
                  <p className="text-sm text-white/50">{chapter.desc}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-blue-500/20 transition-all shrink-0 ml-4">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card p-8 text-center rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Want personalized guidance?</h2>
          <p className="text-white/60 mb-6 relative z-10 max-w-lg mx-auto">Upload your resume to get a custom roadmap tailored specifically to your background and goals.</p>
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-full relative z-10 hover:scale-105 transition-transform">
            Analyze My Resume
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
