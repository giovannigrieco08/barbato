"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FadeUp, Icon, MonoMark, EASE } from "@/components/ui";
import { RevealLines, RevealParagraph } from "@/components/reveals";

type ChatMsg = { role: "bot" | "user"; text: string };

const DEMO_CONVO: ChatMsg[] = [
  {
    role: "bot",
    text: "Ciao! Sono Smile, l’assistente dello Studio Barbato. Come posso aiutarti oggi?",
  },
  { role: "user", text: "Vorrei informazioni sugli impianti dentali." },
  {
    role: "bot",
    text: "Certo. Il Dr. Barbato esegue impianti a carico immediato con chirurgia guidata 3D. Il primo passo è una visita gratuita con TAC cone beam. Vuoi che ti proponga alcune date?",
  },
  { role: "user", text: "Sì, la settimana prossima se possibile." },
];

function TypingDots() {
  return (
    <div className="flex gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-2 h-2 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ChatMockup({ onOpenChat }: { onOpenChat?: (q?: string) => void }) {
  const [visible, setVisible] = useState(0);
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const tick = () => {
      i++;
      if (i <= DEMO_CONVO.length + 1) {
        setVisible(i);
        setTimeout(tick, 700);
      }
    };
    setTimeout(tick, 200);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="liquid-glass rounded-3xl p-5 sm:p-6 relative chat-mockup"
      style={{ minHeight: "min(70svh, 580px)" }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
    >
      <div className="flex items-center justify-between pb-4 border-b border-foreground/10">
        <div className="flex items-center gap-3">
          <MonoMark size={28} />
          <div>
            <div
              className="font-heading italic text-foreground"
              style={{ fontSize: "1.25rem", lineHeight: 1, letterSpacing: "-0.01em" }}
            >
              Smile Assistant
            </div>
            <div
              className="font-body uppercase text-foreground/50 mt-1"
              style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 500 }}
            >
              STUDIO BARBATO · AI
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span
            className="font-body uppercase text-foreground/60"
            style={{ fontSize: "10px", letterSpacing: "0.22em", fontWeight: 500 }}
          >
            ONLINE
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 py-5 min-h-[380px]">
        {DEMO_CONVO.slice(0, visible).map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={
                m.role === "user"
                  ? "bg-primary text-[#0A2E36] rounded-2xl rounded-br-md max-w-[78%] font-body"
                  : "liquid-glass rounded-2xl rounded-bl-md max-w-[82%] font-body text-foreground"
              }
              style={{ padding: "12px 16px", fontSize: "0.875rem", lineHeight: 1.55 }}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
        {visible >= DEMO_CONVO.length && visible < DEMO_CONVO.length + 1 && (
          <div className="flex justify-start">
            <div className="liquid-glass rounded-2xl rounded-bl-md p-4">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      <form
        className="pt-4 border-t border-foreground/10 flex items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const q = draft.trim();
          if (!q) {
            onOpenChat?.();
            return;
          }
          onOpenChat?.(q);
          setDraft("");
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Scrivi la tua domanda…"
          className="flex-1 liquid-glass rounded-full px-4 py-3 font-body text-sm text-foreground placeholder:text-foreground/45 bg-transparent outline-none focus:ring-2 focus:ring-primary/40"
          data-cursor="hover"
        />
        <button
          type="submit"
          className="w-11 h-11 rounded-full flex items-center justify-center text-[#0A2E36] shrink-0 transition-transform hover:scale-105 active:scale-95"
          style={{ background: "#8FC8C4" }}
          aria-label="Invia"
          data-cursor="hover"
        >
          <Icon.ArrowUp size={16} />
        </button>
      </form>
    </motion.div>
  );
}

export default function SmileAssistant({
  onOpenChat,
}: {
  onOpenChat?: (q?: string) => void;
}) {
  return (
    <section
      id="assistant"
      className="relative"
      style={{ zIndex: 4, background: "#0A2E36", minHeight: "100svh" }}
    >
      <div
        className="lg:sticky lg:top-0 overflow-hidden flex items-center px-6 lg:px-12"
        style={{
          minHeight: "100svh",
          background: "#0A2E36",
          paddingTop: "10vh",
          paddingBottom: "8vh",
        }}
      >
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-[45%_1fr] gap-[6vw] items-center">
          <div>
            <div className="inline-flex liquid-glass-gold rounded-full px-4 py-1.5 items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span
                className="font-body text-[11px] tracking-[0.22em] uppercase text-foreground/85"
                style={{ fontWeight: 500 }}
              >
                SMILE ASSISTANT · DISPONIBILE 24/7
              </span>
            </div>
            <h2
              className="mt-7 font-heading italic text-foreground"
              style={{
                fontSize: "clamp(2.25rem, 6.5vw, 4rem)",
                lineHeight: 0.96,
                letterSpacing: "-0.025em",
              }}
            >
              <RevealLines
                as="span"
                text="Hai una domanda sul tuo sorriso?"
                stagger={0.06}
                duration={0.9}
              />
              <br />
              <RevealLines
                as="span"
                text="Chiedila ora."
                stagger={0.06}
                duration={0.9}
                delay={0.25}
              />
            </h2>
            <div className="hidden lg:block">
              <RevealParagraph
                className="mt-8 font-body text-foreground/70"
                style={{
                  fontSize: "clamp(1.05rem, 1.2vw, 1.125rem)",
                  lineHeight: 1.6,
                  maxWidth: "56ch",
                }}
                delay={0.4}
              >
                Smile Assistant è il nostro assistente virtuale. Risponde a domande sui
                trattamenti, aiuta a scegliere il percorso più adatto e organizza la prima
                visita con il Dr. Barbato. Nessuna iscrizione, nessun numero di telefono
                richiesto.
              </RevealParagraph>
              <FadeUp delay={0.55}>
                <ul className="mt-8 space-y-4" style={{ maxWidth: "52ch" }}>
                  {[
                    "Chiarisce costi e tempi indicativi dei trattamenti",
                    "Suggerisce quale specializzazione fa per te",
                    "Fissa un appuntamento con conferma via email",
                    "Risponde in italiano, inglese e tedesco",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-3 font-body text-foreground/85"
                      style={{ fontSize: "0.9375rem", lineHeight: 1.55 }}
                    >
                      <Icon.Check
                        size={20}
                        className="text-primary shrink-0"
                        style={{ marginTop: "2px" }}
                      />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </FadeUp>
            </div>
          </div>

          <ChatMockup onOpenChat={onOpenChat} />
        </div>
      </div>
    </section>
  );
}
