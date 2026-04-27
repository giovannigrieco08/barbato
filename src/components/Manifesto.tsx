"use client";

import { useEffect, useRef } from "react";

const M_INK = "#0A2E36";
const M_BONE = "#F4F1EA";

function naturalVideoWidth(vw: number) {
  if (vw < 768) return Math.min(vw * 0.78, 420);
  if (vw < 1024) return Math.min(vw * 0.48, 560);
  return Math.min(vw * 0.38, 720);
}

// Insets % che rivelano una "window" 16:9 centrata della dimensione
// originale del design. Animate via CSS variables → GSAP tween numerico
// per ognuna, niente parsing di stringhe clip-path complesse → niente bug.
function computeInsets(): { ix: number; iy: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targetW = naturalVideoWidth(vw);
  const targetH = targetW * (9 / 16);
  const ix = Math.max(0, ((vw - targetW) / 2 / vw) * 100);
  const iy = Math.max(0, ((vh - targetH) / 2 / vh) * 100);
  return { ix, iy };
}

function TopographicPattern() {
  return (
    <svg
      className="manifesto-pattern"
      viewBox="0 0 2400 1400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke={M_BONE} strokeOpacity="0.05" strokeWidth="1">
        <path d="M -200 220 Q 300 120, 700 220 T 1500 220 T 2300 220 T 3100 220" />
        <path d="M -200 380 Q 350 280, 720 360 T 1480 380 T 2260 360 T 3000 380" />
        <path d="M -200 540 Q 400 460, 800 540 T 1600 540 T 2400 540 T 3200 540" />
        <path d="M -200 720 Q 280 620, 660 720 T 1420 720 T 2180 700 T 2940 720" />
        <path d="M -200 900 Q 360 820, 760 900 T 1520 900 T 2280 900 T 3040 900" />
        <path d="M -200 1080 Q 320 980, 700 1060 T 1460 1080 T 2220 1060 T 2980 1080" />
        <path d="M -200 1240 Q 380 1160, 780 1240 T 1540 1240 T 2300 1240 T 3060 1240" />
      </g>
    </svg>
  );
}

