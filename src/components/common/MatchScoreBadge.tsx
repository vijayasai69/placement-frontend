import { cn } from "@/lib/utils";
import { getMatchBgColor } from "@/lib/utils";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MatchScoreBadge({ score, size = "md", className }: MatchScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-full border",
        getMatchBgColor(score),
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-sm px-3 py-1",
        size === "lg" && "text-lg px-4 py-2 w-16 h-16 flex-col gap-0",
        className
      )}
    >
      {size === "lg" ? (
        <>
          <span className="text-xl leading-none">{score}%</span>
          <span className="text-[10px] font-medium opacity-80 leading-none">MATCH</span>
        </>
      ) : (
        `${score}%`
      )}
    </span>
  );
}
