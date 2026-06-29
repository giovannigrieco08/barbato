"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Item = {
  num: string;
  title: string;
  desc: string;
  // Foto reale quando disponibile; se assente, mostra il placeholder.
  photo?: { src: string; alt: string };
};

const items: Item[] = [
  {
    num: "I",
    title: "Implantologia",
    desc: "Impianti a carico immediato e chirurgia guidata 3D. Pianificazione digitale, risultato prevedibile.",
    photo: {
      src: "/images/studio/team-radiografia.jpg",
      alt: "Clinico che pianifica un impianto leggendo una radiografia 3D",
    },
  },
  {
    num: "II",
    title: "Ortodonzia invisibile",
    desc: "Allineatori trasparenti per adulti e adolescenti. Risultati visibili senza dover sorridere diversamente.",
    photo: {
      src: "/images/studio/ortodonzia-allineatore.jpg",
      alt: "Allineatore ortodontico trasparente tenuto tra le dita, primo piano",
    },
  },
  {
    num: "III",
    title: "Estetica del sorriso",
    desc: "Faccette in ceramica integrale, sbiancamento professionale, ricostruzioni minimamente invasive.",
    photo: {
      src: "/images/studio/estetica-faccette.jpg",
      alt: "Scala colore dentale accostata a un sorriso per la scelta della tonalità",
    },
  },
  {
    num: "IV",
    title: "Conservativa ed endodonzia",
    desc: "Al microscopio operatorio. Salvare un dente è sempre preferibile a sostituirlo.",
    photo: {
      src: "/images/studio/dente-sezione.jpg",
      alt: "Modello in sezione di un dente con radice e canali",
    },
  },
  {
    num: "V",
    title: "Igiene e prevenzione",
    desc: "Richiami ogni sei mesi, protocolli personalizzati. La manutenzione è dove si vince a lungo termine.",
    photo: {
      src: "/images/studio/igiene-paziente.jpg",
      alt: "Igienista al lavoro su un paziente in studio dentistico",
    },
  },
];

// Tinte placeholder: colore pieno brand (niente gradiente), una per slide.
const PH_TONES = [
  "#13525F",
  "#0F4754",
  "#1A3F49",
  "#114E59",
  "#0E4350",
];

