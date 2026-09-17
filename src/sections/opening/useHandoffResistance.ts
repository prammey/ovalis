import { useEffect, type RefObject } from 'react'
import type Lenis from 'lenis'
import {
  RESISTANCE_GESTURE_GAP_MS,
  RESISTANCE_HARD_FLICK_COUNT,
  RESISTANCE_HARD_FLICK_PX,
  RESISTANCE_HARD_FLICK_WINDOW_MS,
  RESISTANCE_NUDGE_MS,
  RESISTANCE_NUDGE_PX,
  RESISTANCE_REARM_PX,
  RESISTANCE_SUSTAINED_PX,
  RESISTANCE_ZONE_PX,
} from '../../config/motion'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from '../../lib/gsap'
import { registerScrollGate } from '../../lib/smoothScroll'

/**
 * Makes the navy hero resist a casual flick back up from the home page.
 * A sustained upward gesture, or two hard flicks, lets the user through.
 * Only wheel/trackpad input is gated; keyboard and touch scroll natively and
 * are never trapped. Off entirely under prefers-reduced-motion.
 *
 * `boundaryRef` holds the home top: the scroll position where the navy has
 * fully left and the bar is docked. Each resisted event nudges the page up a
 * few pixels, showing a sliver of navy, so the gate reads as tension rather
 * than a wall.
 */
export function useHandoffResistance(lenis: Lenis | null, boundaryRef: RefObject<number>) {
  useEffect(() => {
    if (!lenis || prefersReducedMotion()) return

    let sustained = 0
    let lastAt = 0
    let flicks: number[] = []
    let passed = false
    let nudging = false
    let nudgeTween: gsap.core.Tween | null = null

    // Out and back, driven by a GSAP proxy that writes positions directly.
    // Chaining Lenis's own scrollTo calls proved unreliable for the return leg.
    const nudge = () => {
      if (nudging) return
      nudging = true
      const boundary = boundaryRef.current
      const proxy = { y: boundary }
      nudgeTween = gsap.to(proxy, {
        y: boundary - RESISTANCE_NUDGE_PX,
        duration: RESISTANCE_NUDGE_MS / 1000,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        onUpdate: () => lenis.scrollTo(proxy.y, { immediate: true, force: true }),
        onComplete: () => {
          lenis.scrollTo(boundary, { immediate: true, force: true })
          nudging = false
        },
      })
    }

    const unregister = registerScrollGate(({ deltaY }) => {
      const boundary = boundaryRef.current
      if (boundary <= 0) return true
      const y = lenis.targetScroll

      if (deltaY >= 0) {
        // scrolling down: re-arm once the user is well inside the home page
        if (passed && y > boundary + RESISTANCE_REARM_PX) {
          passed = false
          sustained = 0
          flicks = []
        }
        return true
      }
      if (passed || y > boundary + RESISTANCE_ZONE_PX) return true

      const now = performance.now()
      if (now - lastAt > RESISTANCE_GESTURE_GAP_MS) sustained = 0
      lastAt = now
      sustained += -deltaY
      if (-deltaY > RESISTANCE_HARD_FLICK_PX) flicks.push(now)
      flicks = flicks.filter((t) => now - t < RESISTANCE_HARD_FLICK_WINDOW_MS)

      if (sustained >= RESISTANCE_SUSTAINED_PX || flicks.length >= RESISTANCE_HARD_FLICK_COUNT) {
        // an in-flight nudge would keep writing positions over the scroll we are about to allow
        nudgeTween?.kill()
        nudging = false
        passed = true
        return true
      }
      nudge()
      return false
    })

    return () => {
      nudgeTween?.kill()
      unregister()
    }
  }, [lenis, boundaryRef])
}
