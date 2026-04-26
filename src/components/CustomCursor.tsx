"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor — desktop only. Dot follows pointer; ring lags 12% per frame.
 * RAF idle pause: stops loop when ring has settled OR mouse idle 800ms.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const state = useRef({ mx: 0, my: 0, rx: 0, ry: 0, hover: false });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    let raf = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let active = false;

    const stopLoop = () => {
      active = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const tick = () => {
      const s = state.current;
      s.rx += (s.mx - s.rx) * 0.12;
      s.ry += (s.my - s.ry) * 0.12;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${s.mx}px, ${s.my}px) translate(-50%, -50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${s.rx}px, ${s.ry}px) translate(-50%, -50%)`;
      const settled = Math.abs(s.mx - s.rx) < 0.5 && Math.abs(s.my - s.ry) < 0.5;
      if (active && !settled) {
        raf = requestAnimationFrame(tick);
      } else {
        active = false;
        raf = 0;
      }
    };

    const startLoop = () => {
      if (active) return;
      active = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      state.current.mx = e.clientX;
      state.current.my = e.clientY;
      if (idleTimer) clearTimeout(idleTimer);
      startLoop();
      idleTimer = setTimeout(stopLoop, 800);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const t = target?.closest?.("[data-cursor='hover'], a, button, input, textarea");
      state.current.hover = !!t;
      if (dotRef.current) {
        dotRef.current.style.width = dotRef.current.style.height = t ? "56px" : "6px";
        dotRef.current.style.background = t ? "transparent" : "#F4F1EA";
        dotRef.current.style.border = t ? "1.5px solid #8FC8C4" : "none";
        dotRef.current.style.mixBlendMode = t ? "normal" : "difference";
      }
      if (ringRef.current) ringRef.current.style.opacity = t ? "0" : "1";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      if (idleTimer) clearTimeout(idleTimer);
      stopLoop();
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[100]"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid rgba(244,241,234,0.7)",
          transition: "opacity .3s, width .25s, height .25s",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[100]"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#F4F1EA",
          transition:
            "width .3s cubic-bezier(.2,.8,.2,1), height .3s cubic-bezier(.2,.8,.2,1), background .25s, border .25s",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
