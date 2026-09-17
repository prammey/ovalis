# Ovalis

A marketing site for a fictional luxury speaker brand and its one product, the Luma-One.
Vite + React + TypeScript, GSAP ScrollTrigger, Lenis, Tailwind v4, React Router. No 3D.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

## What's here

| Route | What it is |
| --- | --- |
| `/` | Opening sequence → scroll hero → colorway selector with ambient light → craft notes → one-line section → footer |
| `/collections` (`/shop` redirects) | Three collections, nineteen finishes on grounds tinted from their own hue |
| `/luma-one/:colorway` (`/luma-one` redirects to Navy) | Product page. The stage, glow and whole-page tint follow the selected finish |
| `/about`, `/contact` | Quiet pages, a few lines each |
| `/test/exploded` | Scroll-pinned SVG line drawing; seven parts separate along the unit's axis with mono annotations |
| `/test/spotlight` | Cursor as a soft light revealing a woven texture on a dark field |
| `/test/silence` | One line and the space around it |
| `/test/typography` | The type system as a specimen sheet, plus the palette |
| `/test/colorways` | All nineteen finishes as a contact sheet with their data |
| `/test/opening` | Replays the load → navy fill → scroll hero on demand |
| `/test/placeholder` | The one real render beside the drawn fallback, and the three material treatments |

### Where things live

- `src/config/motion.ts` — every timing, duration, easing, glow and spring value, each with a comment. `springToCss()` turns a spring into a CSS `linear()` easing so the navbar morph and cursor tilt are real springs on plain CSS transitions.
- `src/data/colorways.ts` — the nineteen finishes as typed data (`id, name, collection, hex, materialType, glowAlpha, price`).
- `src/components/ProductShot.tsx` — the one component every appearance of the speaker goes through. Resolves `src` prop → `/colorways/<id>.webp` → drawn `Silhouette`. Cross-fades between finishes and between placeholder and render (0.7s).
- `src/components/Silhouette.tsx` — the drawn Luma-One in the finish's own hex, with fabric, metal and wood treatments, in the same 1492×1023 frame as the render.
- `src/components/ProductStage.tsx`, `Glow.tsx`, `Ambient.tsx` — the surroundings: tinted ground, radial glow, contact shadow, scroll drift, optional cursor tilt, and the page's ambient light.
- `src/sections/opening/` — the opening sequence: `useAssetProgress` (real font + hero-decode progress), `Opening.tsx` (loader, clear, navy fill, pinned scrub hero, indicator), `SlicedLine.tsx` (the type-resolve effect), `useHandoffSnap.ts` (the settle onto the home top).
- `src/components/Navbar.tsx` — the amber-glass bar and its pill collapse.
- `vite.config.ts` — a tiny plugin that lists `public/colorways/` at build time as `virtual:colorway-manifest`.

### Dropping in the remaining renders

Put `<collection>-<finish>.webp` files in `public/colorways/` (e.g. `flores-sunshine.webp`), exported from the same camera and light rig, with alpha. Restart the dev server or rebuild; no code changes. `ProductShot` reads the manifest, so a finish with no file never triggers a request (no 404s in the console, no broken-image flash) and neighbour preloading only warms files that exist. For 1x/2x pairs, pass `src` and `srcSet` explicitly the way the hero does, or drop the 2x file in under the plain name.

## How the opening works

1. **Load.** Bone field, wordmark fades up, a hairline rule scales with real progress: four `document.fonts.load()` calls, `fonts.ready`, and `img.decode()` of the hero at the srcset size the browser will actually pick. Minimum 1.2s so it doesn't strobe on a warm cache, maximum 6s so a stuck asset can never trap the user.
2. **Clear.** Wordmark and rule fade out in 0.4s.
3. **Navy fill.** A 300vw × 220vh navy plane anchored below the viewport rises with `translateY` while rotating from −9° to 0°. Transform only. The edge starts angled (right side higher, as in the storyboard) and levels out as the `power3.out` ease settles.
4. **Invitation.** "Scroll" and an arrow on a slow 2.4s sine bounce. Fades on first scroll; returns if the user comes back to the very top.
5. **Hero.** Pinned for 2.2 viewport heights, scrubbed with 0.6s smoothing, reversible. At rest the navy field is empty: the type sits at opacity 0 and the render waits 40px below the bottom edge, so the only thing on screen is the scroll prompt. The render rises at 1.75× from the centre of the bottom edge and settles to the right of the type over 0–72% of the timeline; the type fades up and resolves over 8–90%. Each line is seven stacked copies clipped to horizontal bands, each translated up to 140px, sliding back into alignment; the outermost bands' clips bleed 40% past the line box so ascenders and the descender of "Age" stay whole. Clip paths are static; only transform and opacity animate.

   The entry offset is measured at runtime against the section (exactly one viewport while pinned) instead of being hard-coded, so it centres correctly at any window size and across both breakpoints' different speaker placements. It is cached per section size and recomputed on refresh.
