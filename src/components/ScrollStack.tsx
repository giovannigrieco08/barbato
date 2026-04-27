"use client";

import {
  useLayoutEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react";

type ScrollStackItemProps = {
  children: ReactNode;
  itemClassName?: string;
  style?: CSSProperties;
};

export function ScrollStackItem({
  children,
  itemClassName = "",
  style,
}: ScrollStackItemProps) {
  return (
    <div
      className={`scroll-stack-card ${itemClassName}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}

type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
};

type Transform = {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
};

type LenisLike = {
  on: (event: string, cb: () => void) => void;
  off: (event: string, cb: () => void) => void;
};

function parsePct(value: string, containerHeight: number): number {
  if (typeof value === "string" && value.includes("%")) {
    return (parseFloat(value) / 100) * containerHeight;
  }
  return parseFloat(value);
}

function calcProgress(scrollTop: number, start: number, end: number): number {
  if (scrollTop < start) return 0;
  if (scrollTop > end) return 1;
  return (scrollTop - start) / (end - start);
}

export default function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".scroll-stack-card")
    );
    if (!cards.length) return;

    const endEl = root.querySelector<HTMLElement>(".scroll-stack-end");
    const transformsCache = new Map<number, Transform>();
    let stackCompleted = false;

    // Static initial card setup
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.contain = "layout paint";
      card.style.transform = "translate3d(0,0,0)";
    }

    // Offset cache: calcolata al mount, ricalcolata su resize/layout change.
    // Niente getBoundingClientRect per frame → 0 reflow durante lo scroll.
    let cardOffsets: number[] = new Array(cards.length).fill(0);
    let endOffset = 0;

    const recomputeOffsets = () => {
      // Reset transform momentaneamente per leggere posizioni "naturali".
      // Senza questo, il cardTop letto include il translate corrente.
      const savedTransforms: string[] = [];
      for (let i = 0; i < cards.length; i++) {
        savedTransforms[i] = cards[i].style.transform;
        cards[i].style.transform = "translate3d(0,0,0)";
      }

      const scrollY = window.scrollY;
      for (let i = 0; i < cards.length; i++) {
        cardOffsets[i] = cards[i].getBoundingClientRect().top + scrollY;
      }
      endOffset = endEl ? endEl.getBoundingClientRect().top + scrollY : 0;

      // Restore transforms
      for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = savedTransforms[i];
      }
    };

    const updateCardTransforms = () => {
      const scrollTop = window.scrollY;
      const containerHeight = window.innerHeight;
      const stackPositionPx = parsePct(stackPosition, containerHeight);
      const scaleEndPositionPx = parsePct(scaleEndPosition, containerHeight);

      // Pre-compute topCardIndex per il blur (1 sola passata).
      let topCardIndex = 0;
      if (blurAmount) {
        for (let j = 0; j < cards.length; j++) {
          const jTriggerStart =
            cardOffsets[j] - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
      }

      for (let i = 0; i < cards.length; i++) {
        const cardTop = cardOffsets[i];
        const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
        const triggerEnd = cardTop - scaleEndPositionPx;
        const pinStart = triggerStart;
        const pinEnd = endOffset - containerHeight / 2;

        const scaleProgress = calcProgress(scrollTop, triggerStart, triggerEnd);
        const targetScale = baseScale + i * itemScale;
        const scale = 1 - scaleProgress * (1 - targetScale);
        const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

        let blur = 0;
        if (blurAmount && i < topCardIndex) {
          blur = (topCardIndex - i) * blurAmount;
        }

        let translateY = 0;
        if (scrollTop >= pinStart && scrollTop <= pinEnd) {
          translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
        }

        const newT: Transform = {
          translateY: Math.round(translateY * 10) / 10,
          scale: Math.round(scale * 1000) / 1000,
          rotation: Math.round(rotation * 10) / 10,
          blur: Math.round(blur * 10) / 10,
        };

        const last = transformsCache.get(i);
        if (
          !last ||
          Math.abs(last.translateY - newT.translateY) > 0.4 ||
          Math.abs(last.scale - newT.scale) > 0.002 ||
          Math.abs(last.rotation - newT.rotation) > 0.4 ||
          Math.abs(last.blur - newT.blur) > 0.4
        ) {
          const card = cards[i];
          card.style.transform = `translate3d(0,${newT.translateY}px,0) scale(${newT.scale})${newT.rotation ? ` rotate(${newT.rotation}deg)` : ""}`;
          card.style.filter = newT.blur > 0 ? `blur(${newT.blur}px)` : "";
          transformsCache.set(i, newT);
        }

        if (i === cards.length - 1) {
          const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
          if (inView && !stackCompleted) {
            stackCompleted = true;
            onStackComplete?.();
          } else if (!inView && stackCompleted) {
            stackCompleted = false;
          }
        }
      }
    };

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let scrollHandler: (() => void) | null = null;
    let lenisRef: LenisLike | null = null;
    let pollId: number | null = null;
    let cancelled = false;

    if (!reduceMotion) {
      // Hook diretto sul Lenis globale del SmoothScrollProvider:
      // è la stessa fonte che alimenta ScrollTrigger del progetto, quindi
      // perfettamente in fase con il lerp. Niente desync, niente jitter.
      const tryHook = (): boolean => {
        const l = (window as unknown as { __lenis?: LenisLike }).__lenis;
        if (l) {
          l.on("scroll", updateCardTransforms);
          lenisRef = l;
          return true;
        }
        return false;
      };

      if (!tryHook()) {
        // Fallback temporaneo su window.scroll mentre aspetto Lenis (caricato
        // async dal provider). Quando Lenis è disponibile, sostituisco.
        let rafPending = false;
        const fallback = () => {
          if (rafPending) return;
          rafPending = true;
          requestAnimationFrame(() => {
            rafPending = false;
            updateCardTransforms();
          });
        };
        window.addEventListener("scroll", fallback, { passive: true });
        scrollHandler = fallback;

        let attempts = 0;
        pollId = window.setInterval(() => {
          if (cancelled) return;
          attempts++;
          if (tryHook()) {
            // Sostituisco fallback con Lenis listener
            if (scrollHandler) {
              window.removeEventListener("scroll", scrollHandler);
              scrollHandler = null;
            }
            if (pollId !== null) {
              window.clearInterval(pollId);
              pollId = null;
            }
          } else if (attempts > 40) {
            // Lenis non disponibile (iOS Safari / reduce-motion / no hover)
            // Resto sul fallback window.scroll che funziona comunque.
            if (pollId !== null) {
              window.clearInterval(pollId);
              pollId = null;
            }
          }
        }, 50);
      }
    }

    // Layout-change cache invalidation: ResizeObserver su body cattura
    // qualsiasi shift verticale (immagini caricate, font caricati, ecc.).
    const ro = new ResizeObserver(() => {
      recomputeOffsets();
      updateCardTransforms();
    });
    ro.observe(document.body);

    const onResize = () => {
      recomputeOffsets();
      updateCardTransforms();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Initial paint
    recomputeOffsets();
    updateCardTransforms();

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      if (lenisRef) {
        try {
          lenisRef.off("scroll", updateCardTransforms);
        } catch {
          /* destroyed */
        }
      }
      if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
      }
      if (pollId !== null) window.clearInterval(pollId);
      transformsCache.clear();
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
  ]);

  return (
    <div
      className={`scroll-stack-scroller ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}
