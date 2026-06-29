import { NextResponse } from "next/server";
import { studio, bookingFallback, bookingFallbackError } from "@/config/studio";

/**
 * Chat API per lo Smile Assistant.
 * Provider in ordine di priorità:
 *   1) Anthropic (Claude) se ANTHROPIC_API_KEY è impostata → produzione.
 *   2) Groq (gratuito, modelli Llama) se GROQ_API_KEY è impostata → test gratis.
 *   3) Nessuna chiave → messaggio di fallback, così la UI degrada con grazia.
 */
const SYS_PROMPT =
  `Sei Smile, l'assistente virtuale dello ${studio.legalName} a ${studio.address.locality}, ${studio.address.region}. Rispondi sempre in italiano, in modo caldo e professionale, in 2-4 frasi brevi. Lo studio offre: implantologia (carico immediato, chirurgia guidata 3D), ortodonzia invisibile, estetica (faccette, sbiancamento), conservativa ed endodonzia al microscopio, igiene e prevenzione. La prima visita è gratuita e include TAC cone beam. Quando opportuno, invita a prenotare scrivendo 'Posso proporti alcune date.' Non inventare prezzi precisi; dai sempre range indicativi.`;

export async function POST(req: Request) {
  try {
    const { question } = (await req.json()) as { question?: string };
    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Empty question" }, { status: 400 });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // —— 1) Anthropic (Claude) ——
    if (anthropicKey) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 400,
          system: SYS_PROMPT,
          messages: [{ role: "user", content: question }],
        }),
      });
      if (!res.ok) return NextResponse.json({ reply: bookingFallbackError });
      const data = (await res.json()) as { content?: Array<{ text?: string }> };
      return NextResponse.json({ reply: data.content?.[0]?.text?.trim() ?? "" });
    }

    // —— 2) Groq (gratuito, per test) — API compatibile OpenAI ——
    if (groqKey) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          authorization: `Bearer ${groqKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 400,
          messages: [
            { role: "system", content: SYS_PROMPT },
            { role: "user", content: question },
          ],
        }),
      });
      if (!res.ok) return NextResponse.json({ reply: bookingFallbackError });
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      return NextResponse.json({
        reply: data.choices?.[0]?.message?.content?.trim() ?? "",
      });
    }

    // —— 3) Nessuna chiave ——
    return NextResponse.json({ reply: bookingFallback });
  } catch {
    return NextResponse.json({ reply: bookingFallbackError });
  }
}
