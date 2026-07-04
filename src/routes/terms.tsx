import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { FileWarning, Award, Sparkles, Scale, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-900 dark:text-white noise-overlay pt-24 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50 max-w-xl mx-auto font-light leading-relaxed">
            Effective date: June 20, 2026. Please read our service agreement, upload policies, and system conditions.
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card p-6 md:p-10 space-y-10 leading-relaxed font-light text-slate-700 dark:text-white/80 text-sm">
          
          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p>
              By accessing and using the Placement Recommendation platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from utilizing the system, uploading resume files, or viewing job recommendation data.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <Award className="w-5 h-5 text-blue-400 shrink-0" />
              <span>2. Platform Scope & AI Recommendations</span>
            </h2>
            <p>
              Placement Recommendation is an interactive career matching and assessment application. 
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-900 dark:text-white/65">
              <li><strong>AI Analysis:</strong> Resume evaluations, ATS compliance scores, readability metrics, and matched skill gaps are generated dynamically by machine learning models for guidance purposes.</li>
              <li><strong>Placement:</strong> While we connect your profile to suitable openings, the platform serves as an assessment engine and does not guarantee job placement, interviews, or hiring outcomes.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <FileWarning className="w-5 h-5 text-blue-400 shrink-0" />
              <span>3. Resume Upload & Content Policy</span>
            </h2>
            <p>
              Users are solely responsible for documents uploaded to the system. You agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-900 dark:text-white/65">
              <li><strong>Format Integrity:</strong> Only valid, text-based PDF files are accepted. Uploading corrupted files, archives, or non-PDF formats renamed with a `.pdf` extension (such as PNG or JPEG image files) will result in parsing errors and profile failure.</li>
              <li><strong>Authenticity:</strong> You must upload only your own authentic resume containing accurate descriptions of your skills and career history.</li>
              <li><strong>Prohibited Actions:</strong> You may not upload files containing malware, viruses, or obfuscated code designed to exploit the server parser.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0" />
              <span>4. Account and Session Security</span>
            </h2>
            <p>
              To maintain system integrity, users are responsible for keeping account credentials confidential. You are fully responsible for all uploads and recommendations processed under your authenticated session tokens. If you suspect any security breaches, please notify support immediately.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-3">
              <Scale className="w-5 h-5 text-blue-400 shrink-0" />
              <span>5. Limitation of Liability</span>
            </h2>
            <p>
              To the maximum extent permitted by applicable law, Placement Recommendation, its developers, and partners shall not be held liable for any indirect, incidental, or consequential damages resulting from AI-generated feedback errors, server downtimes, system recommendations, or placement outcomes.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
