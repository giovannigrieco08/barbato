"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type ReactElement,
  type CSSProperties,
} from "react";

type CSCardProps = {
  customClass?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

export const CSCard = forwardRef<HTMLDivElement, CSCardProps>(function CSCard(
  { customClass, className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      {...rest}
      className={`card-swap-card ${customClass ?? ""} ${className ?? ""}`.trim()}
    />
  );
});

const cs_makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

type CardSwapProps = {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (i: number) => void;
  skewAmount?: number;
  easing?: "elastic" | "power";
  children?: ReactNode;
};

export default function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
}: CardSwapProps) {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => ({ current: null as HTMLDivElement | null })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tlRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled) return;

      const total = refs.length;
      const cs_placeNow = (
        el: HTMLDivElement | null,
        slot: { x: number; y: number; z: number; zIndex: number },
        skew: number
      ) => {
        if (!el) return;
        gsap.set(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          xPercent: -50,
          yPercent: -50,
          skewY: skew,
          transformOrigin: "center center",
          zIndex: slot.zIndex,
          force3D: true,
        });
      };

      refs.forEach((r, i) =>
        cs_placeNow(r.current, cs_makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
      );

      const swap = () => {
        if (order.current.length < 2) return;
        const [front, ...rest] = order.current;
        const elFront = refs[front].current;
        const tl = gsap.timeline();
        tlRef.current = tl;

        tl.to(elFront, { y: "+=500", duration: config.durDrop, ease: config.ease });

        tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
        rest.forEach((idx, i) => {
          const el = refs[idx].current;
          const slot = cs_makeSlot(i, cardDistance, verticalDistance, refs.length);
          tl.set(el, { zIndex: slot.zIndex }, "promote");
          tl.to(
            el,
            { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease },
            `promote+=${i * 0.15}`
          );
        });

        const backSlot = cs_makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
        tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
        tl.call(
          () => {
            gsap.set(elFront, { zIndex: backSlot.zIndex });
          },
          undefined,
          "return"
        );
        tl.to(
          elFront,
          { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease },
          "return"
        );

        tl.call(() => {
          order.current = [...rest, front];
        });
      };

      swap();
      intervalRef.current = setInterval(swap, delay);

      if (pauseOnHover) {
        const node = container.current;
        if (!node) return;
        const pause = () => {
          tlRef.current?.pause();
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
        const resume = () => {
          tlRef.current?.play();
          intervalRef.current = setInterval(swap, delay);
        };
        node.addEventListener("mouseenter", pause);
        node.addEventListener("mouseleave", resume);
        cleanup = () => {
          node.removeEventListener("mouseenter", pause);
          node.removeEventListener("mouseleave", resume);
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      } else {
        cleanup = () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, childArr.length]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as ReactElement<CSCardProps & { ref?: React.Ref<HTMLDivElement> }>, {
          key: i,
          ref: (el: HTMLDivElement | null) => {
            refs[i].current = el;
          },
          style: { width, height, ...((child as ReactElement<CSCardProps>).props.style ?? {}) },
          onClick: (e: React.MouseEvent) => {
            (child as ReactElement<CSCardProps>).props.onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
}
