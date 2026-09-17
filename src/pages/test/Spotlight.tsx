import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from '../../lib/gsap'
import { TransitionLink } from '../../lib/navigation'

/** Radius of the lit area in px. */
const LIGHT_RADIUS = 260

/**
 * Cursor as a soft light over a dark field. The field is a huge dark overlay
 * with a transparent hole; only the hole moves (transform), and it reveals
 * the woven texture underneath.
 */
export function Spotlight() {
  const holeRef = useRef<HTMLDivElement>(null)
  const areaRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const hole = holeRef.current
    const area = areaRef.current
    if (!hole || !area) return
    const reduced = prefersReducedMotion()
    const toX = gsap.quickTo(hole, 'x', { duration: reduced ? 0 : 0.5, ease: 'power3.out' })
    const toY = gsap.quickTo(hole, 'y', { duration: reduced ? 0 : 0.5, ease: 'power3.out' })
    const place = (clientX: number, clientY: number) => {
      const r = area.getBoundingClientRect()
      toX(clientX - r.left)
      toY(clientY - r.top)
    }
    place(area.clientWidth * 0.5, area.clientHeight * 0.5)
    const onMove = (e: PointerEvent) => place(e.clientX, e.clientY)
    area.addEventListener('pointermove', onMove)
    return () => area.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <main ref={areaRef} className="relative h-svh w-full overflow-hidden bg-ink text-bone">
      {/* the weave */}
      <svg aria-hidden className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="spot-weave" width="9" height="9" patternUnits="userSpaceOnUse">
            <rect width="9" height="9" fill="#2a3d5a" />
            <path d="M0 4.5H9" stroke="#0A3D6B" strokeWidth="2.6" strokeOpacity="0.9" />
            <path d="M4.5 0V9" stroke="#3b5578" strokeWidth="2.2" strokeOpacity="0.9" />
            <path d="M0 0H9M0 9H9" stroke="#0e1a2a" strokeWidth="1" />
          </pattern>
          <filter id="spot-nap">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#spot-weave)" />
        <rect width="100%" height="100%" filter="url(#spot-nap)" style={{ mixBlendMode: 'multiply' }} />
      </svg>

      {/* the dark field with a hole; the hole sits at (0,0) of this element */}
      <div
        ref={holeRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
        style={{
          width: '300vw',
          height: '300vh',
          marginLeft: '-150vw',
          marginTop: '-150vh',
          background: `radial-gradient(circle at center, rgba(22,26,31,0) 0px, rgba(22,26,31,0.15) ${LIGHT_RADIUS * 0.45}px, rgba(22,26,31,0.92) ${LIGHT_RADIUS}px, #161A1F ${LIGHT_RADIUS * 1.5}px)`,
        }}
      />

      <div className="relative flex h-full flex-col justify-between px-6 pb-8 pt-24 md:px-12">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] tracking-[0.08em] text-bone/60">test / spotlight</span>
          <TransitionLink to="/" className="quiet-link text-sm text-bone/80">
            Back to Ovalis
          </TransitionLink>
        </div>
        <p className="font-display max-w-none self-center text-[2.4rem] italic text-bone/70 md:text-[3.2rem]">Move the light.</p>
        <span className="font-mono text-[11px] tracking-[0.08em] text-bone/50">WOOL · 240 g/m² · MIDNIGHT</span>
      </div>
    </main>
  )
}
