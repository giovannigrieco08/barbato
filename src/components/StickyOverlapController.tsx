"use client";

import { useEffect, useRef } from "react";

/**
 * StickyOverlapController — assigns rising z-index + marginTop:-100vh chain
 * to all `[data-sticky-overlap]` sections. No GSAP pin (CSS sticky handles
 * the visual hold). Refreshes ScrollTrigger after layout.
 */
export default function StickyOverlapController() {
  const setupRef = useRef(false);

  useEffect(() => {
    if (setupRef.current) return;
    setupRef.current = true;

    let cancelled = false;
    let raf = 0;
    let onResize: (() => void) | null = null;

    (async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      raf = requestAnimationFrame(() => {
        const sections = Array.from(
          document.querySelectorAll<HTMLElement>("[data-sticky-overlap]")
        );

        sections.forEach((s, i) => {
          const chain = s.getAttribute("data-sticky-overlap") || "default";
          let prev: HTMLElement | null = null;
          for (let j = i - 1; j >= 0; j--) {
            if (
              (sections[j].getAttribute("data-sticky-overlap") || "default") === chain
            ) {
              prev = sections[j];
              break;
            }
          }
          s.style.position = s.style.position || "relative";
          s.style.zIndex = String(10 + i);

          if (!prev) return;

          s.style.marginTop = "-100vh";
        });

        ScrollTrigger.refresh();
      });

      onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (onResize) window.removeEventListener("resize", onResize);
      setupRef.current = false;
    };
  }, []);

  return null;
}
