import { cn } from "@/lib/utils";

interface SkillPillProps {
  skill: string;
  variant?: "purple" | "blue" | "muted";
  size?: "sm" | "md";
  className?: string;
}

export function SkillPill({ skill, variant = "purple", size = "sm", className }: SkillPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variant === "purple" && "bg-primary/10 text-primary-hover border-primary/20",
        variant === "blue" && "bg-secondary/10 text-secondary-hover border-secondary/20",
        variant === "muted" && "bg-surface-border/50 text-text-muted border-surface-border",
        className
      )}
    >
      {skill}
    </span>
  );
}
