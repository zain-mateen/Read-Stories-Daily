"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
