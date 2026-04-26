"use client";

import { useEffect, useState } from "react";
import { EditorialPlaceholder } from "@/components/ui";
import { RevealLines, RevealParagraph } from "@/components/reveals";
import CardSwap, { CSCard } from "@/components/CardSwap";

const items: [string, string, string, string][] = [
  [
    "I",
    "Implantologia",
    "Impianti a carico immediato e chirurgia guidata 3D. Pianificazione digitale, risultato prevedibile.",
    "implant",
  ],
  [
    "II",
    "Ortodonzia invisibile",
    "Allineatori trasparenti per adulti e adolescenti. Risultati visibili senza dover sorridere diversamente.",
    "ortho",
  ],
  [
    "III",
    "Estetica del sorriso",
    "Faccette in ceramica integrale, sbiancamento professionale, ricostruzioni minimamente invasive.",
    "esthetic",
  ],
  [
    "IV",
    "Conservativa ed endodonzia",
    "Al microscopio operatorio. Salvare un dente è sempre preferibile a sostituirlo.",
    "endo",
  ],
  [
    "V",
    "Igiene e prevenzione",
    "Richiami ogni sei mesi, protocolli personalizzati. La manutenzione è dove si vince a lungo termine.",
    "hygiene",
  ],
];

function TreatmentCardBody({
  num,
  title,
  desc,
  imgKey,
}: {
  num: string;
  title: string;
  desc: string;
  imgKey: string;
}) {
  const tone: "teal" | "warm" | "deep" =
    num === "III" ? "warm" : num === "V" ? "deep" : "teal";
  return (
    <div className="absolute inset-0 flex flex-col" data-cursor="hover">
      <div className="relative w-full" style={{ height: "52%" }}>
        <EditorialPlaceholder label={`IMG / ${imgKey}`} tone={tone} />
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1 min-h-0">
        <div
          className="font-heading italic text-primary leading-none"
          style={{ fontSize: "1.5rem" }}
        >
          {num}
        </div>
        <h3
          className="mt-2 font-heading italic text-foreground"
          style={{ fontSize: "1.5rem", lineHeight: 1.15, letterSpacing: "-0.015em" }}
        >
          {title}
        </h3>
        <p
          className="mt-3 font-body text-foreground/70"
          style={{ fontSize: "0.875rem", lineHeight: 1.55 }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

export default function Treatments() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const upd = () => setIsDesktop(mq.matches);
    upd();
    mq.addEventListener?.("change", upd);
    return () => mq.removeEventListener?.("change", upd);
  }, []);

  const cardW = isDesktop ? 380 : 300;
  const cardH = isDesktop ? 460 : 420;

  if (!isDesktop) {
    return (
      <section
        id="trattamenti"
        className="relative"
        style={{
          zIndex: 3,
          background: "#0A2E36",
          minHeight: "100svh",
          padding: "10vh 0 8vh",
        }}
      >
        <div className="px-6">
          <div className="inline-flex liquid-glass rounded-full px-4 py-1.5">
            <span
              className="font-body text-[11px] tracking-[0.22em] uppercase text-foreground/75"
              style={{ fontWeight: 500 }}
            >
              I NOSTRI AMBITI
            </span>
          </div>
          <h2
            className="mt-7 font-heading italic text-foreground"
            style={{
              fontSize: "clamp(2.25rem, 9vw, 3.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
            }}
          >
            <RevealLines
              as="span"
              text="Cinque specializzazioni."
              stagger={0.06}
              duration={0.9}
            />
            <br />
            <span className="text-foreground/60">
              <RevealLines
                as="span"
                text="Una sola idea di cura."
                stagger={0.06}
                duration={0.9}
                delay={0.18}
              />
            </span>
          </h2>
          <RevealParagraph
            className="mt-6 font-body text-foreground/70"
            style={{ fontSize: "1rem", lineHeight: 1.6, maxWidth: "52ch" }}
            delay={0.4}
          >
            Meno invasivo quando possibile, più personalizzato sempre.
          </RevealParagraph>
          <ul className="mt-7 space-y-3" style={{ maxWidth: "440px" }}>
            {items.map(([num, title]) => (
              <li
                key={num}
                className="flex items-baseline gap-4 font-body text-foreground/80 border-b border-foreground/10 pb-2.5"
                style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}
              >
                <span
                  className="font-heading italic text-primary shrink-0"
                  style={{ fontSize: "1.0625rem", width: "1.5rem" }}
                >
                  {num}
                </span>
                <span>{title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="treatments-carousel mt-8"
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            padding: "8px 14vw 32px 14vw",
            scrollPaddingInline: "14vw",
          }}
        >
          {items.map(([num, title, desc, key]) => (
            <article
              key={key}
              className="liquid-glass"
              style={{
                flex: "0 0 auto",
                width: "min(72vw, 300px)",
                scrollSnapAlign: "center",
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "0.74",
                position: "relative",
                boxShadow:
                  "0 16px 40px -16px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(244, 241, 234, 0.12)",
              }}
            >
              <TreatmentCardBody num={num} title={title} desc={desc} imgKey={key} />
            </article>
          ))}
        </div>

        <style>{`
          .treatments-carousel::-webkit-scrollbar { display: none; }
          .treatments-carousel { scrollbar-width: none; }
        `}</style>
      </section>
    );
  }

  return (
    <section
      id="trattamenti"
      className="relative"
      style={{ zIndex: 3, height: "100svh", background: "#0A2E36" }}
    >
      <div
        className="sticky top-0 overflow-hidden flex items-center"
        style={{ minHeight: "100svh", height: "100svh" }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 grid md:grid-cols-2 gap-12 md:gap-6 lg:gap-8 items-center">
          <div className="md:pr-4 lg:pr-8">
            <div className="inline-flex liquid-glass rounded-full px-4 py-1.5">
              <span
                className="font-body text-[11px] tracking-[0.22em] uppercase text-foreground/75"
                style={{ fontWeight: 500 }}
              >
                I NOSTRI AMBITI
              </span>
            </div>
            <h2
              className="mt-7 font-heading italic text-foreground"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
                lineHeight: 0.96,
                letterSpacing: "-0.025em",
              }}
            >
              <RevealLines
                as="span"
                text="Cinque specializzazioni."
                stagger={0.06}
                duration={0.9}
              />
              <br />
              <span className="text-foreground/60">
                <RevealLines
                  as="span"
                  text="Una sola idea di cura."
                  stagger={0.06}
                  duration={0.9}
                  delay={0.18}
                />
              </span>
            </h2>
            <RevealParagraph
              className="mt-7 font-body text-foreground/70"
              style={{
                fontSize: "clamp(1rem, 1.1vw, 1.0625rem)",
                lineHeight: 1.6,
                maxWidth: "52ch",
              }}
              delay={0.4}
            >
              Meno invasivo quando possibile, più personalizzato sempre. Ogni trattamento
              segue lo stesso principio.
            </RevealParagraph>
            <ul className="mt-9 space-y-3" style={{ maxWidth: "460px" }}>
              {items.map(([num, title]) => (
                <li
                  key={num}
                  className="flex items-baseline gap-4 font-body text-foreground/80 border-b border-foreground/10 pb-2.5"
                  style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}
                >
                  <span
                    className="font-heading italic text-primary shrink-0"
                    style={{ fontSize: "1.0625rem", width: "1.5rem" }}
                  >
                    {num}
                  </span>
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative flex items-center justify-center"
            style={{ minHeight: cardH + 200 }}
          >
            <CardSwap
              width={cardW}
              height={cardH}
              cardDistance={56}
              verticalDistance={64}
              delay={4200}
              pauseOnHover={true}
              skewAmount={5}
              easing="elastic"
            >
              {items.map(([num, title, desc, key]) => (
                <CSCard key={key}>
                  <TreatmentCardBody num={num} title={title} desc={desc} imgKey={key} />
                </CSCard>
              ))}
            </CardSwap>
          </div>
        </div>
        <div
          className="section-overlay absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: "#0A2E36", opacity: 0, zIndex: 30 }}
        />
      </div>
    </section>
  );
}
