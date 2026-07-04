import { motion } from "framer-motion";
import {
  Upload,
  CheckCircle2,
  Briefcase,
  Star,
  FileText,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityItem } from "@/types";
import { dummyActivity } from "../data/dummy-activity";

const activityIcons = {
  resume_upload: Upload,
  resume_parsed: CheckCircle2,
  jobs_matched: Briefcase,
  top_match: Star,
} as const;

const activityColors = {
  resume_upload: "bg-secondary/15 text-secondary-hover",
  resume_parsed: "bg-success/15 text-success",
  jobs_matched: "bg-primary/15 text-primary-hover",
  top_match: "bg-warning/15 text-warning",
} as const;

interface ActivityFeedProps {
  items?: ActivityItem[];
  isLoading?: boolean;
}

export function ActivityFeed({ items = dummyActivity, isLoading = false }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="h-8 w-8 bg-surface-border rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 w-3/4 bg-surface-border rounded" />
              <div className="h-3 w-1/3 bg-surface-border rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const Icon = activityIcons[item.type] ?? FileText;
        const colorClass = activityColors[item.type] ?? "bg-surface-border text-text-muted";
        const isLast = index === items.length - 1;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="flex gap-3 relative"
          >
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-surface-border" />
            )}

            {/* Icon dot */}
            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium text-text-primary">{item.title}</p>
              {item.description && (
                <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
              )}
              <p className="text-xs text-text-muted mt-1">
                {formatRelativeTime(item.timestamp)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
