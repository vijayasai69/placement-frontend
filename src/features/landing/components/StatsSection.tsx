import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, Briefcase, Building2, TrendingUp } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const stats = [
  { label: "Active Users", value: 50, suffix: "K+", icon: Users, color: "#7C3AED", glow: "rgba(124,58,237,0.4)" },
  { label: "Jobs Analyzed", value: 2.4, suffix: "M+", icon: Briefcase, color: "#D946EF", glow: "rgba(217,70,239,0.4)" },
  { label: "Partner Companies", value: 8.5, suffix: "K+", icon: Building2, color: "#F59E0B", glow: "rgba(245,158,11,0.4)" },
  { label: "Success Rate", value: 94, suffix: "%", icon: TrendingUp, color: "#14B8A6", glow: "rgba(20,184,166,0.4)" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(value * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  const displayValue = Number.isInteger(value) 
    ? Math.floor(count) 
    : count.toFixed(1);

  return (
    <span ref={ref} className="tabular-nums tracking-tight">
      {displayValue}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section id="stats" className="py-24 relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
      {/* Top and bottom shimmer borders */}
      <div className="absolute top-0 left-0 w-full h-[1px] shimmer" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] shimmer" />

      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 opacity-10"
        style={{
          background: "radial-gradient(circle at 20% 50%, var(--accent-violet-light) 0%, transparent 50%), radial-gradient(circle at 80% 50%, var(--accent-magenta-light) 0%, transparent 50%)"
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10 perspective-1000">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, type: "spring", stiffness: 100 }}
              className="text-center group"
              style={{ transformStyle: "preserve-3d" }}
            >
              <MagneticButton strength={0.15} as="div" className="w-full">
                <div className="flex flex-col items-center glass-card glass-card-hover p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${stat.color}, transparent 70%)` }} />
                  
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300"
                    style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.color}88)` }} />
                  </motion.div>
                  
                  <div 
                    className="text-4xl sm:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 font-display"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  
                  <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ease-out"
                    style={{ background: stat.color }} />
                </div>
              </MagneticButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
