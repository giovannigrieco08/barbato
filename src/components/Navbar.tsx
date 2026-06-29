"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon, MagneticButton, EASE } from "@/components/ui";
import { studio, telHref, mailHref } from "@/config/studio";

declare global {
  interface Window {
    __lenis?: {
      scrollTo: (target: string, opts?: Record<string, unknown>) => void;
    };
  }
}

type Tone = "dark" | "light";

// Module scope so the effects can list it as an honest dependency without a
// fresh array identity each render (NAV-11).
const links: [string, string][] = [
  ["Trattamenti", "#trattamenti"],
  ["Smile Assistant", "#assistant"],
  ["Studio", "#studio"],
  ["Dr. Barbato", "#dottore"],
  ["Contatti", "#contatti"],
];

export default function Navbar({ onOpenChat }: { onOpenChat?: () => void }) {
  const [menu, setMenu] = useState(false);
  // Tono per regione: ogni elemento deve contrastare con ciò che ha SOTTO.
  const [tones, setTones] = useState<{ left: Tone; center: Tone; right: Tone }>({
    left: "dark",
    center: "dark",
    right: "dark",
  });
  const [active, setActive] = useState<string>("");
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  // Menu mobile aperto: blocca lo scroll del body, chiudi con Escape, e
  // implementa un focus trap (NAV-13): al primo apri sposta il focus sul
  // pulsante chiudi, intrappola Tab nel dialog, alla chiusura ripristina il
  // focus sul trigger del menu.
  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Sposta il focus dentro il dialog (dopo l'entrata, post-paint).
    const focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 0);

    const FOCUSABLE =
      'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      dialogRef.current
        ? (Array.from(
            dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
          ).filter((el) => el.offsetParent !== null))
        : [];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (activeEl === first || !dialogRef.current?.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const trigger = menuTriggerRef.current;
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      // Ripristina il focus sul trigger che ha aperto il menu.
      trigger?.focus();
    };
  }, [menu]);

  useEffect(() => {
    let raf = 0;
    let lastRun = -Infinity;

    const lumaOf = (r: number, g: number, b: number) =>
      0.2126 * r + 0.7152 * g + 0.0722 * b;
    const RGBA = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g;

    // NAV-10: getComputedStyle forces a sync style flush. The three sample
    // points share overlapping element stacks, so cache the resolved tone per
    // element for the duration of one tick (cleared at the top of updateTones).
    const toneCache = new Map<HTMLElement, Tone | null>();

    // Tono di un singolo elemento, in ordine di affidabilità:
    //   1. override esplicito `data-nav-tone` (per layer che il colore non
    //      può catturare: flip a opacità, video, immagini);
    //   2. background-color solido → luminanza;
    //   3. background-image gradiente → media dei color-stop opachi.
    // null = elemento "trasparente": si continua a risalire.
    const toneOfEl = (el: HTMLElement): Tone | null => {
      const cached = toneCache.get(el);
      if (cached !== undefined) return cached;
      const tone = computeToneOfEl(el);
      toneCache.set(el, tone);
      return tone;
    };
    const computeToneOfEl = (el: HTMLElement): Tone | null => {
      const decl = el.dataset?.navTone;
      if (decl === "light" || decl === "dark") return decl;
      const cs = getComputedStyle(el);
      const bc = cs.backgroundColor.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/
      );
      if (bc) {
        const a = bc[4] !== undefined ? parseFloat(bc[4]) : 1;
        if (a >= 0.5) return lumaOf(+bc[1], +bc[2], +bc[3]) > 165 ? "light" : "dark";
      }
      const bi = cs.backgroundImage;
      if (bi && bi !== "none" && bi.includes("gradient")) {
        const stops = [...bi.matchAll(RGBA)]
          .map((m) => ({
            r: +m[1],
            g: +m[2],
            b: +m[3],
            a: m[4] !== undefined ? parseFloat(m[4]) : 1,
          }))
          .filter((s) => s.a >= 0.5);
        if (stops.length) {
          const avg =
            stops.reduce((s, c) => s + lumaOf(c.r, c.g, c.b), 0) / stops.length;
          return avg > 165 ? "light" : "dark";
        }
      }
      return null;
    };
    // Stack completo di elementi al punto (topmost→bottom). Salta la barra
    // stessa (i suoi layer vetro sono trasparenti e porterebbero a leggere il
    // body scuro) e restituisce il tono del primo sfondo reale DIETRO la barra.
    // Default "dark" (= testo chiaro): contrasta su fondo scuro o ambiguo.
    const toneAt = (x: number, y: number, navEl: HTMLElement | null): Tone => {
      const stack = document.elementsFromPoint(x, y) as HTMLElement[];
      for (const el of stack) {
        if (navEl && navEl.contains(el)) continue;
        const t = toneOfEl(el);
        if (t) return t;
      }
      return "dark";
    };

    const updateTones = () => {
      toneCache.clear(); // new tick → styles may have changed; cache valid only within
      const w = window.innerWidth;
      const y = 42; // dentro la barra: lo stack salta la barra e legge dietro
      const navEl = headerRef.current;
      const next = {
        left: toneAt(Math.min(64, w * 0.05), y, navEl),
        center: toneAt(w / 2, y, navEl),
        right: toneAt(w - Math.min(110, w * 0.09), y, navEl),
      };
      setTones((prev) =>
        prev.left === next.left && prev.center === next.center && prev.right === next.right
          ? prev
          : next
      );
    };

    // Throttle a ~8 letture/sec: getComputedStyle + elementFromPoint forzano
    // un reflow sincrono, inutile farlo a 60fps. rAF resta come scheduler.
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame((t) => {
        raf = 0;
        if (t - lastRun < 120) return;
        lastRun = t;
        updateTones();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    setTimeout(updateTones, 100);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Sezione attiva via IntersectionObserver (non per-frame → economico).
  // Marca il link corrispondente alla sezione che attraversa la fascia
  // centrale del viewport, così la navbar si legge come vera navigazione.
  useEffect(() => {
    const els = links
      .map(([, href]) => document.getElementById(href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    // NAV-11: track the live ratio per section and pick the most-intersecting
    // one, rather than letting whichever entry fired last win the band.
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });
        let bestId = "";
        let best = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > best) {
            best = ratio;
            bestId = id;
          }
        });
        if (bestId) setActive(`#${bestId}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onLinkClick = (e: React.MouseEvent, href: string) => {
    // Transizione a doppia tenda (se montata): copre lo schermo, salta alla
    // sezione e rivela. Gestisce internamente scroll + focus.
    if (window.__sectionCurtains) {
      e.preventDefault();
      window.__sectionCurtains(href);
      return;
    }
    // Fallback (tende non ancora montate): scroll fluido come prima.
    const lenis = window.__lenis;
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(href, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    // NAV-12: move focus to the target section so assistive tech announces the
    // new location (scrollTo alone never shifts focus). preventScroll keeps
    // lenis in charge of the visual motion.
    const el = document.getElementById(href.slice(1));
    if (el) {
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }
  };

  const colorFor = (t: Tone) => (t === "light" ? "#0A2E36" : "#F4F1EA");
  // NAV-19: dim inactive links must still clear AA (4.5:1) over the lightest
  // region a tone can sit on. Raised alphas keep the active/dim hierarchy
  // (active = full opacity) while lifting 14px dim text above 4.5:1.
  const dimFor = (t: Tone) =>
    t === "light" ? "rgba(10,46,54,0.92)" : "rgba(244,241,234,0.92)";
  const fgLeft = colorFor(tones.left);
  const fgCenter = colorFor(tones.center);
  const fgCenterDim = dimFor(tones.center);
  const fgRight = colorFor(tones.right);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-4 left-0 right-0 z-50 px-6 lg:px-12 py-2.5 flex items-center gap-4 navbar-${tones.center}`}
        style={{ transition: "color 280ms ease-out" }}
      >
        <a
          href="#top"
          className="flex items-center gap-3 shrink-0"
          data-cursor="hover"
          style={{ color: fgLeft }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-ring.svg"
            alt="Studio Barbato"
            width="40"
            height="40"
            style={{
              width: 40,
              height: 40,
              objectFit: "contain",
              display: "block",
              filter: tones.left === "light" ? "invert(1) brightness(0.4)" : "none",
              transition: "filter 280ms ease-out",
            }}
          />
          <span
            className="hidden sm:block whitespace-nowrap navbar-wordmark"
            style={{
              fontFamily: "var(--font-funcity), serif",
              letterSpacing: "0.04em",
              color: fgLeft,
              transition: "color 280ms ease-out",
            }}
          >
            FABIO BARBATO
          </span>
        </a>

        <div className="hidden lg:flex flex-1 justify-center min-w-0">
          <nav className="glass-elevated rounded-full px-1.5 py-1.5 flex items-center whitespace-nowrap">
            {links.map(([label, href]) => {
              const isActive = active === href;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => onLinkClick(e, href)}
                  className="nav-link font-body font-medium whitespace-nowrap"
                  data-cursor="hover"
                  data-active={isActive ? "1" : undefined}
                  style={{
                    color: isActive ? fgCenter : fgCenterDim,
                    padding: "8px 16px",
                    fontSize: "0.875rem",
                    letterSpacing: "0.005em",
                    borderRadius: 999,
                    // NAV-15: ease the inline tone-flip color in step with the
                    // wordmark/logo (280ms) instead of snapping.
                    transition: "color 280ms ease-out",
                  }}
                >
                  <span className="nav-link-bg" aria-hidden="true" />
                  <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto lg:ml-0">
          <MagneticButton
            className="nav-cta-prenota hidden lg:inline-flex items-center gap-2 liquid-glass-gold hero-cta-navbar rounded-full group"
            onClick={onOpenChat}
            style={{ color: fgRight }}
          >
            <span>Prenota visita</span>
            <Icon.ArrowUpRight size={16} className="hero-cta-arrow" />
          </MagneticButton>
          <button
            ref={menuTriggerRef}
            className="lg:hidden liquid-glass rounded-full w-11 h-11 flex items-center justify-center transition-transform active:scale-95"
            onClick={() => setMenu(true)}
            aria-label="Menu"
            aria-expanded={menu}
            aria-haspopup="dialog"
            style={{ color: fgRight }}
          >
            <Icon.Menu />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            ref={dialogRef}
            className="fixed inset-0 z-[60] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.34, ease: [0.32, 0.72, 0, 1] } }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            style={{ background: "#0A2E36" }}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ paddingTop: "calc(env(safe-area-inset-top, 0) + 16px)" }}
            >
              <a
                href="#top"
                onClick={(e) => {
                  setMenu(false);
                  onLinkClick(e, "#top");
                }}
                className="flex items-center gap-3"
                data-cursor="hover"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-ring.svg"
                  alt=""
                  width="36"
                  height="36"
                  style={{
                    width: 36,
                    height: 36,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-funcity), serif",
                    fontSize: "14px",
                    letterSpacing: "0.04em",
                    color: "#F4F1EA",
                  }}
                >
                  FABIO BARBATO
                </span>
              </a>
              <button
                ref={closeBtnRef}
                onClick={() => setMenu(false)}
                className="rounded-full flex items-center justify-center transition-transform active:scale-95"
                aria-label="Chiudi menu"
                data-cursor="hover"
                style={{
                  width: 44,
                  height: 44,
                  background: "rgba(244,241,234,0.95)",
                  color: "#0A2E36",
                }}
              >
                <Icon.X />
              </button>
            </div>

            <div
              className="flex flex-col px-6"
              style={{ paddingTop: "5vh" }}
            >
              <motion.div
                className="menu-eyebrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                Naviga
              </motion.div>
              <nav className="w-full flex flex-col">
                {links.map(([l, h], i) => (
                  <motion.a
                    key={h}
                    href={h}
                    onClick={(e) => {
                      setMenu(false);
                      onLinkClick(e, h);
                    }}
                    className="menu-row font-heading"
                    data-cursor="hover"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    // NAV-16: enter/exit symmetry. Tighter forward stagger so
                    // the cascade lands near the container settle (~0.5–0.6s),
                    // and a short REVERSE stagger on exit (last row leaves
                    // first), faster than the entrance.
                    exit={{
                      opacity: 0,
                      y: -14,
                      transition: {
                        duration: 0.26,
                        ease: [0.16, 1, 0.3, 1],
                        delay: (links.length - 1 - i) * 0.03,
                      },
                    }}
                    transition={{
                      duration: 0.42,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.08 + i * 0.035,
                    }}
                  >
                    <span>{l}</span>
                    <Icon.ArrowUpRight size={22} className="menu-row-arrow" />
                  </motion.a>
                ))}
              </nav>

              <motion.button
                onClick={() => {
                  setMenu(false);
                  onOpenChat?.();
                }}
                className="glass-accent rounded-full flex w-full items-center justify-center gap-2"
                data-cursor="hover"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.46 }}
                style={{
                  color: "#F4F1EA",
                  padding: "16px 22px",
                  fontSize: "15px",
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 500,
                  marginTop: "2rem",
                }}
              >
                <span>Prenota visita</span>
                <Icon.ArrowUpRight size={16} className="hero-cta-arrow" />
              </motion.button>
            </div>

            <div style={{ flex: 1 }} />

            <motion.div
              className="flex items-center justify-between px-8 pt-4 pb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
            >
              <a
                href={telHref}
                onClick={() => setMenu(false)}
                className="font-body"
                data-cursor="hover"
                style={{
                  color: "#F4F1EA",
                  fontSize: "14px",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                Chiama
              </a>
              <a
                href={mailHref}
                onClick={() => setMenu(false)}
                className="font-body"
                data-cursor="hover"
                style={{
                  color: "#F4F1EA",
                  fontSize: "14px",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                Email
              </a>
            </motion.div>

            <motion.div
              className="flex items-center justify-center"
              style={{
                paddingTop: "1rem",
                paddingBottom: "calc(env(safe-area-inset-bottom, 0) + 32px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
            >
              <a
                href={studio.instagram.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full flex items-center justify-center"
                data-cursor="hover"
                style={{
                  width: 48,
                  height: 48,
                  background: "rgba(244,241,234,0.08)",
                  border: "1px solid rgba(244,241,234,0.15)",
                  color: "#F4F1EA",
                }}
              >
                <Icon.Instagram />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
