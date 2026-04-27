"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, EASE } from "@/components/ui";

const DR_BARBATO_HEADLINE_LEFT = "Ogni sorriso";
const DR_BARBATO_HEADLINE_RIGHT =
  "racconta una storia. Il nostro lavoro è ascoltarla prima ancora di curarla, e tradurla in qualcosa che senti davvero tuo.";

const DR_BARBATO_FAQS: [string, string][] = [
  [
    "Quanto dura un trattamento di implantologia?",
    "In media dalla prima visita alla protesi definitiva passano tra i 3 e i 5 mesi. Nei casi a carico immediato, una provvisoria viene posizionata entro 24 ore dall’intervento.",
  ],
  [
    "Gli impianti sono dolorosi?",
    "L’intervento viene eseguito in anestesia locale e non è doloroso. Nei giorni successivi un fastidio simile a quello di un’estrazione, gestibile con un comune antinfiammatorio.",
  ],
  [
    "Avete convenzioni con fondi sanitari?",
    "Siamo convenzionati con i principali fondi sanitari integrativi italiani: UniSalute, Previmedica, Fasi, Faschim, Generali Welion e altri.",
  ],
  [
    "La prima visita è gratuita?",
    "Sì, la prima visita di valutazione è gratuita e include una TAC cone beam se necessaria. Dura circa un’ora. Al termine consegniamo un piano di trattamento scritto.",
  ],
  [
    "Ortodonzia invisibile o tradizionale?",
    "Gli allineatori trasparenti funzionano in circa l’80% dei casi che vediamo. Nei casi più complessi, l’ortodonzia tradizionale resta più prevedibile.",
  ],
  [
    "Quanto durano i risultati di uno sbiancamento?",
    "Un ciclo professionale dura in media 12–24 mesi, a seconda delle abitudini alimentari e dell’igiene domiciliare.",
  ],
];

function splitWords(text: string): ReactNode[] {
  const tokens = text.split(/(\s+)/);
  let wIdx = 0;
  return tokens.map((t, i) => {
    if (/^\s+$/.test(t)) return <span key={i}>{t}</span>;
    const idx = wIdx++;
    return (
      <span
        key={i}
        className="reveal-word"
        style={
          {
            "--word-index": idx,
            display: "inline-block",
            willChange: "opacity",
          } as React.CSSProperties
        }
      >
        {t}
      </span>
    );
  });
}

function DrBarbatoFAQItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: "1px solid rgba(244,241,234,0.18)" }}>
      <button
        onClick={onToggle}
        data-cursor="hover"
        className="w-full flex items-center justify-between gap-6 text-left"
        style={{
          padding: "20px 0",
          background: "transparent",
          border: "none",
          color: "#F4F1EA",
        }}
      >
        <span
          className="font-heading"
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.25,
            letterSpacing: "-0.012em",
            fontStyle: "italic",
          }}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ color: "#F4F1EA", flexShrink: 0 }}
        >
          <Icon.Plus size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="font-body"
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                color: "rgba(244,241,234,0.75)",
                paddingBottom: "20px",
                paddingRight: "2rem",
                margin: 0,
                maxWidth: "52ch",
              }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DrBarbato({ onOpenChat }: { onOpenChat?: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const faqPanelRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLHeadingElement>(null);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023px)").matches
  );
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
  );
  const [openFaq, setOpenFaq] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 1023px)");
    const mqPhone = window.matchMedia("(max-width: 767px)");
    const onChange = () => {
      setIsMobile(mqMobile.matches);
      setIsPhone(mqPhone.matches);
    };
    onChange();
    mqMobile.addEventListener("change", onChange);
    mqPhone.addEventListener("change", onChange);
    return () => {
      mqMobile.removeEventListener("change", onChange);
      mqPhone.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setReady(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const triggers: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl: any = null;
    let onResize: (() => void) | null = null;

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
      const photo = photoRef.current;
      const headline = headlineRef.current;
      const faqPanel = faqPanelRef.current;
      const displayPanel = displayRef.current;
      if (!section) return;

      const wordEls = headline ? headline.querySelectorAll(".reveal-word") : [];
      const N = wordEls.length;
      if (headline && N > 0) headline.style.setProperty("--N", String(N));
      const setWordProgress = (progress: number) => {
        if (headline) headline.style.setProperty("--p", String(progress));
      };

      const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches;
      const pinDistance = isTablet ? "+=200%" : "+=240%";

      const stage1 = { x: "31vw", y: "17vh", scale: 0.36 };
      const stage2 = { x: "0vw", y: "0vh", scale: 1 };

      if (photo) gsap.set(photo, { ...stage1, transformOrigin: "0 0" });
      if (faqPanel) gsap.set(faqPanel, { opacity: 0, y: 24, pointerEvents: "none" });
      if (displayPanel) gsap.set(displayPanel, { opacity: 0, y: 24 });
      gsap.set(section, { backgroundColor: "#F4F1EA" });

      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: pinDistance,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        })
      );

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: pinDistance,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const wordProxy = { p: 0 };
      if (N > 0) {
        tl.to(
          wordProxy,
          {
            p: 1,
            ease: "none",
            duration: 0.42,
            onUpdate: () => setWordProgress(wordProxy.p),
          },
          0
        );
      }
      if (photo) {
        tl.to(photo, { ...stage2, ease: "power2.inOut", duration: 0.45 }, 0.42);
      }
      tl.to(section, { backgroundColor: "#0A2E36", ease: "none", duration: 0.1 }, 0.48);
      if (headline) {
        tl.to(headline, { opacity: 0, ease: "none", duration: 0.1 }, 0.45);
      }
      if (faqPanel) {
        tl.to(
          faqPanel,
          {
            opacity: 1,
            y: 0,
            ease: "power1.out",
            duration: 0.2,
            onStart: () => {
              faqPanel.style.pointerEvents = "auto";
            },
            onReverseComplete: () => {
              faqPanel.style.pointerEvents = "none";
            },
          },
          0.6
        );
      }
      if (displayPanel) {
        tl.to(
          displayPanel,
          { opacity: 1, y: 0, ease: "power1.out", duration: 0.22 },
          0.62
        );
      }

      onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (onResize) window.removeEventListener("resize", onResize);
      triggers.forEach((t) => t && t.kill && t.kill());
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, [isMobile]);

  if (isPhone) return null;

  const PHOTO_SRC = "/images/dr-fabio-barbato-portrait.jpg";
  const PHOTO_FILTER = "none";

  return (
    <section
      id="dottore"
      ref={sectionRef}
      className="dr-barbato-section relative w-screen overflow-hidden"
      style={{
        zIndex: 6,
        height: isMobile ? "auto" : "100vh",
        minHeight: isMobile ? "auto" : "100vh",
        visibility: ready ? "visible" : "hidden",
      }}
    >
      <div className="hidden lg:block relative w-full" style={{ height: "100vh" }}>
        <div
          ref={photoRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50vw",
            height: "100vh",
            transformOrigin: "0 0",
            overflow: "hidden",
            zIndex: 5,
            willChange: "transform",
          }}
        >
          <Image
            src={PHOTO_SRC}
            alt="Dr. Fabio Barbato"
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            priority
            style={{
              objectFit: "cover",
              objectPosition: "center 30%",
              display: "block",
              filter: PHOTO_FILTER,
            }}
          />
        </div>

        <div
          ref={headlineRef}
          className="absolute"
          style={{ inset: 0, pointerEvents: "none", zIndex: 10 }}
        >
          <h2
            className="font-heading"
            style={{
              position: "absolute",
              left: "4vw",
              bottom: "8vh",
              fontSize: "clamp(3rem, 6.5vw, 6.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              margin: 0,
              color: "#0A2E36",
              whiteSpace: "nowrap",
            }}
          >
            {DR_BARBATO_HEADLINE_LEFT}
          </h2>
          <p
            className="font-heading"
            style={{
              position: "absolute",
              left: "50vw",
              right: "4vw",
              bottom: "8vh",
              fontSize: "clamp(2.25rem, 4.4vw, 4.25rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.018em",
              margin: 0,
              color: "#0A2E36",
            }}
          >
            {splitWords(DR_BARBATO_HEADLINE_RIGHT)}
          </p>
        </div>

        <div
          ref={faqPanelRef}
          className="absolute"
          style={{
            top: "8vh",
            right: "4vw",
            width: "44vw",
            maxWidth: "600px",
            zIndex: 10,
          }}
        >
          <div style={{ borderTop: "1px solid rgba(244,241,234,0.18)" }}>
            {DR_BARBATO_FAQS.map(([q, a], i) => (
              <DrBarbatoFAQItem
                key={i}
                q={q}
                a={a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>

        <h3
          ref={displayRef}
          className="font-heading absolute pointer-events-none"
          style={{
            left: 0,
            right: 0,
            bottom: "5vh",
            margin: 0,
            fontSize: "clamp(5rem, 11vw, 11rem)",
            fontStyle: "italic",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            color: "#F4F1EA",
            textAlign: "center",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          Domande comuni
        </h3>
      </div>

      {/* Tablet (768-1023): full-screen photo + CTA chat — same as phone fallback shape */}
      <div
        className="dr-barbato-mobile md:hidden lg:hidden"
        style={{
          position: "relative",
          width: "100vw",
          height: "100svh",
          background: "#0A2E36",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/dr-fabio-barbato-portrait.jpg"
          alt="Dr. Fabio Barbato"
          fill
          sizes="100vw"
          priority
          style={{
            objectFit: "cover",
            objectPosition: "center 28%",
            display: "block",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "40%",
            background: "linear-gradient(to top, rgba(10,46,54,0.85), rgba(10,46,54,0))",
            pointerEvents: "none",
          }}
        />
        <button
          type="button"
          onClick={onOpenChat}
          className="liquid-glass-gold"
          data-cursor="hover"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "8svh",
            transform: "translateX(-50%)",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 26px",
            borderRadius: "999px",
            color: "#F4F1EA",
            fontFamily: "'Barlow', sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            letterSpacing: "0.01em",
            border: "1px solid rgba(143,200,196,0.35)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <span>Domande comuni</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
