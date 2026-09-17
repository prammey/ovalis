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
/** Portion of the pinned timeline (0..1) during which the speaker travels. Ends earlier than the type so the two move at different rates. */
export const HERO_SPEAKER_WINDOW = { start: 0, end: 0.72 }
/** Ease of the speaker's travel along the scrub. */
export const HERO_SPEAKER_EASE = 'power2.out'
/** Portion of the pinned timeline during which the sliced type resolves. */
export const HERO_TEXT_WINDOW = { start: 0.08, end: 0.9 }
/** How many horizontal bands each hero line is sliced into for the resolve effect. */
export const HERO_TEXT_BANDS = 7
/** Maximum horizontal displacement of a band at the distorted start state, in px. */
export const HERO_TEXT_SHIFT_PX = 140
/** How far the outermost bands' clips bleed past the line box, as % of its height. Keeps ascenders and the descender of "Age" whole. */
export const HERO_TEXT_BLEED_PCT = 40
/** Opacity of the type before the first scroll. Zero, so the navy field starts empty. */
export const HERO_TEXT_FROM_OPACITY = 0
/** Ease for each band's travel back to alignment. */
export const HERO_TEXT_EASE = 'power3.out'

// ---------------------------------------------------------------------------
// Handoff resistance (phase 6)
// ---------------------------------------------------------------------------

/** Distance above the hero/home boundary (px) within which upward wheel input is gated. */
export const RESISTANCE_ZONE_PX = 8
/** Cumulative upward wheel delta (px) that counts as a deliberate, sustained gesture. */
export const RESISTANCE_SUSTAINED_PX = 900
/** Wheel events further apart than this reset the sustained accumulator. */
export const RESISTANCE_GESTURE_GAP_MS = 160
/** A single wheel event with |deltaY| above this counts as a "hard" flick. */
export const RESISTANCE_HARD_FLICK_PX = 70
/** Number of hard flicks that let the user through regardless of sustain. */
export const RESISTANCE_HARD_FLICK_COUNT = 2
/** Window in which those hard flicks must occur. */
export const RESISTANCE_HARD_FLICK_WINDOW_MS = 1400
/** Once through, the gate re-arms as soon as the user is this far back below the home top. */
export const RESISTANCE_REARM_PX = 24

// ---------------------------------------------------------------------------
// Handoff snap (between the hero releasing and the home top)
// ---------------------------------------------------------------------------

/** Idle time after the last scroll movement before the page settles to an end of the navy scroll-off zone. */
export const HANDOFF_SNAP_IDLE_MS = 140
/** Duration of that settle. */
export const HANDOFF_SNAP_S = 0.8
/** Ease of the settle (cubic in-out), as a Lenis easing function. */
export const HANDOFF_SNAP_EASING = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
/** Bump the page gives on a resisted wheel event (px), so the gate reads as tension rather than a wall. */
export const RESISTANCE_NUDGE_PX = 14
/** Duration of that nudge and its return. */
export const RESISTANCE_NUDGE_MS = 220

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
