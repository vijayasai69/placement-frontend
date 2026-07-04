import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldAlert, BookOpen, Loader2, X, Sparkles, Bot, CheckCircle2, Award, ExternalLink, Layout, Server, Settings, Code, Cloud, Network } from "lucide-react";
import { getSkillGaps } from "@/features/recommendations/services/recommendation-service";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useActiveProfile } from "@/store/useActiveProfile";

// ==========================================
// SkillIcon Component
// ==========================================
const SkillIcon = ({ name, category }: { name: string; category: string }) => {
  const [error, setError] = useState(false);

  const getIconSlug = (skillName: string) => {
    if (!skillName) return 'code';
    const s = skillName.toLowerCase();
    let slug = s.replace(/[^a-z0-9]/g, '');

    // Explicit mapping for known differences
    if (s === 'js' || s.includes('javascript')) slug = 'js';
    else if (s === 'ts' || s.includes('typescript')) slug = 'ts';
    else if (s.includes('spring')) slug = 'spring';
    else if (s.includes('react')) slug = 'react';
    else if (s.includes('node')) slug = 'nodejs';
    else if (s.includes('express')) slug = 'express';
    else if (s.includes('aws')) slug = 'aws';
    else if (s.includes('gcp') || s.includes('google cloud')) slug = 'gcp';
    else if (s.includes('azure')) slug = 'azure';
    else if (s.includes('postgres')) slug = 'postgres';
    else if (s.includes('mongo')) slug = 'mongodb';
    else if (s.includes('docker')) slug = 'docker';
    else if (s.includes('kubernetes') || s === 'k8s') slug = 'kubernetes';
    else if (s.includes('python')) slug = 'python';
    else if (s.includes('java') && !s.includes('script')) slug = 'java';

    // Strict allow-list of skillicons.dev supported icons
    // If it's not here, we instantly drop to our beautiful Lucide fallback icons
    const SUPPORTED = new Set([
      'js', 'ts', 'react', 'nextjs', 'vue', 'angular', 'svelte', 'nodejs', 'express', 'nestjs',
      'spring', 'java', 'python', 'c', 'cpp', 'cs', 'go', 'rust', 'php', 'ruby', 'dart', 'swift',
      'kotlin', 'r', 'scala', 'lua', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'materialui',
      'django', 'flask', 'fastapi', 'rails', 'laravel', 'dotnet', 'aws', 'gcp', 'azure', 'docker',
      'kubernetes', 'linux', 'ubuntu', 'postgres', 'postgresql', 'mysql', 'sqlite', 'mongodb',
      'redis', 'cassandra', 'elasticsearch', 'supabase', 'firebase', 'git', 'github', 'gitlab',
      'bitbucket', 'figma', 'graphql', 'apollo', 'prisma', 'nginx', 'rabbitmq', 'kafka', 'hadoop',
      'spark', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikitlearn', 'jest', 'cypress',
      'selenium', 'vite', 'webpack', 'npm', 'yarn', 'pnpm', 'bash', 'cloudflare', 'netlify',
      'vercel', 'heroku', 'jenkins', 'ansible', 'terraform', 'datadog', 'grafana', 'prometheus'
    ]);

    if (!SUPPORTED.has(slug)) return null;
    return slug;
  };

  const slug = getIconSlug(name);

  const FallbackIcon = () => {
    if (category === 'Frontend') return <Layout className="w-5 h-5 text-blue-400" />;
    if (category === 'Backend') return <Server className="w-5 h-5 text-emerald-400" />;
    if (category === 'DevOps') return <Settings className="w-5 h-5 text-amber-400" />;
    if (category === 'Cloud') return <Cloud className="w-5 h-5 text-sky-400" />;
    if (category === 'Architecture') return <Network className="w-5 h-5 text-purple-400" />;
    if (category === 'Data & AI') return <Bot className="w-5 h-5 text-teal-400" />;
    return <Code className="w-5 h-5 text-rose-400" />;
  };

  if (error || !slug) {
    return (
      <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
        <FallbackIcon />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center shadow-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
      <img
        src={`https://skillicons.dev/icons?i=${slug}`}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
};

export const Route = createFileRoute("/_authenticated/skill-gap")({
  component: SkillGapPage,
});



function SkillGapPage() {
  // Selected detail state for modals
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"skills" | "roles">("roles");

  const { activeProfileId } = useActiveProfile();

  const { data, isLoading: loading, error: queryError } = useQuery({
    queryKey: ["skill-gaps", activeProfileId],
    queryFn: async () => {
      if (!activeProfileId) return null;
      const res = await getSkillGaps(undefined, activeProfileId);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
      throw new Error("Failed to load gaps");
    },
    enabled: !!activeProfileId,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  const gaps = data || [];
  
  let error = null;
  if (!activeProfileId) error = "profile_missing";
  else if (queryError) {
    const status = (queryError as any)?.response?.status;
    if (status === 404) error = "profile_missing";
    else error = "failed_to_fetch";
  }

  // Aggregation of unique missing skills across all roles
  const getAggregatedSkills = () => {
    const uniqueSkillsMap: {
      [key: string]: {
        name: string;
        count: number;
        jobs: string[];
        recommendations: any[]
      }
    } = {};

    const gapsToProcess = activeFilterId ? gaps.filter((g: any) => g.jobId === activeFilterId) : gaps;
    const totalJobs = activeFilterId ? 1 : gaps.length;

    gapsToProcess.forEach((gap: any) => {
      gap.missingSkills?.forEach((skill: string) => {
        if (!skill) return;
        const normalized = skill.trim();
        if (!uniqueSkillsMap[normalized]) {
          uniqueSkillsMap[normalized] = {
            name: normalized,
            count: 0,
            jobs: [],
            recommendations: []
          };
        }
        uniqueSkillsMap[normalized].count += 1;
        uniqueSkillsMap[normalized].jobs.push(`${gap.jobTitle} at ${gap.company}`);

        // Find recommendation for this skill
        const rec = gap.learningRecommendations?.find(
          (r: any) => r?.skill?.toLowerCase() === normalized.toLowerCase()
        );
        if (rec) {
          uniqueSkillsMap[normalized].recommendations.push(rec);
        }
      });
    });

    return Object.values(uniqueSkillsMap).map((skillInfo) => {
      const demandPct = totalJobs > 0 ? Math.round((skillInfo.count / totalJobs) * 100) : 0;
      let demandText = "Low Demand";
      let demandColor = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20";

      if (demandPct >= 75) {
        demandText = `Critical (${demandPct}%)`;
        demandColor = "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 animate-pulse";
      } else if (demandPct >= 40) {
        demandText = `High (${demandPct}%)`;
        demandColor = "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20";
      } else {
        demandText = `Medium (${demandPct}%)`;
        demandColor = "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20";
      }

      // Infer category
      let category = "Core Tech";
      const nameLower = skillInfo.name.toLowerCase();
      if (["react", "redux", "html", "css", "vue", "angular", "tailwind", "next.js", "javascript", "typescript"].some(s => nameLower.includes(s))) {
        category = "Frontend";
      } else if (["node", "express", "nest", "python", "postgres", "sql", "graphql", "mongodb", "redis", "go", "java", "spring"].some(s => nameLower.includes(s))) {
        category = "Backend";
      } else if (["docker", "kubernetes", "ci/cd", "jenkins", "devops", "terraform"].some(s => nameLower.includes(s))) {
        category = "DevOps";
      } else if (["aws", "gcp", "azure", "cloud"].some(s => nameLower.includes(s))) {
        category = "Cloud";
      } else if (["system design", "architecture", "microservices", "distributed systems"].some(s => nameLower.includes(s))) {
        category = "Architecture";
      } else if (["machine learning", "data pipeline", "data engineering", "data processing", "bigquery", "airflow", "analytics", "ai", "model"].some(s => nameLower.includes(s))) {
        category = "Data & AI";
      }

      // Estimate time to learn
      let timeToLearn = "2-3 weeks";
      if (category === "Frontend" || category === "Backend") timeToLearn = "1-2 weeks";
      if (category === "DevOps") timeToLearn = "2-3 weeks";
      if (category === "Architecture") timeToLearn = "3-4 weeks";

      // Combine recommendations
      const finalRec = skillInfo.recommendations[0] || {
        resources: [
          `Official documentation for ${skillInfo.name}`,
          `Search online courses for ${skillInfo.name}`
        ],
        projectIdea: `Create a sandbox project with ${skillInfo.name} to demonstrate its core features.`
      };

      return {
        name: skillInfo.name,
        category,
        demand: demandText,
        demandColor,
        demandPct,
        timeToLearn,
        jobs: skillInfo.jobs,
        resources: finalRec.resources,
        projectIdea: finalRec.projectIdea
      };
    }).sort((a, b) => b.demandPct - a.demandPct);
  };

  const aggregatedSkills = getAggregatedSkills();

  return (
    <div className="p-6 lg:p-12 space-y-8 font-sans max-w-screen-2xl mx-auto pb-24 relative">
      {/* Header */}
      <div className="border-b border-slate-300 dark:border-white/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
            AI Skill Gap Analysis
          </h2>
          <p className="text-xs text-slate-400 dark:text-white/40 mt-1.5 font-medium">
            Identify key competencies missing from your profile based on matched real-time roles.
          </p>
        </div>

        {/* Toggle Switch */}
        {!loading && !error && gaps.length > 0 && (
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/10 shrink-0 relative">
            <button
              onClick={() => setActiveTab("roles")}
              className={cn(
                "px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all relative z-10",
                activeTab === "roles"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white/80"
              )}
            >
              {activeTab === "roles" && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-white dark:bg-blue-600 rounded-md shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Bot className="w-3.5 h-3.5 inline-block mr-1.5" />
              Gap by Role
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={cn(
                "px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all relative z-10",
                activeTab === "skills"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white/80"
              )}
            >
              {activeTab === "skills" && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-white dark:bg-blue-600 rounded-md shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Sparkles className="w-3.5 h-3.5 inline-block mr-1.5" />
              Skill Deficiencies
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <span className="text-xs text-slate-500 dark:text-white/50 tracking-wider">Analyzing profile skill gaps...</span>
        </div>
      ) : error === "profile_missing" ? (
        <div className="text-center py-20 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl max-w-2xl mx-auto space-y-6 bg-[#080d1a]/20">
          <ShieldAlert className="h-12 w-12 text-blue-400 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">No Resume Data Found</h3>
            <p className="text-xs text-slate-500 dark:text-white/50 max-w-md mx-auto leading-relaxed">
              We need your active resume to map your skills against real-time job openings and perform a customized AI gap analysis.
            </p>
          </div>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-105"
          >
            <span>Upload Resume Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : error === "failed_to_fetch" ? (
        <div className="text-center py-20 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl max-w-2xl mx-auto space-y-6 bg-[#080d1a]/20">
          <ShieldAlert className="h-12 w-12 text-rose-400 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Analysis Failed</h3>
            <p className="text-xs text-slate-500 dark:text-white/50 max-w-md mx-auto leading-relaxed">
              We encountered an issue while generating your skill gap analysis. Please try refreshing the page.
            </p>
          </div>
        </div>
      ) : (
        /* Layout */
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >

            {/* Left Column: Top Gaps list */}
            {activeTab === "skills" && (
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>
                      {activeFilterId
                        ? `Missing Skills for ${gaps.find((g: any) => g.jobId === activeFilterId)?.jobTitle} (${aggregatedSkills.length})`
                        : `Critical Skill Deficiencies (${aggregatedSkills.length})`}
                    </span>
                  </h3>
                  {activeFilterId && (
                    <button
                      onClick={() => setActiveFilterId(null)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-md"
                    >
                      <X className="w-3 h-3" /> Clear Filter
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {aggregatedSkills.map((skill) => (
                    <div
                      key={skill.name}
                      onClick={() => setSelectedSkill(skill)}
                      className="glass-card glass-card-hover p-6 flex flex-col justify-between min-h-[190px] cursor-pointer group"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <SkillIcon name={skill.name} category={skill.category} />
                          <span className={cn("text-[9px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase", skill.demandColor)}>
                            {skill.demand}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {skill.name}
                          </h4>
                          <p className="text-xs text-slate-400 dark:text-white/40 mt-1 font-medium">{skill.category}</p>
                        </div>
                      </div>

                      <div className="pt-3 mt-4 border-t border-slate-300 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-white/50">
                        <span>Est. Study Time:</span>
                        <span className="font-semibold text-slate-700 dark:text-white/80">{skill.timeToLearn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right Column: Roles Matching gaps */}
            {activeTab === "roles" && (
              <div className="w-full flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>Gap Analysis By Role</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {gaps.map((role: any) => {
                    const computedMatchScore = (!role.missingSkills || role.missingSkills.length === 0) ? 100 : (role.matchScore || 0);
                    return (
                    <div
                      key={role.jobId}
                      onClick={() => setActiveFilterId(activeFilterId === role.jobId ? null : role.jobId)}
                      className={cn(
                        "glass-card p-6 flex flex-col justify-between min-h-[220px] cursor-pointer transition-all border",
                        activeFilterId === role.jobId
                          ? "border-blue-500/50 bg-blue-500/5 shadow-[0_0_30px_rgba(37,99,235,0.15)]"
                          : "border-slate-200 dark:border-white/5 glass-card-hover opacity-75 hover:opacity-100"
                      )}
                    >
                      <div className="space-y-5">
                        <div className="flex justify-between items-start border-b border-slate-300 dark:border-white/10 pb-4">
                          <div className="flex-1 min-w-0 pr-3">
                            <span className="text-sm font-bold text-slate-900 dark:text-white block truncate" title={role.jobTitle}>{role.jobTitle}</span>
                            <span className="text-xs text-slate-400 dark:text-white/40 font-medium block mt-1 truncate" title={role.company}>{role.company}</span>
                          </div>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0 whitespace-nowrap">{computedMatchScore}% Match</span>
                        </div>

                        <div className="space-y-3">
                          <span className="text-[11px] font-semibold text-slate-400 dark:text-white/40 uppercase tracking-wider block">Missing Skills:</span>
                          <div className="flex flex-wrap gap-2">
                            {role.missingSkills && role.missingSkills.length > 0 ? (
                              role.missingSkills.map((gap: string) => (
                                <span key={gap} className="bg-rose-500/5 border border-rose-500/15 text-xs text-rose-400 font-semibold px-2.5 py-1 rounded">
                                  {gap}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-slate-400 dark:text-white/30">None (100% Fit)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-5 border-t border-slate-300 dark:border-white/10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRole(role);
                          }}
                          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Syllabus & Action Plan</span>
                          <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}

      {/* MODAL 1: Skill Learning Path Details */}
      <AnimatePresence>
        {selectedSkill && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-2xl p-6 md:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title & Metadata */}
              <div className="space-y-2 pr-10">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{selectedSkill.category}</span>
                  <span className="text-slate-300 dark:text-white/20">•</span>
                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider", selectedSkill.demandColor)}>
                    {selectedSkill.demand} Priority
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                  <span>{selectedSkill.name}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-white/40 font-medium">
                  Required by: <span className="text-slate-600 dark:text-white/70">{selectedSkill.jobs.join(", ")}</span>
                </p>
              </div>

              {/* Recommended Resources */}
              <div className="space-y-4 pt-4 border-t border-slate-300 dark:border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-display">
                  <BookOpen className="w-4 h-4" />
                  <span>Curated Learning Resources</span>
                </h3>
                <div className="space-y-2.5">
                  {selectedSkill.resources && selectedSkill.resources.map((resource: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-[#080d1a]/40 border border-slate-300 dark:border-white/10 rounded-xl text-xs sm:text-[13px] text-slate-700 dark:text-white/80">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-light">{resource}</span>
                      </div>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(resource)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1.5 border border-slate-200 dark:border-white/5 hover:border-blue-500/25 rounded-md hover:bg-blue-500/5 transition-all shrink-0 ml-4"
                        title="Search Resource"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Practice Project Idea */}
              <div className="space-y-3 pt-5 border-t border-slate-300 dark:border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-display">
                  <Bot className="w-4 h-4" />
                  <span>AI Study Guide</span>
                </h3>
                <div className="bg-slate-50 dark:bg-[#080d1a]/40 border border-slate-200 dark:border-white/5 rounded-xl p-5 text-xs sm:text-[13px] text-slate-700 dark:text-white/80 leading-relaxed font-light">
                  <p className="font-semibold text-slate-800 dark:text-white/90 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
                    <span>Practice Sandbox Idea:</span>
                  </p>
                  <p className="whitespace-pre-line text-slate-600 dark:text-white/70">{selectedSkill.projectIdea}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end pt-6 border-t border-slate-300 dark:border-white/10">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  Close Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Role Learning Path Details */}
      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-3xl p-6 md:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRole(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title & Metadata */}
              <div className="space-y-1.5 pr-10">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Role Learning Path</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{selectedRole.jobTitle}</h2>
                <p className="text-xs text-slate-400 dark:text-white/40 font-semibold">{selectedRole.company} • {(!selectedRole.missingSkills || selectedRole.missingSkills.length === 0) ? 100 : (selectedRole.matchScore || 0)}% Match Profile</p>
              </div>

              {/* Skills Analysis List */}
              <div className="space-y-6 pt-4 border-t border-slate-300 dark:border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-white/70 flex items-center gap-1.5 font-display">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>Targeted Skill Improvement Plan</span>
                </h3>

                <div className="space-y-6">
                  {selectedRole.missingSkills && selectedRole.missingSkills.length > 0 ? (
                    selectedRole.missingSkills.map((missingSkill: string, idx: number) => {
                      const rec = selectedRole.learningRecommendations?.find((r: any) => r.skill.toLowerCase() === missingSkill.toLowerCase());
                      
                      return (
                      <div key={idx} className="bg-slate-50 dark:bg-[#080d1a]/30 border border-slate-200 dark:border-white/5 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-300 dark:border-white/10 pb-2">
                          <span className="text-sm font-bold text-rose-600 dark:text-rose-400 font-display">{missingSkill}</span>
                          <span className="text-[10px] bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold">
                            Missing
                          </span>
                        </div>

                        {/* Resources */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider block">Recommended resources:</span>
                          {rec?.resources && rec.resources.length > 0 ? (
                            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-white/70 list-disc list-inside font-light mb-3">
                              {rec.resources.map((res: string, resIdx: number) => (
                                <li key={resIdx}>{res}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-500 dark:text-white/50 font-light mb-3">
                              We recommend checking the official documentation and beginner tutorials for {missingSkill}.
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(missingSkill + " full course tutorial")}`} target="_blank" rel="noreferrer" className="text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 px-2 py-1 rounded transition-colors border border-slate-200 dark:border-white/10">
                              📺 YouTube Course
                            </a>
                            <a href={`https://github.com/search?q=${encodeURIComponent(missingSkill + " tutorial")}&type=repositories`} target="_blank" rel="noreferrer" className="text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 px-2 py-1 rounded transition-colors border border-slate-200 dark:border-white/10">
                              💻 GitHub Repos
                            </a>
                            <a href={`https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(missingSkill)}`} target="_blank" rel="noreferrer" className="text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 px-2 py-1 rounded transition-colors border border-slate-200 dark:border-white/10">
                              📚 FreeCodeCamp
                            </a>
                          </div>
                        </div>

                        {/* Project Idea */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider block">Practice Project Idea:</span>
                          <p className="text-xs text-slate-900 dark:text-white/75 bg-blue-500/5 border border-blue-500/10 p-3 rounded-lg leading-relaxed font-light">
                            {rec?.projectIdea || `Build a small starter project utilizing ${missingSkill} to understand its core concepts and practical applications.`}
                          </p>
                        </div>
                      </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400 dark:text-white/30">
                      You already possess all required skills for this job role! Keep up the great work.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end pt-6 border-t border-slate-300 dark:border-white/10">
                <button
                  onClick={() => setSelectedRole(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  Close Path
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
