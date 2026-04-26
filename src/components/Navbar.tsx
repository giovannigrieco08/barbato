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
  const [, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [tone, setTone] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    let raf = 0;
    const updateTone = () => {
      raf = 0;
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
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(updateTone);
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
    ["Studio", "#studio"],
    ["Dr. Barbato", "#dottore"],
    ["Contatti", "#contatti"],
  ];

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
          <nav className="liquid-glass rounded-full px-2 py-1.5 flex items-center whitespace-nowrap">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={(e) => onLinkClick(e, href)}
                className="relative group font-body font-medium hover:text-foreground transition-colors whitespace-nowrap"
                data-cursor="hover"
                style={{
                  color: fgDim,
                  padding: "8px 14px",
                  fontSize: "0.875rem",
                  letterSpacing: "0.005em",
                }}
              >
                {label}
                <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto lg:ml-0">
          <MagneticButton
            className="hidden sm:inline-flex items-center gap-2 liquid-glass-gold hero-cta-navbar rounded-full group"
            onClick={onOpenChat}
            style={{ color: fg }}
          >
            <span>Prenota visita</span>
            <Icon.ArrowUpRight size={16} className="hero-cta-arrow" />
          </MagneticButton>
          <button
            className="lg:hidden liquid-glass rounded-full w-11 h-11 flex items-center justify-center"
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
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.65, ease: [0.7, 0, 0.3, 1] }}
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
                className="rounded-full flex items-center justify-center"
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
              className="flex flex-col items-center px-6"
              style={{ paddingTop: "8vh" }}
            >
              <nav className="flex flex-col items-center" style={{ gap: "0.15rem" }}>
                {links.map(([l, h], i) => (
                  <motion.a
                    key={h}
                    href={h}
                    onClick={(e) => {
                      setMenu(false);
                      onLinkClick(e, h);
                    }}
                    className="font-heading menu-link"
                    data-cursor="hover"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.7, 0, 0.3, 1],
                      delay: 0.18 + i * 0.06,
                    }}
                    style={{
                      color: "#F4F1EA",
                      fontSize: "clamp(2.5rem, 12vw, 4.25rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.025em",
                      fontStyle: "normal",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {l}
                  </motion.a>
                ))}
              </nav>

              <motion.button
                onClick={() => {
                  setMenu(false);
                  onOpenChat?.();
                }}
                className="liquid-glass-gold rounded-full inline-flex items-center justify-center gap-2"
                data-cursor="hover"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1], delay: 0.46 }}
                style={{
                  color: "#F4F1EA",
                  padding: "12px 22px",
                  fontSize: "14px",
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 500,
                  border: "1px solid rgba(143,200,196,0.45)",
                  marginTop: "1.5rem",
                }}
              >
                <span>Prenota visita</span>
                <Icon.ArrowUpRight size={14} className="hero-cta-arrow" />
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
