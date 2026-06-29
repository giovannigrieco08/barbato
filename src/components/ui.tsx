"use client";

import { motion, useMotionValue, useSpring, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ComponentProps, type ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

// ————— BlurText —————
type BlurTextProps = {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  stagger?: number;
  once?: boolean;
};
export function BlurText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  stagger = 0.09,
  once = true,
}: BlurTextProps) {
  const words = text.split(" ");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, amount: 0.3 });
  const reduce = useReducedMotion();
  const TagAny = Tag as React.ElementType;
  // Reduced motion: render the text plainly, no blur/translate choreography.
  if (reduce) {
    return (
      <TagAny ref={ref} className={className} style={{ display: "inline-block" }}>
        {text}
      </TagAny>
    );
  }
  return (
    <TagAny ref={ref} className={className} aria-label={text} style={{ display: "inline-block" }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "pre", willChange: "transform, filter, opacity" }}
          initial={{ filter: "blur(10px)", opacity: 0, y: 18 }}
          animate={
            inView
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [18, -3, 0],
                }
              : {}
          }
          transition={{
            duration: 0.55,
            times: [0, 0.5, 1],
            delay: delay + i * stagger,
            ease: EASE,
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </TagAny>
  );
}

// ————— FadeUp —————
type FadeUpProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  amount?: number;
  once?: boolean;
};
export function FadeUp({
  children,
  delay = 0,
  y = 24,
  className = "",
  amount = 0.2,
  once = true,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const reduce = useReducedMotion();
  // Reduced motion: keep an opacity fade but drop the position animation.
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? { opacity: 0 } : { y, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: reduce ? 0.4 : 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// ————— MagneticButton —————
type MagneticButtonProps = ComponentProps<typeof motion.button> & {
  radius?: number;
};
export function MagneticButton({
  children,
  className = "",
  radius = 40,
  style,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
    if (reduce) return; // no magnetic pull under reduced motion
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const max = Math.max(r.width, r.height) / 2 + radius;
    if (dist < max) {
      x.set(dx * 0.3);
      y.set(dy * 0.3);
    }
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{ ...style, x: sx, y: sy }}
      className={className}
      data-cursor="hover"
      {...rest}
    >
      <motion.span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {children}
      </motion.span>
    </motion.button>
  );
}

// ————— MonoMark (logo ring) —————
export function MonoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-ring.svg"
      width={size}
      height={size}
      className={className}
      alt=""
      aria-hidden
      style={{ width: size, height: size, objectFit: "contain", display: "block" }}
    />
  );
}

// ————— Icons (Lucide-style inline SVGs) —————
type IconProps = { size?: number; className?: string; [key: string]: unknown };
export const Icon = {
  ArrowUpRight: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width={p.size || 14} height={p.size || 14} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17 17 7" /><path d="M8 7h9v9" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width={p.size || 20} height={p.size || 20} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
  ArrowUp: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
    </svg>
  ),
  Calendar: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Phone: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width={p.size || 22} height={p.size || 22} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  X: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width={p.size || 20} height={p.size || 20} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  ),
  Instagram: (p: IconProps) => (
    <svg viewBox="0 0 24 24" width={p.size || 16} height={p.size || 16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect width="20" height="20" x="2" y="2" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
    </svg>
  ),
};
