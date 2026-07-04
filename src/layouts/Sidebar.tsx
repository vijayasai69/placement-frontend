import React from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/features/authentication/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { logout } from "@/features/authentication/services/auth-service";
import {
  LayoutDashboard,
  FileUp,
  FileText,
  Briefcase,
  Target,
  LogOut,
  Brain,
  Milestone,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface NavSection {
  title: string;
  items: NavItem[];
  color: string;
}

const navigation: NavSection[] = [
  {
    title: "Overview",
    color: "var(--accent-blue)",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Career Tools",
    color: "var(--accent-purple)",
    items: [
      { name: "Resume Upload",   href: "/resume",          icon: FileUp   },
      { name: "Resume Analysis", href: "/resume-analysis", icon: FileText },
      { name: "Job Matches",     href: "/jobs",            icon: Briefcase },
      { name: "Skill Gap",       href: "/skill-gap",       icon: Target   },
      { name: "Career Roadmap",  href: "/roadmap",         icon: Milestone },
      { name: "Market Intelligence", href: "/insights", icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const { clearUser, user } = useAuthStore();
  const customAvatar = useAuthStore(state => state.user ? state.customAvatars[state.user.id] : null);
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";

  const [imageError, setImageError] = React.useState(false);
  React.useEffect(() => {
    setImageError(false);
  }, [customAvatar, user?.image]);

  const validCustomAvatar = customAvatar && customAvatar !== "null" ? customAvatar : null;
  const validUserImage = user?.image && user?.image !== "null" ? user?.image : null;
  const displayImage = !imageError && (validCustomAvatar || validUserImage);

  const handleLogout = () => {
    logout()
      .catch((err) => console.error("Logout request failed:", err))
      .finally(() => {
        setUser(null);
        window.location.href = "/login";
      });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 288 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden md:flex h-screen max-h-screen sticky top-0 flex-col overflow-hidden z-40 shrink-0"
      style={{
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(59,130,246,0.02) 100%)" }}
      />

      {/* Brand Header */}
      <div
        className={cn("p-6 flex items-center relative z-10", sidebarCollapsed ? "justify-center" : "justify-between")}
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <Link to="/dashboard" className="flex items-center gap-3 group shrink-0" title={sidebarCollapsed ? "AI Placement" : ""}>
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
              boxShadow: "0 0 15px var(--glow-blue)",
            }}
          >
            <Brain className="w-5 h-5 text-slate-900 dark:text-white" />
          </motion.div>
          
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-[15px] font-bold tracking-wide whitespace-nowrap"
              style={{ color: "var(--text-primary)" }}
            >
              AI Placement
            </motion.span>
          )}
        </Link>
        
        {!sidebarCollapsed && (
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}
      </div>

      {sidebarCollapsed && (
        <div className="flex justify-center mt-4">
           <button 
            onClick={toggleSidebar} 
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/5 border border-white/10"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10" style={{ scrollbarWidth: "none" }}>
        {navigation.map((section) => (
          <div key={section.title} className="space-y-1">
            {!sidebarCollapsed && (
              <span
                className="px-3 text-[10px] font-bold tracking-widest uppercase block mb-2 whitespace-nowrap"
                style={{ color: "var(--text-faint)" }}
              >
                {section.title}
              </span>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    title={sidebarCollapsed ? item.name : ""}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative group",
                      sidebarCollapsed && "justify-center px-0"
                    )}
                    style={
                      isActive
                        ? {
                            color: "var(--accent-blue)",
                            background: "rgba(59,130,246,0.08)",
                            border: "1px solid rgba(59,130,246,0.15)",
                            boxShadow: "0 0 20px rgba(59,130,246,0.06)",
                          }
                        : {
                            color: "var(--text-muted)",
                            border: "1px solid transparent",
                          }
                    }
                  >
                    {/* Active left indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{
                          background: "linear-gradient(to bottom, var(--accent-blue), var(--accent-purple))",
                          boxShadow: "0 0 10px var(--glow-blue)",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}

                    <item.icon
                      className={cn("w-5 h-5 transition-all duration-200 shrink-0")}
                      style={
                        isActive
                          ? { color: "var(--accent-blue)", filter: "drop-shadow(0 0 6px var(--glow-blue))" }
                          : { color: "var(--text-faint)" }
                      }
                    />
                    {!sidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div
        className="p-4 flex items-center justify-between relative z-10"
        style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--glass-bg)" }}
      >
        <Link to="/profile" className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity" title="View Profile">
          {/* Avatar with gradient ring */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs relative shrink-0 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
              boxShadow: "0 0 15px var(--glow-blue)",
            }}
          >
            {displayImage ? (
              <img 
                src={displayImage} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              initials
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <span className="block text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {user?.name ?? "User"}
              </span>
              <span className="block text-[10px] truncate" style={{ color: "var(--text-faint)" }}>
                {user?.email ?? ""}
              </span>
            </div>
          )}
        </Link>
        {!sidebarCollapsed && (
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg transition-all shrink-0"
            style={{ color: "var(--text-faint)" }}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 hover:text-rose-400 transition-colors" />
          </button>
        )}
      </div>
    </motion.aside>
  );
}

export function MobileTabBar() {
  const location = useLocation();

  const mobileNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resume",    href: "/resume",    icon: FileText   },
    { name: "Jobs",      href: "/jobs",      icon: Briefcase  },
    { name: "Skill Gap", href: "/skill-gap", icon: Target     },
    { name: "Insights",  href: "/insights",  icon: BarChart3  },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around p-3 pb-safe md:hidden"
      style={{
        background: "var(--sidebar-bg)",
        borderTop: "1px solid var(--border-subtle)",
        backdropFilter: "blur(20px)",
      }}
    >
      {mobileNav.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className="flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all"
            style={isActive ? { color: "var(--accent-blue)" } : { color: "var(--text-faint)" }}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
