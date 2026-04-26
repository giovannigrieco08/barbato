import { NextResponse } from "next/server";

/**
 * Chat API stub. Wire up to Anthropic SDK or any LLM provider via
 * env var ANTHROPIC_API_KEY. Falls back to a polite "service unavailable"
 * if no key is set so the UI still degrades gracefully.
 */
export async function POST(req: Request) {
  try {
    const { question } = (await req.json()) as { question?: string };
    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Empty question" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Per prenotare la tua visita, chiama lo 0884 000 000 o scrivi a studio@barbato.dental. Saremo felici di aiutarti.",
      });
    }

    const sys =
      "Sei Smile, l'assistente virtuale dello Studio Dentistico Fabio Barbato a Manfredonia, Apulia. Rispondi sempre in italiano, in modo caldo e professionale, in 2-4 frasi brevi. Lo studio offre: implantologia (carico immediato, chirurgia guidata 3D), ortodonzia invisibile, estetica (faccette, sbiancamento), conservativa ed endodonzia al microscopio, igiene e prevenzione. La prima visita è gratuita e include TAC cone beam. Quando opportuno, invita a prenotare scrivendo 'Posso proporti alcune date.' Non inventare prezzi precisi; dai sempre range indicativi.";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: sys,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({
        reply:
          "Mi scuso, c'è stato un problema tecnico. Per prenotare chiama lo 0884 000 000 o scrivi a studio@barbato.dental.",
      });
    }

    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const reply = data.content?.[0]?.text?.trim() ?? "";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({
      reply:
        "Mi scuso, c'è stato un problema tecnico. Per prenotare chiama lo 0884 000 000 o scrivi a studio@barbato.dental.",
    });
  }
}
