import { Link } from "@tanstack/react-router";
import { Code2, Globe, Star, Brain } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Case Studies", href: "#" },
    { label: "Reviews", href: "#" },
  ],
  resources: [
    { label: "Blog", href: "#" },
    { label: "Career Guide", href: "#" },
    { label: "Resume Templates", href: "#" },
    { label: "API Docs", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Globe, href: "#", color: "#1DA1F2" },
  { icon: Code2, href: "#", color: "#ffffff" },
  { icon: Star, href: "#", color: "#0A66C2" },
];

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      {/* Top gradient divider */}
      <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: "linear-gradient(90deg, transparent, var(--accent-violet), var(--accent-magenta), transparent)" }} />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group inline-flex">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, var(--accent-violet), var(--accent-magenta))", boxShadow: "0 0 15px var(--glow-violet)" }}
              >
                <Brain className="w-4 h-4 text-slate-900 dark:text-white" />
              </div>
              <span className="text-lg font-bold tracking-wide font-display" style={{ color: "var(--text-primary)" }}>
                Placement Recommendation
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: "var(--text-muted)" }}>
              The most advanced AI career intelligence platform. We bridge the gap between academic achievements and your dream role.
            </p>
            
            <div className="flex items-center gap-4">
              {socialLinks.map((social, idx) => (
                <MagneticButton key={idx} strength={0.2} as="div">
                  <a 
                    href={social.href}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all group"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
                  >
                    <social.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-all" style={{ color: "var(--text-primary)" }} />
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: "var(--text-primary)" }}>
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href as any} className="text-sm transition-colors hover:text-slate-900 dark:hover:text-white" style={{ color: "var(--text-muted)" }}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm transition-colors hover:text-slate-900 dark:hover:text-white" style={{ color: "var(--text-muted)" }}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Placement Recommendation. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
