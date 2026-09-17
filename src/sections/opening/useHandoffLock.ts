import { useEffect, type RefObject } from 'react'
import type Lenis from 'lenis'
import {
  HANDOFF_LOCK_CHARGE_PX,
  HANDOFF_LOCK_EPS_PX,
  HANDOFF_LOCK_GESTURE_GAP_MS,
  HANDOFF_LOCK_GESTURES_TO_PASS,
  HANDOFF_LOCK_REARM_PX,
} from '../../config/motion'
import { registerScrollGate } from '../../lib/smoothScroll'

/**
 * Holds the home top against scrolling back up, so the opening never replays
 * by accident.
 *
 * Approaching from the home page, an upward delta that would cross the lock is
 * *clamped* to land exactly on it — Lenis reads `deltaY` after this callback,
 * so the target never goes past and there is nothing to spring back from. A
 * fling from the very bottom therefore travels the whole way and stops dead on
 * the lock, however hard it was thrown.
 *
 * Passage is a fresh, deliberate push. Gestures at the lock are counted (a
 * pause of HANDOFF_LOCK_GESTURE_GAP_MS starts a new one); the one that
 * arrives is absorbed, and from the next onward upward delta accumulates
 * toward HANDOFF_LOCK_CHARGE_PX. Re-arming is positional
 * rather than event-driven, because the page usually returns to the lock
 * through the snap, which never passes through this gate. Inside the hero the
 * lock is inert, so the animation still scrubs freely in both directions.
 *
 * Only wheel and touch pass through here, which is what Lenis virtualises;
 * keyboard and programmatic scrolling are never gated, so the page can always
 * be escaped by other means.
 */
export function useHandoffLock(lenis: Lenis | null, lockRef: RefObject<number>) {
  useEffect(() => {
    if (!lenis) return

    let released = false
    let leftLock = false
    /** Gestures seen since the page arrived at the lock; the arriving one counts as the first. */
    let gestures = 0
    let charge = 0
    let lastAt = 0

    return registerScrollGate((data) => {
      const lock = lockRef.current
      if (lock <= 0) return true

      const y = lenis.targetScroll
      const { deltaY } = data
      const now = performance.now()
      const idle = now - lastAt > HANDOFF_LOCK_GESTURE_GAP_MS
      lastAt = now

      // Re-arm on position, whatever brought the page back — usually the snap,
      // which bypasses this gate. The user has to clear the lock first, or a
      // release would be cancelled before it had moved anywhere.
      if (released) {
        if (y < lock - HANDOFF_LOCK_REARM_PX) leftLock = true
        else if (leftLock && y >= lock - HANDOFF_LOCK_EPS_PX) {
          released = false
          leftLock = false
          gestures = 0
          charge = 0
        }
      }

      if (deltaY >= 0) {
        gestures = 0
        charge = 0
        return true
      }
      if (released) return true
      // Inside the hero the lock does not apply: the scrub stays reversible.
      if (y < lock - HANDOFF_LOCK_EPS_PX) return true

      const room = y - lock
      if (room > HANDOFF_LOCK_EPS_PX) {
        // Still approaching. Travel, but never past the lock. This gesture is
        // the one that arrives, so it is already the first.
        if (y + deltaY < lock) data.deltaY = -room
        gestures = 1
        charge = 0
        return true
      }

      // Sitting on the lock.
      if (idle) {
        gestures += 1
        charge = 0
      }
      if (gestures < HANDOFF_LOCK_GESTURES_TO_PASS) return false

      charge += -deltaY
      if (charge >= HANDOFF_LOCK_CHARGE_PX) {
        released = true
        gestures = 0
        charge = 0
        return true
      }
      return false
    })
  }, [lenis, lockRef])
}
