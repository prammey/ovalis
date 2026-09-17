import { useEffect, type RefObject } from 'react'
import { REVEAL_EASE, REVEAL_MS, REVEAL_Y_PX } from '../config/motion'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion } from './useReducedMotion'

/**
 * Elements marked `data-reveal` inside `ref` rise and fade in as they enter
 * the viewport, staggered in document order. Instant under reduced motion.
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (items.length === 0 || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y: REVEAL_Y_PX })
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: REVEAL_MS / 1000, ease: REVEAL_EASE, stagger: 0.08, overwrite: true }),
      })
    }, root)
    return () => ctx.revert()
  }, [ref])
}
