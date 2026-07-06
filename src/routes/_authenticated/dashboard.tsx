import { createFileRoute, Link } from "@tanstack/react-router";
import { UploadCloud, Search, FileText, Briefcase, Bookmark, Loader2, AlertCircle, Brain } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuthStore } from "@/features/authentication/store/auth-store";
import { useActiveProfile } from "@/store/useActiveProfile";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

// Category color mapping
const CATEGORY_COLORS: Record<string, { stroke: string; bg: string }> = {
  "Frontend":    { stroke: "#2563eb", bg: "bg-blue-600" },
  "Backend":     { stroke: "#10b981", bg: "bg-emerald-500" },
  "Full Stack":  { stroke: "#8b5cf6", bg: "bg-purple-500" },
  "Data Science":{ stroke: "#f59e0b", bg: "bg-amber-500" },
  "AI/ML":       { stroke: "#06b6d4", bg: "bg-cyan-500" },
  "DevOps":      { stroke: "#ec4899", bg: "bg-pink-500" },
  "Mobile":      { stroke: "#f97316", bg: "bg-orange-500" },
  "Other":       { stroke: "#6b7280", bg: "bg-gray-500" },
};

const loadingPhrases = [
  "Analyzing your career trajectory...",
  "Matching skills with top employers...",
  "Generating personalized roadmap...",
  "Calibrating ATS metrics...",
  "Loading your dashboard..."
];

