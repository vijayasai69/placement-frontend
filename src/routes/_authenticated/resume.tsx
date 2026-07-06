import { useState, useCallback, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { cn } from "@/lib/utils";
import { uploadResume, getResumeHistory, downloadResumeProfile } from "@/features/resume/services/resume-service";
import { useActiveProfile } from "@/store/useActiveProfile";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/resume")({
  component: () => <ResumePage defaultStep="idle" />,
});

type UploadStep = "idle" | "uploading";

export function ResumePage({ defaultStep = "idle" }: { defaultStep?: UploadStep }) {
  const navigate = useNavigate();
  const { setActiveProfileId } = useActiveProfile();
  const [step, setStep] = useState<UploadStep>(defaultStep);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "uploading" && startTime) {
      interval = setInterval(() => {
        setElapsedMs(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [step, startTime]);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      const selectedFile = accepted[0];
      setStep("uploading");
      setStartTime(Date.now());
      setElapsedMs(0);
      
      uploadResume(selectedFile)
        .then((res) => {
          if (res.data?.success) {
            if (res.data?.profile?.id) {
              setActiveProfileId(res.data.profile.id);
            }
            // Redirect directly to the analysis page
            navigate({ to: "/resume-analysis" });
          } else {
            setStep("idle");
            alert("Failed to parse resume: " + (res.data?.message || "Unknown error"));
          }
        })
        .catch((err) => {
          setStep("idle");
          console.error("Failed to upload/parse resume", err);
          const errMsg = err?.response?.data?.error?.message || err?.message || "Failed to connect to the parsing agent.";
          alert("Error: " + errMsg);
        });
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  return (
    <div className="p-6 lg:p-12 space-y-8 font-sans max-w-screen-2xl mx-auto pb-24 relative">
      <AnimatePresence mode="wait">
        {/* State 1: IDLE / Drag-n-Drop Upload */}
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto space-y-8 pt-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-display">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300">
                  Upload your Resume
                </span>
              </h2>
              <p className="text-slate-500 dark:text-white/50 text-sm font-light">
                Our advanced neural model analyzes 40+ key metrics to score ATS compliance.
              </p>
            </div>

            <div
              {...getRootProps()}
              className={cn(
                "group relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 ease-out flex flex-col items-center justify-center text-center cursor-pointer min-h-[400px] p-16",
                isDragActive 
                  ? "border-violet-500 bg-violet-500/10 scale-[1.02]" 
                  : "border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-[#080d1a]/30 hover:border-fuchsia-500/50 hover:bg-slate-100 dark:hover:bg-white/[0.02]"
              )}
            >
              {/* Subtle glowing background overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <input {...getInputProps()} />
              
              <div className="relative mb-8">
                {/* Outer pulsing ring */}
                <div className={cn(
                  "absolute inset-0 rounded-full bg-violet-500/20 blur-xl transition-all duration-500",
                  isDragActive ? "scale-150 opacity-100" : "scale-100 opacity-0 group-hover:opacity-100 group-hover:scale-125"
                )} />
                
                {/* Inner Icon Container */}
                <div className={cn(
                  "relative w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-500 border border-violet-500/20 shadow-lg shadow-violet-500/5",
                  isDragActive ? "bg-violet-500/20 scale-110" : "bg-violet-500/10 group-hover:scale-110"
                )}>
                  <UploadCloud className={cn(
                    "h-8 w-8 transition-colors duration-300",
                    isDragActive ? "text-fuchsia-400" : "text-violet-400 group-hover:text-fuchsia-400"
                  )} />
                </div>
              </div>
              
              <p className="relative text-xl font-bold text-slate-900 dark:text-white mb-3 font-display tracking-wide">
                {isDragActive ? "Drop it to Analyze!" : "Drop Resume PDF Here"}
              </p>
              
              <div className="relative flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-white/40 mb-6 w-full max-w-[200px]">
                <span className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
                <span>OR</span>
                <span className="h-[1px] flex-1 bg-slate-200 dark:bg-white/10" />
              </div>

              <div className="relative px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold tracking-wide hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                Browse Files
              </div>
              
              <p className="relative mt-8 text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-bold">
                Supported format: PDF • Max Size: 5MB
              </p>
            </div>
          </motion.div>
        )}

        {/* State 2: Uploading Loading screen */}
        {step === "uploading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto py-24 text-center space-y-6"
          >
            <div className="relative inline-flex items-center justify-center">
              <GlobalLoader singleText="Uploading & Analyzing Document..." />
              {elapsedMs > 0 && (
                <p className="text-xs font-mono text-blue-400 pt-1">
                  Time elapsed: {(elapsedMs / 1000).toFixed(1)}s
                </p>
              )}
            </div>

            <div className="w-full h-1 bg-[#0c1224] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500" 
                initial={{ width: 0 }}
                animate={{ width: "95%" }}
                transition={{ duration: 2.0 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume History Section */}
      {step === "idle" && <ResumeHistorySection />}
    </div>
  );
}

function ResumeHistorySection() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumeHistory()
      .then((res) => {
        if (res.data?.success) {
          setHistory(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to load resume history", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || history.length === 0) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30";
    if (score >= 70) return "text-blue-400 border-blue-500/30";
    return "text-amber-400 border-amber-500/30";
  };

  const handleDownload = async (profileId: string, fileName: string) => {
    try {
      await downloadResumeProfile(profileId, fileName);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download resume");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-2xl mx-auto mt-16"
    >
      <div className="glass-card p-8 border border-slate-200 dark:border-white/10 rounded-2xl relative overflow-hidden dark:bg-[#0c1222]">
        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
          Resume History
        </h3>
        
        <div className="space-y-4 relative z-10">
          {history.map((resume, idx) => {
            const dateStr = resume.createdAt ? formatDate(resume.createdAt) : resume.analysisDate;
            const scoreColor = getScoreColor(resume.atsScore);
            
            return (
              <div 
                key={resume.id || idx}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-white">{resume.fileName}</p>
                    <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">{dateStr}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", scoreColor, "bg-[#0b1120]")}>
                    ATS: {resume.atsScore}
                  </span>
                  
                  <button 
                    onClick={() => handleDownload(resume.id, resume.fileName)}
                    className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                    title="Download original PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