export default function Treatments() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let st: any = null;
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

      const sticky = stickyRef.current;
      if (!sticky) return;
      const steps = Array.from(sticky.querySelectorAll<HTMLElement>(".trt-step"));
      const n = steps.length;
      if (n < 2) return;

      // 1. Il wrapper diventa la "finestra" alta 100vh che verrà pinnata.
      gsap.set(sticky, { position: "relative", overflow: "hidden", height: "100vh" });

      // 2. Ogni slide assoluta, impilata, z-index crescente, clip iniziale:
      //    la prima visibile, le altre ritagliate dall'alto (nascoste).
      steps.forEach((s, i) => {
        gsap.set(s, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: i + 1,
          overflow: "hidden",
          clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          willChange: "clip-path",
        });
      });

      // 3. Timeline: ogni slide successiva si rivela (inset 100% → 0%),
      //    lineare per un controllo 1:1 con lo scroll.
      tl = gsap.timeline();
      for (let t = 0; t < n - 1; t++) {
        tl.to(
          steps[t + 1],
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 },
          t
        );
      }

      // 4. ScrollTrigger: pinna il wrapper, durata (n-1)·100vh, scrub 1:1.
      st = ScrollTrigger.create({
        trigger: sticky,
        start: "top top",
        end: () => `+=${(n - 1) * window.innerHeight}`,
        pin: true,
        anticipatePin: 1,
        scrub: true,
        animation: tl,
        invalidateOnRefresh: true,
      });

      let resizeT: ReturnType<typeof setTimeout> | undefined;
      onResize = () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => ScrollTrigger.refresh(), 200);
      };
      window.addEventListener("resize", onResize);
      tRefresh = setTimeout(() => ScrollTrigger.refresh(), 250);
    })();

    return () => {
      cancelled = true;
      if (tRefresh) clearTimeout(tRefresh);
      if (onResize) window.removeEventListener("resize", onResize);
      if (st) st.kill();
      if (tl) tl.kill();
    };
  }, []);

  return (
    <section id="trattamenti" ref={sectionRef} className="trt-section">
      <div className="trt-intro" aria-hidden="true" />

      <div ref={stickyRef} className="trt-sticky">
        {items.map((it, i) => (
          <article className="trt-step" key={it.title} data-nav-tone="dark">
            <div
              className="trt-step-media"
              data-cursor="hover"
              style={{ background: PH_TONES[i % PH_TONES.length] }}
            >
              {it.photo ? (
                <Image
                  src={it.photo.src}
                  alt={it.photo.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <>
                  <div className="trt-ph-light" />
                  <span className="trt-ph-tag">Immagine · placeholder</span>
                </>
              )}
            </div>
            <div className={"trt-step-info" + (i % 2 ? " trt-step-info--alt" : "")}>
              <div className="trt-step-top">
                <span className="trt-step-index">
                  <strong>{String(i + 1).padStart(2, "0")}</strong>
                  <span className="trt-step-total"> / {String(items.length).padStart(2, "0")}</span>
                </span>
              </div>
              <div className="trt-step-body">
                <h3 className="trt-step-title font-heading">{it.title}</h3>
                <p className="trt-step-desc font-body">{it.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        /* Sfondo bone: respiro chiaro che chiude il "capitolo bianco" iniziato
           dalla hero, prima che entrino le slide scure. */
        .trt-section {
          position: relative;
          z-index: 3;
          background: #F4F1EA;
          color: #0A2E36;
        }
        .trt-intro { height: 18vh; }
        @media (max-width: 767px) { .trt-intro { height: 12vh; } }

        .trt-sticky { position: relative; width: 100%; }

        /* Default / fallback (reduced-motion, no-JS): slide in flusso normale,
           impilate verticalmente e già visibili. GSAP sovrascrive in assoluto. */
        .trt-step {
          position: relative;
          width: 100%;
          min-height: 100svh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .trt-step-media {
          position: relative;
          height: 100%;
          min-height: 100svh;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 2.5rem;
        }
        .trt-ph-light {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .trt-ph-tag {
          position: relative;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(244,241,234,0.5);
        }

        .trt-step-info {
          height: 100%;
          background: #0F4754;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 2rem;
          padding: clamp(2rem, 4vw, 4.5rem);
        }
        .trt-step-info--alt { background: #0A2E36; }
        /* Numero piccolo bold in alto; titolo+testo centrati verticalmente
           così il pannello non resta vuoto in mezzo. */
        .trt-step-body { margin-top: auto; margin-bottom: auto; }
        .trt-step-top {
          display: flex;
          justify-content: flex-end;
        }
        .trt-step-index {
          font-family: 'Barlow', sans-serif;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
          color: rgba(244,241,234,0.55);
          font-variant-numeric: tabular-nums;
        }
        .trt-step-index strong { font-weight: 700; color: rgba(244,241,234,0.95); }
        .trt-step-total { font-weight: 400; }
        .trt-step-title {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(2rem, 4vw, 3.5rem);
          line-height: 1.02;
          letter-spacing: -0.02em;
          margin: 0 0 1.25rem;
          color: #F4F1EA;
        }
        .trt-step-desc {
          font-size: clamp(1rem, 1.2vw, 1.125rem);
          line-height: 1.6;
          color: rgba(244,241,234,0.82);
          max-width: 46ch;
          margin: 0;
        }

        @media (max-width: 767px) {
          .trt-step {
            grid-template-columns: 1fr;
            grid-template-rows: 42svh 1fr;
          }
          .trt-step-media { min-height: 0; padding: 1.75rem; }
          .trt-step-info { padding: 2rem 1.5rem 2.5rem; gap: 1.5rem; }
        }
      `}</style>
    </section>
  );
}
