# Build brief — Ovalis

You are the design lead and sole engineer on this. Build a complete, running marketing site for a fictional luxury speaker brand called **Ovalis**. The hero product is the **Luma-One**: a fabric-wrapped, flattened-ellipsoid speaker that sits tilted on a turned pedestal foot, like a piece of furniture rather than a gadget.

Nothing here is a real product. Do not write spec-sheet marketing copy about audio quality. The site is judged entirely on how it looks, how it moves, and how good it feels to click around in. Aim for the restraint of a gallery site, not the density of an e-commerce store.

---

## 1. Hard constraints

Read these first. They determine the whole architecture.

- **No 3D. No Three.js, no WebGL, no React Three Fiber.** The product is presented entirely through pre-rendered transparent PNG/WebP images. Do not add a 3D library for any reason.
- **Exactly one real render exists right now:** `/public/herospeaker.webp`, used on the landing page. It is a transparent-background studio shot of the speaker facing right with the pedestal sweeping left. It **must** keep its alpha channel — it sits on a navy field, so any format without transparency (JPEG) would render as a white box. If you find it with a `.jpg` extension, stop and say so rather than building around it.
- **All eighteen other finishes are placeholders for now.** They will be dropped in later at `/public/colorways/<collection>-<finish>.webp` (e.g. `flores-sunshine.webp`). Until then the site must look finished and intentional — see "The placeholder" below. Do not special-case the navy image: route it through the same component as everything else, so the others become real by adding files and changing no code.
- Everything else visual is SVG or CSS. Do not reference external image URLs, and never leave a broken-image icon anywhere.
- **Stack:** Vite + React + TypeScript. GSAP with ScrollTrigger for scroll choreography. Lenis for smooth scroll. Tailwind for layout. React Router for pages. Nothing else.
- **Performance floor:** 60fps on any laptop. Animate only `transform` and `opacity`. Serve WebP, lazy-load below the fold, and keep the hero image under 300 KB.
- **Accessibility floor:** visible keyboard focus everywhere, `prefers-reduced-motion` honored (motion becomes instant state changes, never disappears), all interactive elements reachable by tab, alt text or aria-labels on every meaningful visual.

---

## 2. Color system

Use CSS custom properties. These are the whole palette; do not introduce new hues.

**Surfaces**
- `--bone: #E2DACA` — the dominant page surface. Warm, paper-like. Most of the site is this.
- `--porcelain: #F9F6F0` — rare. Used as a *lift*: raised cards, one floating panel. Not a background.

**Neutrals**
- `--ink: #161A1F` — headlines and body copy
- `--graphite: #5C5A56` — secondary text, captions
- `--smoke: #5D6063` — cool alternative to graphite; use for the footer's concrete feel
- `--slate: #7A7873` — rules, icons, mono labels. Never body text.
- Dividers: `rgba(22, 26, 31, 0.12)`. Never a separate hex.

**Navy** — the brand color, and the only saturated color that can also be a typeface
- `--navy: #0A3D6B`
- `--navy-deep: #06304F`

**Accents**
- `--sage: #8C9B7E` / `--sage-deep: #5A6B4C` — dry, earthy. For use on bone surfaces.
- `--mint: #A8CFA0` — display type on navy only. Brighter than sage; the two never appear together.
- `--clay: #C4613A` / `--clay-deep: #8E4123` / `--clay-pale: #F3DED2`
- `--amber-glass: rgba(242, 226, 199, 0.62)` — the navbar's translucent fill, over `backdrop-filter: blur(20px) saturate(140%)`

**Ratio discipline.** Roughly 75% bone and porcelain, 15% ink and graphite, 8% navy, 2% everything else. Clay should appear no more than three or four times on the entire site: an active-state marker, one pull-quote rule, an availability dot. Clay is never a section background.

**Contrast rules that must not be broken:**
- Sage and clay at full strength cannot hold small text on bone. They are fills only.
- When text sits on a tinted surface, use the `-deep` stop of that same family, never ink.
- Sage-deep and clay-deep both clear 5:1 directly on bone and may be used as text colors.

---

## 3. Typography

- **Display:** Fraunces (variable). Set `font-variation-settings: "SOFT" 100, "WONK" 1` for the soft, slightly irregular character. Italic for emotional lines.
- **Body:** Geist, weight 300–400.
- **Technical:** Geist Mono for spec labels, colorway codes, and the exploded-view annotations.

