"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FadeUp, Icon, MagneticButton, MonoMark } from "@/components/ui";
import { RevealLines, RevealParagraph } from "@/components/reveals";
import { studio, telHref, mailHref, addressShort, copyrightLine } from "@/config/studio";

export default function CtaFooter({ onOpenChat }: { onOpenChat?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // FOOTER-13: only let the muted loop play while the section is on screen.
  // Pause + release decode work when it scrolls away; resume on re-entry.
  // Poster stays as the visible fallback while paused.
  useEffect(() => {
    const video = videoRef.current;
    const target = sectionRef.current;
    if (!video || !target) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <section
        id="contatti"
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ zIndex: 7, background: "#0A2E36", height: "100svh", minHeight: "560px" }}
      >
        <video
          ref={videoRef}
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
                  href={telHref}
                  className="cta-tel inline-flex items-center gap-2 font-body text-foreground/85 underline-offset-4 hover:underline hover:text-foreground"
                  data-cursor="hover"
                  style={{ fontSize: "0.9375rem" }}
                >
                  <Icon.Phone /> Chiama {studio.phone.display}
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
              {studio.wordmark.line1}
              <br />
              {studio.wordmark.line2}
            </div>
            <div
              className="mt-5 font-body text-foreground/75"
              style={{ fontSize: "13px", lineHeight: 1.7 }}
            >
              {studio.address.street}
              <br />
              {studio.address.postalCode} {studio.address.locality} ({studio.address.province})
              <br />
              {studio.address.region} · {studio.address.country}
            </div>
          </div>
          <div>
            <div
              className="font-body uppercase text-foreground/60 mb-5"
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
              className="font-body uppercase text-foreground/60 mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.22em", fontWeight: 500 }}
            >
              TRATTAMENTI
            </div>
            <ul
              className="space-y-3 font-body text-foreground/70"
              style={{ fontSize: "14px", lineHeight: 1.5 }}
            >
              {/* FOOTER-12: anchor to the real #trattamenti section so these
                  carry the same link affordance as STUDIO / CONTATTI. */}
              {[
                "Implantologia",
                "Ortodonzia invisibile",
                "Estetica del sorriso",
                "Conservativa ed endodonzia",
                "Igiene e prevenzione",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#trattamenti"
                    className="hover:text-foreground transition-colors"
                    data-cursor="hover"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div
              className="font-body uppercase text-foreground/60 mb-5"
              style={{ fontSize: "11px", letterSpacing: "0.22em", fontWeight: 500 }}
            >
              CONTATTI
            </div>
            <ul
              className="space-y-3 font-body text-foreground/70"
              style={{ fontSize: "14px", lineHeight: 1.5 }}
            >
              <li>{addressShort}</li>
              <li>
                <a
                  href={telHref}
                  className="hover:text-foreground transition-colors"
                  data-cursor="hover"
                >
                  {studio.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={mailHref}
                  className="hover:text-foreground transition-colors"
                  data-cursor="hover"
                >
                  {studio.email}
                </a>
              </li>
              <li className="flex items-center gap-2 pt-2">
                <a
                  href={studio.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                  data-cursor="hover"
                >
                  <Icon.Instagram /> {studio.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row md:justify-between gap-3">
          <div
            className="font-body uppercase text-foreground/75"
            style={{ fontSize: "11px", letterSpacing: "0.16em", fontWeight: 500 }}
          >
            {copyrightLine}
          </div>
          <div
            className="font-body uppercase text-foreground/75 flex flex-wrap items-center gap-x-2 gap-y-1"
            style={{ fontSize: "11px", letterSpacing: "0.16em", fontWeight: 500 }}
          >
            {(
              [
                ["/privacy", "Privacy"],
                ["/cookie", "Cookie"],
                ["/note-legali", "Note legali"],
                ["/trasparenza-tariffe", "Trasparenza tariffe"],
              ] as [string, string][]
            ).map(([href, label], i) => (
              <span key={href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                <Link
                  href={href}
                  className="hover:text-foreground transition-colors"
                  data-cursor="hover"
                >
                  {label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* FOOTER-10: give the tel link the same interaction weight as the
          MagneticButton — color shift on hover (Tailwind) + subtle press feedback. */}
      <style jsx>{`
        .cta-tel {
          transition: color 160ms var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
            transform 160ms var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
        }
        .cta-tel:active {
          transform: scale(0.97);
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-tel {
            transition: color 160ms var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
          }
          .cta-tel:active {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
