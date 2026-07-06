import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, ArrowLeft, TrendingUp, TrendingDown, Minus, CheckCircle, Trash2 } from "lucide-react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { getResumeHistory, deleteResumeProfile } from "@/features/resume/services/resume-service";
import { cn } from "@/lib/utils";
import { useActiveProfile } from "@/store/useActiveProfile";

export const Route = createFileRoute("/_authenticated/resume-comparison")({
  component: ResumeComparisonPage,
});

function ResumeComparisonPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const { activeProfileId, setActiveProfileId } = useActiveProfile();

  useEffect(() => {
    getResumeHistory()
      .then((res) => {
        if (res.data?.success && res.data.data) {
          setHistory(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load resume history", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (profileId: string) => {
    if (!window.confirm("Are you sure you want to delete this resume version?")) return;
    try {
      await deleteResumeProfile(profileId);
      setHistory(prev => prev.filter(h => h.id !== profileId));
      if (activeProfileId === profileId) {
        setActiveProfileId(null);
      }
    } catch (error) {
      console.error("Failed to delete profile", error);
      alert("Failed to delete resume profile");
    }
  };

  if (loading) {
    return <GlobalLoader singleText="Loading resume history..." />;
  }

  if (history.length < 2) {
    return (
      <div className="p-6 lg:p-12 max-w-2xl mx-auto pt-24 text-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Not Enough Data</h2>
        <p className="text-slate-500 dark:text-white/50 text-sm">
          You need at least two resume versions to compare. Please upload a new resume.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/resume" })}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white text-sm font-semibold transition-colors"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  const maxResumes = history.slice(0, 4).reverse(); // oldest to newest

  const renderTrend = (curr: number, prev: number) => {
    if (curr > prev) {
      return <span className="flex items-center text-emerald-500 text-xs font-bold"><TrendingUp className="w-3 h-3 mr-1"/> +{curr - prev}</span>;
    } else if (curr < prev) {
      return <span className="flex items-center text-rose-500 text-xs font-bold"><TrendingDown className="w-3 h-3 mr-1"/> {curr - prev}</span>;
    }
    return <span className="flex items-center text-slate-400 text-xs font-bold"><Minus className="w-3 h-3 mr-1"/> No change</span>;
  };

  const gridColsClass = maxResumes.length === 2 ? 'lg:grid-cols-2' : maxResumes.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-4';

  const formatDateTime = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 lg:p-12 space-y-8 font-sans max-w-screen-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/resume-analysis" })}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-white/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">Resume Comparison</h2>
            <p className="text-xs text-slate-400 dark:text-white/40 mt-1.5 flex items-center gap-1.5 font-medium">
              <FileText className="w-3.5 h-3.5" />
              <span>Comparing resume history ({maxResumes.length} versions)</span>
            </p>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-8 ${gridColsClass}`}>
        {maxResumes.map((resume: any, idx: number) => {
          const isLatest = idx === maxResumes.length - 1;
          const isOldest = idx === 0;
          const previous = idx > 0 ? maxResumes[idx - 1] : null;

          return (
            <div key={idx} className="space-y-6">
              <div className={cn("glass-card p-6 text-center", isLatest && "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]")}>
                <h3 className={cn("text-lg font-bold", isLatest ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-white/50")}>
                  {isLatest ? "Latest Resume" : isOldest && maxResumes.length === 2 ? "Previous Resume" : `Version ${idx + 1}`}
                </h3>
                <p className={cn("text-xs mt-1", isLatest ? "text-emerald-500/70" : "text-slate-400")}>{resume.fileName}</p>
                <p className={cn("text-xs mt-1", isLatest ? "text-emerald-500/70" : "text-slate-400")}>Analyzed: {resume.createdAt ? formatDateTime(resume.createdAt) : resume.analysisDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={cn("glass-card p-4 text-center relative", isLatest && "border-emerald-500/30")}>
                  <p className="text-xs text-slate-500 dark:text-white/50 uppercase tracking-wide font-bold">ATS Score</p>
                  <div className="flex flex-col items-center justify-center mt-2">
                    <p className="text-3xl font-display font-bold text-slate-800 dark:text-white">{resume.atsScore}%</p>
                    {previous && (
                      <div className="mt-1">{renderTrend(resume.atsScore, previous.atsScore)}</div>
                    )}
                  </div>
                </div>
                <div className={cn("glass-card p-4 text-center relative", isLatest && "border-emerald-500/30")}>
                  <p className="text-xs text-slate-500 dark:text-white/50 uppercase tracking-wide font-bold">Readability</p>
                  <div className="flex flex-col items-center justify-center mt-2">
                    <p className="text-3xl font-display font-bold text-slate-800 dark:text-white">{resume.readability}%</p>
                    {previous && (
                      <div className="mt-1">{renderTrend(resume.readability, previous.readability)}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={cn("glass-card p-6", isLatest && "border-emerald-500/30")}>
                <h4 className="text-sm font-bold text-slate-700 dark:text-white/80 mb-4">Keywords ({resume.skills.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((s: string, i: number) => {
                    const isNew = previous ? !previous.skills.includes(s) : false;
                    return (
                      <span key={i} className={cn("px-2.5 py-1 text-xs rounded-md", isNew ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70")}>
                        {s} {isNew && '✨'}
                      </span>
                    )
                  })}
                </div>
              </div>
              
              <div className="flex justify-center mt-4 gap-3">
                <button
                  onClick={() => setActiveProfileId(resume.id)}
                  disabled={activeProfileId === resume.id || (activeProfileId === null && isLatest)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                    (activeProfileId === resume.id || (activeProfileId === null && isLatest))
                      ? "bg-primary/20 text-primary cursor-default border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                      : "bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-surface-border"
                  )}
                >
                  {(activeProfileId === resume.id || (activeProfileId === null && isLatest)) ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Active Profile
                    </>
                  ) : (
                    "Set as Active"
                  )}
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 bg-surface hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 border border-surface-border hover:border-rose-500/30"
                  title="Delete this version"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
