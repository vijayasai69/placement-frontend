import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: "card" | "stat" | "list" | "text" | "avatar";
  count?: number;
  className?: string;
}

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-surface-border rounded-xl animate-pulse",
        className
      )}
    />
  );
}

export function LoadingSkeleton({ variant = "card", count = 1, className }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "stat") {
    return (
      <>
        {items.map((i) => (
          <div key={i} className={cn("glass-card p-6 space-y-3", className)}>
            <div className="flex justify-between">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-8 w-8 rounded-lg" />
            </div>
            <SkeletonBox className="h-8 w-16" />
            <SkeletonBox className="h-3 w-32" />
          </div>
        ))}
      </>
    );
  }

  if (variant === "list") {
    return (
      <>
        {items.map((i) => (
          <div key={i} className={cn("flex items-center gap-3 p-3", className)}>
            <SkeletonBox className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="h-3 w-3/4" />
              <SkeletonBox className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        {items.map((i) => (
          <SkeletonBox key={i} className="h-4 w-full last:w-3/4" />
        ))}
      </div>
    );
  }

  if (variant === "avatar") {
    return <SkeletonBox className={cn("h-12 w-12 rounded-full", className)} />;
  }

  // default: card
  return (
    <>
      {items.map((i) => (
        <div key={i} className={cn("glass-card p-6 space-y-4", className)}>
          <div className="flex gap-3">
            <SkeletonBox className="h-12 w-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="h-4 w-3/4" />
              <SkeletonBox className="h-3 w-1/2" />
            </div>
          </div>
          <SkeletonBox className="h-3 w-full" />
          <SkeletonBox className="h-3 w-5/6" />
          <div className="flex gap-2">
            <SkeletonBox className="h-6 w-16 rounded-full" />
            <SkeletonBox className="h-6 w-16 rounded-full" />
            <SkeletonBox className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}
