"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
        transition={{
          duration: reducedMotion ? 0 : 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
