"use client";

import { useEffect, useRef, useState } from "react";
import { EditorialPlaceholder } from "@/components/ui";

const G_INK = "#0A2E36";
const G_BONE = "#F4F1EA";
const G_MINT = "#8FC8C4";

function GalleryPattern({ tone = "ink" }: { tone?: "ink" | "bone" }) {
  const stroke = tone === "ink" ? G_BONE : G_INK;
  return (
    <svg
      className="gs-pattern"
      viewBox="0 0 3200 1200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke={stroke} strokeOpacity="0.05" strokeWidth="1">
        <path d="M -200 220 Q 400 120, 800 220 T 1600 220 T 2400 220 T 3200 220" />
        <path d="M -200 380 Q 460 280, 880 360 T 1640 380 T 2400 360 T 3200 380" />
        <path d="M -200 540 Q 520 460, 960 540 T 1720 540 T 2480 540 T 3240 540" />
        <path d="M -200 720 Q 380 620, 760 720 T 1520 720 T 2280 700 T 3040 720" />
        <path d="M -200 900 Q 460 820, 860 900 T 1620 900 T 2380 900 T 3140 900" />
        <path d="M -200 1080 Q 420 980, 800 1060 T 1560 1080 T 2320 1060 T 3080 1080" />
      </g>
    </svg>
  );
}

type ImgItem = {
  kind: "img";
  id: string;
  caption: string;
  tone: "teal" | "deep" | "warm";
  w: number;
  h: number;
  yVh: number;
  vy: number;
};
type QuoteItem = {
  kind: "quote";
  id: string;
  text: (string | { i: string })[];
  widthPx: number;
  yVh: number;
};
type TrackItem = ImgItem | QuoteItem;

const TRACK: TrackItem[] = [
  { kind: "img", id: "g1", caption: "RECEPTION · 2024", tone: "teal", w: 280, h: 360, yVh: -22, vy: -3 },
  { kind: "img", id: "g2", caption: "SALA OPERATIVA · 2024", tone: "deep", w: 520, h: 660, yVh: 8, vy: -6 },
  { kind: "img", id: "g3", caption: "STUDIO TECNICO · 2024", tone: "warm", w: 320, h: 420, yVh: -14, vy: 3 },
  {
    kind: "quote",
    id: "q1",
    text: [
      "Ogni paziente porta una storia.",
      "Il nostro lavoro è ",
      { i: "ascoltarla" },
      " prima ancora di ",
      { i: "curarla" },
      ".",
    ],
    widthPx: 380,
    yVh: -8,
  },
  { kind: "img", id: "g4", caption: "AREA STERILIZZAZIONE · 2024", tone: "deep", w: 260, h: 340, yVh: 20, vy: -3 },
  { kind: "img", id: "g5", caption: "TECNOLOGIA · 2024", tone: "teal", w: 580, h: 720, yVh: -4, vy: -5 },
  { kind: "img", id: "g6", caption: "DETTAGLIO · 2024", tone: "warm", w: 320, h: 420, yVh: 18, vy: 2 },
  {
    kind: "quote",
    id: "q2",
    text: [
      "La precisione non è un dettaglio.",
      "È il modo in cui trattiamo le ",
      { i: "persone" },
      ".",
    ],
    widthPx: 360,
    yVh: -16,
  },
  { kind: "img", id: "g7", caption: "INGRESSO · 2024", tone: "teal", w: 300, h: 380, yVh: -20, vy: -2 },
  { kind: "img", id: "g8", caption: "POLTRONA · 2024", tone: "deep", w: 460, h: 580, yVh: 6, vy: 3 },
];

const ITEM_GAP = 64;
const PIN_DURATION_VH = 380;
const BG_FLIP_AT = 0.55;

