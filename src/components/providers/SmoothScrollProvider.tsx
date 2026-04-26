"use client";

import { useEffect } from "react";

/**
 * SmoothScrollProvider — Lenis loaded dynamically only on devices with
 * fine pointer (desktop). Bridges Lenis RAF to GSAP ticker so ScrollTrigger
 * pins/scrubs read the smoothed scrollY.
 *
 * Skipped on iOS Safari (native momentum + URL-bar collapse work better).
 * Skipped on prefers-reduced-motion.
 */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS) return;

    let lenis: { destroy: () => void; raf: (t: number) => void; on: (e: string, cb: () => void) => void } | null = null;
    let tickerCb: ((t: number) => void) | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, gsapModule, stModule] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = stModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lenis = new (Lenis as any)({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
      });
      lenis!.on("scroll", () => ScrollTrigger.update());
      tickerCb = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tickerCb);
      gsap.ticker.lagSmoothing(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__lenis = lenis;
    })();

    return () => {
      cancelled = true;
      if (lenis) {
        try {
          lenis.destroy();
        } catch {}
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__lenis = null;
    };
  }, []);

  return <>{children}</>;
}
