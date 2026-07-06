import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { LayoutTemplate, Download, FileCheck } from "lucide-react";

export const Route = createFileRoute("/resume-templates")({
  component: ResumeTemplatesPage,
});

function ResumeTemplatesPage() {
  const templates = [
    { name: "Modern Minimalist", role: "Software Engineering", color: "from-slate-700 to-slate-900", popularity: "Most Popular" },
    { name: "Creative Portfolio", role: "Design / UI UX", color: "from-pink-900/50 to-purple-900/50", popularity: "Trending" },
    { name: "Executive Suite", role: "Management / PM", color: "from-blue-900/50 to-indigo-900/50", popularity: "Classic" },
    { name: "Data Science Pro", role: "Data / Analytics", color: "from-emerald-900/50 to-teal-900/50", popularity: "ATS Optimized" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16 flex-1">
        {/* Header */}
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <div className="inline-flex p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
            <LayoutTemplate className="w-10 h-10 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            ATS-Friendly Templates
          </h1>
          <p className="text-lg text-slate-500 dark:text-white/60 font-light leading-relaxed">
            Beautiful, professionally designed resume templates guaranteed to parse correctly in modern Applicant Tracking Systems.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((tpl, i) => (
            <div key={i} className="glass-card p-4 flex flex-col gap-4 group">
              <div className={`h-64 rounded-xl bg-gradient-to-br ${tpl.color} relative overflow-hidden border border-white/10 p-4 flex flex-col`}>
                 {/* Fake Resume Layout */}
                 <div className="w-1/2 h-3 bg-white/20 rounded mb-4"></div>
                 <div className="w-full h-1 bg-white/10 rounded mb-2"></div>
                 <div className="w-3/4 h-1 bg-white/10 rounded mb-6"></div>
                 <div className="space-y-2 mt-auto">
                   <div className="w-full h-8 bg-white/5 rounded"></div>
                   <div className="w-full h-8 bg-white/5 rounded"></div>
                 </div>
                 
                 <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur rounded text-[10px] font-bold text-white/80 border border-white/10 uppercase">
                   {tpl.popularity}
                 </div>
              </div>
              
              <div className="space-y-1 px-2">
                <h3 className="font-bold text-white text-sm">{tpl.name}</h3>
                <p className="text-xs text-white/50">{tpl.role}</p>
              </div>
              
              <button className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 border border-white/10 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2 text-sm font-medium text-white/80 mt-auto">
                <Download className="w-4 h-4" /> Download DOCX
              </button>
            </div>
          ))}
        </div>

        {/* Feature Banner */}
        <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white">100% ATS Optimized</h4>
            <p className="text-sm text-white/60">Our templates are built without complex tables or text boxes that confuse parsers.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
