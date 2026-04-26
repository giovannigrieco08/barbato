"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Splash screen — ring drawn via conic-gradient mask + wordmark fade-up.
 * Exits after `duration`ms or on click. Respects prefers-reduced-motion.
 */
export default function Splash({
  duration = 1800,
  onComplete,
}: {
  duration?: number;
  onComplete?: () => void;
}) {
  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!mounted) {
      onComplete?.();
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const waitMs = reduced ? Math.round(duration / 2) : duration;
    timers.current.push(setTimeout(() => setExiting(true), waitMs));

    return () => {
      document.body.style.overflow = prevOverflow;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem("splash-seen", "1");
      } catch {}
      document.body.style.overflow = "";
      setMounted(false);
      onComplete?.();
    }, 1250);
    timers.current.push(t);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting]);

  const handleClick = () => {
    if (!exiting) setExiting(true);
  };

  if (!mounted) return null;

  return (
    <div
      aria-hidden={exiting ? "true" : "false"}
      aria-label="Studio Dentistico Fabio Barbato"
      onClick={handleClick}
      className="splash-root"
      data-exiting={exiting ? "1" : "0"}
    >
      <div className="splash-ring" aria-hidden="true">
        <svg
          viewBox="0 0 775 669"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <linearGradient
              id="splashRingGrad"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(0,668.75,-775,0,387.5,0)"
            >
              <stop offset="0" style={{ stopColor: "#1a4a54", stopOpacity: 1 }} />
              <stop offset="0.43" style={{ stopColor: "#5a7c82", stopOpacity: 1 }} />
              <stop offset="1" style={{ stopColor: "#ebebeb", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M775,334.375c0,184.547 -173.633,334.375 -387.5,334.375c-213.867,0 -387.5,-149.828 -387.5,-334.375c0,-184.547 173.633,-334.375 387.5,-334.375c213.867,0 387.5,149.828 387.5,334.375Zm-106.703,0c0,133.729 -125.821,242.301 -280.797,242.301c-154.976,0 -280.797,-108.571 -280.797,-242.301c0,-133.729 125.821,-242.301 280.797,-242.301c154.976,0 280.797,108.571 280.797,242.301Z"
            fill="url(#splashRingGrad)"
            fillRule="evenodd"
          />
        </svg>
      </div>

      <div className="splash-wordmark">
        <h1 className="splash-title">FABIO BARBATO</h1>
        <p className="splash-sub">STUDIO DENTISTICO</p>
      </div>
    </div>
  );
}
