import Link from "next/link";
import type { ReactNode } from "react";
import { studio } from "@/config/studio";

const LEGAL_LINKS: [string, string][] = [
  ["/privacy", "Privacy Policy"],
  ["/cookie", "Cookie Policy"],
  ["/note-legali", "Note legali"],
  ["/trasparenza-tariffe", "Trasparenza tariffe"],
];

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="legal-root"
      style={{ background: "#F4F1EA", color: "#0A2E36", minHeight: "100svh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.25rem clamp(1.25rem, 5vw, 3rem)",
          borderBottom: "1px solid rgba(10,46,54,0.12)",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-funcity), 'Barlow', sans-serif",
            fontSize: "15px",
            letterSpacing: "0.06em",
            color: "#0A2E36",
            textDecoration: "none",
            lineHeight: 1.2,
          }}
        >
          {studio.wordmark.line1}
          <br />
          {studio.wordmark.line2}
        </Link>
        <Link
          href="/"
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: "13.5px",
            fontWeight: 500,
            color: "#0A2E36",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span aria-hidden="true">←</span> Torna al sito
        </Link>
      </header>

      <main
        id="main-content"
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "880px",
          margin: "0 auto",
          padding: "clamp(2.5rem, 7vw, 5rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 8vw, 6rem)",
        }}
      >
        {children}
      </main>

      <footer
        style={{
          borderTop: "1px solid rgba(10,46,54,0.12)",
          padding: "1.5rem clamp(1.25rem, 5vw, 3rem)",
        }}
      >
        <div
          style={{
            maxWidth: "880px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem 1.5rem",
          }}
        >
          <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 1rem" }}>
            {LEGAL_LINKS.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="legal-footer-link"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "12.5px",
                  color: "rgba(10,46,54,0.82)",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.04em",
              color: "rgba(10,46,54,0.5)",
            }}
          >
            © {studio.copyrightYear} {studio.legalName}
          </div>
        </div>
      </footer>
    </div>
  );
}
