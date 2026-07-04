import { motion } from "framer-motion";
import { MapPin, Building2, Sparkles, ExternalLink, Bookmark } from "lucide-react";
import { MatchScoreBadge } from "@/components/common/MatchScoreBadge";
import { SkillPill } from "@/components/common/SkillPill";
import { cn } from "@/lib/utils";
import type { Job } from "@/types";

const companyColors: Record<string, string> = {
  Google: "from-blue-500 to-blue-700",
  Razorpay: "from-blue-600 to-indigo-700",
  Swiggy: "from-orange-500 to-red-600",
  Zepto: "from-purple-500 to-purple-700",
  PhonePe: "from-indigo-500 to-purple-700",
  Microsoft: "from-green-500 to-teal-700",
  Figma: "from-pink-500 to-red-600",
  StartupXYZ: "from-gray-500 to-gray-700",
};

function getCompanyGradient(company: string): string {
  return companyColors[company] ?? "from-primary to-primary-hover";
}

interface JobCardProps {
  job: Job;
  delay?: number;
}

const getSourceLogoUrl = (source?: string) => {
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
};

export function JobCard({ job, delay = 0 }: JobCardProps) {
  const displaySkills = job.skills.slice(0, 3);
  const extraSkills = job.skills.length - 3;
  const initial = job.company.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-6 card-hover group relative overflow-hidden"
    >
      {/* Purple glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl border border-primary/30" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Company avatar */}
          <div
            className={cn(
              "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-slate-900 dark:text-white font-bold text-lg flex-shrink-0",
              getCompanyGradient(job.company)
            )}
          >
            {initial}
          </div>
          <div>
            <h3 className="font-bold text-text-primary leading-snug">{job.title}</h3>
            <p className="text-sm text-text-muted">{job.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {job.source && (
            <img 
              src={getSourceLogoUrl(job.source)}
              alt={`${job.source} logo`}
              className="h-6 w-auto object-contain opacity-80"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <MatchScoreBadge score={job.matchScore} size="md" className="flex-shrink-0" />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" />
          {job.type}
        </span>
      </div>

      {/* Salary */}
      <p className="text-sm font-semibold text-text-primary mb-4">
        <span className="text-xs font-normal text-text-muted mr-1">Salary</span>
        {job.salary}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {displaySkills.map((skill) => (
          <SkillPill key={skill} skill={skill} />
        ))}
        {extraSkills > 0 && (
          <SkillPill skill={`+${extraSkills} more`} variant="muted" />
        )}
      </div>

      {/* AI Insight */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-5">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-primary-hover flex-shrink-0" />
          <span className="text-xs font-bold text-primary-hover uppercase tracking-wide">AI Match Insight</span>
        </div>
        <p className="text-xs text-text-muted italic leading-relaxed">{job.aiInsight}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          id={`save-job-${job.id}`}
          aria-label="Save job"
          className="btn-ghost px-3 py-2 text-sm border border-surface-border"
        >
          <Bookmark className="h-4 w-4" />
        </button>
        <button
          id={`view-job-${job.id}`}
          className="btn-secondary flex-1 justify-center text-sm py-2"
        >
          View Details
        </button>
        <button
          id={`apply-job-${job.id}`}
          className="btn-primary-gradient flex-1 justify-center text-sm py-2 shadow-purple-glow-sm"
        >
          Apply Now
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