6. **Handoff.** The pin releases and the navy scrolls off over the bone page. The navbar becomes visible at that moment but sits at a lower z-index than the hero, so the navy scrolling away literally reveals it — docked, rectangular, edge to edge. The stretch where the navy is leaving has no resting state: stop scrolling inside it while heading down and the page settles (0.8s, through Lenis so it never fights the smoothing) onto the **home top**, the point where the navy has fully gone and the bar's top edge meets the viewport top. That is the one scroll effect added here. Heading up is left alone: the navy scrolls back on and the hero plays in reverse under the user's own hand, with nothing pulling or resisting.

## What I improvised (the brief was silent or ambiguous)

- **Playing the opening once per session.** Returning to `/` from another page skips straight to the hero at scroll 0 (sessionStorage flag). Replaying a 2.5s sequence on every internal navigation felt hostile. `/test/opening` ignores the flag.
- **No scroll-back resistance.** The brief asked for the navy to resist a casual flick back up. Built, then removed at the owner's request: with the snap in place it read as the page bouncing between the hero and the home top. The only added scroll behaviour is the settle onto the home top when heading down.
- **Navbar shapes.** Three, cut from one full-width 72px glass shell with a spring-eased `clip-path: inset(... round r)`, so the backdrop layer never re-composites. *Docked*: rectangular, edge to edge, at the top of every page (on the home page, at the home top). *Pill*: 84px, mark only, once the user has scrolled 120px past the top and 24px downward. *Floating*: a rounded bar (max 1120px, 16px from the top and sides) whenever the pill expands — on hover, focus-within, an open dropdown, or an upward scroll of 6px. Reaching the top again re-docks. The content column is the same 1120px in every shape, so links never move horizontally; it rides 8px lower in the floating and pill shapes to centre on the shell's lower band. Links fade and go `visibility: hidden` while collapsed so they can't take focus.
- **Shop, Contact, About.** The brief lists them in the navbar but defines no pages. Shop redirects to `/collections`; About and Contact are one-screen pages with no claims.
- **Home section order** follows the brief's suggestion. Copy is mine: "Nineteen finishes. Pick one. The room changes with it." / "Made slowly." / "An object first."
- **Clay budget.** Used exactly three times: the active dot ring, the pull-quote rule on the home page, and the availability dot on the product page.
- **Prices.** Foundations $1,290; Element fabrics $1,390, wood $1,590, metals $1,790–$1,890; Flores $1,340.
- **Glow spread.** "Blur radius about 1.4× the unit width" is implemented as a radial gradient whose diameter is 1.4× the container width with a soft falloff, rather than a `filter: blur()`, which would cost paint time on every cross-fade.
- **Ambient tint strength** on the product page is 0.2 (mix of hue into bone) plus a pool of the hue at the top of the page. Pale finishes (White, Pearl) will always read faintly; that's the colour, not a bug.
- **The silhouette caption** shows for every finish, not just placeholders, so the caption can't give away which ones have files. The hero and stages hide it.
- **The silhouette retires once its render decodes.** It holds the frame while the image loads, then fades to opacity 0 over the same 0.7s. Leaving it lit showed its outline around the photo — a visible second unit, since the drawn shape is deliberately simpler than the render.
- **Removed the Vite starter assets** (`App.css`, sample images, `icons.svg`) and replaced the favicon with the mark.
- **Font correction** applied to the brief: body is Inter 300, mono is JetBrains Mono.

## Verified

- `tsc -b` clean, `vite build` clean. `oxlint` reports only fast-refresh and effect-style warnings.
- Every phase of the opening, the pill collapse, the dropdown, the selector's ambient response, the collections grid, the product page switch, and every test page were screenshotted in Chromium at 1440×900 during the build.
- Both hero WebP files keep their alpha channel (VP8X alpha flag set). 1x screens fetch the 142 KB file.

## Needs a second pass

- **Mobile.** Layouts collapse to one column and the navbar has a menu sheet, but nothing below 768px has been looked at in a real browser. The hero type at 15vw and the speaker at 92vw will need tuning on phones.
- **Navbar behind the hero at scroll 0.** Because the bar sits under the hero's z-index, it is unreachable while the navy covers the top. That's by design on the home page, but it means the home hero has no navigation until you scroll. If that's unwanted, raise the header's z-index and drop the "emerge from behind" effect.
- **The handoff snap was tuned with synthetic wheel events**, not a hand on a trackpad. The snap idle (140ms) and duration (0.8s) live in `motion.ts`; if a real trackpad's momentum tail makes the settle feel late or eager, those are the two numbers.
- **Silhouette fidelity.** The drawn unit is deliberately simpler than the render. When the other eighteen files arrive it disappears; if they take a while, the pedestal and shell thickness could be refined.
- **The hero srcset sizes attribute** assumes the speaker is 54vw of the viewport on desktop. If the composition changes, update `HERO_SIZES` in `src/sections/opening/hero.ts`.
- **Page transitions** fade the new page in and veil the old one; there's no shared-element continuity between a collection card and its product page.
- **Lenis + ScrollTrigger pin** has been reliable here, but resize during the pinned hero relies on `invalidateOnRefresh`; worth a check at odd viewport ratios.
- Everything in `Visual_Storyboard.pdf` page 9 (the rough drafts) was intentionally not followed, per the storyboard's own note.
