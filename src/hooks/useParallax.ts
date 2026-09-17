import { useEffect, type RefObject } from 'react'
import { PARALLAX_PX } from '../config/motion'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion } from './useReducedMotion'

/** A few pixels of vertical drift as the element crosses the viewport. */
export function useParallax(ref: RefObject<HTMLElement | null>, amount = PARALLAX_PX) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const tween = gsap.fromTo(
      el,
      { y: amount },
      {
        y: -amount,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [ref, amount])
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])
}
