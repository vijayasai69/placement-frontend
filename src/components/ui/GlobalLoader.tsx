import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";

interface GlobalLoaderProps {
  phrases?: string[];
  singleText?: string;
  fullScreen?: boolean;
}

export const GlobalLoader = ({ 
  phrases = ["Loading..."], 
  singleText,
  fullScreen = false
}: GlobalLoaderProps) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (!singleText && phrases.length > 1) {
      const interval = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [singleText, phrases]);

  return (
    <div className={`flex items-center justify-center w-full px-4 ${fullScreen ? "h-screen bg-[var(--bg-primary)]" : "h-[60vh] min-h-[300px]"}`}>
      <div className="flex flex-col items-center justify-center gap-6 max-w-sm w-full">
        {/* Animated AI Core */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full border border-blue-500/30 dark:border-blue-400/30"
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1.5 sm:inset-2 rounded-full border-2 border-indigo-500/40 dark:border-indigo-400/40 border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 sm:inset-6 rounded-full border border-purple-500/50 dark:border-purple-400/50"
            animate={{ rotate: 360, scale: [1, 0.9, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          
          {/* Floating Particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100 
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Text Animation */}
        <div className="h-8 relative w-full overflow-hidden flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={singleText || phraseIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute text-xs sm:text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 text-center w-full px-2"
            >
              {singleText || phrases[phraseIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
