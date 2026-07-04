import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, TrendingUp, CheckCircle } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

/* ── Floating particle field ── */
function Particles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 43) % 90}%`,
    top: `${10 + (i * 37) % 80}%`,
    delay: `${(i * 0.35) % 3}s`,
    duration: `${4 + (i % 4)}s`,
    size: [3, 2, 1.5, 2.5][i % 4],
    color: ["#8B5CF6", "#D946EF", "#F59E0B", "#14B8A6"][i % 4],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full opacity-0"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: p.color,
            filter: `blur(0.5px) drop-shadow(0 0 4px ${p.color})`,
            animation: `particle-float ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Typewriter effect ── */
function TypewriterText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = words[index];
    if (!deleting && displayed.length < target.length) {
      const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 70);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === target.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }
  }, [displayed, deleting, index, words]);

  return (
    <span className="inline-block relative">
      <span
        className="text-gradient"
        style={{ backgroundImage: "linear-gradient(135deg, #A78BFA, #E879F9, #FCD34D)" }}
      >
        {displayed}
      </span>
      <span
        className="inline-block w-0.5 h-[0.85em] ml-1 rounded-full align-middle"
        style={{
          background: "#8B5CF6",
          animation: "blink-caret 1s ease infinite",
          boxShadow: "0 0 8px rgba(139,92,246,0.8)",
        }}
      />
    </span>
  );
}

