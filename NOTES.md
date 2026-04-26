# Migrazione Studio Barbato → Next.js 15 — Stato finale

## ✅ MIGRAZIONE COMPLETA — porting tutti i 13 componenti

Tutti i 13 componenti del prototipo sono portati 1:1 in TypeScript, con tutti i valori di animazione (durate, easing, scrub, pin, start, end) preservati identici al sorgente.

`npm run build` ✅ verde — output static prerender + 1 route dinamica `/api/chat`.

### Componenti portati

| # | Componente | File | Source | Note |
|---|---|---|---|---|
| 1 | Splash | `src/components/Splash.tsx` | `splash.jsx` | CSS-driven, sessionStorage, click-to-skip |
| 2 | StickyOverlapController | `src/components/StickyOverlapController.tsx` | `sticky-overlap.jsx` | z-index ascendente + marginTop:-100vh chain |
| 3 | CustomCursor | `src/components/CustomCursor.tsx` | `chat.jsx` | RAF idle pause, dot+ring |
| 4 | FloatingChat | `src/components/FloatingChat.tsx` + `src/app/api/chat/route.ts` | `chat.jsx` | Modal panel + Anthropic API stub |
| 5 | CtaFooter | `src/components/CtaFooter.tsx` | `sections3.jsx` | CTA + footer 4-col → 1-col mobile |
| 6 | Navbar | `src/components/Navbar.tsx` | `sections.jsx` | Tone detection scroll-driven, hamburger fullscreen animato |
| 7 | CardSwap | `src/components/CardSwap.tsx` | `cardswap.jsx` | GSAP timeline elastic + auto-swap |
| 8 | Treatments | `src/components/Treatments.tsx` | `sections.jsx` | CardSwap desktop + carosello scroll-snap mobile |
| 9 | SmileAssistant | `src/components/SmileAssistant.tsx` | `sections2.jsx` | Chat mockup auto-typing + sticky/min-h |
| 10 | Manifesto | `src/components/Manifesto.tsx` | `manifesto.jsx` | **Pin GSAP +280%/+180% mobile** con video shrink, marquee, pattern |
| 11 | GalleriaStudio (+Mobile) | `src/components/GalleriaStudio.tsx` | `galleria-studio.jsx` | **Horizontal pin 380% desktop, vertical asymmetric mobile con bg crossfade ink↔bone** |
| 12 | DrBarbato | `src/components/DrBarbato.tsx` | `sections3.jsx` | **Pin multi-stage 240%/200% con photo translate+scale, word-reveal CSS-calc, FAQ accordion, mobile fullscreen** |
| 13 | HomePageClient | `src/components/HomePageClient.tsx` | `app.jsx` | Chat state holder + assemblaggio sezioni |

### Foundation production-ready

- `src/app/globals.css` — palette + font-face + liquid-glass + splash + reveal-word + tutti gli stili del prototipo
- `src/app/layout.tsx` — metadata SEO completi (Open Graph, Twitter, robots, icons, viewport, lang="it"), structured data Dentist via `src/components/StructuredData.tsx`, skip-link a11y, font preconnect Google
- `next.config.ts` — Cache headers immutable per `/videos /images /fonts /_next/static`, security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy), AVIF/WebP formats, deviceSizes/imageSizes per `next/image`
- `src/app/sitemap.ts` + `src/app/robots.ts`
- `src/components/providers/SmoothScrollProvider.tsx` — Lenis dynamic-imported con bridge GSAP ticker, skip iOS+reduced-motion+touch
- `src/components/ui.tsx` — primitives portati (BlurText, FadeUp, MagneticButton, MonoMark, Icon×10, EditorialPlaceholder, DentalArchVideoPlaceholder)
- `src/components/reveals.tsx` — RevealLines+tokenize, RevealText, RevealParagraph, RevealRule, ParallaxImage

### Componenti con dynamic GSAP import (Phase 11+12)

