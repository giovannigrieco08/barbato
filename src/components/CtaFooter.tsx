"use client";

import { FadeUp, Icon, MagneticButton, MonoMark } from "@/components/ui";
import { RevealLines, RevealParagraph } from "@/components/reveals";

export default function CtaFooter({ onOpenChat }: { onOpenChat?: () => void }) {
  return (
    <>
      <section
        id="contatti"
        className="relative overflow-hidden"
        style={{ zIndex: 7, background: "#0A2E36", height: "100svh", minHeight: "560px" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/videos/hero-desktop.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,46,54,0.85), rgba(6,31,37,0.95))",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="relative z-10 text-center" style={{ maxWidth: "56rem" }}>
            <h2
              className="font-heading italic text-foreground"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
              }}
            >
              <RevealLines
                as="span"
                text="Il primo passo è una visita."
                stagger={0.06}
                duration={0.95}
              />
              <br />
              <RevealLines
                as="span"
                text="Il resto, lo decidiamo insieme."
                stagger={0.06}
                duration={0.95}
                delay={0.3}
              />
            </h2>
            <RevealParagraph
              className="mt-8 font-body text-foreground/75 mx-auto"
              style={{
                fontSize: "clamp(1rem, 1.2vw, 1.125rem)",
                lineHeight: 1.6,
                maxWidth: "52ch",
              }}
              delay={0.5}
            >
              Prima visita senza impegno. Diagnostica 3D inclusa. Preventivo chiaro e
              scritto, prima di ogni trattamento.
            </RevealParagraph>
            <FadeUp delay={0.7}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
                <MagneticButton
                  onClick={onOpenChat}
                  className="liquid-glass-gold rounded-full font-body font-medium text-foreground"
                  style={{
                    padding: "14px 28px",
                    fontSize: "0.9375rem",
                    letterSpacing: "0.005em",
                  }}
                >
                  <Icon.Calendar /> Prenota ora
                </MagneticButton>
                <a
                  href="tel:+390884000000"
                  className="inline-flex items-center gap-2 font-body text-foreground/85 underline-offset-4 hover:underline"
                  data-cursor="hover"
                  style={{ fontSize: "0.9375rem" }}
                >
                  <Icon.Phone /> Chiama 0884 000 000
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <footer
        className="px-6 lg:px-12 pt-14 pb-7"
        style={{ backgroundColor: "#061F25" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-9 border-b border-foreground/10">
          <div>
            <MonoMark size={44} />
            <div
              className="mt-5 text-foreground"
              style={{
                fontFamily: "var(--font-funcity), serif",
                fontSize: "17px",
                letterSpacing: "0.06em",
                lineHeight: 1.35,
              }}
            >
              STUDIO DENTISTICO
              <br />
              FABIO BARBATO
            </div>
            <div
              className="mt-5 font-body text-foreground/55"
              style={{ fontSize: "13px", lineHeight: 1.7 }}
            >
              Via del Porto, 14
              <br />
              71043 Manfredonia (FG)
              <br />
              Apulia · Italia
            </div>
          </div>
          <div>
            <div
              className="font-body uppercase text-foreground/45 mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.22em", fontWeight: 500 }}
            >
              STUDIO
            </div>
            <ul
              className="space-y-3 font-body text-foreground/70"
              style={{ fontSize: "14px", lineHeight: 1.5 }}
            >
              <li>
                <a
                  href="#dottore"
                  className="hover:text-foreground transition-colors"
                  data-cursor="hover"
                >
                  Dr. Barbato
                </a>
              </li>
              <li>
                <a
                  href="#studio"
                  className="hover:text-foreground transition-colors"
                  data-cursor="hover"
                >
                  Tecnologia
                </a>
              </li>
              <li>
                <a
                  href="#studio"
                  className="hover:text-foreground transition-colors"
                  data-cursor="hover"
                >
                  Studio
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div
              className="font-body uppercase text-foreground/45 mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.22em", fontWeight: 500 }}
            >
              TRATTAMENTI
            </div>
            <ul
              className="space-y-3 font-body text-foreground/70"
              style={{ fontSize: "14px", lineHeight: 1.5 }}
            >
              <li>Implantologia</li>
              <li>Ortodonzia invisibile</li>
              <li>Estetica del sorriso</li>
              <li>Conservativa ed endodonzia</li>
              <li>Igiene e prevenzione</li>
            </ul>
          </div>
          <div>
            <div
              className="font-body uppercase text-foreground/45 mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.22em", fontWeight: 500 }}
            >
              CONTATTI
            </div>
            <ul
              className="space-y-3 font-body text-foreground/70"
              style={{ fontSize: "14px", lineHeight: 1.5 }}
            >
              <li>Via del Porto, 14 · Manfredonia</li>
              <li>
                <a
                  href="tel:+390884000000"
                  className="hover:text-foreground transition-colors"
                  data-cursor="hover"
                >
                  0884 000 000
                </a>
              </li>
              <li>
                <a
                  href="mailto:studio@barbato.dental"
                  className="hover:text-foreground transition-colors"
                  data-cursor="hover"
                >
                  studio@barbato.dental
                </a>
              </li>
              <li className="flex items-center gap-2 pt-2">
                <Icon.Instagram /> @studio.barbato
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row md:justify-between gap-3">
          <div
            className="font-body uppercase text-foreground/45"
            style={{ fontSize: "11px", letterSpacing: "0.16em", fontWeight: 500 }}
          >
            © 2026 Studio Dentistico Fabio Barbato · P.IVA 00471820712
          </div>
          <div
            className="font-body uppercase text-foreground/45"
            style={{ fontSize: "11px", letterSpacing: "0.16em", fontWeight: 500 }}
          >
            Privacy · Cookie · Note legali · Trasparenza tariffe
          </div>
        </div>
      </footer>
    </>
  );
}