/* ── 3D interactive dashboard mockup ── */
function Dashboard3DMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 180, damping: 28 });
  const springY = useSpring(ry, { stiffness: 180, damping: 28 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    rx.set(-dy * 10);
    ry.set(dx * 10);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ perspective: "1100px" }}>
      <motion.div
        style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* "94% Match!" floating badge */}
        <motion.div
          className="absolute -top-5 -right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
          style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.35)",
            color: "#34d399",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 20px rgba(16,185,129,0.25)",
          }}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>94% Match Found!</span>
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </motion.div>

        {/* Main glass window */}
        <div className="w-full rounded-2xl p-6 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(18,14,34,0.95) 0%, rgba(24,16,44,0.95) 100%)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}>

          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <div className="flex-1 h-3 rounded-full ml-3" style={{ background: "rgba(139,92,246,0.1)" }} />
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { val: "88%", label: "Resume Score", color: "#8B5CF6" },
              { val: "47",  label: "Job Matches",  color: "#D946EF" },
              { val: "12",  label: "Applications", color: "#F59E0B" },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                className="p-4 rounded-xl text-center"
                style={{ background: "rgba(139,92,246,0.06)", border: `1px solid ${m.color}20` }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="text-xl font-extrabold"
                  style={{ color: m.color, filter: `drop-shadow(0 0 10px ${m.color}88)` }}>
                  {m.val}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,255,0.4)" }}>{m.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Mini bar chart — violet/magenta/gold colors */}
          <div className="rounded-xl p-3 mb-5"
            style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(139,92,246,0.1)" }}>
            <div className="h-24 flex items-end justify-between gap-1 px-1">
              {[35, 22, 55, 48, 68, 62, 78, 95].map((h, i) => {
                const colors = ["#7C3AED", "#8B5CF6", "#A78BFA", "#C026D3", "#D946EF", "#E879F9", "#F59E0B", "#FCD34D"];
                return (
                  <motion.div key={i} className="flex-1 rounded-t"
                    style={{
                      background: i === 7 ? `linear-gradient(to top, ${colors[i]}, ${colors[i]}cc)` : `${colors[i]}55`,
                      boxShadow: i === 7 ? `0 0 14px ${colors[i]}88` : "none",
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.07, duration: 0.55, ease: "easeOut" }}
                  />
                );
              })}
            </div>
          </div>

          {/* Job cards */}
          <div className="space-y-2.5">
            {[
              { letter: "S", company: "Stripe",    title: "Senior Frontend Eng.", score: "94%", bg: "rgba(124,58,237,0.15)", col: "#8B5CF6" },
              { letter: "A", company: "Anthropic", title: "ML Engineer",           score: "87%", bg: "rgba(217,70,239,0.15)",  col: "#D946EF" },
            ].map((job) => (
              <div key={job.company} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                    style={{ background: job.bg, color: job.col }}>{job.letter}</div>
                  <div>
                    <div className="text-[11px] font-semibold" style={{ color: "#F5F0FF" }}>{job.title}</div>
                    <div className="text-[9px]" style={{ color: "rgba(245,240,255,0.4)" }}>{job.company}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${job.col}18`, border: `1px solid ${job.col}30`, color: job.col }}>
                  ✓ {job.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ATS floating badge */}
        <motion.div
          className="absolute -bottom-5 left-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
          style={{
            background: "rgba(18,14,34,0.95)",
            border: "1px solid rgba(139,92,246,0.35)",
            color: "#8B5CF6",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 20px rgba(124,58,237,0.3)",
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <TrendingUp className="w-4 h-4" />
          <span>ATS Score: 88 / 100</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

const TYPEWRITER_WORDS = ["Dream Job", "Top Salary", "Perfect Role", "Best Match"];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item: any = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroSection() {
  return (
    <section
      className="relative min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-24 py-14 lg:py-20 overflow-hidden max-w-screen-2xl mx-auto gap-12 aurora-bg"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Aurora blobs — violet/magenta/gold */}
      <div className="aurora-blob-1" style={{ top: "8%", left: "-8%",   background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)" }} />
      <div className="aurora-blob-2" style={{ bottom: "8%", right: "-8%", background: "radial-gradient(circle, rgba(217,70,239,0.2) 0%, transparent 70%)" }} />
      <div className="aurora-blob-3" style={{ top: "45%", left: "38%",  background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />

      {/* Particles */}
      <Particles />

      {/* Dot grid */}
      <div className="absolute inset-0 grid-bg-dots pointer-events-none opacity-50" />

      {/* Rotating conic gradient ring decorative */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none opacity-5"
        style={{
          background: "conic-gradient(from 0deg, #7C3AED, #D946EF, #F59E0B, #14B8A6, #7C3AED)",
          animation: "spin-slow 25s linear infinite",
        }}
      />

      {/* ── Left: Text + CTA ── */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-start text-left z-10 max-w-2xl"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-6 shimmer"
          style={{
            border: "1px solid rgba(139,92,246,0.35)",
            background: "rgba(124,58,237,0.1)",
            color: "#A78BFA",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Career Intelligence Platform</span>
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"
            style={{ boxShadow: "0 0 6px #8B5CF6" }} />
        </motion.div>

        {/* Headline with typewriter */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-tight leading-[1.1] mb-6"
          style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Land Your{" "}
          <TypewriterText words={TYPEWRITER_WORDS} />
          <br />
          <span style={{ color: "var(--text-primary)" }}>with AI Precision</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="text-base sm:text-lg font-light leading-relaxed mb-10 max-w-lg"
          style={{ color: "var(--text-muted)" }}
        >
          Placement Recommendation analyzes your resume, matches you with top roles, identifies skill gaps,
          and coaches you to interview excellence — all powered by cutting-edge AI.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
          <MagneticButton>
            <Link to="/auth" className="btn-primary-gradient py-4 px-8 flex items-center gap-2 text-sm">
              <span>Start for Free</span>
              <ArrowRight className="w-4 h-4" style={{ animation: "bounce-x 1.5s ease-in-out infinite" }} />
            </Link>
          </MagneticButton>
        </motion.div>

        {/* Trust signals */}
        <motion.div variants={item} className="flex items-center gap-6 flex-wrap">
          {[
            { label: "50K+ Placed",    dot: "#8B5CF6" },
            { label: "120K+ Resumes",  dot: "#D946EF" },
            { label: "8.5K+ Companies",dot: "#F59E0B" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: s.dot, boxShadow: `0 0 6px ${s.dot}` }} />
              <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right: 3D Dashboard Mockup ── */}
      <motion.div
        className="flex-1 w-full lg:max-w-xl z-10"
        initial={{ opacity: 0, x: 60, rotateY: -15 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Dashboard3DMockup />
      </motion.div>
    </section>
  );
}
