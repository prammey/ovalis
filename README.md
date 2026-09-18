# Ovalis

A marketing site for a fictional luxury speaker brand and its one product, the Luma-One.

**Live:** https://ovalis-studio.vercel.app

Vite · React · TypeScript · GSAP ScrollTrigger · Lenis · Tailwind v4 · React Router. No 3D — the
product is presented entirely through pre-rendered transparent WebP and drawn SVG.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

## Routes

| Route | |
| --- | --- |
| `/` | Opening sequence → scroll hero → colorway selector with ambient light → craft notes → one-line section → footer |
| `/collections` | Three collections, nineteen finishes on grounds tinted from their own hue. `/shop` redirects here |
| `/luma-one/:colorway` | Product page. The stage, glow and whole-page tint follow the selected finish. `/luma-one` redirects to Navy |
| `/about`, `/contact` | One screen each |
| `/test/exploded` | Scroll-pinned SVG line drawing; seven parts separate along the unit's axis with mono annotations |
| `/test/spotlight` | Cursor as a soft light revealing a woven texture on a dark field |
| `/test/silence` | One line and the space around it |
| `/test/typography` | The type system as a specimen sheet, plus the palette |
| `/test/colorways` | All nineteen finishes as a contact sheet with their data |
| `/test/opening` | Replays the load → navy fill → scroll hero on demand |
| `/test/placeholder` | The one real render beside the drawn fallback, and the three material treatments |

## Layout

- **`src/config/motion.ts`** — every timing, duration, easing, glow and spring value on the site,
  each with a comment explaining what it controls. Tune motion here rather than in components.
  `springToCss()` turns a spring into a CSS `linear()` easing, so the navbar morph and cursor tilt
  are real springs on plain CSS transitions.
- **`src/data/colorways.ts`** — the nineteen finishes as typed data
  (`id, name, collection, hex, materialType, glowAlpha, price`).
- **`src/components/ProductShot.tsx`** — the single component every appearance of the speaker goes
  through. Resolves an explicit `src` → `/colorways/<id>.webp` → the drawn `Silhouette`, and
  cross-fades between finishes and between placeholder and render over 0.7s.
- **`src/components/Silhouette.tsx`** — the drawn Luma-One in each finish's own hex, with fabric,
  metal and wood treatments, in the same 1492×1023 frame as the render so nothing reflows.
- **`src/components/ProductStage.tsx`, `Glow.tsx`, `Ambient.tsx`** — the surroundings: tinted
  ground, radial glow, contact shadow, scroll drift, optional cursor tilt, page ambient light.
- **`src/sections/opening/`** — the opening sequence. `useAssetProgress` (font and hero-decode
  progress), `Opening.tsx` (loader, navy fill, pinned scrub hero, indicator), `HeroLine.tsx` (the
  gradient sweep on the type), `useHandoffSnap.ts` (the settle onto the home top),
  `useHandoffLock.ts` (the hold against replaying the opening).
- **`src/components/Navbar.tsx`** — the amber-glass bar and its three shapes.
- **`vite.config.ts`** — a plugin that lists `public/colorways/` at build time as
  `virtual:colorway-manifest`, so a missing render never triggers a request.
- **`vercel.json`** — catch-all rewrite to `index.html`. Required: routing is client-side, so
  without it every path but `/` 404s on direct load.

## Adding the remaining renders

Only one real render exists — Midnight Navy, at `/herospeaker@1x.webp` (900w) and
`/herospeaker.webp` (1492w), served through a `srcset`. The other eighteen finishes fall back to
the drawn silhouette.

To add one, drop `<collection>-<finish>.webp` into `public/colorways/` (e.g.
`flores-sunshine.webp`), exported from the same camera and light rig, with alpha intact. Restart
the dev server or rebuild — no code changes. `ProductShot` reads the build-time manifest, so a
finish with no file never fires a request (no console 404s, no broken-image flash) and neighbour
preloading only warms files that exist. For 1x/2x pairs, pass `src` and `srcSet` explicitly the way
the hero does.

## The opening sequence

1. **Load.** A clean bone field — nothing else paints first. Two things keep it that way:
   `PageFrame` skips its fade on the first page of a session (a running opacity animation would give
   the wrapper a stacking context, trapping the loader's `z-60` beneath the navbar's `z-30`), and
   `Opening` hides the navbar in a *layout* effect, before the first paint rather than after.
   `history.scrollRestoration` is `manual`, so a reload never restores a mid-page position behind
   the loader.

   The wordmark fades up and a hairline rule scales with real progress — four
   `document.fonts.load()` calls, `fonts.ready`, and `img.decode()` of the hero at the srcset size
   the browser will actually pick. Minimum 1.2s so it doesn't strobe on a warm cache, maximum 6s so
   a stuck asset can't trap the user.

2. **Clear.** Wordmark and rule fade out in 0.4s.

3. **Navy fill.** A 300vw × 220vh navy plane anchored below the viewport rises with `translateY`
   while rotating from −9° to 0°, transform only. The leading edge starts angled and levels out as
   the `power3.out` ease settles.

4. **Invitation.** "Scroll" and an arrow on a slow 2.4s sine bounce. Fades on first scroll; returns
   at the very top.

