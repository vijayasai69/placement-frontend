import { motion } from "framer-motion";
import { CheckCircle, Clock, Briefcase, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  status?: "success" | "warning" | "error" | "purple";
  isLoading?: boolean;
  delay?: number;
}

const statusColors = {
  success: { bg: "bg-success/10", icon: "text-success", border: "border-success/20" },
  warning: { bg: "bg-warning/10", icon: "text-warning", border: "border-warning/20" },
  error: { bg: "bg-error/10", icon: "text-error", border: "border-error/20" },
  purple: { bg: "bg-primary/10", icon: "text-primary-hover", border: "border-primary/20" },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  status = "purple",
  isLoading = false,
  delay = 0,
}: StatCardProps) {
  const colors = statusColors[status];

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="flex justify-between mb-4">
          <div className="h-4 w-24 bg-surface-border rounded" />
          <div className="h-10 w-10 bg-surface-border rounded-xl" />
        </div>
        <div className="h-8 w-16 bg-surface-border rounded mb-2" />
        <div className="h-3 w-32 bg-surface-border rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card"
    >
      {/* Subtle gradient */}
      <div className="absolute top-0 right-0 h-20 w-20 bg-primary/5 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", colors.bg, colors.border)}>
            <Icon className={cn("h-5 w-5", colors.icon)} />
          </div>
        </div>

        <p className="text-3xl font-extrabold text-text-primary mb-1">{value}</p>

        {subtitle && (
          <p className="text-xs text-text-muted">{subtitle}</p>
        )}

        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            <span className="text-xs text-success font-medium">{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Preset stat cards for dashboard
export function DashboardStats({ isLoading = false }: { isLoading?: boolean }) {
  const stats = [
    {
      title: "Profile Completion",
      value: "72%",
      subtitle: "Complete your profile for better matches",
      icon: CheckCircle,
      status: "purple" as const,
      trend: "+8% this week",
    },
    {
      title: "Resume Status",
      value: "Parsed ✓",
      subtitle: "Last updated 2 hours ago",
      icon: Clock,
      status: "success" as const,
    },
    {
      title: "Match Score",
      value: "91/100",
      subtitle: "Based on your profile strength",
      icon: TrendingUp,
      status: "purple" as const,
      trend: "Excellent",
    },
    {
      title: "Jobs Found",
      value: "24",
      subtitle: "AI-curated recommendations",
      icon: Briefcase,
      status: "purple" as const,
      trend: "24 new matches",
    },
  ];

  return (
    <>
      {stats.map((stat, i) => (
        <StatCard key={stat.title} {...stat} isLoading={isLoading} delay={i * 0.1} />
      ))}
    </>
  );
}
