"use client";

import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useMemo, useRef, type CSSProperties, type ReactNode } from "react";

const RV_EASE = [0.7, 0, 0.2, 1] as const;
const RV_EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Tokenize string into segments {t, em, space}.
type Segment = { t: string; em: boolean; space: boolean };
function tokenize(str: string): Segment[] {
  const out: Segment[] = [];
  const lines = str.split(/\n/);
  lines.forEach((line, li) => {
    if (li > 0) out.push({ t: "\n", space: false, em: false });
    const parts = line.split(/(\*[^*]+\*)/g);
    parts.forEach((p) => {
      if (!p) return;
      const isEm = p.startsWith("*") && p.endsWith("*");
      const inner = isEm ? p.slice(1, -1) : p;
      const words = inner.split(/(\s+)/);
      let bufWord = "";
      words.forEach((w) => {
        if (/^\s+$/.test(w)) {
          if (bufWord) {
            out.push({ t: bufWord, em: isEm, space: true });
            bufWord = "";
          }
        } else {
          bufWord += w;
        }
      });
      if (bufWord) out.push({ t: bufWord, em: isEm, space: false });
    });
  });
  return out;
}

// ————— RevealLines —————
type RevealLinesProps = {
  text?: string | string[];
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
  children?: ReactNode;
  ariaLabel?: string;
};
export function RevealLines({
  text,
  as: Tag = "h2",
  className = "",
  stagger = 0.06,
  duration = 0.9,
  delay = 0,
  amount = 0.35,
  once = true,
  children,
  ariaLabel,
}: RevealLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, amount });
  const reduce = useReducedMotion();

  const segments = useMemo(() => {
    if (typeof children === "string") return tokenize(children);
    if (Array.isArray(text)) return tokenize(text.join(" \n "));
    if (typeof text === "string") return tokenize(text);
    return [];
  }, [text, children]);

  const flatText =
    ariaLabel || (Array.isArray(text) ? text.join(" ") : typeof text === "string" ? text : "");

  if (reduce) {
    const TagAny = Tag as React.ElementType;
    return <TagAny className={className} aria-label={flatText}>{flatText}</TagAny>;
  }

  const TagAny = Tag as React.ElementType;
  return (
    <TagAny ref={ref} className={className} aria-label={flatText}>
      {segments.map((seg, i) => {
        if (seg.t === "\n") {
          return <br key={`br-${i}`} aria-hidden />;
        }
        return (
          <span key={`w-${i}`} aria-hidden style={{ display: "inline-block" }}>
            <motion.span
              style={{
                display: "inline-block",
                fontStyle: seg.em ? "italic" : undefined,
                willChange: "transform, opacity",
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration, ease: RV_EASE, delay: delay + i * stagger }}
            >
              {seg.t}
              {seg.space ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </TagAny>
  );
}

// ————— RevealText —————
type RevealTextProps = {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: number;
  amount?: number;
  once?: boolean;
  style?: CSSProperties;
};
export function RevealText({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  duration = 0.7,
  y = 14,
  blur = 6,
  amount = 0.4,
  once = true,
  style = {},
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const reduce = useReducedMotion();
  if (reduce) {
    const TagAny = Tag as React.ElementType;
    return <TagAny ref={ref} className={className} style={style}>{children}</TagAny>;
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, willChange: "transform, opacity, filter" }}
      initial={{ y, opacity: 0, filter: `blur(${blur}px)` }}
      animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration, ease: RV_EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

// ————— RevealParagraph —————
type RevealParagraphProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  amount?: number;
  once?: boolean;
  style?: CSSProperties;
};
export function RevealParagraph({
  children,
  className = "",
  delay = 0,
  duration = 1.0,
  y = 22,
  amount = 0.4,
  once = true,
  style = {},
}: RevealParagraphProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once, amount });
  const reduce = useReducedMotion();
  if (reduce) return <p ref={ref} className={className} style={style}>{children}</p>;
  return (
    <motion.p
      ref={ref}
      className={className}
      style={{ ...style, willChange: "transform, opacity" }}
      initial={{ y, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration, ease: RV_EASE_OUT, delay }}
    >
      {children}
    </motion.p>
  );
}

// ————— RevealRule —————
type RevealRuleProps = {
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  origin?: "left" | "right" | "center";
  height?: number;
  color?: string;
  style?: CSSProperties;
};
export function RevealRule({
  className = "",
  delay = 0,
  duration = 1.2,
  amount = 0.6,
  once = true,
  origin = "left",
  height = 1,
  color,
  style = {},
}: RevealRuleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const reduce = useReducedMotion();
  const baseStyle: CSSProperties = {
    height,
    background: color || "currentColor",
    transformOrigin: origin === "right" ? "right" : origin === "center" ? "center" : "left",
    width: "100%",
    ...style,
  };
  if (reduce) return <div ref={ref} className={className} style={baseStyle} />;
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...baseStyle, willChange: "transform" }}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration, ease: RV_EASE, delay }}
    />
  );
}

// ————— ParallaxImage —————
export function ParallaxImage({
  children,
  className = "",
  amount = 8,
  scale = 1.12,
  style = {},
  rounded = 0,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  scale?: number;
  style?: CSSProperties;
  rounded?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", overflow: "hidden", borderRadius: rounded, ...style }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: reduce ? 0 : y,
          scale,
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export { RV_EASE, RV_EASE_OUT };