function MarqueeRow({
  text,
  italic,
  opacity,
  dir,
}: {
  text: string;
  italic?: boolean;
  opacity?: number;
  dir?: "left" | "right";
}) {
  const repeat = 6;
  const copies = Array.from({ length: repeat }, (_, i) => i);
  return (
    <div
      className="manifesto-marquee"
      style={
        {
          opacity,
          "--dir": dir === "left" ? -1 : 1,
        } as React.CSSProperties
      }
    >
      <div
        className="manifesto-marquee-track"
        style={{ fontStyle: italic ? "italic" : "normal" }}
      >
        {copies.map((i) => (
          <span key={i} className="manifesto-marquee-word">
            {text}&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const basedRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const botRowRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const windowBorderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl: any = null;
    let onLoad: (() => void) | null = null;
    let onResize: (() => void) | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.config({ force3D: true, nullTargetWarn: false });
      ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

      const section = sectionRef.current;
      const sticky = stickyRef.current;
      const videoBox = videoBoxRef.current;
      const heroText = heroTextRef.current;
      const based = basedRef.current;
      const topRow = topRowRef.current;
      const botRow = botRowRef.current;
      const pattern = patternRef.current;
      const windowBorder = windowBorderRef.current;
      if (!section || !sticky || !videoBox) return;

      const all = [topRow, botRow, videoBox, heroText, based, pattern];
      all.forEach((el) => {
        if (el) el.style.willChange = "transform, opacity";
      });
      const clearWillChange = () => {
        all.forEach((el) => {
          if (el) el.style.willChange = "auto";
        });
      };
      const setWillChange = () => {
        all.forEach((el) => {
          if (el) el.style.willChange = "transform, opacity";
        });
      };

      // Stato iniziale: video copre tutta la viewport (clip-path inset 0).
      // Pattern + marquee partono opacity 0 e sono comunque DIETRO al video
      // → invisibili a t=0.
      gsap.set(videoBox, {
        "--ci-y": "0%",
        "--ci-x": "0%",
        "--ci-r": "0px",
      });
      gsap.set(windowBorder, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderColor: "rgba(244, 241, 234, 0)",
        borderRadius: 0,
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0)",
        opacity: 0,
      });
      gsap.set([pattern, topRow, botRow], { opacity: 0 });

      const isMobView = window.matchMedia("(max-width: 767px)").matches;
      const pinDistance = isMobView ? "+=180%" : "+=280%";

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: pinDistance,
          scrub: true,
          pin: sticky,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: clearWillChange,
          onLeaveBack: clearWillChange,
          onEnter: setWillChange,
          onEnterBack: setWillChange,
        },
      });

      let targets = computeInsets();

      tl.to(heroText, { opacity: 0, y: -40, ease: "power1.out", duration: 0.2 }, 0.1);
      tl.to(based, { opacity: 0, y: 30, ease: "power1.out", duration: 0.2 }, 0.1);

      // Video shrink: animo le 3 CSS variables (--ci-y, --ci-x, --ci-r) che
      // il browser ricompone in clip-path: inset(...) round ... . Ogni var
      // viene tweenata numericamente da GSAP → tween simmetrico, niente bug.
      tl.to(
        videoBox,
        {
          "--ci-y": () => `${targets.iy}%`,
          "--ci-x": () => `${targets.ix}%`,
          "--ci-r": "4px",
          ease: "power2.inOut",
          duration: 0.5,
        },
        0.05
      );
      // Border della window (sopra video) — appare con la stessa cinetica
      tl.to(
        windowBorder,
        {
          top: () => `${targets.iy}%`,
          bottom: () => `${targets.iy}%`,
          left: () => `${targets.ix}%`,
          right: () => `${targets.ix}%`,
          borderColor: "rgba(244, 241, 234, 0.18)",
          borderRadius: 4,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.5,
        },
        0.05
      );

      tl.to(pattern, { opacity: 1, ease: "power1.out", duration: 0.2 }, 0.3);
      tl.to(topRow, { opacity: 1, ease: "power1.out", duration: 0.15 }, 0.4);
      tl.to(botRow, { opacity: 1, ease: "power1.out", duration: 0.15 }, 0.45);
      tl.fromTo(
        topRow,
        { xPercent: 0 },
        { xPercent: -50, ease: "none", duration: 1 },
        0
      );
      tl.fromTo(
        botRow,
        { xPercent: -50 },
        { xPercent: 0, ease: "none", duration: 1 },
        0
      );
      tl.fromTo(
        pattern,
        { xPercent: 0 },
        { xPercent: -25, ease: "none", duration: 1 },
        0
      );
      tl.to(
        videoBox,
        { opacity: 0.5, ease: "power2.in", duration: 0.15 },
        0.85
      );
      tl.to(
        [topRow, botRow],
        { opacity: 0, ease: "power1.in", duration: 0.15 },
        0.85
      );

      onResize = () => {
        targets = computeInsets();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      const refresh = () => {
        targets = computeInsets();
        ScrollTrigger.refresh();
      };
      timeout = setTimeout(refresh, 200);
      onLoad = refresh;
      window.addEventListener("load", onLoad);
    })();

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
      if (onLoad) window.removeEventListener("load", onLoad);
      if (onResize) window.removeEventListener("resize", onResize);
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="manifesto-section"
      style={{ background: M_INK, position: "relative", zIndex: 2 }}
      data-screen-label="01 Hero + Manifesto"
      data-sticky-overlap="A"
    >
      <div ref={stickyRef} className="manifesto-sticky">
        {/* Pattern + marquee z-1, z-2 — DIETRO al video. Sono invisibili
            durante il video full-viewport, emergono solo nei bordi quando
            il video si stringe alla window 16:9 centrale. */}
        <div ref={patternRef} className="manifesto-pattern-wrap">
          <TopographicPattern />
        </div>

        <div ref={topRowRef} className="manifesto-row manifesto-row-top">
          <MarqueeRow
            text="PRECISIONE • CURA • TEMPO • FIDUCIA •"
            italic={false}
            opacity={0.18}
            dir="left"
          />
        </div>

        <div ref={botRowRef} className="manifesto-row manifesto-row-bot">
          <MarqueeRow
            text="Ogni giorno • Un sorriso alla volta •"
            italic={true}
            opacity={0.12}
            dir="right"
          />
        </div>

        {/* Video full-viewport sopra a pattern/marquee. Clip-path animato
            via CSS variables per "stringere" alla window 16:9. */}
        <div ref={videoBoxRef} className="manifesto-window">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/videos/hero-poster.jpg"
            aria-hidden="true"
          >
            <source src="/videos/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/videos/hero-desktop.mp4" type="video/mp4" />
          </video>
          <div className="manifesto-window-overlay" aria-hidden="true" />
        </div>

        {/* Border della window — sopra il video clipped, opacità + posizione
            animate per emergere insieme al shrink. */}
        <div ref={windowBorderRef} className="manifesto-window-border" aria-hidden="true" />

        <div ref={heroTextRef} className="manifesto-hero-text">
          <div className="manifesto-hero-eyebrow">Studio Dentistico · Manfredonia</div>
          <h1 className="manifesto-hero-headline font-heading">
            <span className="manifesto-hero-line-1">
              Il sorriso<br className="hero-break-mobile" /> che meriti,
            </span>
            <span className="manifesto-hero-line-2">ogni giorno</span>
          </h1>
        </div>

        <div ref={basedRef} className="manifesto-based">
          <div className="manifesto-based-label">Based in:</div>
          <ul className="manifesto-based-list">
            <li>Manfredonia</li>
            <li>Gargano</li>
            <li>Puglia</li>
          </ul>
        </div>
      </div>

      <style>{`
        .manifesto-section {
          position: relative;
          width: 100%;
          color: ${M_BONE};
        }
        .manifesto-sticky {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          overflow: hidden;
        }

        /* Pattern + marquee — DIETRO il video. */
        .manifesto-pattern-wrap {
          position: absolute;
          inset: 0;
          width: 130%;
          z-index: 1;
          pointer-events: none;
        }
        .manifesto-pattern { width: 100%; height: 100%; display: block; }
        .manifesto-row {
          position: absolute;
          left: 0; right: 0;
          z-index: 2;
          pointer-events: none;
        }
        .manifesto-row-top { top: 30%; }
        .manifesto-row-bot { top: 70%; }
        .manifesto-marquee {
          position: relative;
          width: 100%;
          overflow: visible;
          transform: translateY(-50%);
        }
        .manifesto-marquee-track {
          display: flex;
          flex-wrap: nowrap;
          white-space: nowrap;
          width: max-content;
          font-family: 'Instrument Serif', serif;
          font-size: clamp(6rem, 12vw, 10rem);
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.02em;
          color: ${M_BONE};
        }
        .manifesto-marquee-word { display: inline-block; padding-right: 0.4em; }

        /* Video full-viewport sopra a pattern + marquee. clip-path
           animato tramite CSS variables: GSAP tweena ogni var
           numericamente, il browser ricompone la stringa clip-path. */
        .manifesto-window {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          background: ${M_INK};
          overflow: hidden;
          --ci-y: 0%;
          --ci-x: 0%;
          --ci-r: 0px;
          clip-path: inset(var(--ci-y) var(--ci-x) var(--ci-y) var(--ci-x) round var(--ci-r));
          will-change: clip-path, opacity;
        }
        .manifesto-window video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .manifesto-window-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10,46,54,0.15) 0%, rgba(10,46,54,0.0) 30%, rgba(10,46,54,0.0) 70%, rgba(10,46,54,0.35) 100%);
          pointer-events: none;
        }

        /* Window border — sopra il video, animato in posizione + opacità */
        .manifesto-window-border {
          position: absolute;
          z-index: 4;
          top: 0; bottom: 0; left: 0; right: 0;
          border: 1px solid rgba(244, 241, 234, 0);
          border-radius: 0;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0);
          opacity: 0;
          pointer-events: none;
          will-change: top, bottom, left, right, opacity;
        }

        .manifesto-hero-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          width: 100%;
          padding: 0 6vw;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1rem, 2vw, 1.75rem);
          pointer-events: none;
          text-align: center;
        }
        .manifesto-hero-eyebrow {
          font-family: 'Barlow', 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${M_BONE};
          opacity: 0.72;
          white-space: nowrap;
        }
        .manifesto-hero-headline {
          margin: 0;
          font-family: 'Instrument Serif', serif;
          font-size: clamp(3.5rem, 8.5vw, 7.5rem);
          line-height: 0.96;
          letter-spacing: -0.025em;
          color: ${M_BONE};
          font-weight: 400;
          text-shadow: 0 2px 20px rgba(0,0,0,0.35);
        }
        .manifesto-hero-line-1, .manifesto-hero-line-2 { display: block; }
        .manifesto-hero-line-2 { font-style: italic; }
        .manifesto-based {
          position: absolute;
          bottom: 8vh;
          left: 6vw;
          z-index: 20;
          color: ${M_BONE};
          font-family: 'Barlow', 'Inter', sans-serif;
        }
        .manifesto-based-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.55;
          margin-bottom: 14px;
        }
        .manifesto-based-list {
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 13px;
          line-height: 1.75;
          opacity: 0.9;
        }
        @media (max-width: 1023px) {
          .manifesto-marquee-track { font-size: clamp(6rem, 12vw, 9rem); }
        }
        .hero-break-mobile { display: none; }
        @media (max-width: 767px) {
          .hero-break-mobile { display: inline; }
          .manifesto-marquee-track { font-size: clamp(2.75rem, 14vw, 5rem); letter-spacing: -0.015em; }
          .manifesto-hero-headline { font-size: clamp(3rem, 14vw, 5.5rem); letter-spacing: -0.025em; line-height: 0.92; }
          .manifesto-hero-eyebrow { font-size: 11px; letter-spacing: 0.18em; }
          .manifesto-based { display: none; }
          .manifesto-pattern-wrap { opacity: 0.7; }
        }
        @media (max-width: 479px) {
          .manifesto-marquee-track { font-size: clamp(2.25rem, 13vw, 4rem); }
        }
        @media (prefers-reduced-motion: reduce) {
          .manifesto-window { opacity: 1 !important; }
          .manifesto-window-border { display: none !important; }
          .manifesto-marquee, .manifesto-pattern-wrap { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
      <div
        className="section-overlay"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "#0A2E36",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 30,
        }}
      />
    </section>
  );
}