// ————— MOBILE component (separate to avoid sharing GSAP-pinned section) —————
function GalleriaStudioMobile() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgBoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bone = bgBoneRef.current;
    if (!section || !bone) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      let p = traveled / total;
      if (p < 0) p = 0;
      else if (p > 1) p = 1;
      let op = (p - 0.45) / 0.3;
      if (op < 0) op = 0;
      else if (op > 1) op = 1;
      bone.style.opacity = String(op);
      const past = op >= 0.5;
      if (past && !section.classList.contains("gs-tone-bone")) {
        section.classList.add("gs-tone-bone");
      } else if (!past && section.classList.contains("gs-tone-bone")) {
        section.classList.remove("gs-tone-bone");
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="gs-section gs-section-mobile"
      style={{ background: G_INK, color: G_BONE, position: "relative", overflow: "hidden", padding: "10vh 0 8vh" }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none", zIndex: 0 }}>
        <GalleryPattern tone="ink" />
      </div>
      <div
        ref={bgBoneRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "none", zIndex: 1, background: G_BONE }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
          <GalleryPattern tone="bone" />
        </div>
      </div>

      <header className="px-6" style={{ position: "relative", zIndex: 2, marginBottom: "6vh" }}>
        <div className="gs-mobile-eyebrow" style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1rem" }}>
          L’AMBIENTE
        </div>
        <h2 className="gs-mobile-title font-heading" style={{ fontSize: "clamp(2rem, 8vw, 3rem)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}>
          Uno spazio pensato per il <em>tempo</em> che dedichi a te.
        </h2>
      </header>

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "6vh" }}>
        {TRACK.map((it, i) => {
          const align = i % 2 === 0 ? "flex-start" : "flex-end";
          if (it.kind === "img") {
            const widthVw = it.w > 400 ? 64 : 50;
            return (
              <figure
                key={it.id}
                style={{
                  width: `${widthVw}vw`,
                  alignSelf: align,
                  margin: 0,
                  padding: align === "flex-end" ? "0 5vw 0 0" : "0 0 0 5vw",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    aspectRatio: `${it.w} / ${it.h}`,
                    overflow: "hidden",
                    borderRadius: "4px",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
                  }}
                >
                  <div style={{ width: "100%", height: "100%", filter: "saturate(0.85) contrast(1.05)" }}>
                    <EditorialPlaceholder label={it.caption.split(" · ")[0]} tone={it.tone} />
                  </div>
                </div>
              </figure>
            );
          }
          return (
            <blockquote
              key={it.id}
              className="gs-mobile-quote"
              style={{
                width: "82vw",
                alignSelf: "center",
                margin: 0,
                padding: "4vh 0",
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(1.4rem, 5vw, 1.85rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
              }}
            >
              <p style={{ margin: 0 }}>
                {it.text.map((seg, idx) =>
                  typeof seg === "string" ? (
                    <span key={idx}>
                      {seg}
                      {idx < it.text.length - 1 ? " " : ""}
                    </span>
                  ) : (
                    <em key={idx}>
                      {seg.i}
                      {idx < it.text.length - 1 ? " " : ""}
                    </em>
                  )
                )}
              </p>
              <footer
                className="gs-mobile-quote-cite"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "0.8rem",
                  marginTop: "0.85rem",
                }}
              >
                — Dr. Fabio Barbato
              </footer>
            </blockquote>
          );
        })}
      </div>

      <style>{`
        .gs-section-mobile {
          --gs-fg: ${G_BONE};
          --gs-fg-soft: rgba(244,241,234,0.6);
          --gs-rule: rgba(244,241,234,0.18);
        }
        .gs-section-mobile.gs-tone-bone {
          --gs-fg: ${G_INK};
          --gs-fg-soft: rgba(10,46,54,0.6);
          --gs-rule: rgba(10,46,54,0.18);
        }
        .gs-section-mobile .gs-mobile-eyebrow { color: var(--gs-fg-soft); transition: color 250ms ease-out; }
        .gs-section-mobile .gs-mobile-title { color: var(--gs-fg); transition: color 250ms ease-out; }
        .gs-section-mobile .gs-mobile-quote {
          color: var(--gs-fg);
          border-top: 1px solid var(--gs-rule);
          border-bottom: 1px solid var(--gs-rule);
          transition: color 250ms ease-out, border-color 250ms ease-out;
        }
        .gs-section-mobile .gs-mobile-quote-cite { color: var(--gs-fg-soft); transition: color 250ms ease-out; }
      `}</style>
    </section>
  );
}

