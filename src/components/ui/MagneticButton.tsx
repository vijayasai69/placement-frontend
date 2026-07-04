import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  strength?: number;
  as?: "button" | "div";
}

/**
 * Magnetic button that slightly follows the cursor within a radius.
 * Wrap any button/element with this to get a premium magnetic hover effect.
 */
export function MagneticButton({
  children,
  className = "",
  style,
  onClick,
  strength = 0.35,
  as: _Tag = "div",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const springY = useSpring(y, { stiffness: 350, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`magnetic-wrap ${className}`}
      style={style}
    >
      <motion.div
        style={{ x: springX, y: springY, display: "inline-flex" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
