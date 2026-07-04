import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, Brain } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#process",  label: "How It Works" },
    { href: "#stats",    label: "Stats" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-500"
        style={{
          background: scrolled
            ? "var(--navbar-bg)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
        }}
      >
        <div className="flex items-center justify-between h-20 px-6 sm:px-12 lg:px-24 max-w-screen-2xl mx-auto">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-10 h-10 rounded-full flex items-center justify-center relative"
              style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))", boxShadow: "0 0 20px var(--glow-blue)" }}
            >
              <Brain className="w-5 h-5 text-slate-900 dark:text-white" />
            </motion.div>
            <span className="text-lg font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>
              Placement Recommendation
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium transition-all duration-200 relative group"
                style={{ color: "var(--text-secondary)" }}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{ background: "linear-gradient(90deg, var(--accent-blue), var(--accent-purple))" }}
                />
              </a>
            ))}
          </div>

          {/* Desktop CTAs + Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="theme-toggle"
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
                  transition={{ duration: 0.25 }}
                >
                  {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <Link
              to="/auth"
              className="text-[13px] font-medium transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="btn-primary-gradient text-[13px] py-2.5 px-5"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile: Toggle + Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              className="theme-toggle"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-0 right-0 z-40 md:hidden"
            style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-subtle)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex flex-col gap-1 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/auth"
                  className="text-center py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ border: "1px solid var(--border-medium)", color: "var(--text-primary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="btn-primary-gradient text-center py-3"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
