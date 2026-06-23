---
target: src/components (one-page brand site)
total_score: 30
p0_count: 0
p1_count: 3
timestamp: 2026-06-23T13-29-32Z
slug: src-components
---
# Critique — Studio Barbato (src/components, one-page brand site)

Register: **brand** (design IS the product). State evaluated: post-review fixes (PR #1).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Chat typing/online/pending good; SmileAssistant mockup "submit" gives no in-place feedback (just opens panel) |
| 2 | Match System / Real World | 3 | Italian + explained dental terms; "Based in:" English label on an IT site |
| 3 | User Control and Freedom | 2 | Lenis scroll-jacking + long pinned sequences (Manifesto +280%, Gallery +380%, DrBarbato +240%) hold the page; no quick way past |
| 4 | Consistency and Standards | 3 | Tokenized glass + unified easing; inline hex everywhere instead of tokens, two glass naming aliases |
| 5 | Error Prevention | 3 | Chat has graceful API fallback; low-stakes forms; no destructive actions |
| 6 | Recognition Rather Than Recall | 3 | Visible nav/FAQ/quick-replies; custom cursor hides native pointer affordance |
| 7 | Flexibility and Efficiency | 3 | Quick-reply chips help; no keyboard shortcuts; scroll-jacking slows fast scanning (acceptable for brand) |
| 8 | Aesthetic and Minimalist Design | 3 | Strong aesthetic, but overstimulated: custom cursor + splash + multiple infinite loops + glass everywhere |
| 9 | Error Recovery | 3 | Chat fallback names phone/email; little else to recover |
| 10 | Help and Documentation | 4 | The site IS help: FAQ + contextual chat assistant + contacts |
| **Total** | | **30/40** | **Good — solid foundation, specific weak areas** |

## Anti-Patterns Verdict

**LLM assessment:** Not generic-AI on first glance — the teal drench, the video-shrink hero, the horizontal-pinned gallery and the photo-scale doctor reveal are committed, crafted moves. The real distinctiveness risk is **second-order**: Instrument Serif italic + small mono uppercase caption labels + ruled separators + monochromatic restraint is *exactly* the saturated "editorial-typographic" brand lane named in the brand register. The bones are bespoke; the typographic surface sits in the most crowded 2026 lane.

**Deterministic scan (detect.mjs):** 9 findings, all `warning`.
- 7× `overused-font` "Instrument Serif". True that it's saturated — but it's the **already-shipped brand identity**, so identity-preservation applies; not a fix, a flag.
- 2× `layout-transition`: `.menu-row` animates `padding-left` on hover (globals.css:276); CustomCursor animates `width/height` (CustomCursor.tsx:98). Both should be `transform`.

**Visual overlays:** none — no browser automation in this session; no user-visible overlay produced.

## Overall Impression
A genuinely well-built brand site whose craft is undercut by **too much happening at once** and by **scroll control taken away from the user**. The single biggest opportunity: dial the energy down 20% (cursor, splash, infinite loops, pin lengths) so the precision the copy promises is *felt*, not fought. The clinic's core promise is calm, trustworthy precision; the motion budget currently argues with that.

## What's Working
1. **The video-shrink hero** (clip-path window via CSS vars) is a real signature moment, not a template.
2. **The doctor reveal** (photo scale + scrubbed word-reveal via CSS `calc()`, 1 write/frame) is efficient and distinctive.
3. **The glass system is tokenized** — one material, two variants, an elevation. Cohesive rather than decorative-random.

## Priority Issues

- **[P1] Scroll control is taken from the user.** Lenis smoothing plus three long pinned sequences mean the visitor can't quickly scan or skip; on a trust-first medical site this reads as "fighting the page."
  - **Why:** Control/Freedom is the lowest heuristic; motion-sensitive and hurried users bail.
  - **Fix:** Shorten pin distances (e.g. Gallery 380→~260%, Manifesto 280→~200%), and/or let fast scroll break the pin sooner.
  - **Command:** `$impeccable quieter`

- **[P1] Overstimulation stack.** Custom difference-blend cursor + splash + several infinite loops + glass-on-everything compete simultaneously.
  - **Why:** Aesthetic/Minimalist and emotional fit suffer; a clinic should feel calm and exact.
  - **Fix:** Reconsider the custom cursor on a medical site; reduce concurrent infinite loops; reserve glass for truly floating surfaces.
  - **Command:** `$impeccable quieter`

- **[P1] The studio gallery has no real imagery.** "L'ambiente" ships duotone placeholders (improved from stripes, but still placeholders).
  - **Why:** Brand register: an image-led section with colored panels is a bug, not restraint. This is the section meant to build physical trust in the space.
  - **Fix:** Ship real studio photography (`<Image fill>` drop-in is ready).
  - **Command:** n/a — needs assets.

- **[P2] Layout-property animations.** `.menu-row` `padding-left` and cursor `width/height` cause layout work mid-interaction.
  - **Why:** Jank on lower-end devices; both are trivially transform-able.
  - **Fix:** `transform: translateX` for the menu row; `transform: scale` for the cursor.
  - **Command:** `$impeccable polish`

- **[P2] Typographic lane is the saturated one.** Display-serif-italic + mono caption labels + rules is the modal 2026 brand surface.
  - **Why:** Distinctiveness; the structure is bespoke but the type reads "seen it."
  - **Fix:** Keep Instrument Serif (it's identity) but break the lane elsewhere — retire mono uppercase caption labels, vary the kicker cadence further, lean on one strong voice element.
  - **Command:** `$impeccable typeset`

## Persona Red Flags

**Jordan (first-timer):** Splash delays first content; once in, the page "holds" on pinned sections — Jordan may think it's broken ("why won't it scroll?"). Custom cursor is unfamiliar and the native pointer is gone.

**Casey (distracted mobile):** Two hero videos to fund on cellular; long pinned sequences translate to a lot of thumb-scrolling per idea. Chat FAB is correctly in the thumb zone; splash now skips on return — good.

**Sam (a11y-dependent):** `prefers-reduced-motion` is respected and focus states exist; menu/chat are now Esc-dismissible. But the custom cursor removes the native pointer, and scroll-jacking can disorient screen-magnifier users.

**"Lucia" (anxious prospective patient, project persona):** Wants reassurance, clear cost/▶time, easy booking. Served well by free-first-visit copy, FAQ, and chat — but the playful, heavy motion can read as "agency showreel" rather than "careful clinician," softening clinical trust at the exact moment she's deciding.

## Minor Observations
- "Based in:" English label on an Italian site.
- Inline hex (`#0A2E36`/`#F4F1EA`/`#8FC8C4`) repeated across components instead of tokens — maintenance smell.
- Two glass naming systems (`.glass*` / `.liquid-glass*` aliases) — migration leftover.
- `NOTES.md` still lists removed components (CardSwap, DentalArchVideoPlaceholder).

## Questions to Consider
- What would the *calm, exact* version of this motion budget look like — same signatures, 20% less noise?
- Does a medical practice gain or lose trust from a custom cursor?
- If the gallery can't get real photos soon, should it become a typographic/contact section instead of holding space for images?
