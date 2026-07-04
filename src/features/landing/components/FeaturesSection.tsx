import { Brain, Target, LineChart, Milestone, BarChart3, Bot } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Link } from "@tanstack/react-router";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analysis",
    description: "Deep ATS parsing with 98% accuracy. Get actionable improvements instantly.",
    color: "#7C3AED", // Violet
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
    glow: "rgba(124,58,237,0.4)",
    comingSoon: false,
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    description: "Semantic AI matches your profile to thousands of live openings with precision scoring.",
    color: "#D946EF", // Magenta
    gradient: "linear-gradient(135deg, rgba(217,70,239,0.15), rgba(217,70,239,0.05))",
    glow: "rgba(217,70,239,0.4)",
    comingSoon: false,
  },
  {
    icon: LineChart,
    title: "Skill Gap Analysis",
    description: "Know exactly what to learn. Personalized roadmaps powered by market demand data.",
    color: "#F59E0B", // Gold
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
    glow: "rgba(245,158,11,0.4)",
    comingSoon: false,
  },
  {
    icon: Milestone,
    title: "Career Roadmap",
    description: "Visualize your path from where you are to your dream role with milestone tracking.",
    color: "#14B8A6", // Teal
    gradient: "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(20,184,166,0.05))",
    glow: "rgba(20,184,166,0.4)",
    comingSoon: false,
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description: "Live salary data, hiring trends, and company insights to negotiate confidently.",
    color: "#F43F5E", // Rose
    gradient: "linear-gradient(135deg, rgba(244,63,94,0.15), rgba(244,63,94,0.05))",
    glow: "rgba(244,63,94,0.4)",
    comingSoon: false,
    link: "/insights"
  },
  {
    icon: Bot,
    title: "AI Career Coach",
    description: "24/7 conversational AI for interview prep, career questions, and resume feedback.",
    color: "#8B5CF6", // Violet Bright
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))",
    glow: "rgba(139,92,246,0.4)",
    comingSoon: false,
  },
];

function TiltCard({ children, color, glow }: { children: ReactNode; color: string; glow: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="group cursor-default relative h-full transition-transform duration-200"
    >
      {/* Animated glowing border on hover */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${color}, transparent, ${color})`,
          backgroundSize: "200% 200%",
          animation: "gradient-shift 3s ease infinite",
        }}
      />
      <div className="card-rainbow absolute -inset-[1.5px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative h-full" style={{ background: "var(--bg-secondary)", borderRadius: "1rem" }}>
        {/* Inner glow on hover */}
        <div 
          className="absolute inset-0 rounded-[1rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 40px ${glow}` }}
        />
        {children}
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section
      className="py-28 px-6 sm:px-12 lg:px-24 font-sans max-w-screen-2xl mx-auto relative overflow-hidden"
      id="features"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Section glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--accent-violet) 0%, transparent 70%)", filter: "blur(100px)" }} />

      {/* Header */}
      <motion.div
        className="text-center mb-20 max-w-2xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <MagneticButton strength={0.2} as="div">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 tracking-wide"
            style={{ border: "1px solid var(--border-strong)", color: "var(--accent-violet-light)", background: "var(--glass-bg)", boxShadow: "0 0 20px rgba(124,58,237,0.15)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_#8B5CF6]" />
            Platform Features
          </div>
        </MagneticButton>
        <h2
          className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-tight mb-5 leading-tight"
          style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Everything You Need to{" "}
          <span className="text-gradient">Win</span>
        </h2>
        <p className="text-sm sm:text-base font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
          AI-powered tools that give you an unfair advantage in today's competitive job market.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 perspective-1000">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
            className={`h-full ${feature.comingSoon ? "opacity-70 grayscale-[30%]" : ""}`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {feature.link ? (
              <Link to={feature.link} className="block h-full">
                <TiltCard color={feature.color} glow={feature.glow}>
                  <div
                    className="p-8 flex flex-col justify-between min-h-[260px] h-full rounded-2xl relative z-10"
                    style={{ border: "1px solid var(--border-medium)" }}
                  >
                    {/* Coming Soon Badge */}
                    {feature.comingSoon && (
                      <div
                        className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--border-strong)", color: "var(--text-secondary)", backdropFilter: "blur(10px)" }}
                      >
                        Coming Soon
                      </div>
                    )}

                    <div>
                      {/* Icon */}
                      <motion.div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative"
                        style={{
                          background: feature.gradient,
                          border: `1px solid ${feature.color}40`,
                          boxShadow: `0 0 25px ${feature.glow}`,
                        }}
                        whileHover={{ scale: 1.15, rotate: [0, -10, 10, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                      </motion.div>

                      <h3
                        className="text-xl font-bold mb-3 group-hover:translate-x-2 transition-transform duration-300"
                        style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-sm font-light leading-relaxed group-hover:text-slate-900 dark:hover:text-white transition-colors duration-300" style={{ color: "var(--text-muted)" }}>
                        {feature.description}
                      </p>
                    </div>

                    {/* Bottom accent line */}
                    <div className="mt-6 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                      style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }} />
                  </div>
                </TiltCard>
              </Link>
            ) : (
              <TiltCard color={feature.color} glow={feature.glow}>
                <div
                  className="p-8 flex flex-col justify-between min-h-[260px] h-full rounded-2xl relative z-10"
                  style={{ border: "1px solid var(--border-medium)" }}
                >
                  {/* Coming Soon Badge */}
                  {feature.comingSoon && (
                    <div
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--border-strong)", color: "var(--text-secondary)", backdropFilter: "blur(10px)" }}
                    >
                      Coming Soon
                    </div>
                  )}

                  <div>
                    {/* Icon */}
                    <motion.div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative"
                      style={{
                        background: feature.gradient,
                        border: `1px solid ${feature.color}40`,
                        boxShadow: `0 0 25px ${feature.glow}`,
                      }}
                      whileHover={{ scale: 1.15, rotate: [0, -10, 10, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                    </motion.div>

                    <h3
                      className="text-xl font-bold mb-3 group-hover:translate-x-2 transition-transform duration-300"
                      style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed group-hover:text-slate-900 dark:hover:text-white transition-colors duration-300" style={{ color: "var(--text-muted)" }}>
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="mt-6 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                    style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }} />
                </div>
              </TiltCard>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
