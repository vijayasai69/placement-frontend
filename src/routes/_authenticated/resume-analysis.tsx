import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  FileText, CheckCircle2, AlertCircle, Loader2, UploadCloud, GitCompare, Trash2, Lightbulb, CheckSquare
} from "lucide-react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { getResumeProfile, getResumeHistory, resetUserData } from "@/features/resume/services/resume-service";
import { useActiveProfile } from "@/store/useActiveProfile";

export const Route = createFileRoute("/_authenticated/resume-analysis")({
  component: ResumeAnalysisPage,
});

function CircularProgress({
  percentage, label, strokeColor, glowClass,
}: { percentage: number; label: string; strokeColor: string; glowClass: string }) {
  const radius = 36;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, percentage, { duration: 1.5, ease: "easeOut" });
    return animation.stop;
  }, [percentage, count]);

  return (
    <div className="glass-card glass-card-hover p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
      {/* Background ambient glow effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: strokeColor }}
      />
      
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer subtle ring for depth */}
        <div className="absolute inset-0 rounded-full border border-slate-200/50 dark:border-white/5 scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
          {/* Track */}
          <circle cx="48" cy="48" r={radius} fill="transparent" stroke="rgba(148,163,184,0.1)" strokeWidth={strokeWidth} />
          
          {/* Animated Progress Bar */}
          <motion.circle
            cx="48" cy="48" r={radius} fill="transparent"
            stroke={strokeColor} strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
            strokeLinecap="round"
            className={glowClass}
            style={{ filter: `drop-shadow(0 0 8px ${strokeColor}60)` }}
          />
        </svg>

        <div className="absolute flex items-baseline">
          <motion.span className="text-3xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
            {rounded}
          </motion.span>
          <span className="text-sm font-bold text-slate-500 dark:text-white/40 ml-0.5">%</span>
        </div>
      </div>
      
      <span className="text-[11px] font-bold text-slate-600 dark:text-white/60 mt-5 tracking-widest uppercase">{label}</span>
    </div>
  );
}

function ResumeAnalysisPage() {
  const navigate = useNavigate();
  const { activeProfileId } = useActiveProfile();
  const [loading, setLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [profile, setProfile] = useState<{
    fileName: string;
    analysisDate: string;
    atsScore: number;
    readability: number;
    keywordMatch: number;
    formatScore: number;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getResumeProfile(activeProfileId), getResumeHistory().catch(() => ({ data: { data: [] } }))])
      .then(([res, historyRes]) => {
        if (res.data?.success && res.data.profile) {
          const p = res.data.profile;
          if (p.fileName) {
            setHasResume(true);
            setProfile(p);
            
            // Sync active profile ID to frontend store if it was missing (e.g. after fresh login)
            if (!activeProfileId && p.id) {
              useActiveProfile.getState().setActiveProfileId(p.id);
            }

            if (historyRes?.data?.data?.length > 1) {
              setHasHistory(true);
            }
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load resume profile", err);
      })
      .finally(() => setLoading(false));
  }, [activeProfileId]);

  const [isDeleting, setIsDeleting] = useState(false);
  const { setActiveProfileId } = useActiveProfile();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your resume and all associated matches? This cannot be undone.")) {
      try {
        setIsDeleting(true);
        await resetUserData();
        setActiveProfileId(null);
        setHasResume(false);
        setProfile(null);
        window.location.href = "/resume";
      } catch (err) {
        console.error("Failed to delete resume data", err);
        alert("Failed to delete resume data.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading || isDeleting) {
    return <GlobalLoader singleText="Loading resume analysis..." />;
  }

  // No resume uploaded yet — show a prompt to upload
  if (!hasResume || !profile) {
    return (
      <div className="p-6 lg:p-12 max-w-2xl mx-auto pt-24 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mx-auto">
          <UploadCloud className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">No Resume Analyzed Yet</h2>
        <p className="text-slate-500 dark:text-white/50 text-sm">
          Upload your resume first to get AI-powered ATS analysis, keyword matching and personalized improvement suggestions.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/resume" })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white text-sm font-semibold transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Resume
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 space-y-8 font-sans max-w-screen-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">AI Resume Analysis</h2>
          <p className="text-xs text-slate-400 dark:text-white/40 mt-1.5 flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5" />
            <span>{profile.fileName}</span>
            <span>•</span>
            <span>Analyzed {profile.analysisDate}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasHistory && (
            <button
              type="button"
              onClick={() => navigate({ to: "/resume-comparison" })}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare Previous
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate({ to: "/resume" })}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Another
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 p-2.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            title="Delete Resume & Reset Data"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <CircularProgress percentage={profile.atsScore} label="ATS Score" strokeColor="#3b82f6" glowClass="glow-blue" />
        <CircularProgress percentage={profile.readability} label="Readability" strokeColor="#06b6d4" glowClass="glow-cyan" />
        <CircularProgress percentage={profile.keywordMatch} label="Keyword Match" strokeColor="#10b981" glowClass="glow-green" />
        <CircularProgress percentage={profile.formatScore} label="Format Score" strokeColor="#8b5cf6" glowClass="glow-purple" />
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500/20" />
          <h3 className="text-base font-bold text-emerald-400 mb-6 flex items-center gap-2 font-display">
            <CheckCircle2 className="w-5 h-5" />
            Strengths
          </h3>
          <div className="space-y-4">
            {(profile.strengths || []).map((item, idx) => (
              <div key={idx} className="flex items-start gap-3.5 py-3.5 px-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-[13px] text-slate-700 dark:text-white/80 font-medium leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 hover:border-rose-500/20 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500/20" />
          <h3 className="text-base font-bold text-rose-400 mb-6 flex items-center gap-2 font-display">
            <AlertCircle className="w-5 h-5" />
            Areas to Improve
          </h3>
          <div className="space-y-4">
            {(profile.improvements || []).map((item, idx) => (
              <div key={idx} className="flex items-start gap-3.5 py-3.5 px-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-[13px] text-slate-700 dark:text-white/80 font-medium leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Improvement Suggestions */}
      {(profile as any).aiSuggestions && (profile as any).aiSuggestions.length > 0 && (
        <div className="glass-card p-8 border border-slate-200 dark:border-white/10 rounded-2xl relative overflow-hidden bg-[#0c1222]">
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            AI Improvement Suggestions
          </h3>
          <div className="space-y-4">
            {(profile as any).aiSuggestions.map((suggestion: any, idx: number) => {
              const isHigh = suggestion.priority === "high";
              const isMed = suggestion.priority === "medium";
              const pColors = isHigh
                ? "bg-blue-900/40 text-blue-400 border border-blue-500/20" 
                : isMed 
                ? "bg-yellow-900/40 text-yellow-500 border border-yellow-500/20" 
                : "bg-slate-800 text-slate-400 border border-slate-700";

              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 sm:gap-0 rounded-xl bg-slate-900/40 dark:bg-white/5 hover:bg-slate-800/60 dark:hover:bg-white/10 border border-slate-800 dark:border-white/5 transition-colors">
                  <div className="flex items-start sm:items-center gap-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${pColors} lowercase tracking-wider mt-1 sm:mt-0`}>
                      {suggestion.priority}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 dark:text-white">{suggestion.text}</p>
                      <p className="text-xs text-slate-500 dark:text-white/40 mt-1">Effort: {suggestion.effort}</p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-slate-600 dark:border-white/10 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold shrink-0">
                    <CheckSquare className="w-4 h-4" />
                    Apply
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