const DynamicLoader = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-[60vh] w-full">
      <div className="flex flex-col items-center justify-center gap-8 max-w-sm w-full">
        {/* Animated AI Core */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-500/30 dark:border-blue-400/30"
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-indigo-500/40 dark:border-indigo-400/40 border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-6 rounded-full border-2 border-purple-500/50 dark:border-purple-400/50"
            animate={{ rotate: 360, scale: [1, 0.9, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          
          {/* Floating Particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 120,
                y: (Math.random() - 0.5) * 120 
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Text Animation */}
        <div className="h-8 relative w-full overflow-hidden flex justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={phraseIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 text-center w-full"
            >
              {loadingPhrases[phraseIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


interface DashboardStats {
  hasProfile: boolean;
  profileCompletion: number;
  atsScore: number;
  readability: number;
  keywordMatch: number;
  formatScore: number;
  skills: string[];
  strengths: string[];
  improvements: string[];
  bestMatchScore: number;
  avgMatchScore: number;
  totalRecommendations: number;
  totalJobs: number;
  jobCategories: Record<string, number>;
  matchScoreTrend: { jobId: string; jobTitle?: string; score: number; createdAt: string }[];
}

function DashboardPage() {
  const { user } = useAuthStore();
  const { activeProfileId } = useActiveProfile();
  const name = user?.name?.split(" ")[0] ?? "User";
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {    
    setLoading(true);
    api
      .get("/api/dashboard/stats", { params: { profileId: activeProfileId } })
      .then((res) => {
        if (res.data?.success) {
          setStats(res.data.data);
        } else {
          setError("Failed to load dashboard data.");
        }
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        if (err?.response?.status === 404) {
          setError("No profile found. Upload your resume to get started.");
        } else {
          setError("Could not connect to the server.");
        }
      })
      .finally(() => setLoading(false));
  }, [activeProfileId]);

  if (loading) {
    return <DynamicLoader />;
  }

  // If no stats or no profile, show empty state
  if (!stats || !stats.hasProfile) {
    return (
      <div className="p-6 lg:p-12 space-y-8 font-sans max-w-screen-2xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-12 text-center space-y-6 relative overflow-hidden"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--border-medium)" }}
        >
          {/* Aurora background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
          </div>
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center relative z-10"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))",
              border: "1px solid rgba(59,130,246,0.25)",
              boxShadow: "0 0 30px rgba(59,130,246,0.2)",
            }}
          >
            <UploadCloud className="w-9 h-9" style={{ color: "var(--accent-blue)" }} />
          </div>
          <h2 className="text-2xl font-bold relative z-10" style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome, {name}! 👋
          </h2>
          <p className="text-sm max-w-md mx-auto relative z-10" style={{ color: "var(--text-muted)" }}>
            Upload your resume to unlock personalized ATS scores, job match insights, skill gap analysis, and AI-powered career coaching.
          </p>
          <Link
            to="/resume"
            className="btn-primary-gradient inline-flex items-center gap-2 relative z-10"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Resume
          </Link>
        </motion.div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="p-6 lg:p-12 font-sans">
        <div className="rounded-2xl p-8 text-center space-y-3"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--border-medium)" }}>
          <AlertCircle className="w-8 h-8 mx-auto" style={{ color: "#ef4444" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{error}</p>
        </div>
      </div>
    );
  }

  // --- Build metrics cards from real data ---
  const metrics = [
    {
      label: "Resume ATS Score",
      value: `${stats.atsScore}%`,
      icon: FileText,
      color: "var(--accent-blue)",
      glow: "rgba(59,130,246,0.2)",
      gradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))",
    },
    {
      label: "Best Match Score",
      value: `${stats.bestMatchScore}%`,
      icon: Briefcase,
      color: "var(--accent-emerald)",
      glow: "rgba(16,185,129,0.2)",
      gradient: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))",
    },
    {
      label: "Job Matches",
      value: `${stats.totalRecommendations}`,
      icon: Brain,
      color: "var(--accent-purple)",
      glow: "rgba(168,85,247,0.2)",
      gradient: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))",
      link: "/jobs",
    },
    {
      label: "Total Jobs Available",
      value: `${stats.totalJobs}`,
      icon: Bookmark,
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.2)",
      gradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))",
      link: "/jobs",
    },
  ];

  // --- Build trend chart points from matchScoreTrend ---
  const trendData = stats.matchScoreTrend.map(t => ({
    name: t.jobTitle?.length && t.jobTitle.length > 15 ? t.jobTitle.substring(0, 15) + "..." : (t.jobTitle || "Job"),
    fullTitle: t.jobTitle || "Job Match",
    score: t.score
  }));

  // --- Build doughnut chart from job categories ---
  const catEntries = Object.entries(stats.jobCategories);
  const totalCatJobs = catEntries.reduce((sum, [, count]) => sum + count, 0);
  const circumference = 2 * Math.PI * 40; // ~251.2

  let accumulatedOffset = 0;
  const doughnutSegments = catEntries.map(([category, count]) => {
    const fraction = totalCatJobs > 0 ? count / totalCatJobs : 0;
    const dashLength = fraction * circumference;
    const dashOffset = circumference - dashLength;
    const rotation = accumulatedOffset * 360;
    accumulatedOffset += fraction;

    const color = CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"];
    return { category, count, fraction, dashLength, dashOffset, rotation, color };
  });

  return (
    <div
      className="p-6 lg:p-10 space-y-8 font-sans max-w-screen-2xl mx-auto pb-24"
      style={{ background: "var(--bg-primary)" }}
    >

      {/* 1. Welcome Card Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(168,85,247,0.06) 100%)",
          border: "1px solid var(--border-medium)",
        }}
      >
        {/* Aurora overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--accent-blue), var(--accent-purple), transparent)" }} />

        <div className="space-y-4 flex-1 relative z-10">
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Welcome back, {name} 👋
          </h2>
          <p className="text-sm font-light max-w-xl" style={{ color: "var(--text-muted)" }}>
            {stats.profileCompletion < 100
              ? `Your profile is ${stats.profileCompletion}% complete. Add more details to boost visibility.`
              : "Your profile is fully complete! Explore your job matches and skill insights."}
          </p>

          {/* Progress bar */}
          <div className="space-y-2 max-w-md pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span style={{ color: "var(--text-muted)" }}>Profile Completion</span>
              <span style={{ color: "var(--accent-blue)" }}>{stats.profileCompletion}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-card)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.profileCompletion}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--accent-blue), var(--accent-purple))" }}
              />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 shrink-0 relative z-10">
          <Link
            to="/resume"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95"
            style={{
              border: "1px solid rgba(20,184,166,0.3)",
              background: "rgba(20,184,166,0.08)",
              color: "var(--accent-emerald)",
            }}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Resume</span>
          </Link>
          <Link
            to="/jobs"
            className="btn-primary-gradient flex items-center gap-2 py-2.5 px-6 text-sm"
          >
            <Search className="w-4 h-4" />
            <span>Find Jobs</span>
          </Link>
        </div>
      </motion.div>

      {/* 2. Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((card, idx) => {
          const CardContent = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.07 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-2xl p-6 relative overflow-hidden group h-full"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--border-subtle)",
                backdropFilter: "blur(12px)",
                cursor: card.link ? "pointer" : "default",
              }}
            >
              {/* Glow blob */}
              <div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ background: `radial-gradient(circle, ${card.color} 0%, transparent 70%)`, filter: "blur(20px)" }}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ background: card.gradient, border: `1px solid ${card.color}25`, boxShadow: `0 0 15px ${card.glow}` }}
                  >
                    <card.icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold mb-1"
                  style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {card.value}
                </div>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  {card.label}
                </p>
              </div>

              {/* Bottom accent on hover */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
              />
            </motion.div>
          );

          return card.link ? (
            <Link key={card.label} to={card.link} className="block outline-none">
              {CardContent}
            </Link>
          ) : (
            <div key={card.label} className="block outline-none">
              {CardContent}
            </div>
          );
        })}
      </div>

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Match Score Trend */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--border-subtle)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
              Match Score by Job
            </h3>
            <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
              {trendData.length} matched roles
            </span>
          </div>

          <div className="h-64 relative flex items-end">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: 'var(--text-faint)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
                            <p className="text-white font-bold text-sm mb-1">{data.fullTitle}</p>
                            <p className="text-blue-400 font-bold text-xs">{`Score: ${data.score}%`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ stroke: 'var(--border-medium)', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--accent-blue)"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    activeDot={{ r: 6, fill: '#60a5fa', stroke: '#1e293b', strokeWidth: 2 }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm"
                style={{ color: "var(--text-faint)" }}>
                No match data yet. Upload your resume to get started.
              </div>
            )}
          </div>
        </div>

        {/* Right: Job Categories Doughnut */}
        <div
          className="rounded-2xl p-6 flex flex-col justify-between"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--border-subtle)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
              Job Categories
            </h3>
          </div>

          {catEntries.length > 0 ? (
            <>
              <div className="flex-1 flex items-center justify-center py-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Base track */}
                    <circle cx="50" cy="50" r="40" fill="transparent"
                      stroke="var(--bg-card)" strokeWidth="11" />
                    {/* Dynamic segments */}
                    {doughnutSegments.map((seg) => (
                      <circle
                        key={seg.category}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={seg.color.stroke}
                        strokeWidth="11"
                        strokeDasharray={`${circumference}`}
                        strokeDashoffset={seg.dashOffset}
                        strokeLinecap="round"
                        transform={`rotate(${seg.rotation}, 50, 50)`}
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold"
                      style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                      {totalCatJobs}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}>
                      {totalCatJobs === 1 ? "Role" : "Roles"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 pt-4"
                style={{ borderTop: "1px solid var(--border-subtle)" }}>
                {doughnutSegments.map((seg) => (
                  <div key={seg.category} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: seg.color.stroke }}
                    />
                    <span className="text-[11px] font-medium truncate" style={{ color: "var(--text-muted)" }}>
                      {seg.category} ({seg.count})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm"
              style={{ color: "var(--text-faint)" }}>
              No job matches yet.
            </div>
          )}
        </div>
      </div>

      {/* 4. Skills & Insights Row */}
      {(stats.skills.length > 0 || stats.strengths.length > 0 || stats.improvements.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills */}
          {stats.skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl p-6"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--border-subtle)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-5"
                style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Your Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {stats.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
                    style={{
                      background: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      color: "var(--accent-blue)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Strengths */}
          {stats.strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-2xl p-6"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--border-subtle)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-5"
                style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Resume Strengths
              </h3>
              <ul className="space-y-2.5">
                {stats.strengths.map((s, i) => (
                  <li key={`str-${i}`} className="flex items-start gap-2.5 text-xs"
                    style={{ color: "var(--text-muted)" }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "var(--accent-emerald)" }} />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Improvements */}
          {stats.improvements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-2xl p-6"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--border-subtle)", backdropFilter: "blur(12px)" }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-5"
                style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Areas to Improve
              </h3>
              <ul className="space-y-2.5">
                {stats.improvements.map((s, i) => (
                  <li key={`imp-${i}`} className="flex items-start gap-2.5 text-xs"
                    style={{ color: "var(--text-muted)" }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#f59e0b" }} />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