// ————— DESKTOP component with horizontal pin —————
export default function GalleriaStudio() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const bgBoneRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLElement[]>([]);
  itemRefs.current = [];

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023px)").matches
  );

  const registerItem = (el: HTMLElement | null) => {
    if (el && !itemRefs.current.includes(el)) itemRefs.current.push(el);
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const upd = () => setIsMobile(mq.matches);
    upd();
    mq.addEventListener?.("change", upd);
    return () => mq.removeEventListener?.("change", upd);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const track = trackRef.current;
      const bgBone = bgBoneRef.current;
      if (track) track.style.transform = "translate3d(0,0,0)";
      if (bgBone) bgBone.style.opacity = "1";
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl: any = null;
    let onResize: (() => void) | null = null;
    let tRefresh: ReturnType<typeof setTimeout> | null = null;

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
      const track = trackRef.current;
      const header = headerRef.current;
      const bgBone = bgBoneRef.current;
      if (!section || !sticky || !track) return;

      const measureScroll = () => {
        const trackW = track.scrollWidth;
        const vw = window.innerWidth;
        return Math.max(0, trackW - vw);
      };

      track.style.willChange = "transform";

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${PIN_DURATION_VH}%`,
          scrub: true,
          pin: sticky,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            track.style.willChange = "auto";
          },
          onLeaveBack: () => {
            track.style.willChange = "auto";
          },
          onEnter: () => {
            track.style.willChange = "transform";
          },
          onEnterBack: () => {
            track.style.willChange = "transform";
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onUpdate: (self: any) => {
            const past = self.progress >= BG_FLIP_AT;
            if (past && !section.classList.contains("gs-tone-bone")) {
              section.classList.add("gs-tone-bone");
            } else if (!past && section.classList.contains("gs-tone-bone")) {
              section.classList.remove("gs-tone-bone");
            }
          },
        },
      });

      tl.fromTo(
        track,
        { x: 0 },
        { x: () => -measureScroll(), ease: "none", duration: 1 },
        0
      );

      if (header) {
        tl.to(header, { opacity: 0, x: -80, ease: "power1.in", duration: 0.14 }, 0.04);
      }
      if (bgBone) {
        tl.fromTo(
          bgBone,
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 0.2 },
          BG_FLIP_AT - 0.1
        );
      }

      itemRefs.current.forEach((el) => {
        const dy = parseFloat(el.dataset.vy || "0");
        if (!dy) return;
        el.style.willChange = "transform";
        const inner = el.querySelector(".gs-item-inner") as HTMLElement | null;
        if (!inner) return;
        tl.fromTo(
          inner,
          { yPercent: -dy },
          { yPercent: dy, ease: "none", duration: 1 },
          0
        );
      });

      onResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);
      tRefresh = setTimeout(() => ScrollTrigger.refresh(), 250);
    })();

    return () => {
      cancelled = true;
      if (tRefresh) clearTimeout(tRefresh);
      if (onResize) window.removeEventListener("resize", onResize);
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, [isMobile]);

  if (isMobile) {
    return <GalleriaStudioMobile />;
  }

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="gs-section"
      data-screen-label="04 Galleria Studio"
    >
      <div ref={stickyRef} className="gs-sticky">
        <div className="gs-bg gs-bg-ink" aria-hidden="true">
          <div className="gs-pattern-wrap">
            <GalleryPattern tone="ink" />
          </div>
        </div>
        <div ref={bgBoneRef} className="gs-bg gs-bg-bone" aria-hidden="true">
          <div className="gs-pattern-wrap">
            <GalleryPattern tone="bone" />
          </div>
        </div>

        <header ref={headerRef} className="gs-header">
          <div className="gs-eyebrow">L’ambiente</div>
          <h2 className="gs-title font-heading">
            Uno spazio pensato per il <em>tempo</em> che dedichi a te.
          </h2>
        </header>

        <div ref={trackRef} className="gs-track">
          <div className="gs-track-leadin" aria-hidden="true" />
          {TRACK.map((it) => {
            if (it.kind === "img") {
              return (
                <figure
                  key={it.id}
                  ref={registerItem}
                  className="gs-item gs-item-img"
                  data-vy={it.vy}
                  style={{
                    width: `${it.w}px`,
                    height: `${it.h}px`,
                    transform: `translateY(${it.yVh}vh)`,
                  }}
                >
                  <figcaption className="gs-img-caption">{it.caption}</figcaption>
                  <div className="gs-item-inner">
                    <EditorialPlaceholder label={it.caption.split(" · ")[0]} tone={it.tone} />
                  </div>
                </figure>
              );
            }
            return (
              <blockquote
                key={it.id}
                ref={registerItem}
                className="gs-item gs-item-quote"
                data-vy={0}
                style={{
                  width: `${it.widthPx}px`,
                  transform: `translateY(${it.yVh}vh)`,
                }}
              >
                <div className="gs-item-inner">
                  <p className="gs-quote-body font-heading">
                    {it.text.map((seg, i) =>
                      typeof seg === "string" ? (
                        <span key={i}>
                          {seg}
                          {i < it.text.length - 1 ? " " : ""}
                        </span>
                      ) : (
                        <em key={i}>
                          {seg.i}
                          {i < it.text.length - 1 ? " " : ""}
                        </em>
                      )
                    )}
                  </p>
                  <footer className="gs-quote-sig font-heading">— Dr. Fabio Barbato</footer>
                </div>
              </blockquote>
            );
          })}
          <div className="gs-track-tail" aria-hidden="true" />
        </div>
      </div>

      <style>{`
        .gs-section {
          position: relative;
          width: 100%;
          color: ${G_BONE};
          --gs-fg: ${G_BONE};
          --gs-fg-soft: rgba(244, 241, 234, 0.6);
        }
        .gs-section.gs-tone-bone {
          color: ${G_INK};
          --gs-fg: ${G_INK};
          --gs-fg-soft: rgba(10, 46, 54, 0.6);
        }
        .gs-sticky {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          overflow: hidden;
        }
        .gs-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        .gs-bg-ink  { background: ${G_INK}; z-index: 0; }
        .gs-bg-bone { background: ${G_BONE}; z-index: 1; opacity: 0; }
        .gs-pattern-wrap {
          position: absolute;
          inset: 0;
          width: 110%;
          height: 100%;
        }
        .gs-pattern { width: 100%; height: 100%; display: block; }
        .gs-header {
          position: absolute;
          left: 6vw;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          max-width: 320px;
          will-change: transform, opacity;
          pointer-events: none;
        }
        .gs-eyebrow {
          font-family: 'Barlow', 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${G_MINT};
          margin-bottom: 20px;
        }
        .gs-title {
          margin: 0;
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 3.8vw, 3.5rem);
          line-height: 1.04;
          letter-spacing: -0.022em;
          color: var(--gs-fg);
          font-weight: 400;
        }
        .gs-title em { font-style: italic; }
        .gs-track {
          position: absolute;
          top: 10vh;
          left: 0;
          z-index: 3;
          height: 80vh;
          display: flex;
          align-items: center;
          gap: ${ITEM_GAP}px;
          padding: 0;
          will-change: transform;
        }
        .gs-track-leadin { flex: 0 0 auto; width: 32vw; height: 1px; }
        .gs-track-tail { flex: 0 0 auto; width: 25vw; height: 1px; }
        .gs-item { position: relative; flex: 0 0 auto; margin: 0; }
        .gs-item-inner { width: 100%; height: 100%; position: relative; }
        .gs-item-img {
          border-radius: 4px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          background: ${G_INK};
          transition: box-shadow 600ms ease-out;
          cursor: pointer;
        }
        .gs-item-img:hover { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35); }
        .gs-item-img .gs-item-inner {
          height: 110%;
          margin-top: -5%;
          filter: saturate(0.85) contrast(1.05);
        }
        .gs-img-caption {
          position: absolute;
          top: -28px;
          left: 0;
          font-family: 'Barlow', 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gs-fg-soft);
          z-index: 2;
          white-space: nowrap;
        }
        .gs-item-quote { padding: 0 16px; align-self: center; }
        .gs-quote-body {
          margin: 0;
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.75rem, 2.4vw, 2.5rem);
          line-height: 1.28;
          letter-spacing: -0.012em;
          font-weight: 400;
          color: var(--gs-fg);
        }
        .gs-quote-body em { font-style: italic; }
        .gs-quote-sig {
          margin-top: 20px;
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 14px;
          letter-spacing: -0.005em;
          color: ${G_MINT};
        }
        @media (max-width: 1023px) {
          .gs-track-leadin { width: 40vw; }
          .gs-quote-body { font-size: clamp(1.5rem, 2.6vw, 2rem); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gs-sticky { overflow-x: auto; }
          .gs-track { position: relative; transform: none; }
          .gs-bg-bone { opacity: 1 !important; }
        }
      `}</style>
    </section>
  );
}
