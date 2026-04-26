"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon, MonoMark, EASE } from "@/components/ui";

type ChatMsg = { role: "bot" | "user"; text: string };

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
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "bot",
      text: "Ciao! Sono Smile, l’assistente dello Studio Barbato. Come posso aiutarti?",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    if (open && initialDraft && typeof initialDraft === "string" && initialDraft.trim()) {
      const q = initialDraft.trim();
      onDraftConsumed?.();
      setTimeout(() => send(q), 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialDraft]);

  const quick = [
    "Quanto costa un impianto?",
    "La prima visita è gratuita?",
    "Ortodonzia invisibile per adulti",
    "Come prenoto una visita?",
  ];

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || pending) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            data.reply?.trim() ||
            "Mi scuso, c’è stato un problema tecnico. Per prenotare chiama lo 0884 000 000 o scrivi a studio@barbato.dental.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            "Mi scuso, c’è stato un problema tecnico. Per prenotare chiama lo 0884 000 000 o scrivi a studio@barbato.dental.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
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
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="liquid-glass-strong overflow-hidden flex flex-col chat-panel"
            style={{
              position: "fixed",
              zIndex: 65,
              right: 16,
              bottom: "calc(env(safe-area-inset-bottom, 0px) + 100px)",
              width: "min(400px, calc(100vw - 32px))",
              height: "min(600px, calc(100svh - 120px))",
              borderRadius: 24,
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
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
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
                className="text-foreground/60 hover:text-foreground"
                aria-label="Chiudi"
              >
                <Icon.X size={18} />
              </button>
            </div>

            <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "bg-primary text-[#0A2E36] rounded-2xl rounded-br-md max-w-[85%] font-body"
                        : "liquid-glass rounded-2xl rounded-bl-md max-w-[85%] font-body text-foreground"
                    }
                    style={{ padding: "10px 14px", fontSize: "0.875rem", lineHeight: 1.55 }}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {pending && (
                <div className="flex justify-start">
                  <div className="liquid-glass rounded-2xl rounded-bl-md px-3.5 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="block w-1.5 h-1.5 rounded-full bg-primary"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
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
              <div className="flex-1 liquid-glass rounded-full px-4 py-2.5 flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Scrivi la tua domanda…"
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
