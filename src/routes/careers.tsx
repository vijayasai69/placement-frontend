import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
});

function CareersPage() {
  const jobs = [
    { title: "Senior AI Engineer", dept: "Engineering", location: "Remote (US/EU)", type: "Full-time" },
    { title: "Product Designer", dept: "Design", location: "New York, NY", type: "Full-time" },
    { title: "Career Data Analyst", dept: "Data Science", location: "Remote", type: "Contract" },
    { title: "Frontend Developer (React)", dept: "Engineering", location: "London, UK", type: "Full-time" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-16 flex-1">
        {/* Header */}
        <div className="space-y-6 text-center">
          <div className="inline-flex p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
            <Briefcase className="w-10 h-10 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            Join Our Team
          </h1>
          <p className="text-lg text-slate-500 dark:text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Help us build the intelligence layer for the future of work. We're looking for passionate individuals who want to make a global impact.
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {['Remote First', '4-Day Work Week', 'Unlimited PTO', 'Health & Wellness'].map((perk, i) => (
             <div key={i} className="glass-card p-4 text-center rounded-xl border border-white/5">
                <span className="text-sm font-semibold text-white/80">{perk}</span>
             </div>
           ))}
        </div>

        {/* Open Positions */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-blue-500/40 transition-colors cursor-pointer">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/> {job.dept}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {job.type}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
