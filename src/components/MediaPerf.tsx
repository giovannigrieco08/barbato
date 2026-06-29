"use client";

import { useEffect } from "react";

/**
 * MediaPerf — ottimizzazione di performance puramente trasparente.
 *
 * I <video> decorativi (autoplay/loop/muted) continuano a decodificare frame
 * anche quando sono fuori dal viewport, sottraendo budget di rendering allo
 * scroll e alle animazioni visibili. Qui li metto in pausa quando escono dallo
 * schermo e li riavvio appena rientrano (con un margine d'anticipo per evitare
 * qualsiasi frame nero).
 *
 * NON cambia nulla di visibile né di animato: fuori schermo non c'è niente da
 * vedere, e quando il video torna in vista riparte. È un componente isolato:
 * non tocca le sezioni né le loro animazioni.
 */
export default function MediaPerf() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;

    const videos = Array.from(document.querySelectorAll("video"));
    if (videos.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (v.paused) v.play().catch(() => {});
          } else if (!v.paused) {
            v.pause();
          }
        }
      },
      // Anticipo di 200px così il video è già in play prima di entrare in vista.
      { root: null, rootMargin: "200px 0px", threshold: 0 }
    );

    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return null;
}
