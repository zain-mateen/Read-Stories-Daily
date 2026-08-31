"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      // The new route's content is usually taller than the last one. Lenis
      // caches its scroll limit, so without re-measuring you can't scroll
      // past where the previous page ended. Re-measure now, next frame, and
      // once fonts have settled (which shift layout height).
      lenis.resize();
      requestAnimationFrame(() => lenis.resize());
      const t = setTimeout(() => lenis.resize(), 250);
      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => lenis.resize());
      }
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, lenis]);

  return null;
}
