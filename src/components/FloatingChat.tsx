"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Icon, MonoMark, EASE } from "@/components/ui";
import { bookingFallbackError } from "@/config/studio";

type ChatMsg = { id: string; role: "bot" | "user"; text: string };

export default function FloatingChat({
  open,
  setOpen,
  initialDraft,
  onDraftConsumed,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  initialDraft?: string | null;
  onDraftConsumed?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const idBase = useId();
  const msgSeq = useRef(1); // m0 is the seed bot message
  const nextId = useCallback(() => `${idBase}-m${msgSeq.current++}`, [idBase]);

  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      id: `${idBase}-m0`,
      role: "bot",
      text: "Ciao! Sono Smile, l’assistente dello Studio Barbato. Come posso aiutarti?",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // INFRA-10: scroll to real content height; honor reduced-motion (no smooth).
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, pending, reduceMotion]);

  // Pannello aperto: Escape per chiudere, focus trap, restore del focus al FAB,
  // body-scroll-lock. INFRA-05/06: lock incondizionato finché è aperto (così il
  // passaggio del breakpoint 639px non lascia lo stato stale) e ripristino in
  // cleanup; trap inline (nessuna dipendenza) + focus restoration sul FAB.
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    // Elemento da rimettere a fuoco alla chiusura: di norma il FAB.
    const restoreTo = fabRef.current;

    const getFocusable = (): HTMLElement[] => {
      if (!panel) return [];
      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const f = getFocusable();
      if (f.length === 0) {
        e.preventDefault();
        panel?.focus();
        return;
      }
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panel?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel?.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    // INFRA-06: lock incondizionato → niente lettura stale del breakpoint.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Attivazione: porta il cursore nell'input ad apertura, ma solo con
    // puntatore fine (desktop) — su touch evitiamo di forzare la tastiera.
    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      focusTimer = setTimeout(() => inputRef.current?.focus(), 260);
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (focusTimer) clearTimeout(focusTimer);
      // INFRA-05: restore del focus al FAB alla chiusura.
      restoreTo?.focus();
    };
  }, [open, setOpen]);

  // INFRA-07: send è stabile (useCallback) → le deps dell'effetto draft sono
  // oneste, niente closure stale. `input` non serve qui: il draft passa `text`.
  const send = useCallback(
    async (text?: string) => {
      const q = (text ?? input).trim();
      if (!q || pending) return;
      setMessages((m) => [...m, { id: nextId(), role: "user", text: q }]);
      setInput("");
      setPending(true);
      const fallbackText = bookingFallbackError;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ question: q }),
        });
        const data = (await res.json()) as { reply?: string };
        setMessages((m) => [
          ...m,
          { id: nextId(), role: "bot", text: data.reply?.trim() || fallbackText },
        ]);
      } catch {
        setMessages((m) => [...m, { id: nextId(), role: "bot", text: fallbackText }]);
      } finally {
        setPending(false);
      }
    },
    [input, pending, nextId]
  );

  useEffect(() => {
    if (open && initialDraft && typeof initialDraft === "string" && initialDraft.trim()) {
      const q = initialDraft.trim();
      onDraftConsumed?.();
      const t = setTimeout(() => send(q), 250);
      return () => clearTimeout(t);
    }
  }, [open, initialDraft, onDraftConsumed, send]);

  const quick = [
    "Quanto costa un impianto?",
    "La prima visita è gratuita?",
    "Ortodonzia invisibile per adulti",
    "Come prenoto una visita?",
  ];

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Apri Smile Assistant"
        data-cursor="hover"
        className="chat-fab"
        style={{ opacity: open ? 0 : 1, pointerEvents: open ? "none" : "auto" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-ring.svg"
          alt=""
          aria-hidden
          width="30"
          height="30"
          style={{ width: 30, height: 30, objectFit: "contain", display: "block" }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            // INFRA-04: enter alive (spring, scala dall'angolo del FAB),
            // EXIT più veloce e intenzionale (~200ms, curva drawer iOS).
            // Reduced-motion: crossfade istantaneo, niente movimento.
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
            animate={
              reduceMotion
                ? { opacity: 1, transition: { duration: 0.12 } }
                : { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 22 } }
            }
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : {
                    opacity: 0,
                    scale: 0.96,
                    y: 12,
                    transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
                  }
            }
            role="dialog"
            aria-modal="true"
            aria-label="Smile Assistant"
            className="liquid-glass-strong overflow-hidden flex flex-col chat-panel"
            style={{
              position: "fixed",
              zIndex: 65,
              right: 16,
              bottom: "calc(env(safe-area-inset-bottom, 0px) + 100px)",
              width: "min(400px, calc(100vw - 32px))",
              height: "min(600px, calc(100svh - 120px))",
              borderRadius: 24,
              transformOrigin: "bottom right",
              // Vetro scuro: translucido + blur (effetto glass) ma con tint
              // sufficientemente scuro da garantire il contrasto del contenuto
              // su QUALSIASI sezione dietro (anche le sezioni bianche).
              background: "rgba(8, 33, 40, 0.72)",
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
              <div className="flex items-center gap-3">
                <MonoMark size={28} />
                <div>
                  <div
                    className="font-heading italic text-foreground"
                    style={{ fontSize: "1.125rem", lineHeight: 1, letterSpacing: "-0.01em" }}
                  >
                    Smile Assistant
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {/* INFRA-19: pulse decorativo solo se il moto è consentito */}
                    {reduceMotion ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    ) : (
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ opacity: [0.55, 1, 0.55] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                    <span
                      className="font-body uppercase text-foreground/55"
                      style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 500 }}
                    >
                      ONLINE · IT/EN/DE
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-foreground/60 hover:text-foreground transition-transform active:scale-90"
                aria-label="Chiudi"
              >
                <Icon.X size={18} />
              </button>
            </div>

            <div
              ref={bodyRef}
              className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: EASE }}
                  className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "bg-primary text-[#0A2E36] rounded-2xl rounded-br-md max-w-[85%] font-body"
                        : "liquid-glass rounded-2xl rounded-bl-md max-w-[85%] font-body text-foreground"
                    }
                    style={{ padding: "10px 14px", fontSize: "0.875rem", lineHeight: 1.55, overflowWrap: "anywhere" }}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {pending && (
                <div className="flex justify-start">
                  <div
                    className="liquid-glass rounded-2xl rounded-bl-md px-3.5 py-3"
                    aria-label="Sta scrivendo…"
                  >
                    <div className="flex gap-1.5" aria-hidden>
                      {/* INFRA-19: loop dei puntini solo con moto consentito */}
                      {[0, 1, 2].map((i) =>
                        reduceMotion ? (
                          <span
                            key={i}
                            className="block w-1.5 h-1.5 rounded-full bg-primary opacity-70"
                          />
                        ) : (
                          <motion.span
                            key={i}
                            className="block w-1.5 h-1.5 rounded-full bg-primary"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {messages.length <= 1 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {quick.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="liquid-glass rounded-full px-3 py-1.5 font-body text-xs text-foreground/85 hover:text-foreground"
                      data-cursor="hover"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 border-t border-foreground/10 flex items-center gap-2"
            >
              {/* INFRA-18: niente backdrop-filter annidato (il pannello già
                  sfoca) — fill translucido piatto. Focus ring visibile sul pill
                  via :focus-within, in sostituzione di outline-none. */}
              <div
                className="flex-1 rounded-full px-4 py-2.5 flex items-center transition-[box-shadow,border-color] focus-within:border-primary/60 focus-within:shadow-[0_0_0_2px_rgba(143,200,196,0.45)]"
                style={{
                  background: "rgba(244, 241, 234, 0.06)",
                  border: "1px solid rgba(244, 241, 234, 0.12)",
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Scrivi la tua domanda…"
                  aria-label="Scrivi la tua domanda"
                  maxLength={500}
                  className="bg-transparent outline-none w-full font-body text-sm text-foreground placeholder:text-foreground/45"
                />
              </div>
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="w-11 h-11 rounded-full flex items-center justify-center text-[#0A2E36] disabled:opacity-50"
                style={{ background: "#8FC8C4" }}
                aria-label="Invia"
              >
                <Icon.ArrowUp size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
