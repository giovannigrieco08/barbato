"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Uscita più veloce dell'entrata (curva drawer iOS). Vedi INFRA-11.
const EXIT_MS = 200;

/**
 * Banner di consenso cookie. Mostra il banner finché l'utente non sceglie;
 * la scelta è memorizzata in localStorage ("cookie-consent": accepted|rejected).
 *
 * NB: il sito al momento non carica script di analytics/profilazione. Quando
 * verranno aggiunti, vanno condizionati a `localStorage["cookie-consent"] === "accepted"`.
 */
export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const reduceMotion = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie-consent")) setShow(true);
    } catch {
      /* localStorage non disponibile: non mostriamo il banner */
    }
    if (typeof window !== "undefined") {
      reduceMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem("cookie-consent", value);
    } catch {}
    // INFRA-11: anima l'uscita prima di smontare (no scomparsa istantanea).
    if (reduceMotion.current) {
      setShow(false);
      return;
    }
    setExiting(true);
    exitTimer.current = setTimeout(() => setShow(false), EXIT_MS);
  };

  if (!show) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label="Preferenze cookie"
      // INFRA-11: stato di uscita inline — opacity + translateY, più veloce
      // dell'entrata. transform/opacity only (GPU), nessuna nuova regola CSS.
      style={
        exiting
          ? {
              opacity: 0,
              transform: "translateY(12px)",
              transition: `opacity ${EXIT_MS}ms cubic-bezier(0.32,0.72,0,1), transform ${EXIT_MS}ms cubic-bezier(0.32,0.72,0,1)`,
              pointerEvents: "none",
            }
          : undefined
      }
    >
      <p>
        Usiamo cookie tecnici e, previo consenso, cookie analitici per migliorare il sito.{" "}
        <Link href="/cookie">Leggi la Cookie Policy</Link>.
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn-ghost" onClick={() => choose("rejected")}>
          Rifiuta
        </button>
        <button type="button" className="cookie-btn" onClick={() => choose("accepted")}>
          Accetta
        </button>
      </div>
    </div>
  );
}
