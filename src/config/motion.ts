/**
 * Every timing, duration, easing and glow value on the site lives here.
 * Durations are in milliseconds unless the name says otherwise. Easings are
 * GSAP ease strings unless the name ends in `Css`, in which case they are CSS
 * `transition-timing-function` values.
 */

// ---------------------------------------------------------------------------
// Opening sequence
// ---------------------------------------------------------------------------

/** Floor on how long the loader stays up, even if assets are already cached. Keeps the wordmark from strobing on repeat visits. */
export const LOADER_MIN_MS = 1200
/** Ceiling on the loader. If fonts or the hero image hang past this, we proceed anyway rather than trap the user. */
export const LOADER_MAX_MS = 6000
/** How long the wordmark takes to fade up when the loader first appears. */
export const LOADER_WORDMARK_IN_MS = 700
/** How the loading rule catches up to real progress. Short so it tracks honestly, but not so short it stutters. */
export const LOADER_RULE_CATCHUP_MS = 350
/** Phase 2: wordmark and rule fade out. */
export const CLEAR_MS = 400
/** Phase 3: navy sweeps up to fill the viewport. */
export const NAVY_FILL_MS = 900
/** Ease for the navy fill. Fast start, long settle, so the angled edge visibly levels out as it completes. */
export const NAVY_FILL_EASE = 'power3.out'
/** Tilt of the navy panel's leading edge at the start of the fill, in degrees. Negative lifts the right side first. Goes to 0 as it completes. */
export const NAVY_FILL_ANGLE_DEG = -9
/** Small pause after the navy fills before the scroll indicator appears. */
export const INDICATOR_DELAY_MS = 350
/** Scroll indicator fade-in. */
export const INDICATOR_IN_MS = 600
/** Full period of one arrow bounce. Long and slow, never jittery. */
export const INDICATOR_BOUNCE_MS = 2400
/** Bounce travel in px. */
export const INDICATOR_BOUNCE_PX = 10
/** Ease used for each half of the bounce. */
export const INDICATOR_BOUNCE_EASE = 'sine.inOut'
/** Indicator fade-out once scrolling begins. */
export const INDICATOR_OUT_MS = 300

// ---------------------------------------------------------------------------
// Scroll-driven hero (phase 5)
// ---------------------------------------------------------------------------

/** Scroll distance the hero is pinned for, as a multiple of viewport height. Longer feels slower and more deliberate. */
export const HERO_SCROLL_LENGTH_VH = 2.2
/** Smoothing on the scrub; 0.6s lag makes wheel steps feel like one continuous motion. */
export const HERO_SCRUB_S = 0.6
/**
 * Speaker start state: oversized and centred below the fold. Its x/y offsets
 * are measured at runtime against the viewport (see Opening.tsx) rather than
 * fixed here, so the entry lands the same on both breakpoints.
 */
export const HERO_SPEAKER_FROM = { scale: 1.75, rotate: -6 }
/** How far below the viewport edge the speaker waits before the first scroll. Keeps the navy field blank. */
export const HERO_SPEAKER_ENTER_GAP_PX = 40
/** Speaker end state: settled to the right of the type, slightly overlapping it. */
export const HERO_SPEAKER_TO = { x: 0, y: 0, scale: 1, rotate: 0 }
/** Portion of the pinned timeline (0..1) during which the speaker travels in. Ends earlier than the type so the two move at different rates. */
export const HERO_SPEAKER_WINDOW = { start: 0, end: 0.55 }
/** Ease of the speaker's travel along the scrub. */
export const HERO_SPEAKER_EASE = 'power2.out'
/** Portion of the pinned timeline during which the sliced type resolves. */
export const HERO_TEXT_WINDOW = { start: 0.06, end: 0.62 }
/**
 * The reveal and erase sweeps, as a fraction of each line's masked box measured
 * from its bottom edge. The reveal runs past 1 so the type ends fully lit; the
 * erase starts below 0 so it begins fully lit.
 */
export const HERO_TEXT_REVEAL_FROM = 0
export const HERO_TEXT_REVEAL_TO = 1.2
export const HERO_TEXT_ERASE_FROM = -0.25
export const HERO_TEXT_ERASE_TO = 1.2
/** Softness of the sweep's edge, as % of the masked box. The whole point of the effect. */
export const HERO_TEXT_MASK_SOFT_PCT = 20
/**
 * How far each line's mask extends past its line box, in em. The italic "g" of
 * "Age" hangs about 0.16em below the box, so the mask must reach past it or the
 * descender is cut off. Masks only affect their own element's pixels, so
 * neighbouring lines' masks may overlap freely — which they must here, since at
 * leading 0.92 the two lines' glyphs genuinely share vertical space.
 */
