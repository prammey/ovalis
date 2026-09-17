import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AMBIENT_TINT_STRENGTH, CROSSFADE_EASE_CSS, CROSSFADE_MS } from '../config/motion'
import type { Colorway } from '../data/colorways'
import { mix, rgba } from '../lib/color'

type Props = {
  colorway: Colorway
  /** Cover the viewport (product page) rather than the parent (home section). */
  fixed?: boolean
  /** How far the hue mixes into bone. */
  strength?: number
  className?: string
}

/**
 * The page's ambient light. A flat tint of the hue into bone plus a soft
 * pool of it high and centre, as if the unit were lighting the room.
 * Changes cross-fade between two stacked layers, opacity only.
 */
export function Ambient({ colorway, fixed = false, strength = AMBIENT_TINT_STRENGTH, className = '' }: Props) {
  const [prev, setPrev] = useState<{ colorway: Colorway; fading: boolean } | null>(null)
  const last = useRef(colorway)

  useEffect(() => {
    if (last.current.id === colorway.id) return
    const previous = last.current
    last.current = colorway
    setPrev({ colorway: previous, fading: false })
    const raf = requestAnimationFrame(() => setPrev((p) => (p ? { ...p, fading: true } : p)))
    const timer = window.setTimeout(() => setPrev(null), CROSSFADE_MS + 50)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [colorway])

  const layer = (c: Colorway): CSSProperties => ({
    background: `radial-gradient(120% 70% at 50% 0%, ${rgba(c.hex, c.glowAlpha * 0.9)} 0%, ${rgba(c.hex, 0)} 70%), ${mix('#E2DACA', c.hex, strength)}`,
    transition: `opacity ${CROSSFADE_MS}ms ${CROSSFADE_EASE_CSS}`,
  })

  return (
    <div aria-hidden className={`${fixed ? 'fixed' : 'absolute'} inset-0 -z-10 ${className}`}>
      <div className="absolute inset-0" style={layer(colorway)} />
      {prev && <div className="absolute inset-0" style={{ ...layer(prev.colorway), opacity: prev.fading ? 0 : 1 }} />}
    </div>
  )
}
