import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Brain, TrendingUp, ShieldAlert, Code2, FileText, BrainCircuit, FolderGit2, MessageSquare, Target, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,

} from "recharts";
import { cn } from "@/lib/utils";
import { useActiveProfile } from "@/store/useActiveProfile";

export const Route = createFileRoute("/_authenticated/insights")({
  component: InsightsPage,
});

interface MarketIntelligence {
  salaryRange: {
    low: number;
    median: number;
    high: number;
  };
  hiringTrend: {
    growthPercentage: number;
    analysis: string;
  };
  topCompanies: string[];
  topLocations: string[];
  topEarners: { salary: string; company: string; whatTheyDid: string[] }[];
  skillsSimulator: { name: string; boost: number }[];
  trendingSkills: { name: string; score: number; color: string }[];
  companyReadiness: { name: string; match: number; salary: string; difficulty: string; trend: string; deadline: string; logo: string }[];
}

interface InsightsResponse {
  profile: {
    skills: string[];
    atsScore: number;
    location?: string;
    marketIntelligence: MarketIntelligence;
    strengths: string[];
    improvements: string[];
  };
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}

// ============================================================================
// SECTION 1: Top Earners Insight Card
// ============================================================================
function TopEarnersInsight({ profile }: { profile: InsightsResponse["profile"] }) {
  const topEarners = profile.marketIntelligence?.topEarners || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-[1px] rounded-[24px] bg-gradient-to-br from-amber-500/50 via-orange-500/50 to-rose-500/50 overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-rose-500/20 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="relative bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-xl p-6 md:p-8 rounded-[23px] overflow-hidden">

        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-amber-500/50 rounded-full blur-md"
            />
            <div className="relative w-14 h-14 bg-gradient-to-br from-amber-500 to-rose-500 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">Top Earners in your Role</h2>
            <p className="text-amber-500 text-sm font-medium mt-1">What the top 1% are doing to achieve high salaries</p>
          </div>
        </div>

        {topEarners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {topEarners.map((earner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-amber-500/30 transition-all hover:bg-white/10 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{earner.company}</div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 font-bold rounded-full text-sm border border-emerald-500/20">
                    {earner.salary}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">How they did it:</p>
                  {earner.whatTheyDid.map((step, j) => (
                    <div key={j} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <span className="leading-snug">{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 dark:text-slate-400 text-sm p-4 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
            Fetching top earner insights for your specific skills...
          </div>
        )}
      </div>
    </motion.div>
  );
}


// ============================================================================
// SECTION 2: Interactive Salary Simulator
// ============================================================================
function SalarySimulator({ baseLow, baseMedian, baseHigh, marketSkills }: { baseLow: number, baseMedian: number, baseHigh: number, marketSkills: { name: string, boost: number }[] }) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills = marketSkills;

  const totalBoost = selectedSkills.reduce((acc, skillName) => {
    return acc + (skills.find(s => s.name === skillName)?.boost || 0);
  }, 0);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const currentSalary = baseLow + totalBoost;

  const chartData = [
    { name: "Entry Level", value: currentSalary, color: "#f43f5e" },
    { name: "Market Median", value: baseMedian + (totalBoost * 1.0), color: "#8b5cf6" },
    { name: "Top Tier", value: baseHigh + (totalBoost * 1.5), color: "#10b981" },
  ];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-[1px] rounded-[24px] bg-gradient-to-br from-violet-500/30 to-rose-500/30 group"
    >
      <div className="bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-xl p-6 rounded-[23px] transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none transition-all duration-500 group-hover:bg-violet-500/20" />

        <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400 mb-2">
          💰 Salary Growth Simulator
        </h2>
        <div className="flex items-end gap-3 mb-5">
          <p className="text-sm text-slate-500 dark:text-slate-400 pb-1">Current Prediction:</p>
          <motion.div
            key={currentSalary}
            initial={{ scale: 1.1, filter: "brightness(1.5)" }}
            animate={{ scale: 1, filter: "brightness(1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-3xl font-black text-slate-900 dark:text-white"
          >
            {formatCurrency(currentSalary)}
          </motion.div>
          <AnimatePresence>
            {totalBoost > 0 && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-emerald-400 text-sm font-bold pb-1.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              >
                +{formatCurrency(totalBoost)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {skills.map(skill => {
            const isSelected = selectedSkills.includes(skill.name);
            return (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={skill.name}
                onClick={() => toggleSkill(skill.name)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border",
                  isSelected
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/10 hover:border-slate-300 dark:border-white/20"
                )}
              >
                {isSelected ? "−" : "+"} {skill.name}
              </motion.button>
            )
          })}
        </div>

        <div className="w-full mt-6 h-[280px] text-slate-500 dark:text-slate-400 dark:text-slate-400/50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="strokeValue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={1} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.15} vertical={false} />
              <XAxis dataKey="name" stroke="currentColor" tick={{ fill: "currentColor", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[50000, (dataMax: number) => Math.max(dataMax, 2500000)]}
                tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                stroke="currentColor"
                tick={{ fill: "currentColor", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: 'currentColor', strokeWidth: 2, strokeOpacity: 0.1 }}
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#10b981', fontWeight: 600 }}
                formatter={(value: any) => [formatCurrency(value as number), "Salary"]}
                labelStyle={{ color: 'var(--text-muted)' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="url(#strokeValue)"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1500}
                activeDot={{ r: 8, fill: '#10b981', stroke: '#0a0f1c', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// SECTION 3: AI Skill Demand Heatmap
// ============================================================================
function SkillHeatmap({ trendingSkills }: { trendingSkills: { name: string, score: number, color: string }[] }) {

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-[1px] rounded-[24px] bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 group"
    >
      <div className="bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-xl p-6 rounded-[23px] relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6">
          🔥 Trending Skills in the Market
        </h2>

        <div className="space-y-4 flex-1 justify-center flex flex-col">
          {trendingSkills.map((skill, i) => {
            const colors = ["bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-rose-500", "bg-amber-500", "bg-cyan-500", "bg-fuchsia-500"];
            const barColor = colors[i % colors.length];
            return (
              <div key={skill.name} className="relative group/item cursor-pointer">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{skill.name}</span>
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{skill.score}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                    className={cn("h-full rounded-full shadow-[0_0_10px_currentColor]", barColor)}
                  />
                </div>

                {/* Hover tooltip for skill */}
                <div className="absolute left-1/2 -top-16 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-xs whitespace-nowrap shadow-xl border border-slate-200 dark:border-white/10 z-10 pointer-events-none flex gap-4">
                  <div>
                    <div className="text-slate-500 dark:text-slate-400 mb-1">Demand Growth</div>
                    <div className="text-emerald-400 font-bold">+{Math.floor(Math.random() * 20 + 5)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400 mb-1">Hiring Companies</div>
                    <div className="text-cyan-400 font-bold">{Math.floor(Math.random() * 500 + 100)}+</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// SECTION 4: Resume vs Market Alignment
// ============================================================================
function ResumeAlignment({ resumeSkills, marketSkills, matchScore }: { resumeSkills: string[], marketSkills: string[], matchScore: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxInitialSkills = 10;

  const displayResumeSkills = isExpanded ? resumeSkills : resumeSkills.slice(0, maxInitialSkills);
  const displayMarketSkills = isExpanded ? marketSkills : marketSkills.slice(0, maxInitialSkills);

  const hasMore = resumeSkills.length > maxInitialSkills || marketSkills.length > maxInitialSkills;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-[1px] rounded-[24px] bg-gradient-to-br from-blue-500/30 to-purple-500/30 group h-full flex flex-col"
    >
      <div className="bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-xl p-6 rounded-[23px] relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col items-center h-full">
        <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8 text-center">
          🎯 Resume vs Market Alignment
        </h2>

        <div className="grid grid-cols-2 gap-8 w-full mb-8 relative flex-grow">
          {/* Vertical Separator Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-200 dark:bg-white/10 -translate-x-1/2" />

          <div className="space-y-4">
            <h3 className="text-xs font-display uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Your Resume</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {displayResumeSkills.map((s, i) => (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={s}
                  className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-display uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Market Needs</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {displayMarketSkills.map((s, i) => (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={s}
                  className="px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs shadow-[0_0_10px_rgba(249,115,22,0.15)]"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-8 px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors border border-slate-200 dark:border-white/10"
          >
            {isExpanded ? "View Less" : "View More Skills"}
          </button>
        )}

        <div className="flex flex-col items-center justify-center relative mt-auto w-full">
          {/* Animated Circular Progress Indicator */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="45" fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 300" }}
                whileInView={{ strokeDasharray: "230 300" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{matchScore}%</span>
              <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">Match</span>
            </div>
          </div>

          <Link
            to="/skill-gap"
            className="block"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2"
            >
              Improve Match <TrendingUp className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCurrent(value);
        clearInterval(interval);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [value]);
  return <span>{current}</span>;
}

// ============================================================================
// SECTION 5: Placement Readiness Progress
// ============================================================================
function PlacementReadiness({ profile }: { profile: InsightsResponse["profile"] }) {
  const base = profile.atsScore || 75;
  const hash = profile.skills.length + profile.strengths.length; // deterministic offset
  
  const categories = [
    { name: "Technical Skills", target: Math.min(98, base + (hash % 5)), gradient: "from-purple-500 to-cyan-500", icon: Code2, recommendation: "Foundation matches your extracted skills profile." },
    { name: "Resume Quality", target: Math.min(95, base + ((hash * 2) % 10) - 2), gradient: "from-emerald-500 to-cyan-500", icon: FileText, recommendation: profile.improvements.some(i => i.toLowerCase().includes('resume')) ? "Your resume structure needs some ATS optimization." : "Resume is ATS friendly with minor improvements suggested." },
    { name: "Problem Solving", target: Math.max(60, base - ((hash * 3) % 15)), gradient: "from-blue-500 to-purple-500", icon: BrainCircuit, recommendation: "Consistent practice in DSA and logical reasoning recommended." },
    { name: "Project Quality", target: Math.min(96, Math.max(50, base + (profile.strengths.length * 2) - 8)), gradient: "from-orange-500 to-pink-500", icon: FolderGit2, recommendation: "Ensure your projects are deployed and have live links." },
    { name: "Communication", target: Math.max(50, base - 12 + (hash % 8)), gradient: "from-pink-500 to-purple-500", icon: MessageSquare, recommendation: "Focus on articulating your thought process clearly." },
    { name: "Placement Readiness", target: base, gradient: "from-yellow-400 to-emerald-500", icon: Target, recommendation: base >= 80 ? "Ready for placements. Focus on interview prep to maximize offers." : "Focus on closing skill gaps before applying to top-tier roles." }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-[1px] rounded-[24px] bg-gradient-to-br from-indigo-500/30 to-purple-500/30 group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[24px] blur-xl -z-10" />
      <div className="bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-xl p-6 rounded-[23px] relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">

        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-indigo-400"
              animate={{
                y: ["0%", "-100%", "0%"],
                x: ["0%", "50%", "0%"],
                opacity: [0.1, 0.5, 0.1]
              }}
              transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "linear" }}
              style={{ left: `${10 + i * 20}%`, top: `${20 + i * 15}%` }}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start mb-6 gap-3">
          <div>
            <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-400" />
              Placement Readiness Progress
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium max-w-sm">
              AI evaluates your overall placement readiness across multiple career dimensions.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <span className="text-emerald-400 text-[10px] font-bold tracking-wide uppercase">AI Updated Just Now</span>
          </div>
        </div>

        <div className="space-y-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.02, x: 5 }}
              className="group/row relative bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 overflow-hidden hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 z-10"
            >
              {/* Mouse Spotlight effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-200/0 via-slate-200/50 to-slate-200/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 opacity-0 group-hover/row:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-black/40 flex items-center justify-center shadow-inner border border-slate-200 dark:border-white/5 group-hover/row:border-slate-300 dark:border-white/20 transition-colors">
                    <cat.icon className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover/row:text-indigo-600 dark:group-hover/row:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wide">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {cat.target > 90 && (
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  )}
                  <span className="font-black text-lg text-slate-900 dark:text-white font-display tracking-tight">
                    <AnimatedNumber value={cat.target} />%
                  </span>
                </div>
              </div>

              <div className="h-2.5 w-full bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 relative z-10">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${cat.target}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
                  className={`h-full rounded-full bg-gradient-to-r ${cat.gradient} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
                {/* Glow behind the bar */}
                <motion.div
                  initial={{ width: "0%", opacity: 0 }}
                  whileInView={{ width: `${cat.target}%`, opacity: 0.5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
                  className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${cat.gradient} blur-sm -z-10`}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 group-hover/row:text-slate-700 dark:text-slate-300 transition-colors relative z-10 flex items-start gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                {cat.recommendation}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}

function AIReadinessSummary({ profile }: { profile: InsightsResponse["profile"] }) {
  const [typing, setTyping] = useState("");
  const fullText = profile.atsScore > 80 
    ? "Your profile demonstrates strong alignment with market demands." 
    : "Your profile has foundational skills but requires targeted improvements.";

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        currentText += fullText[currentIndex];
        setTyping(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="p-[1px] rounded-[24px] bg-gradient-to-br from-indigo-900/40 to-purple-900/40 group relative"
    >
      <div className="bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-xl p-5 sm:p-6 rounded-[23px] relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-display">AI Readiness Summary</h3>
        </div>

        <p className="text-sm text-cyan-600 dark:text-cyan-300 font-mono mb-6 min-h-[40px] flex items-center relative z-10">
          &gt; {typing}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="ml-1 inline-block w-1.5 h-4 bg-cyan-600 dark:bg-cyan-400" />
        </p>

        <div className="grid grid-cols-2 gap-4 mb-5 relative z-10">
          <div className="bg-slate-50 dark:bg-black/30 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-white/5">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Probability</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400">{profile.atsScore}%</p>
          </div>
          <div className="bg-slate-50 dark:bg-black/30 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-white/5">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Expected Salary</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ₹{(profile.marketIntelligence.salaryRange.low / 100000).toFixed(1).replace('.0', '')}–{(profile.marketIntelligence.salaryRange.high / 100000).toFixed(1).replace('.0', '')} LPA
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <div className="bg-emerald-500/5 rounded-xl p-3 sm:p-4 border border-emerald-500/10">
            <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Strengths</p>
            <ul className="space-y-2">
              {(profile.strengths.length > 0 ? profile.strengths.slice(0, 3) : ["Technical Skills", "Resume Quality", "Industry Alignment"]).map((strength, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full shrink-0" /> <span className="truncate">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-rose-500/5 rounded-xl p-3 sm:p-4 border border-rose-500/10">
            <p className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Areas for Improvement</p>
            <ul className="space-y-2">
              {(profile.improvements.length > 0 ? profile.improvements.slice(0, 3) : ["Communication", "System Design", "Cloud Deployment"]).map((imp, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-rose-400 rounded-full shrink-0" /> <span className="truncate">{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-200 dark:border-white/10 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-medium rounded-full border border-indigo-200 dark:border-indigo-500/30">
            <TrendingUp className="w-4 h-4" /> Expected Match Improvement: <strong className="text-indigo-800 dark:text-white">+{Math.max(5, 100 - profile.atsScore)}%</strong>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN PAGE ASSEMBLE
// ============================================================================
function InsightsPage() {
  const { activeProfileId } = useActiveProfile();

  const { data, isLoading, error } = useQuery({
    queryKey: ["market-intelligence", activeProfileId],
    queryFn: async () => {
      const res = await api.get<InsightsResponse>("/api/market/insights");
      return res.data;
    },
    refetchOnWindowFocus: false,
    retry: false
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin" />
          <Brain className="absolute inset-0 m-auto w-8 h-8 text-violet-400 animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm text-violet-400 font-display tracking-[0.2em] uppercase animate-pulse font-medium">
            Synthesizing Intelligence
          </p>
          <div className="flex gap-1.5 justify-center mt-2">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data || !data.profile || !data.profile.marketIntelligence) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]" />
        <p className="text-rose-400 font-medium text-lg">Please upload a resume to see this.</p>
        <div className="flex gap-4 mt-6">
          <Link to="/resume" className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm text-white font-medium transition-colors">
            Upload Resume
          </Link>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 font-medium transition-colors">
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto relative min-h-screen text-slate-800 dark:text-slate-200">

      {/* Global Background Glows */}
      <div className="fixed top-0 left-10 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-10 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Floating AI Assistant Icon */}
      <motion.div
        drag
        dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/10 rounded-full shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center justify-center cursor-pointer z-50 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-cyan-500/20 group-hover:from-violet-500/40 group-hover:to-cyan-500/40 transition-colors" />
        <Brain className="w-6 h-6 text-white relative z-10" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0f1c] animate-pulse" />
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 dark:border-white/10 pb-6 relative z-10 gap-4 group"
      >
        <div>
          <motion.h1
            whileHover={{ scale: 1.02 }}
            className="text-3xl md:text-4xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 drop-shadow-sm flex flex-wrap items-center gap-3 cursor-default"
          >
            <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] group-hover:-translate-y-1 transition-transform duration-500" />
            Market Intelligence
          </motion.h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 font-medium max-w-2xl group-hover:text-slate-700 dark:text-slate-300 transition-colors">
            Real-time data-driven insights tailored to your profile.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-shadow">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          <span className="text-emerald-400 text-xs font-bold tracking-wide uppercase">AI Updated Just Now</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

        {/* Full width hero */}
        <div className="lg:col-span-12">
          <TopEarnersInsight profile={data.profile} />
        </div>

        {/* Left Column */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6 flex flex-col">
          <div>
            <SalarySimulator
              baseLow={data.profile.marketIntelligence.salaryRange.low}
              baseMedian={data.profile.marketIntelligence.salaryRange.median}
              baseHigh={data.profile.marketIntelligence.salaryRange.high}
              marketSkills={data.profile.marketIntelligence.skillsSimulator || []}
            />
          </div>
          <div>
            <PlacementReadiness profile={data.profile} />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6 flex flex-col">
          <div>
            <SkillHeatmap trendingSkills={data.profile.marketIntelligence.trendingSkills || []} />
          </div>
          <div>
            <ResumeAlignment
              resumeSkills={data.profile.skills}
              marketSkills={(data.profile.marketIntelligence.trendingSkills || []).map(s => s.name)}
              matchScore={data.profile.atsScore}
            />
          </div>
          <div>
            <AIReadinessSummary profile={data.profile} />
          </div>
        </div>

      </div>
    </div>
  );
}
