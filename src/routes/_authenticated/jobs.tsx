import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, Briefcase, ArrowRight, Loader2, X, CheckCircle2, AlertCircle, Bot } from "lucide-react";
import { getRecommendations } from "@/features/recommendations/services/recommendation-service";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveProfile } from "@/store/useActiveProfile";

export const Route = createFileRoute("/_authenticated/jobs")({
  component: JobsPage,
});

function getSourceLogoUrl(source?: string) {
  if (!source) return `https://logo.clearbit.com/linkedin.com`;
  const normalized = source.toLowerCase();
  if (normalized.includes('indeed')) return `https://logo.clearbit.com/indeed.com`;
  if (normalized.includes('linkedin')) return `https://logo.clearbit.com/linkedin.com`;
  if (normalized.includes('unstop')) return `https://logo.clearbit.com/unstop.com`;
  if (normalized.includes('glassdoor')) return `https://logo.clearbit.com/glassdoor.com`;
  if (normalized.includes('naukri')) return `https://logo.clearbit.com/naukri.com`;
  if (normalized.includes('ycombinator') || normalized.includes('yc')) return `https://logo.clearbit.com/ycombinator.com`;
  if (normalized.includes('wellfound') || normalized.includes('angellist')) return `https://logo.clearbit.com/wellfound.com`;

  return `https://logo.clearbit.com/${normalized.replace(/[^a-z0-9]/g, "")}.com`;
}