I componenti con animazioni pin (Manifesto, GalleriaStudio, DrBarbato) caricano `gsap` e `gsap/ScrollTrigger` via `await import()` dentro `useEffect`. Questo:
- Tiene GSAP fuori dal **First Load JS** (~80KB risparmiati)
- Applica `gsap.config({ force3D: true, nullTargetWarn: false })` e `ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })` (Phase 12)
- Cleanup tramite `tl.kill()` + `ScrollTrigger.kill()` su unmount

CardSwap e SmoothScrollProvider seguono lo stesso pattern.

### API route Anthropic — `src/app/api/chat/route.ts`

Endpoint POST `/api/chat` che riceve `{question}` e ritorna `{reply}`. Usa `ANTHROPIC_API_KEY` dall'env (Anthropic Messages API, model `claude-haiku-4-5-20251001`). Senza chiave restituisce un fallback educato con info contatto. Nessuna chiave hardcoded — set in `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

---

## ⚠️ Aree NON applicate (per scelta o vincolo)

### Phase 8 — `next/font/local` ✅ APPLICATO
**Stato**: completato. WOFF2 generati via `ttf2woff2` da TTF/OTF originali:
- `src/app/fonts/FunCity.woff2` (31KB → 8.8KB, **-72%**)
- `src/app/fonts/EuropaGrotesk-Bold.woff2` (25KB → 16.8KB, **-35%**)

Caricati via `next/font/local` in [src/app/layout.tsx](src/app/layout.tsx) con `display: swap` e CSS variables `--font-funcity` / `--font-europa`. Rimossi `@font-face` da [globals.css](src/app/globals.css) e tutte le occorrenze inline `'FunCity'` sostituite con `var(--font-funcity)` in `Navbar.tsx` e `CtaFooter.tsx`.

Per Instrument Serif e Barlow: rimangono via Google Fonts CDN con `<link rel="preconnect">`. Conversione a `next/font/google` possibile come step ulteriore (rinunceresti a CDN cache HTTP per ottenere preload + zero CLS via fontFallback).

