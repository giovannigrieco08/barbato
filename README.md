# Studio Dentistico Fabio Barbato — Next.js 15 production

Sito production-premium dello Studio Dentistico Fabio Barbato (Manfredonia · Apulia).
Migrazione del prototipo Babel-in-browser ([../barbato2](../barbato2)) a Next.js 15 con
ottimizzazioni production complete: font locali, video multi-source, immagini AVIF/WebP
con next/image, scroll smoothing Lenis, code-splitting GSAP, structured data, security headers.

## Stack

- **Next.js 15** (App Router · Turbopack · TypeScript)
- **Tailwind CSS v4** (`@theme` directive)
- **Framer Motion** 11 — reveal + magnetic + chat animations
- **GSAP 3 + ScrollTrigger** — pin choreography (Manifesto, GalleriaStudio, DrBarbato)
- **Lenis** 1.x — smooth scroll dynamic-imported per desktop hover-pointer (skip iOS)

## Comandi

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve production
npm run lint      # eslint check
```

## Deploy

Pronto per Vercel:
```bash
vercel deploy
```

In alternativa, qualsiasi host Node 18+ supporta `npm run build && npm run start`.

## Struttura

```
src/
├── app/
│   ├── globals.css          stili globali (liquid-glass, splash, reveal-word, ecc.)
│   ├── layout.tsx           metadata SEO, fonts, providers, structured data
│   ├── page.tsx             homepage (assembla sezioni)
│   ├── sitemap.ts           sitemap dinamica
│   └── robots.ts            robots.txt
├── components/
│   ├── ui.tsx               primitives: BlurText, MagneticButton, Icon, ecc.
│   ├── reveals.tsx          reveal primitives (RevealLines, RevealText, ecc.)
│   ├── StructuredData.tsx   schema.org Dentist
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx   Lenis dynamic
│   └── (sezioni)            Manifesto, Treatments, ... (vedi NOTES.md per stato)
public/
├── images/
├── videos/
└── fonts/
```

## Stato della migrazione

Vedi [NOTES.md](./NOTES.md) per lo stato dettagliato del porting di ogni componente
e per i passi rimanenti (font woff2, video multi-source, next/image migration).

## Performance target (post-migrazione completa)

- Lighthouse: Performance ≥95, Accessibility 100, Best Practices 100, SEO 100
- First Load JS: < 200KB
- LCP: < 1.8s
- CLS: < 0.05

## Branding

- **Palette**: `--background: #0A2E36` (ink), `--foreground: #F4F1EA` (bone), `--primary: #8FC8C4` (mint)
- **Font**: Instrument Serif (display, italic), Barlow (body), FunCity (wordmark)
- Studio Dentistico Fabio Barbato · Via del Porto, 14 · 71043 Manfredonia (FG)
