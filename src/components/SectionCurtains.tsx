"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    // Avvia la transizione a doppia tenda verso una sezione (href "#id").
    __sectionCurtains?: (href: string) => void;
    __lenis?: {
      scrollTo: (target: string, opts?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Transizione di sezione "a doppia tenda" (clip-path).
 *
 * Due pannelli #1a1a1a larghi 50%: il sinistro si svela dal basso, il destro
 * dall'alto (movimento incrociato). Sequenza: chiusura tende → salto istantaneo
 * alla sezione (schermo coperto) → apertura tende. Parametri fedeli alla
 * specifica: duration 1, ease "power3.inOut".
 *
 * È completamente isolata dal meccanismo di pin/scrub/overlap: durante la fase
 * coperta esegue solo uno scroll istantaneo (Lenis `immediate` su desktop,
 * `scrollIntoView` altrove). Sotto prefers-reduced-motion salta direttamente.
 */
export default function SectionCurtains() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const curtains = document.querySelector<HTMLElement>(".transition-curtains");
    const left = document.querySelector<HTMLElement>(".curtain-left");
    const right = document.querySelector<HTMLElement>(".curtain-right");
    if (!curtains || !left || !right) return;

    const reduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const jumpTo = (href: string) => {
      const id = href.startsWith("#") ? href.slice(1) : href;
      const el = document.getElementById(id);
      const lenis = window.__lenis;
      // Schermo coperto → salto istantaneo, niente animazione di scroll.
      if (lenis?.scrollTo) lenis.scrollTo("#" + id, { immediate: true });
      else if (el) el.scrollIntoView();
      if (el) {
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapRef: any = null;
    let busy = false;

    const run = async (href: string) => {
      if (busy) return;
      // Reduced-motion: niente tenda, salto e basta.
      if (reduced()) {
        jumpTo(href);
        return;
      }
      try {
        if (!gsapRef) gsapRef = (await import("gsap")).default;
      } catch {
        jumpTo(href);
        return;
      }
      const gsap = gsapRef;
      busy = true;

      // Stato iniziale collassato, poi rendo visibile il wrapper (no flash).
      // scaleY con origini opposte → la sinistra cresce dal basso, la destra
      // dall'alto (movimento incrociato), e GSAP lo interpola sempre.
      gsap.set(left, { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(right, { scaleY: 0, transformOrigin: "50% 0%" });
      curtains.style.display = "flex";

      gsap
        .timeline({
          onComplete: () => {
            curtains.style.display = "none";
            busy = false;
          },
        })
        // —— chiusura: le due metà crescono dai lati opposti ——
        .to([left, right], { scaleY: 1, duration: 1, ease: "power3.inOut" }, 0)
        // —— scambio (schermo coperto) ——
        .add(() => jumpTo(href))
        // —— apertura: movimento inverso (collassano verso le origini) ——
        .to([left, right], { scaleY: 0, duration: 1, ease: "power3.inOut" });
    };

    window.__sectionCurtains = run;
    return () => {
      if (window.__sectionCurtains === run) delete window.__sectionCurtains;
    };
  }, []);

  return (
    <div className="transition-curtains" aria-hidden="true">
      <div className="curtain curtain-left" />
      <div className="curtain curtain-right" />
    </div>
  );
}
