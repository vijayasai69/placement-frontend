import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative rounded-xl border border-surface-border bg-surface transition-all duration-200",
        "hover:border-primary/50 hover:bg-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        size === "sm" ? "p-1.5" : "p-2",
        className
      )}
    >
      {isDark ? (
        <Sun
          className={cn("text-warning transition-transform duration-200", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")}
        />
      ) : (
        <Moon
          className={cn("text-primary-hover transition-transform duration-200", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")}
        />
      )}
    </button>
  );
}
