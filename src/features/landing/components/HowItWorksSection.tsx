import { Upload, Cpu, Briefcase } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const steps = [
  {
    icon: Upload,
    title: "1. Upload Your Resume",
    desc: "Drop your PDF. Our system parses 40+ data points instantly.",
    color: "#7C3AED", // Violet
    glow: "rgba(124,58,237,0.4)",
  },
  {
    icon: Cpu,
    title: "2. AI Analysis & Gap Detection",
    desc: "Neural models evaluate your skills against current market demands.",
    color: "#D946EF", // Magenta
    glow: "rgba(217,70,239,0.4)",
  },
  {
    icon: Briefcase,
    title: "3. Land Your Dream Role",
    desc: "Get matched with open jobs where you have a 90%+ statistical chance of success.",
    color: "#F59E0B", // Gold
    glow: "rgba(245,158,11,0.4)",
  },
];

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), { stiffness: 50, damping: 20 });

  return (
    <section
      ref={containerRef}
      className="py-28 px-6 sm:px-12 lg:px-24 font-sans max-w-5xl mx-auto relative"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="text-center mb-20 relative z-10">
        <MagneticButton strength={0.2}>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 tracking-wide"
            style={{ border: "1px solid var(--border-strong)", color: "var(--accent-magenta-light)", background: "var(--glass-bg)", boxShadow: "0 0 20px rgba(217,70,239,0.15)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-magenta-400 animate-pulse shadow-[0_0_8px_#D946EF]" />
            The Process
          </div>
        </MagneticButton>
        <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-tight mb-5" style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
          How <span className="text-gradient">It Works</span>
        </h2>
        <p className="text-sm sm:text-base font-light max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
          Three simple steps to transform your job search from a guessing game into a deterministic science.
        </p>
      </div>

      <div className="relative z-10 perspective-1000">
        {/* Animated vertical line */}
        <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-slate-100 dark:bg-white/5 rounded-full hidden sm:block">
          <motion.div
            className="w-full rounded-full"
            style={{
              height: lineHeight,
              background: "linear-gradient(to bottom, #7C3AED, #D946EF, #F59E0B)",
              boxShadow: "0 0 15px rgba(217,70,239,0.6)",
            }}
          />
        </div>

        <div className="space-y-16 sm:space-y-24 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -40, rotateY: 15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: idx * 0.2, type: "spring" }}
              className="relative flex items-start gap-8 group transform-3d"
            >
              {/* Icon Bubble */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${step.color}20, ${step.color}05)`,
                  border: `1px solid ${step.color}50`,
                  boxShadow: `0 0 20px ${step.glow}`,
                }}
              >
                <step.icon className="w-6 h-6" style={{ color: step.color }} />
                
                {/* Pulse Ring */}
                <div 
                  className="absolute inset-0 rounded-full border-2 pulse-ring"
                  style={{ borderColor: step.color }}
                />
              </div>

              {/* Content Card */}
              <MagneticButton strength={0.05} className="flex-1 w-full" as="div">
                <div
                  className="pt-1 w-full glass-card glass-card-hover p-6 sm:p-8 rounded-2xl relative overflow-hidden"
                >
                  {/* Hover background gradient glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at left, ${step.color}, transparent 60%)` }} />
                  
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-300"
                      style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed transition-colors duration-300" style={{ color: "var(--text-muted)" }}>
                    {step.desc}
                  </p>

                  {/* Colored bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ease-out"
                    style={{ background: step.color }} />
                </div>
              </MagneticButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