function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");

  const { activeProfileId } = useActiveProfile();

  useEffect(() => {
    setLoading(true);

    // Fetch both recommendations and raw jobs
    if (!activeProfileId) {
      setJobs([]);
      setLoading(false);
      return;
    }

    getRecommendations(undefined, activeProfileId)
      .then((res) => {
        setJobs(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs:", err);
        setJobs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeProfileId]);

  // Filter jobs based on search term and active tab
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      job?.company?.toLowerCase().includes(search.toLowerCase()) ||
      job?.skills?.some((skill: string) => skill?.toLowerCase().includes(search.toLowerCase()));

    // An expired/archived job is one that has isArchived = true (or 'Unknown Company' from bad scrapes)
    const isArchivedJob = job.isArchived || job.company === "Unknown Company";

    if (activeTab === "active") return matchesSearch && !isArchivedJob;
    if (activeTab === "archived") return matchesSearch && isArchivedJob;
    return matchesSearch;
  });

  return (
    <div className="p-6 lg:p-12 space-y-8 font-sans max-w-screen-2xl mx-auto pb-24">

      {/* Header and Search Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Matched Roles
          </h2>
          <p className="text-xs text-slate-400 dark:text-white/40 mt-1.5 font-medium">
            Browse and analyze active opportunities synced to your skill profile.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72 group">
            <span className="absolute inset-y-0 right-0 flex items-center justify-center w-10 pointer-events-none transition-colors duration-300">
              <Search className="h-4 w-4 text-slate-400 dark:text-white/30 group-hover:text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-300" />
            </span>
            <input
              type="text"
              placeholder="Search roles, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-[#0d1527]/50 border border-slate-200 dark:border-white/5 rounded-full pl-4 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-white/30 outline-none hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.4)] focus:bg-slate-50 dark:focus:bg-[#030712]/80 transition-all duration-300"
            />
          </div>
          <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0d1527]/50 flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-px">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === "active"
              ? "text-blue-500"
              : "text-slate-500 hover:text-slate-700 dark:text-white/50 dark:hover:text-white/80"
            }`}
        >
          Active Roles
          {activeTab === "active" && (
            <motion.div layoutId="jobTabs" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          )}
        </button>

      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : !activeProfileId ? (
        <div className="text-center py-20 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
          <Briefcase className="h-10 w-10 text-slate-300 dark:text-white/20 mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-700 dark:text-white/70 mb-2">No active resume</p>
          <p className="text-sm text-slate-500 dark:text-white/50">Please upload and select a resume to see your personalized job matches.</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
          <Briefcase className="h-10 w-10 text-slate-300 dark:text-white/20 mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-white/50">No matching placements found.</p>
        </div>
      ) : (
        /* Grid Layout of Glassmorphic Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job: any) => (
            <div
              key={job.id}
              className="glass-card glass-card-hover p-6 flex flex-col justify-between min-h-[300px] relative group"
            >
              {/* Top Right Actions: Source Logo & Score Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-3">
                {activeTab === "archived" && (
                  <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-md uppercase tracking-wider">
                    Archived
                  </span>
                )}
                {job.source && (
                  <img
                    src={getSourceLogoUrl(job.source)}
                    alt={`${job.source} logo`}
                    className={`h-6 w-auto object-contain opacity-80 ${activeTab === 'archived' ? 'grayscale' : ''}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                {job.matchScore != null && (
                  <div className={`h-9 w-9 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 ${activeTab === 'archived' ? 'opacity-50' : ''}`}>
                    {job.matchScore}%
                  </div>
                )}
              </div>

              {/* Job details */}
              <div className="mb-8">
                <div className="w-10 h-10 rounded-md shadow-sm mb-4 overflow-hidden">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${job.company.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}.com&sz=128`}
                    alt={job.company}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a beautiful generated avatar if the favicon fails
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loops
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=128&bold=true`;
                    }}
                  />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {job.company} - {job.title}
                </h3>
                <p className="text-xs text-slate-900 dark:text-white/55 font-medium tracking-wide mt-1.5">
                  {job.location}
                </p>
                {job.aiInsight && (
                  <p className="text-[10px] text-teal-400/80 font-mono mt-2 uppercase tracking-wider">
                    {job.aiInsight}
                  </p>
                )}
              </div>

              {/* Skill Pills */}
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] text-slate-600 dark:text-white/60 font-semibold px-2.5 py-1 rounded-md tracking-wide"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Analyze Action button */}
              <button
                onClick={() => setSelectedJob(job)}
                className="flex items-center justify-between border-t border-slate-300 dark:border-white/10 pt-5 mt-auto w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group/btn"
              >
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Analyze Role
                </span>
                <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-3xl p-6 md:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title & Company */}
              <div className="space-y-1.5 pr-10">
                <div className="h-9 w-9 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {selectedJob.matchScore}%
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">{selectedJob.title}</h2>
                <p className="text-sm text-slate-600 dark:text-white/60 font-semibold">{selectedJob.company} • {selectedJob.location}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-white/5">
                {/* Matched Skills */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-display">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Matched Skills ({selectedJob.matchedSkills?.length || 0})</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.matchedSkills && selectedJob.matchedSkills.length > 0 ? (
                      selectedJob.matchedSkills.map((skill: string) => (
                        <span key={skill} className="bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-md tracking-wide">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-white/30">None identified</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-display">
                    <AlertCircle className="w-4 h-4" />
                    <span>Missing Skills ({selectedJob.missingSkills?.length || 0})</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.missingSkills && selectedJob.missingSkills.length > 0 ? (
                      selectedJob.missingSkills.map((skill: string) => (
                        <span key={skill} className="bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 text-[10px] text-amber-700 dark:text-amber-400 font-semibold px-2.5 py-1 rounded-md tracking-wide">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-white/30">None identified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Recommendation Reason */}
              <div className="space-y-3 pt-6 border-t border-slate-300 dark:border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-display">
                  <Bot className="w-4 h-4" />
                  <span>AI Recommendation & Analysis</span>
                </h3>
                <div className="bg-slate-50 dark:bg-[#080d1a]/40 border border-slate-200 dark:border-white/5 rounded-xl p-5 text-xs sm:text-[13px] text-slate-700 dark:text-white/80 leading-relaxed font-light whitespace-pre-line">
                  {selectedJob.recommendationReason}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-white/5">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  Close
                </button>
                <a
                  href={selectedJob.applyUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  Apply Now
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
