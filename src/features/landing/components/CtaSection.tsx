import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function CtaSection() {
  return (
    <section className="py-32 px-6 sm:px-12 lg:px-24 font-sans relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--accent-violet) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--accent-magenta) 0%, transparent 40%)",
            filter: "blur(80px)"
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-violet-600/10 to-amber-500/10 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10 glass-card p-12 lg:p-20 border border-slate-200 dark:border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          boxShadow: "0 0 100px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}
      >
        <MagneticButton strength={0.2} as="div">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 shimmer border border-slate-200 dark:border-white/10" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Join 50,000+ professionals</span>
          </div>
        </MagneticButton>
        
        <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight mb-6 leading-tight font-display" style={{ color: "var(--text-primary)" }}>
          Stop Searching.<br/>
          Start <span className="text-gradient">Matching.</span>
        </h2>
        
        <p className="text-base sm:text-lg font-light leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
          Upload your resume now and let our AI instantly map your skills to the most lucrative opportunities on the market.
        </p>
        
        <MagneticButton>
          <Link 
            to="/auth" 
            className="btn-primary-gradient py-4 px-10 text-base sm:text-lg w-full sm:w-auto flex items-center justify-center gap-3 mx-auto"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </MagneticButton>
        
        <p className="text-xs mt-6 opacity-60 font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          No credit card required • Setup in 60 seconds
        </p>
      </motion.div>
    </section>
  );
}
