import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { Compass, BookText, Code, MessageSquare, LineChart, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/career-guide")({
  component: CareerGuidePage,
});

function CareerGuidePage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const chapters = [
    { 
      icon: BookText, 
      title: "1. Resume Optimization", 
      desc: "Learn how to format, structure, and word your resume to pass ATS filters.",
      content: "An ATS (Applicant Tracking System) parses your resume to extract data. To optimize your resume, use standard headings like 'Experience', 'Education', and 'Skills'. Avoid complex layouts, tables, or columns that can confuse the parser. Use keywords directly from the job description to increase your match score. Quantify your achievements (e.g., 'Improved performance by 20%') to stand out to human recruiters after passing the ATS."
    },
    { 
      icon: Code, 
      title: "2. Technical Interviews", 
      desc: "Master system design, algorithms, and live coding assessments.",
      content: "Technical interviews test your problem-solving skills and coding proficiency. Start by clarifying the problem and defining edge cases before writing any code. For algorithms, practice on platforms like LeetCode and focus on data structures like HashMaps, Trees, and Graphs. For system design interviews, communicate your thought process clearly, discuss trade-offs (e.g., latency vs. consistency), and scale your design from a single user to millions."
    },
    { 
      icon: MessageSquare, 
      title: "3. Behavioral Interviews", 
      desc: "Using the STAR method to tell compelling professional stories.",
      content: "Behavioral interviews assess if you are a cultural fit and how you handle workplace situations. Use the STAR method: Situation (set the scene), Task (describe your responsibility), Action (explain exactly what you did), and Result (share the positive outcome, preferably with metrics). Prepare stories for common themes like conflict resolution, overcoming a challenge, and leadership."
    },
    { 
      icon: LineChart, 
      title: "4. Salary Negotiation", 
      desc: "Strategies to value your skills and negotiate the best compensation package.",
      content: "Never accept the first offer immediately. Always ask for time to review the package. Research market rates for your role and location using tools like levels.fyi or Glassdoor. When negotiating, focus on your value to the company rather than your personal needs. Remember that compensation isn't just base salary—you can also negotiate sign-on bonuses, equity, remote work flexibility, and extra vacation days."
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-16 flex-1">
        {/* Header */}
        <div className="space-y-6 text-center">
          <div className="inline-flex p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-600 dark:text-purple-400 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
            <Compass className="w-10 h-10 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-white dark:to-white/60">
            Ultimate Career Guide
          </h1>
          <p className="text-lg text-slate-500 dark:text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Your comprehensive, step-by-step manual to navigating the modern tech landscape and securing your dream role.
          </p>
        </div>

        {/* Chapters */}
        <div className="space-y-6">
          {chapters.map((chapter, i) => (
            <div 
              key={i} 
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="glass-card p-6 md:p-8 flex flex-col group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer rounded-2xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-transparent shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 border border-purple-500/20 transition-transform">
                    <chapter.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">{chapter.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-white/50">{chapter.desc}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-white/30 group-hover:text-slate-900 dark:text-white group-hover:bg-purple-500/20 transition-all shrink-0 ml-4">
                  <ChevronDown className={`w-5 h-5 transition-transform ${expandedIndex === i ? 'rotate-180' : ''}`} />
                </div>
              </div>
              
              {/* Expandable Content */}
              {expandedIndex === i && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-light leading-relaxed animate-in fade-in slide-in-from-top-4 duration-300">
                  {chapter.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card p-8 text-center rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-600/20 mix-blend-overlay"></div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Want personalized guidance?</h2>
          <p className="text-slate-500 dark:text-white/60 mb-6 relative z-10 max-w-lg mx-auto">Upload your resume to get a custom roadmap tailored specifically to your background and goals.</p>
          <Link to="/auth" className="inline-block px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-semibold rounded-full relative z-10 hover:scale-105 transition-transform">
            Analyze My Resume
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