**Per applicare**:
1. Convertire `public/fonts/FunCityLevel1Basic.ttf` e `europa-grotesk-sh-bold.otf` in WOFF2 (tool: `npm i -g @vercel/woff2-tools` o `pyftsubset` o https://everythingfonts.com/ttf-to-woff2).
2. Spostare i WOFF2 in `src/app/fonts/`.
3. Aggiungere a `layout.tsx`:
   ```tsx
   import localFont from 'next/font/local';
   const funcity = localFont({ src: './fonts/FunCity.woff2', variable: '--font-funcity', display: 'swap' });
   ```
4. Applicare `${funcity.variable}` al `<html>` className.
5. Sostituire `font-family: 'FunCity'` in globals.css con `font-family: var(--font-funcity)`.

### Phase 9 — Video multi-source desktop/mobile/poster ✅ APPLICATO
**Stato**: completato. Generati con ffmpeg:
- `public/videos/hero-desktop.mp4` (1920p H.264 CRF 28, **1.7MB** vs 3.4MB originale, **-47%**)
- `public/videos/hero-mobile.mp4` (1280p CRF 30, **730KB**, **-78%**)
- `public/videos/hero-poster.jpg` (frame 0, 41KB, fast first paint)

Aggiornato [src/components/Manifesto.tsx](src/components/Manifesto.tsx) con `<source media="(max-width: 767px)">` e poster.

**Per applicare** (ffmpeg disponibile localmente):
```bash
cd c:/Users/grigi/Desktop/barbato-prod
ffmpeg -i public/videos/hero-enhanced.mp4 -vcodec libx264 -crf 28 -preset slow -vf scale=1920:-2 -an -movflags +faststart public/videos/hero-desktop.mp4
ffmpeg -i public/videos/hero-enhanced.mp4 -vcodec libx264 -crf 30 -preset slow -vf scale=1280:-2 -an -movflags +faststart public/videos/hero-mobile.mp4
ffmpeg -i public/videos/hero-enhanced.mp4 -ss 00:00:00 -vframes 1 -q:v 2 public/videos/hero-poster.jpg
```

Poi in `Manifesto.tsx` sostituisci il `<video>` con:
```tsx
<video poster="/videos/hero-poster.jpg" preload="metadata" muted loop autoPlay playsInline>
  <source src="/videos/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)"/>
  <source src="/videos/hero-desktop.mp4" type="video/mp4"/>
</video>
```

### Phase 10 — `<img>` → `<Image/>` di next/image ✅ PARZIALE (alto impatto)
**Stato**: foto Dr. Barbato (PNG ~300KB) migrata a `<Image/>` con `fill`, `priority`, `sizes` responsive su [DrBarbato.tsx](src/components/DrBarbato.tsx) sia nel desktop che nel mobile fullscreen. Next.js servirà AVIF/WebP automaticamente con `deviceSizes` ottimali.

**SVG logos** (logo-ring.svg in MonoMark, Navbar, FloatingChat) **rimangono `<img>`** — gli SVG bypassano l'ottimizzazione di next/image (sono già ottimi così), e `<img>` evita il rischio di rotture su filtri dinamici (es. `invert(1) brightness(0.4)` quando navbar è su sfondo chiaro).

**Config già pronta** in `next.config.ts` (formats AVIF/WebP, deviceSizes, imageSizes, minimumCacheTTL 30 giorni).

### Phase 14 — Lighthouse run
**Richiede**: browser locale. Avvia `npm run start` poi DevTools → Lighthouse → Mobile/Desktop.
**Target**: Performance ≥95, Accessibility 100, Best Practices 100, SEO 100.

---

## Domain placeholder

`https://studiobarbato.it` è usato come placeholder in:
- `src/app/layout.tsx` (`metadataBase`, OG URL, canonical)
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/components/StructuredData.tsx` (`@id`, `url`, `image`)

**Sostituire** con il dominio reale dello studio quando disponibile.

---

## OG image placeholder

`/images/dr-fabio-barbato.png` è usato come fallback OG image. **Sostituire** con grafica dedicata 1200×630px in `/public/og-image.jpg` e aggiornare `layout.tsx` + `StructuredData.tsx`.

---

## Comandi

```bash
# Sviluppo
cd c:/Users/grigi/Desktop/barbato-prod
npm run dev    # http://localhost:3000

# Production build
npm run build
npm run start  # http://localhost:3000 production-mode

# Deploy Vercel
vercel deploy
# Aggiungi env var ANTHROPIC_API_KEY su Vercel Project Settings
```

## Checklist pre-deploy

- [x] Tutti i 13 componenti portati e wired in HomePageClient
- [x] Build production verde, no TS errors
- [x] Asset trasferiti (images, videos, fonts)
- [x] Metadata SEO completi
- [x] Structured data schema.org Dentist
- [x] Cache headers production
- [x] Lenis dynamic-imported (skip iOS)
- [x] GSAP dynamic-imported nei pin sections
- [x] gsap.config + ScrollTrigger.config applicati
- [ ] Conversione font TTF/OTF → WOFF2 + setup `next/font/local` (Phase 8)
- [ ] Generazione video desktop/mobile/poster con ffmpeg (Phase 9)
- [ ] Migrazione `<img>` → `<Image/>` (Phase 10)
- [ ] Lighthouse run locale (Phase 14)
- [ ] Sostituzione URL `studiobarbato.it` con dominio reale
- [ ] OG image dedicata 1200×630
- [ ] `ANTHROPIC_API_KEY` su Vercel/host production
- [ ] Smoke test visivo side-by-side col prototipo a 320/375/768/1024/1440/1920px

## Note di rollback applicati

Nessun rollback applicato durante il porting. Tutti i 13 componenti compilano TS clean e mantengono i valori di animazione originali del prototipo.
