"use client";

import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
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
  const TagAny = Tag as React.ElementType;
  return (
    <TagAny ref={ref} className={className} aria-label={text} style={{ display: "inline-block" }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "pre", willChange: "transform, filter, opacity" }}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            inView
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [50, -5, 0],
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
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay }}
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
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
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
      style={{ x: sx, y: sy }}
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

// ————— DentalArchVideoPlaceholder —————
// Animated dental arch (two arcs of teeth opening/closing).
// Stand-in for the cinematic MP4 background of CtaFooter.
export function DentalArchVideoPlaceholder() {
  const teethTop = 14, teethBot = 14;
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 55%, #0f5463 0%, #0a2e36 45%, #061f25 100%)"
      }}/>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at 50% 35%, rgba(244,241,234,0.12), transparent 40%)"
      }}/>
      <motion.svg
        viewBox="0 0 1600 900"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="tooth" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FBF7EC"/>
            <stop offset="60%" stopColor="#E5DDC7"/>
            <stop offset="100%" stopColor="#8A7F63"/>
          </radialGradient>
          <linearGradient id="gum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B1E2A"/>
            <stop offset="100%" stopColor="#2A0A10"/>
          </linearGradient>
          <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.6"/>
          </filter>
        </defs>
        <motion.g
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        >
          <path d="M 300 290 Q 800 140 1300 290 Q 1300 210 800 90 Q 300 210 300 290 Z" fill="url(#gum)" opacity="0.85"/>
          {Array.from({ length: teethTop }).map((_, i) => {
            const t = i / (teethTop - 1);
            const angle = (t - 0.5) * Math.PI * 0.85;
            const cx = 800 + Math.sin(angle) * 520;
            const cy = 290 - Math.cos(angle) * 160;
            const w = 56 + Math.abs(t - 0.5) * 30;
            const h = 120 - Math.abs(t - 0.5) * 30;
            return (
              <g key={`u${i}`} transform={`translate(${cx} ${cy}) rotate(${(angle * 180 / Math.PI)})`}>
                <rect x={-w / 2} y={0} width={w} height={h} rx={w * 0.35} fill="url(#tooth)" filter="url(#soft)"/>
                <rect x={-w / 2 + 3} y={4} width={w * 0.35} height={h * 0.55} rx={w * 0.2} fill="#FDFBF3" opacity="0.55"/>
              </g>
            );
          })}
        </motion.g>
        <motion.g
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        >
          <path d="M 300 610 Q 800 760 1300 610 Q 1300 690 800 810 Q 300 690 300 610 Z" fill="url(#gum)" opacity="0.85"/>
          {Array.from({ length: teethBot }).map((_, i) => {
            const t = i / (teethBot - 1);
            const angle = (t - 0.5) * Math.PI * 0.85;
            const cx = 800 + Math.sin(angle) * 520;
            const cy = 610 + Math.cos(angle) * 160;
            const w = 52 + Math.abs(t - 0.5) * 28;
            const h = 110 - Math.abs(t - 0.5) * 30;
            return (
              <g key={`l${i}`} transform={`translate(${cx} ${cy}) rotate(${-(angle * 180 / Math.PI)})`}>
                <rect x={-w / 2} y={-h} width={w} height={h} rx={w * 0.35} fill="url(#tooth)" filter="url(#soft)"/>
                <rect x={-w / 2 + 3} y={-h + 4} width={w * 0.35} height={h * 0.55} rx={w * 0.2} fill="#FDFBF3" opacity="0.55"/>
              </g>
            );
          })}
        </motion.g>
        <motion.ellipse
          cx="800" cy="450" rx="600" ry="60"
          fill="rgba(244,241,234,0.08)"
          animate={{ cx: [500, 1100, 500] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.svg>
      <div className="absolute inset-0 pointer-events-none" style={{
        opacity: 0.06,
        mixBlendMode: "overlay",
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")"
      }}/>
    </div>
  );
}

// ————— EditorialPlaceholder —————
type EditorialPlaceholderProps = {
  label: string;
  tone?: "teal" | "deep" | "warm" | "portrait";
  className?: string;
  style?: React.CSSProperties;
};
export function EditorialPlaceholder({ label, tone = "teal", className = "", style = {} }: EditorialPlaceholderProps) {
  const palettes: Record<string, { bg: string; stripe: string; ink: string }> = {
    teal: { bg: "#0F4754", stripe: "#0A2E36", ink: "rgba(244,241,234,0.35)" },
    deep: { bg: "#0A2E36", stripe: "#061F25", ink: "rgba(244,241,234,0.32)" },
    warm: { bg: "#1a3a44", stripe: "#0f2a32", ink: "rgba(244,241,234,0.4)" },
    portrait: { bg: "#2a2a2a", stripe: "#1c1c1c", ink: "rgba(244,241,234,0.35)" },
  };
  const p = palettes[tone] || palettes.teal;
  return (
    <div
      className={"relative w-full h-full overflow-hidden " + className}
      style={{
        backgroundColor: p.bg,
        backgroundImage: `repeating-linear-gradient(135deg, ${p.stripe} 0 2px, transparent 2px 14px)`,
        ...style,
      }}
    >
      <div className="absolute inset-0 flex items-end p-5">
        <span style={{
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: p.ink,
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}
