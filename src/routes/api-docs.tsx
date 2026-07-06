import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { Code2, Terminal, Key, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/api-docs")({
  component: ApiDocsPage,
});

function ApiDocsPage() {
  const endpoints = [
    { method: "POST", path: "/v1/resume/analyze", desc: "Upload and extract entities from a PDF resume." },
    { method: "GET", path: "/v1/profile/metrics", desc: "Retrieve calculated ATS scores and skill gaps." },
    { method: "POST", path: "/v1/jobs/match", desc: "Match a candidate profile against job descriptions." }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16 flex-1 w-full">
        {/* Header */}
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <div className="inline-flex p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
            <Code2 className="w-10 h-10 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            API Documentation
          </h1>
          <p className="text-lg text-slate-500 dark:text-white/60 font-light leading-relaxed">
            Integrate our predictive career intelligence directly into your own HR software or recruiting platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" /> Getting Started
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                The Placement AI API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes.
              </p>
              
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-white/70 overflow-x-auto">
                <span className="text-purple-400">curl</span> https://api.placement-ai.com/v1/ping \<br/>
                &nbsp;&nbsp;-H <span className="text-emerald-400">"Authorization: Bearer YOUR_API_KEY"</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Core Endpoints</h3>
              {endpoints.map((ep, i) => (
                <div key={i} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono tracking-wider shrink-0 ${ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm text-white/90 shrink-0">{ep.path}</span>
                  <span className="text-sm text-white/50 sm:ml-auto">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" /> Authentication
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Authenticate your API requests by including your secret API key in the Authorization header.
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm text-white font-medium border border-white/10">
                Generate API Key
              </button>
            </div>
            
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">API Global</span>
                  <span className="text-emerald-400">99.99% Uptime</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Inference Engine</span>
                  <span className="text-emerald-400">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
