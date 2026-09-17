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
- `src/sections/opening/` — the opening sequence: `useAssetProgress` (real font + hero-decode progress), `Opening.tsx` (loader, clear, navy fill, pinned scrub hero, indicator), `SlicedLine.tsx` (the type-resolve effect), `useHandoffSnap.ts` (the settle onto the home top), `useHandoffLock.ts` (the hold against replaying the opening).
- `src/components/Navbar.tsx` — the amber-glass bar and its pill collapse.
- `vite.config.ts` — a tiny plugin that lists `public/colorways/` at build time as `virtual:colorway-manifest`.

### Dropping in the remaining renders

Put `<collection>-<finish>.webp` files in `public/colorways/` (e.g. `flores-sunshine.webp`), exported from the same camera and light rig, with alpha. Restart the dev server or rebuild; no code changes. `ProductShot` reads the manifest, so a finish with no file never triggers a request (no 404s in the console, no broken-image flash) and neighbour preloading only warms files that exist. For 1x/2x pairs, pass `src` and `srcSet` explicitly the way the hero does, or drop the 2x file in under the plain name.

## How the opening works

1. **Load.** A clean bone field — nothing else paints first. Two things have to be right for that: `PageFrame` skips its fade on the very first page (a running opacity animation gives the wrapper a stacking context, which would trap the loader's `z-60` *beneath* the fixed navbar's `z-30`), and `Opening` hides the navbar in a **layout** effect, before the first paint rather than after it. Get either wrong and the bar and a half-faded home page flash up before the wordmark. `history.scrollRestoration` is also set to `manual`, so a reload never restores a mid-page position behind the loader.

   Wordmark fades up, a hairline rule scales with real progress: four `document.fonts.load()` calls, `fonts.ready`, and `img.decode()` of the hero at the srcset size the browser will actually pick. Minimum 1.2s so it doesn't strobe on a warm cache, maximum 6s so a stuck asset can never trap the user.
2. **Clear.** Wordmark and rule fade out in 0.4s.
3. **Navy fill.** A 300vw × 220vh navy plane anchored below the viewport rises with `translateY` while rotating from −9° to 0°. Transform only. The edge starts angled (right side higher, as in the storyboard) and levels out as the `power3.out` ease settles.
4. **Invitation.** "Scroll" and an arrow on a slow 2.4s sine bounce. Fades on first scroll; returns if the user comes back to the very top.
5. **Hero.** Pinned for 2.2 viewport heights, scrubbed with 0.6s smoothing, reversible. At rest the navy field is empty: the type sits at opacity 0 and the render waits 40px below the bottom edge, so the only thing on screen is the scroll prompt.

   *In* (0–0.62): the render rises at 1.75× from the centre of the bottom edge and settles to the right of the type, large enough to overlap it — it covers the end of "New-Age", as the storyboard draws it. The type fills in alongside at a different rate, line by line: each line sits behind a navy gradient "curtain" that slides up off it, so the words appear through a soft edge sweeping from bottom to top.

   *Out* (0.72–1): the mirror image. A second curtain sweeps up over each line in turn, so the type empties from the bottom through the same soft gradient it filled through, and the block lifts a little as it goes.

   Each sweep is a `mask-image` gradient driven by a CSS custom property. This is the one place the site animates something other than transform and opacity, and it is deliberate: the first version slid opaque navy panels over the type, which composites more cheaply, but a panel covers whatever it overlaps — and at leading 0.92 the descender of "Age" reaches into the line below, so the neighbouring panel cropped the "g". A mask only affects its own element's pixels, so the lines can overlap as much as the type needs. Measured while scrubbing the whole sequence: 16.7ms median frame, 17.6ms p95, one frame over 20ms. `HERO_TEXT_MASK_SOFT_PCT` sets how soft the edge is and `HERO_TEXT_MASK_BLEED_EM` how far the mask reaches past the line box to clear descenders.

   The speaker has **no exit of its own**. It holds exactly where it settled and leaves only when the pinned section scrolls away — the storyboard's rising speaker is the panel moving, not a separate animation, and giving it one left it adrift. Clip paths are static throughout, and only transform and opacity animate.

6. **Handoff.** The pin releases and the navy scrolls off over the bone page. The navbar becomes visible at that moment but sits at a lower z-index than the hero, so the navy scrolling away literally reveals it — docked, rectangular, edge to edge. The stretch where the navy is leaving has no resting state: stop scrolling inside it while heading down and the page settles (0.8s, through Lenis) onto the **home top**, the point where the navy has fully gone and the bar's top edge meets the viewport top.

