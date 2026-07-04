import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "../features/authentication/components/LoginForm";
import { RegisterForm } from "../features/authentication/components/RegisterForm";
import { ArrowLeft, Loader2, Brain } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/features/authentication/store/auth-store";
import { getSession } from "@/features/authentication/services/auth-service";


export const Route = createFileRoute("/auth")({
  component: AuthRoute,
});

// Floating 3D geometric shapes for the left panel
function FloatingShapes() {
  const shapes = [
    { size: 120, top: "10%",  left: "10%",  delay: "0s",    duration: "8s",  color: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)",  rotate: "15deg" },
    { size: 80,  top: "60%",  left: "5%",   delay: "1s",    duration: "10s", color: "rgba(168,85,247,0.1)",   border: "rgba(168,85,247,0.2)",   rotate: "-20deg" },
    { size: 60,  top: "25%",  left: "70%",  delay: "2s",    duration: "7s",  color: "rgba(6,182,212,0.1)",    border: "rgba(6,182,212,0.2)",    rotate: "30deg" },
    { size: 100, top: "75%",  left: "60%",  delay: "0.5s",  duration: "9s",  color: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.18)",  rotate: "-10deg" },
    { size: 40,  top: "45%",  left: "40%",  delay: "1.5s",  duration: "6s",  color: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.2)",   rotate: "45deg" },
    { size: 90,  top: "85%",  left: "20%",  delay: "3s",    duration: "11s", color: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.15)",  rotate: "-35deg" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-2xl"
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            background: s.color,
            border: `1px solid ${s.border}`,
            transform: `rotate(${s.rotate})`,
            backdropFilter: "blur(4px)",
            animation: `float-y ${s.duration} ${s.delay} ease-in-out infinite`,
            boxShadow: `0 8px 32px ${s.color}`,
          }}
        />
      ))}
    </div>
  );
}

function AuthRoute() {
  const [isLogin, setIsLogin] = useState(true);
  const [checking, setChecking] = useState(true);
  const { isAuthenticated, setUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If persisted store says authenticated, verify with server
    if (isAuthenticated) {
      getSession()
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user);
            void navigate({ to: "/dashboard", replace: true });
          } else {
            setChecking(false);
          }
        })
        .catch(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  // Show spinner while checking — prevents login page flash for logged-in users
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" style={{ color: "var(--accent-blue)" }} />
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted)" }}>
            Syncing Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row noise-overlay font-sans"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >

      {/* ── Left Branding Panel ── */}
      <div
        className="flex-1 relative p-8 lg:p-16 flex flex-col justify-between overflow-hidden"
        style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border-subtle)" }}
      >
        {/* Aurora blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(60px)", animation: "aurora-1 10s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", filter: "blur(50px)", animation: "aurora-2 13s ease-in-out infinite" }}
        />

        {/* Floating 3D geometric shapes */}
        <FloatingShapes />

        {/* Grid dots */}
        <div className="absolute inset-0 grid-bg-dots opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[500px]">

          {/* Logo */}
          <header>
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                  boxShadow: "0 0 20px var(--glow-blue)",
                }}
              >
                <Brain className="w-5 h-5 text-slate-900 dark:text-white" />
              </motion.div>
              <span className="text-lg font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>
                Placement Recommendation
              </span>
            </Link>
          </header>

          {/* Headline */}
          <motion.div
            className="my-12"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "var(--accent-blue)" }}
            >
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Secure Authentication
            </div>
            <h1
              className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight"
              style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Access the <br />
              <span className="text-gradient-blue">Predictive Grid</span>
            </h1>
            <p className="font-light text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-muted)" }}>
              Securely authenticate to access the predictive grid and align your career trajectory with enterprise demands.
            </p>
          </motion.div>

          {/* Back link */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{
                border: "1px solid var(--border-medium)",
                background: "var(--glass-bg)",
                color: "var(--text-secondary)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div
        className="flex-1 flex items-center justify-center p-8 lg:p-16 relative"
        style={{ background: "var(--bg-primary)" }}
      >
        {/* Subtle corner glows */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {isLogin ? "Sign in to continue your career journey." : "Join thousands of professionals already using the platform."}
            </p>
          </div>


          {/* Tab Switcher */}
          <div
            className="flex rounded-2xl p-1.5 mb-8"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
          >
            {[{ label: "Sign In", val: true }, { label: "Sign Up", val: false }].map((tab) => (
              <button
                key={String(tab.val)}
                onClick={() => setIsLogin(tab.val)}
                className="flex-1 py-3 text-xs font-semibold rounded-xl uppercase tracking-wider transition-all duration-300"
                style={
                  isLogin === tab.val
                    ? {
                        color: "#fff",
                        background: "linear-gradient(135deg, var(--accent-blue), #0ea5e9)",
                        boxShadow: "0 0 20px var(--glow-blue)",
                      }
                    : { color: "var(--text-muted)" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Area */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <RegisterForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