Load from Google Fonts. Body copy at 16–17px with generous line height, measure under 68 characters. Let the serif carry all the emphasis; the sans stays quiet.

Do not use all-caps labels above headings, do not accent a single word in a headline in a different color, do not append arrows to link text. The wordmark `OVALIS` is the one exception: set it letterspaced at roughly 0.42em in Fraunces.

---

## 4. The opening sequence

This is the most important thing on the site. Build it precisely.

**Phase 1 — Load (0 to ~1.2s).** Bone background. `OVALIS` fades up centered, letterspaced. A single hairline rule beneath it grows from zero width to full as loading progresses. It is a real progress indicator tied to asset and font readiness, not a fake timer.

**Phase 2 — Clear (~0.4s).** Wordmark and rule fade out quickly.

**Phase 3 — Navy fill (~0.9s).** Navy sweeps up from the bottom to fill the viewport. **Asymmetric:** the leading edge is not level. Use a curved or angled mask that rises faster on one side, easing out as it completes. This asymmetry is the signature moment; a flat wipe kills it.

**Phase 4 — Invitation.** A scroll indicator appears on the navy field. Arrow bounces slowly and smoothly, long easing, nothing jittery. It fades out the moment the user begins scrolling.

**Phase 5 — Scroll-driven hero.** Scrubbed to scroll position, reversible in both directions. Use `<ProductShot colorway="foundations-navy" src="/herospeaker.webp" />` — the one real render — positioned and driven purely by CSS transforms — translate, scale, rotate — with GSAP scrubbing them against scroll.
- The Luma-One enters oversized from the bottom-right, cropped by the viewport edge, then scales down and settles to sit over the type.
- `New-Age` / `Noise` set in Fraunces italic, mint on navy, two lines, large. The letterforms resolve from a distorted state into clean type as scroll advances — start with heavy horizontal displacement or a clip-path reveal that reads as the letters assembling. The storyboard shows them mid-resolve; match that feel.
- Speaker and type share the scroll timeline but move at different rates.

**Phase 6 — Handoff.** The navy panel releases and the bone home page arrives beneath it. The navy section stays reachable by scrolling back up, but with *resistance*: require a deliberate sustained upward gesture rather than a flick, and never trap the user. If they scroll up hard twice, let them through. Disable resistance entirely under `prefers-reduced-motion`.

---

## 5. Presenting the speaker

### The placeholder

Build one component, `<ProductShot colorway={...} />`, used for every appearance of the product anywhere on the site — the landing page included. It resolves a source in this order: an explicit `src` prop, then `/colorways/<collection>-<finish>.webp`, then the drawn placeholder.

Today only the landing page passes an explicit src (`/herospeaker.webp`, the Midnight Navy shot). All nineteen colorway slots fall through to placeholders, including `foundations-navy` on its own product page. That is expected. Those pages must still look deliberate.

The fallback is an inline SVG of the product's silhouette: a tilted ellipse on a flared pedestal foot, filled in that colorway's own hex, with a slightly darker inset ellipse for the grille and a soft highlight along the upper-left rim. Same aspect ratio and same position as a real render, so nothing reflows when images arrive. Add a small Geist Mono caption beneath in `--slate` reading the finish name.

Never render a grey box, a broken-image icon, a spinner that never resolves, or the word "placeholder". Someone browsing the collections page today should read those as stylised illustrations, not as missing assets. The bar: a stranger should not be able to tell which finishes have real renders and which don't without looking closely.

Keep the fallback logic in that one component. Dropping the real files into `/public/colorways/` should require no code change at all.

### Once the remaining renders exist

They will share the navy shot's camera and light rig, so switching finish is a cross-fade between two stacked images at the same coordinates — roughly 0.7s, ease-in-out. Never a hard cut, never a reload flash. The same cross-fade works between placeholder and real render.

Make them feel three-dimensional through their surroundings rather than through geometry:
- A soft radial glow behind the unit in that finish's own hue
- A contact shadow beneath the pedestal that shifts subtly with the ambient light
- Slow parallax on scroll, a few pixels of drift, nothing showy
- Optional: a very small tilt toward the cursor on the product page, maybe 3 degrees maximum, spring-eased

Preload the current finish's neighbours so switching is instant. Lazy-load the rest. Since most files are absent today, the preloading must fail silently and never block a render or log errors to the console.


## 6. Pages

