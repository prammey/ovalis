import Lenis, { type VirtualScrollData } from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { LENIS_LERP, LENIS_WHEEL_MULTIPLIER } from '../config/motion'
import { prefersReducedMotion } from '../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from './gsap'

/**
 * A gate sees every wheel/touch delta before Lenis applies it. Returning
 * `false` swallows that delta. The opening sequence registers one to add
 * resistance at the hero/home boundary.
 */
export type ScrollGate = (data: VirtualScrollData) => boolean

const gates = new Set<ScrollGate>()

export function registerScrollGate(gate: ScrollGate): () => void {
  gates.add(gate)
  return () => {
    gates.delete(gate)
  }
}

const LenisContext = createContext<Lenis | null>(null)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      lerp: LENIS_LERP,
      wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
      smoothWheel: !prefersReducedMotion(),
      virtualScroll: (data) => {
        for (const gate of gates) if (gate(data) === false) return false
        return true
      },
    })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

/** Jumps to the top on route change and lets ScrollTrigger re-measure the new page. */
export function ScrollReset() {
  const lenis = useLenis()
  const { pathname } = useLocation()
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname, lenis])
  return null
}
