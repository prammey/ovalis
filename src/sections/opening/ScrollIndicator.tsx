import { forwardRef, useEffect, useRef } from 'react'
import {
  INDICATOR_BOUNCE_EASE,
  INDICATOR_BOUNCE_MS,
  INDICATOR_BOUNCE_PX,
} from '../../config/motion'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from '../../lib/gsap'

/** "Scroll" and a slow-bouncing arrow on the navy field. The parent fades it in and out. */
export const ScrollIndicator = forwardRef<HTMLDivElement>(function ScrollIndicator(_, ref) {
  const arrowRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const arrow = arrowRef.current
    if (!arrow || prefersReducedMotion()) return
    const tween = gsap.to(arrow, {
      y: INDICATOR_BOUNCE_PX,
      duration: INDICATOR_BOUNCE_MS / 2000,
      ease: INDICATOR_BOUNCE_EASE,
      yoyo: true,
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute bottom-[7vh] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-bone/80"
      style={{ opacity: 0 }}
    >
      <span className="text-[13px] tracking-[0.04em]">Scroll</span>
      <svg ref={arrowRef} width="14" height="40" viewBox="0 0 14 40" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M7 0v38M1 32l6 7 6-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
})