5. **Hero.** Pinned for 2.2 viewport heights, scrubbed with 0.6s smoothing, reversible. At rest the
   navy field is empty — the type sits at opacity 0 and the render waits 40px below the bottom
   edge, so only the scroll prompt shows.

   *In* (0–0.62): the render rises at 1.75× from the centre of the bottom edge and settles to the
   right of the type, large enough to overlap the end of "New-Age". The type fills in alongside at
   a different rate, line by line, each line revealed by a gradient sweeping from bottom to top.

   *Out* (0.72–1): the mirror. A second sweep empties each line from the bottom through the same
   soft edge, and the block lifts a little as it goes. The speaker has no exit of its own — it holds
   where it settled and leaves with the panel when the pin releases.

6. **Handoff.** The pin releases and the navy scrolls off over the bone page. The navbar sits at a
   lower z-index than the hero, so the navy scrolling away reveals it, docked and edge to edge. The
   stretch where the navy is leaving has no resting state: stop inside it while heading down and
   the page settles over 0.8s onto the **home top**, where the navy has fully gone and the bar's top
   edge meets the viewport top.

7. **The lock.** The home top holds against scrolling back up, so the opening never replays by
   accident. Lenis reads `deltaY` *after* its `virtualScroll` callback, so an upward delta that
   would cross the lock is clamped to land exactly on it — the target never overshoots, so there is
   nothing to spring back from. A fling thrown from the bottom of the page travels the whole way and
   stops dead on the lock, however hard.

   Passage takes a fresh, deliberate push. Magnitude alone can't separate a hard fling from an
   intentional one, so gestures at the lock are counted, with a 220ms pause starting a new one: the
   gesture that *arrives* is absorbed, and from the next onward upward delta accumulates toward
   700px. Coming back down re-arms it, positionally rather than by event, since the page usually
   returns through the snap. Inside the hero the lock is inert, so the sequence stays reversible.

## Notes on the implementation

**Motion budget.** Everything animates on transform and opacity, with one deliberate exception: the
hero type's reveal is a `mask-image` gradient driven by a CSS custom property. Opaque panels
composite more cheaply, but a panel covers whatever it overlaps, and at leading 0.92 the descender
of "Age" reaches into the line below — a neighbouring panel cropped the "g". A mask only affects its
own element's pixels. Scrubbing the full sequence measures a 16.7ms median frame and 17.6ms p95.
`HERO_TEXT_MASK_SOFT_PCT` sets the edge softness; `HERO_TEXT_MASK_BLEED_EM` how far the mask reaches
past the line box to clear descenders.

**The opening plays once per session.** Returning to `/` from another page goes straight to the hero
at scroll 0, via a sessionStorage flag. `/test/opening` ignores it.

**Keyboard and programmatic scrolling are never locked.** Only wheel and touch pass through Lenis's
virtual scroll, so arrow keys, space, Home and anchor jumps always move freely — the page can't trap
anyone.

**Navbar shapes.** Three, cut from one full-width 72px glass shell with a spring-eased
`clip-path: inset(... round r)`, so the backdrop layer never re-composites. *Docked* — rectangular,
edge to edge, at the top of a page (on the home page, at the home top). *Pill* — 84px, mark only,
once scrolled 120px past the top and 24px downward. *Floating* — a rounded bar, max 1120px, when the
pill expands on hover, focus, an open dropdown or a 6px upward scroll. The content column stays
1120px in every shape so links never shift horizontally.

**Glow spread.** "1.4× the unit width" is a radial gradient of that diameter with a soft falloff,
not `filter: blur()`, which would cost paint on every cross-fade.

**Colour discipline.** Clay appears exactly three times: the active dot ring, the pull-quote rule on
the home page, and the availability dot on the product page. Pale finishes (White, Pearl) read
faintly in the ambient tint by design.

**Prices.** Foundations $1,290; Element fabrics $1,390, wood $1,590, metals $1,790–$1,890;
Flores $1,340.

## Responsive

Verified at 1440×900, 1280×800, 390×844 and 320×568. No horizontal scroll at any width.

The hero keeps its overlap on phones but rearranges it: the type takes a phone-only `23vw` size
(the desktop `clamp()` is untouched) and the speaker comes up from below at `100vw`, high enough
that its edge clips the tail of "Noise" the way it clips the end of "New-Age" on a wide screen. The
desktop composition used as-is left only "New-A / No" readable, since at phone width there is no
room for the type to sit beside a speaker large enough to read.

Colorway dots put their collection label above rather than beside on phones — beside, it took enough
width to wrap a seven-finish row and orphan a single dot — and each dot's tap target is padded to
40px around its 22px visual. The navbar collapses to a menu sheet with the test pages below a rule.

Mobile was checked in a desktop browser at phone dimensions, not on physical hardware.

## Known limitations

- **No navigation on the home hero until you scroll.** The navbar sits under the hero's z-index so
  the navy can reveal it. Raising the header's z-index would fix it at the cost of that effect.
- **Soft 404s.** The SPA catch-all rewrite means unknown paths return HTTP 200 with the "Nothing
  here." page rendered client-side. Fine for people, not for crawlers.
- **The snap and lock were tuned with synthetic wheel events**, not a hand on a trackpad. A real
  momentum tail may want `HANDOFF_LOCK_CHARGE_PX`, `HANDOFF_SNAP_IDLE_MS` or the gesture gap
  adjusted in `motion.ts`.
- **`HERO_SIZES`** in `src/sections/opening/hero.ts` assumes the speaker is 54vw on desktop. Update
  it if the composition changes.
- **No shared-element transition** between a collection card and its product page; pages cross-fade.
- **No test suite.** Verification is `tsc -b`, `vite build`, `oxlint` and browser checks.