### Home (`/`)
The storyboard leaves this open. Design it yourself. Five sections maximum. Suggested shape:
1. The scroll hero above
2. Colorway selector with live ambient response (below)
3. A materials or craft section, restrained
4. One nearly empty section: one line of Fraunces italic, enormous margins, nothing else
5. Footer

### Collections (`/collections`)
Three collections, grouped. Grid of finishes, each a card using `<ProductShot>` on a tinted ground derived from that finish's own hue. Lazy-load below the fold. Hovering a card lifts it slightly and warms its glow.

### Product (`/luma-one/:colorway`)
One template, driven by the colorway data below.
- Large rounded-corner stage holding the speaker with ambient lighting
- **The page's ambient light and background tint respond to the selected colorway.** Pick Sunshine and the whole stage warms. This is the single most important interaction on the site.
- Model name, colorway name, price
- Other colorways as small selectable dots; switching cross-fades the render, the glow and the page's ambient tint together over ~0.7s rather than cutting
- Glow: radial gradient from the colorway's own hue behind the product, low alpha, blur radius about 1.4× the unit width. Warm colorways need lower alpha than cool ones to read as equally bright — around 0.22 for warm, 0.28 for cool.

### Test Pages (navbar dropdown)
A dropdown listing experimental pages. Build at least these, and add any others you think are worth showing:
- `/test/exploded` — an SVG technical drawing of the speaker's internal components separating along a scroll-driven timeline, with thin leader lines and Geist Mono annotations. Line art on bone, no 3D.
- `/test/spotlight` — cursor as a soft light that reveals fabric weave texture in a dark field
- `/test/silence` — the restraint experiment: one line of type, vast empty space
- `/test/typography` — the type system as a specimen sheet
- `/test/colorways` — every finish as a contact sheet

Each test page needs a way back to the main site.

---

## 7. Navbar and footer

**Navbar.** Descends from the top as the navy releases, appearing to emerge from behind it. Fill is `--amber-glass` with backdrop blur — warm translucent glass, not frosted white. Links: Home, Luma-One, Shop, Contact, About, Test Pages.

As the user scrolls down it contracts into a small floating pill holding just the Ovalis mark, in the same glass material, the way an iPhone Dynamic Island collapses. Scrolling up slightly anywhere, or hovering the pill, expands it back to the full bar smoothly. Use a spring, not a linear ease. You choose the exact shape.

**Footer.** Concrete or smoke texture built procedurally — subtle noise and grain over `--smoke`, light and natural rather than heavy. Should feel like the site is resting on a material surface.

---

## 8. Colorways

19 finishes across three collections. Assign a plausible price to each (the Element metals should cost more).

**Foundations** — White `#F2EFE9`, Black `#1C1C1E`, Light Grey `#B8B8B6`, Dark Grey `#4A4A4C`, Navy `#2A3550`, Maroon `#6B2233`, Orange `#D2662E`

**Element** — Wood `#6B4A32` (grain), Pearl `#EDE6DA`, Aluminum Chrome `#C5C8CB` (metal), Aluminum Gold `#C9A96A` (metal), Aluminum Rose Gold `#D4A198` (metal), Sand `#D8C4A0`, Moss `#7C8968`

**Flores** — Stem `#C3D9A8`, Sunshine `#F2D96B`, Rosé `#EFC0C4`, Lavender `#C9BEDC`, Sky `#AFC9DE`

Store as typed data with `{ id, name, collection, hex, materialType: 'fabric' | 'metal' | 'wood', glowAlpha, price }`.

---

## 9. Texture and finish

- Fixed full-screen grain overlay at 3–5% opacity via SVG `feTurbulence`. It must not scroll with content.
- Selection highlight uses a navy tint, not the system blue.
- Focus ring: 2px navy with 2px offset.
- Transitions between pages should fade, not cut.

---

## 10. Copy

Write it yourself, sparingly. Plain verbs, sentence case, no filler. Short lines that leave space around themselves. Never explain how good the speaker sounds. Name things simply. If a section can work with four words instead of a paragraph, use four words.

---

## 11. Deliverable

A running Vite project. Include a short `README.md` listing what you built, what you improvised where the brief was silent, and anything you'd flag as needing a second pass.

If something here is ambiguous, make a confident choice and note it in the README rather than asking. Spend your boldness on the opening sequence and the colorway ambient response; keep everything else quiet.
