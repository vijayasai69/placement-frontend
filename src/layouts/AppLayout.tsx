import { useEffect, type ReactNode } from "react";
import { Chatbot } from "@/components/ui/Chatbot";
import { Sidebar, MobileTabBar } from "./Sidebar";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { LogOut, Sun, Moon } from "lucide-react";
import { useAuthStore } from "@/features/authentication/store/auth-store";
import { logout } from "@/features/authentication/services/auth-service";
import { useTheme } from "@/providers/theme-provider";
import { motion, AnimatePresence } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { clearUser } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Dynamically lock window-level scrolling when in authenticated app layout
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    return () => {
      // Revert styles when leaving the authenticated app layout
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  const handleLogout = () => {
    logout()
      .catch((err) => console.error("Logout request failed:", err))
      .finally(() => {
        clearUser();
        window.location.href = "/login";
      });
  };

  // Route path to human readable page title mapping
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":       return "Dashboard";
      case "/resume":          return "Resume Upload";
      case "/resume-analysis": return "Resume Analysis";
      case "/jobs":            return "Job Matches";
      case "/skill-gap":       return "Skill Gap Analysis";
      case "/roadmap":         return "Career Roadmap";
      case "/applications":    return "Applications";
      case "/insights":        return "Market Insights";
      case "/support":         return "Interview Prep";
      case "/settings":        return "Certifications";
      case "/profile":         return "Reports";
      default:                 return "Dashboard";
    }
  };

  const title = getPageTitle(location.pathname);

  return (
    <div
      className="flex h-screen h-[100dvh] overflow-hidden"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Header Bar */}
        <header
          className="h-16 px-6 lg:px-8 flex items-center justify-between z-30 shrink-0"
          style={{
            background: "var(--navbar-bg)",
            borderBottom: "1px solid var(--border-subtle)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Left: Page Title */}
          <h1
            className="text-base font-bold tracking-tight hidden sm:block"
            style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h1>



          {/* Right: Theme Toggle + Logout */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="theme-toggle text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark"
                    ? <Sun className="w-4 h-4" />
                    : <Moon className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full transition-all text-slate-500 dark:text-white/40 hover:text-rose-500 dark:hover:text-rose-400"
              title="Terminate Session"
            >
              <LogOut className="h-4.5 w-4.5 transition-colors" />
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto pb-28">
          <div className="min-h-full">{children}</div>
        </main>
      </div>

      {/* Mobile Navigation bar */}
      <MobileTabBar />

      {/* AI Career Coach Chatbot */}
      <Chatbot />
    </div>
  );
}