7. **The lock.** The home top then holds against scrolling back up, so the opening never replays by accident. Lenis reads `deltaY` *after* the `virtualScroll` callback, so an upward delta that would cross the lock is clamped to land exactly on it rather than swallowed — the target never goes past, and there is nothing to spring back from. A fling thrown from the very bottom of the page therefore travels the whole way and stops dead on the lock, however hard it was thrown. (An earlier attempt nudged the page instead of clamping the delta, which read as a bounce between the hero and the home page; that is what the clamp replaces.)

   Passage is a fresh, deliberate push. Magnitude alone cannot separate a hard fling from an intentional one — a fling clears any sane threshold in two events — so gestures at the lock are counted, a pause of 220ms starting a new one. The gesture that *arrives* at the lock is absorbed; from the next onward, upward delta accumulates toward 700px, and reaching it releases the page into the hero, which scrubs in reverse as normal. Coming back down re-arms the lock, and because the page usually returns through the snap (which never passes through the gate) the re-arm is positional rather than event-driven. Inside the hero the lock is inert, so the opening stays fully reversible once you are in it.

## What I improvised (the brief was silent or ambiguous)

- **Playing the opening once per session.** Returning to `/` from another page skips straight to the hero at scroll 0 (sessionStorage flag). Replaying a 2.5s sequence on every internal navigation felt hostile. `/test/opening` ignores the flag.
- **The lock is firmer than the brief's "resistance".** The brief asked the navy to resist a casual flick and let a hard one through. As built it holds against *any* wheel gesture that arrives at it, and only a following deliberate push passes — the owner's requirement being that the opening must never replay by accident, from any scroll position or speed.
- **Keyboard and programmatic scrolling are not locked.** Only wheel and touch pass through Lenis's virtual scroll. Arrow keys, space, Home and anchor jumps move freely, which is deliberate: it keeps the page from ever being genuinely trapped.
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

## Mobile

Checked in a browser at 390×844 and 320×568. No horizontal scroll anywhere.

The hero keeps the desktop's overlap on phones but rearranges it: the type sits above at `23vw` (its own phone-only size — the desktop `clamp()` is untouched) and the speaker comes up from below at `100vw`, high enough that its edge clips the tail of "Noise" the way it clips the end of "New-Age" on a wide screen. The desktop composition used as-is left only "New-A / No" readable, because at phone width there is no room for the type to sit *beside* a speaker large enough to read.

Positioning it was done by measuring rather than by eye: the speaker's ink occupies 20.3–88.2% across and 11.7–93.4% down of its image box, so the box has to sit about 31px above wherever the visible disc should start. The colorway dots put their collection label above rather than beside — beside, the label stole enough width to wrap a seven-finish row onto a second line and orphan a single dot — and each dot's tap target is padded out to 40px from its 22px visual. The navbar collapses to a menu sheet with the test pages divided off below a rule.

## Needs a second pass

- **Navbar behind the hero at scroll 0.** Because the bar sits under the hero's z-index, it is unreachable while the navy covers the top. That's by design on the home page, but it means the home hero has no navigation until you scroll. If that's unwanted, raise the header's z-index and drop the "emerge from behind" effect.
- **Navigation is exercised by clicking, not by URL.** Every navbar, dropdown, footer and card link was clicked in a real browser after the provider fix below. Worth keeping up: driving the site by `page.goto` alone hides dead links completely.
- **The snap and lock were tuned with synthetic wheel events**, not a hand on a trackpad. The snap idle (140ms) and duration (0.8s), and the lock's charge (700px) and gesture gap (220ms), all live in `motion.ts`. A real trackpad's momentum tail is the thing most likely to want them adjusted — in particular, if the lock feels too easy to push through, raise `HANDOFF_LOCK_CHARGE_PX`.
- **Silhouette fidelity.** The drawn unit is deliberately simpler than the render. When the other eighteen files arrive it disappears; if they take a while, the pedestal and shell thickness could be refined.
- **The hero srcset sizes attribute** assumes the speaker is 54vw of the viewport on desktop. If the composition changes, update `HERO_SIZES` in `src/sections/opening/hero.ts`.
- **Page transitions** fade the new page in and veil the old one; there's no shared-element continuity between a collection card and its product page.
- **Lenis + ScrollTrigger pin** has been reliable here, but resize during the pinned hero relies on `invalidateOnRefresh`; worth a check at odd viewport ratios.
- Everything in `Visual_Storyboard.pdf` page 9 (the rough drafts) was intentionally not followed, per the storyboard's own note.