export const HERO_TEXT_MASK_BLEED_EM = 0.25
/** Delay between the two lines, in timeline units, so they arrive and leave one after the other. */
export const HERO_TEXT_LINE_STAGGER = 0.06
/** Ease of the reveal. */
export const HERO_TEXT_EASE = 'power2.out'

// ---------------------------------------------------------------------------
// Hero exit — the type is taken away as the scroll carries past it
// ---------------------------------------------------------------------------

/** Portion of the pinned timeline given to the exit. The gap after the entrance is the beat the finished frame holds for. */
export const HERO_EXIT_WINDOW = { start: 0.72, end: 1 }
/**
 * The speaker has no exit of its own: it holds where it settled and leaves
 * only when the pinned section itself scrolls away. The storyboard's rising
 * speaker is that panel moving, not a separate animation.
 */
/** Ease of the exit. Mild, because the user is driving it by scrolling. */
export const HERO_EXIT_EASE = 'power1.in'
/** How far the whole block of type lifts as it leaves, in px. */
export const HERO_EXIT_TEXT_RISE_PX = 130


// ---------------------------------------------------------------------------
// Handoff lock (the home top holds against scrolling back up)
// ---------------------------------------------------------------------------

/** Cumulative upward delta (px) within one gesture needed to pass the lock into the hero. */
export const HANDOFF_LOCK_CHARGE_PX = 700
/**
 * Which gesture at the lock is allowed to charge through. Magnitude alone
 * cannot tell a hard fling from a deliberate push — a fling clears any
 * threshold in two events — so the gesture that arrives at the lock is
 * absorbed and only the next one counts.
 */
export const HANDOFF_LOCK_GESTURES_TO_PASS = 2
/** A pause this long ends the current gesture: the charge resets, and a fling that has just landed on the lock stops counting. */
export const HANDOFF_LOCK_GESTURE_GAP_MS = 220
/** Tolerance for "sitting on the lock", in px. */
export const HANDOFF_LOCK_EPS_PX = 2
/** After passing, the user must get this far above the lock before returning to it re-arms it. Stops a release from being cancelled on the spot. */
export const HANDOFF_LOCK_REARM_PX = 24

// ---------------------------------------------------------------------------
// Handoff snap (between the hero releasing and the home top)
// ---------------------------------------------------------------------------

/** Idle time after the last downward scroll movement before the page settles forward to the home top. */
export const HANDOFF_SNAP_IDLE_MS = 140
/** Duration of that settle. */
export const HANDOFF_SNAP_S = 0.8
/** Ease of the settle (cubic in-out), as a Lenis easing function. */
export const HANDOFF_SNAP_EASING = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

/** Descent of the full bar when it first appears from behind the navy. */
export const NAVBAR_DESCEND_MS = 900
export const NAVBAR_DESCEND_EASE = 'power3.out'
/** Distance (px) below a page's top within which the bar stays docked — rectangular and full-width — and never collapses. On the home page the "top" is where the navy has fully scrolled off. */
export const NAVBAR_COLLAPSE_AFTER_PX = 120
/** Height of the docked, full-width bar. */
export const NAVBAR_DOCKED_HEIGHT_PX = 72
/** Inset of the floating bar from the top and sides once undocked. The floating bar's height is the docked height minus this. */
export const NAVBAR_FLOAT_INSET_PX = 16
/** Widest the floating bar (and the content inside the docked one) will go. */
export const NAVBAR_MAX_WIDTH_PX = 1120
/** Downward scroll distance (px) that triggers the collapse. */
export const NAVBAR_COLLAPSE_DELTA_PX = 24
/** Upward scroll distance (px) that expands the bar again. Small on purpose — "scrolling up slightly anywhere". */
export const NAVBAR_EXPAND_DELTA_PX = 6
/** Delay before the bar re-collapses after the cursor leaves the pill. */
export const NAVBAR_HOVER_LINGER_MS = 700
/** Spring for the bar/pill morph. Higher stiffness snaps faster; lower damping overshoots more. */
export const NAVBAR_SPRING = { stiffness: 170, damping: 22, mass: 1 }
/** Content (links) cross-fade during the morph. */
export const NAVBAR_CONTENT_FADE_MS = 260
/** Dropdown open/close. */
export const NAVBAR_DROPDOWN_MS = 220
/** Width of the collapsed pill in px. */
export const NAVBAR_PILL_WIDTH_PX = 84

