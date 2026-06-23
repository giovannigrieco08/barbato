"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Icon, MagneticButton, EASE } from "@/components/ui";

declare global {
  interface Window {
    __lenis?: {
      scrollTo: (target: string, opts?: { duration?: number; easing?: (t: number) => number }) => void;
    };
  }
}

export default function Navbar({ onOpenChat }: { onOpenChat?: () => void }) {
  const [menu, setMenu] = useState(false);
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const [active, setActive] = useState<string>("");

  // Menu mobile aperto: blocca lo scroll del body e chiudi con Escape.
  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  useEffect(() => {
    let raf = 0;
    let lastRun = -Infinity;
    const updateTone = () => {
      const navProbeY = 56;
      const x = Math.max(2, window.innerWidth / 2);
      const el = document.elementFromPoint(x, navProbeY + 60);
      if (!el) return;
      let sec: HTMLElement | null = el as HTMLElement;
      while (sec && sec !== document.body && sec.tagName !== "SECTION")
        sec = sec.parentElement;
      const target = sec && sec.tagName === "SECTION" ? sec : (el as HTMLElement);
      const cs = getComputedStyle(target);
      const m = cs.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return;
      const r = +m[1], g = +m[2], b = +m[3];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      setTone(luma > 160 ? "light" : "dark");
    };
    // Throttle a ~8 letture/sec: getComputedStyle + elementFromPoint forzano
    // un reflow sincrono, inutile farlo a 60fps. rAF resta come scheduler.
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame((t) => {
        raf = 0;
        if (t - lastRun < 120) return;
        lastRun = t;
        updateTone();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    setTimeout(updateTone, 100);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const links: [string, string][] = [
    ["Trattamenti", "#trattamenti"],
    ["Smile Assistant", "#assistant"],
    ["Studio", "#studio"],
    ["Dr. Barbato", "#dottore"],
    ["Contatti", "#contatti"],
  ];

  // Sezione attiva via IntersectionObserver (non per-frame → economico).
  // Marca il link corrispondente alla sezione che attraversa la fascia
  // centrale del viewport, così la navbar si legge come vera navigazione.
  useEffect(() => {
    const els = links
      .map(([, href]) => document.getElementById(href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLinkClick = (e: React.MouseEvent, href: string) => {
    const lenis = window.__lenis;
    if (!lenis) return;
    e.preventDefault();
    lenis.scrollTo(href, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  };

  const isLight = tone === "light";
  const fg = isLight ? "#0A2E36" : "#F4F1EA";
  const fgDim = isLight ? "rgba(10,46,54,0.82)" : "rgba(244,241,234,0.85)";

  return (
    <>
      <header
        className={`fixed top-4 left-0 right-0 z-50 px-6 lg:px-12 py-2.5 flex items-center gap-4 navbar-${tone}`}
        style={{ transition: "color 280ms ease-out" }}
      >
        <a
          href="#top"
          className="flex items-center gap-3 shrink-0"
          data-cursor="hover"
          style={{ color: fg }}
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
              filter: isLight ? "invert(1) brightness(0.4)" : "none",
              transition: "filter 280ms ease-out",
            }}
          />
          <span
            className="hidden sm:block whitespace-nowrap navbar-wordmark"
            style={{
              fontFamily: "var(--font-funcity), serif",
              letterSpacing: "0.04em",
              color: fg,
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
                    color: isActive ? fg : fgDim,
                    padding: "8px 16px",
                    fontSize: "0.875rem",
                    letterSpacing: "0.005em",
                    borderRadius: 999,
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
            style={{ color: fg }}
          >
            <span>Prenota visita</span>
            <Icon.ArrowUpRight size={16} className="hero-cta-arrow" />
          </MagneticButton>
          <button
            className="lg:hidden liquid-glass rounded-full w-11 h-11 flex items-center justify-center transition-transform active:scale-95"
            onClick={() => setMenu(true)}
            aria-label="Menu"
            style={{ color: fg }}
          >
            <Icon.Menu />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
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
                    exit={{ opacity: 0, y: -14 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.16 + i * 0.05,
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
                href="tel:+390884000000"
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
                href="mailto:studio@barbato.dental"
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
                href="https://instagram.com/studio.barbato"
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
