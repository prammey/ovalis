import { useEffect, type RefObject } from 'react'
import type Lenis from 'lenis'
import { HANDOFF_SNAP_EASING, HANDOFF_SNAP_IDLE_MS, HANDOFF_SNAP_S } from '../../config/motion'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'

export type SnapZone = { start: number; end: number }

/**
 * The stretch where the navy scrolls off over the home page has no resting
 * state of its own. When scrolling stops inside it while heading down, the
 * page settles forward to the home top (navy gone, bar docked). Heading up is
 * left alone: the navy scrolls back on and the hero reverses under the user's
 * own hand, with nothing pulling either way. Done through Lenis so it never
 * fights the smoothing; user input during a settle simply takes over.
 */
export function useHandoffSnap(lenis: Lenis | null, zoneRef: RefObject<SnapZone>) {
  useEffect(() => {
    if (!lenis || prefersReducedMotion()) return

    let timer: number | undefined
    let lastY = lenis.scroll
    let direction = 0

    const settle = () => {
      const { start, end } = zoneRef.current
      if (end <= start) return
      const y = lenis.targetScroll
      if (direction <= 0 || y <= start + 1 || y >= end - 1) return
      lenis.scrollTo(end, { duration: HANDOFF_SNAP_S, easing: HANDOFF_SNAP_EASING })
    }

    const onScroll = () => {
      const y = lenis.scroll
      if (y !== lastY) direction = y > lastY ? 1 : -1
      lastY = y
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, HANDOFF_SNAP_IDLE_MS)
    }

    lenis.on('scroll', onScroll)
    return () => {
      window.clearTimeout(timer)
      lenis.off('scroll', onScroll)
    }
  }, [lenis, zoneRef])
}