// ---------------------------------------------------------------------------
// Product presentation
// ---------------------------------------------------------------------------

/** Cross-fade between two finishes (render, glow and ambient tint together). */
export const CROSSFADE_MS = 700
export const CROSSFADE_EASE_CSS = 'cubic-bezier(0.45, 0, 0.25, 1)'
/** Glow alpha for warm hues; warm reads brighter so it needs less. */
export const GLOW_ALPHA_WARM = 0.22
/** Glow alpha for cool hues. */
export const GLOW_ALPHA_COOL = 0.28
/** Glow blur radius as a multiple of the unit's width. */
export const GLOW_BLUR_RATIO = 1.4
/** Ambient page tint strength (0..1 mix of the hue into bone) on the product page. */
export const AMBIENT_TINT_STRENGTH = 0.2
/** Stage (rounded box) tint strength, slightly stronger than the page. */
export const STAGE_TINT_STRENGTH = 0.22
/** Max vertical drift of the product on scroll, in px. A few pixels, nothing showy. */
export const PARALLAX_PX = 18
/** Maximum tilt toward the cursor on the product page, degrees. */
export const TILT_MAX_DEG = 3
/** Spring for the cursor tilt. */
export const TILT_SPRING = { stiffness: 120, damping: 16, mass: 1 }
/** Shadow shift under the pedestal as ambient light moves, px. */
export const CONTACT_SHADOW_SHIFT_PX = 6
/** Card hover lift on the collections grid, px. */
export const CARD_LIFT_PX = 6
export const CARD_HOVER_MS = 420
export const CARD_HOVER_EASE_CSS = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
/** How much a card's glow brightens on hover (multiplier on its alpha). */
export const CARD_HOVER_GLOW_GAIN = 1.5

// ---------------------------------------------------------------------------
// Global
// ---------------------------------------------------------------------------

/** Page-to-page fade. Out is the veil covering the old page; in is the new page arriving. */
export const PAGE_FADE_OUT_MS = 220
export const PAGE_FADE_IN_MS = 520
export const PAGE_FADE_EASE_CSS = 'cubic-bezier(0.3, 0, 0.2, 1)'
/** Opacity of the fixed film-grain overlay. Brief allows 3–5%. */
export const GRAIN_OPACITY = 0.04
/** Lenis smoothing. */
export const LENIS_LERP = 0.09
export const LENIS_WHEEL_MULTIPLIER = 1
/** Generic reveal for sections entering the viewport. */
export const REVEAL_MS = 900
export const REVEAL_EASE = 'power3.out'
export const REVEAL_Y_PX = 28
/** Hover state for links and buttons. */
export const HOVER_MS = 220

// ---------------------------------------------------------------------------
// Spring → CSS linear() easing
// ---------------------------------------------------------------------------

export type Spring = { stiffness: number; damping: number; mass: number }

/**
 * Samples a damped spring from 0 to 1 and returns a CSS `linear()` easing
 * plus the duration it needs to settle. Use it as
 * `transition: transform ${ms}ms ${easing}` to get real spring motion out of
 * a plain CSS transition (no JS on the hot path).
 */
export function springToCss(spring: Spring, samples = 40): { easing: string; ms: number } {
  const { stiffness: k, damping: c, mass: m } = spring
  const w0 = Math.sqrt(k / m)
  const zeta = c / (2 * Math.sqrt(k * m))
  const position = (t: number) => {
    if (zeta < 1) {
      const wd = w0 * Math.sqrt(1 - zeta * zeta)
      return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    }
    // critically damped or over-damped: no oscillation
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t)
  }
  // settle time: when the envelope drops under 0.1% of travel
  const settle = zeta < 1 ? -Math.log(0.001) / (zeta * w0) : 7 / w0
  const points: string[] = []
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * settle
    points.push(position(t).toFixed(4))
  }
  return { easing: `linear(${points.join(', ')})`, ms: Math.round(settle * 1000) }
}
