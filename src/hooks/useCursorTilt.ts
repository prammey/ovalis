import { useEffect, type RefObject } from 'react'
import { springToCss, TILT_MAX_DEG, TILT_SPRING } from '../config/motion'
import { prefersReducedMotion } from './useReducedMotion'

const spring = springToCss(TILT_SPRING)

/**
 * A very small tilt toward the cursor, spring-eased through a CSS transition
 * so each new target is chased from wherever the element currently is.
 */
export function useCursorTilt(
  areaRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  maxDeg = TILT_MAX_DEG,
) {
  useEffect(() => {
    const area = areaRef.current
    const target = targetRef.current
    if (!area || !target || prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    target.style.transition = `transform ${spring.ms}ms ${spring.easing}`
    target.style.transformStyle = 'preserve-3d'
    area.style.perspective = '1200px'

    const onMove = (e: PointerEvent) => {
      const r = area.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      target.style.transform = `rotateX(${(-py * maxDeg * 2).toFixed(2)}deg) rotateY(${(px * maxDeg * 2).toFixed(2)}deg)`
    }
    const onLeave = () => {
      target.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
    area.addEventListener('pointermove', onMove)
    area.addEventListener('pointerleave', onLeave)
    return () => {
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
      target.style.transform = ''
      target.style.transition = ''
    }
  }, [areaRef, targetRef, maxDeg])
}
