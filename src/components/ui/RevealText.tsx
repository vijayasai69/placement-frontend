import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  style?: React.CSSProperties;
}

export function RevealText({
  children,
  delay = 0,
  className = "",
  as: Component = "div",
  style,
}: RevealTextProps) {
  const containerVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // Custom cubic bezier for smooth reveal
        delay: delay,
      },
    },
  };

  return (
    <div className="overflow-hidden inline-flex">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <Component className={className} style={style}>{children}</Component>
      </motion.div>
    </div>
  );
}
