import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { ShieldCheck, FileText, Share2, Key, Eye } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50 max-w-xl mx-auto font-light leading-relaxed">
            Effective date: June 1, 2026. Learn how we handle your resume, credentials, and AI profiling data.
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card p-6 md:p-10 space-y-10 leading-relaxed font-light text-slate-700 dark:text-white/80 text-sm">
          
          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-400 shrink-0" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              To provide predictive career modeling and resume scoring, we collect and process the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-900 dark:text-white/65">
              <li><strong>Resume Documents:</strong> The PDF files you upload and the raw text extracted from them.</li>
              <li><strong>Candidate Profiles:</strong> Structured summaries generated from your resume, including skills, education, projects, certifications, and work experience.</li>
              <li><strong>Authentication Data:</strong> Your name, email address, and encrypted passwords managed securely via session tokens.</li>
              <li><strong>Interactive Metrics:</strong> Calculated data including ATS scores, keyword matching, and readability ratings.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <Eye className="w-5 h-5 text-purple-400 shrink-0" />
              <span>2. How We Use Your Information</span>
            </h2>
            <p>
              Your data is strictly utilized to power the core services of the Placement Recommendation:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-900 dark:text-white/65">
              <li>Analyzing and rating your resume compliance against industrial ATS standards.</li>
              <li>Matching your profile dynamically with active job opportunities in our database.</li>
              <li>Generating tailored skill gap reports, curriculum learning resources, and practice sandbox projects.</li>
              <li>Securing and maintaining your personalized session and application dashboard.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <Share2 className="w-5 h-5 text-purple-400 shrink-0" />
              <span>3. Data Sharing & AI Processing</span>
            </h2>
            <p>
              We do not sell or lease your personal information or resume files to third-party marketers. 
            </p>
            <p>
              <strong>AI Agent Processing:</strong> To provide semantic matching and skills analysis, extracted resume text is sent securely to third-party large language model (LLM) inference endpoints (such as Groq). No credentials or underlying account passwords are shared with LLM providers.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <Key className="w-5 h-5 text-purple-400 shrink-0" />
              <span>4. Data Security & Storage</span>
            </h2>
            <p>
              We employ robust administrative and technical controls to safeguard your data. Passwords are cryptographically hashed, and network communications between the client and Express servers are encrypted over secure channels. Uploaded files are isolated within secure workspace storage.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
              <span>5. Control Over Your Data</span>
            </h2>
            <p>
              You have complete ownership over your career data. At any time, you can:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-900 dark:text-white/65">
              <li>Upload a new resume to completely overwrite and re-analyze your candidate profile and job recommendations.</li>
              <li>Export or view your structured profile metrics directly on the dashboard.</li>
              <li>Delete your profile or file attachments by contacting technical support.</li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
