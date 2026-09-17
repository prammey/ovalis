import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CROSSFADE_EASE_CSS, CROSSFADE_MS, GLOW_BLUR_RATIO } from '../config/motion'
import type { Colorway } from '../data/colorways'
import { rgba } from '../lib/color'

type Props = {
  colorway: Colorway
  /** Multiplies the finish's own glow alpha (e.g. brighter on hover). */
  gain?: number
  className?: string
  style?: CSSProperties
}

/**
 * Soft radial light behind the unit in the finish's own hue. Its spread is
 * GLOW_BLUR_RATIO × the container width. Changing the finish cross-fades
 * between the old and new light rather than cutting.
 */
export function Glow({ colorway, gain = 1, className = '', style }: Props) {
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

  const size = `${GLOW_BLUR_RATIO * 100}%`
  const layer = (c: Colorway): CSSProperties => ({
    background: `radial-gradient(closest-side, ${rgba(c.hex, Math.min(1, c.glowAlpha * gain))} 0%, ${rgba(c.hex, 0)} 100%)`,
    width: size,
    aspectRatio: '1 / 1',
    left: '50%',
    top: '48%',
    transform: 'translate(-50%, -50%)',
    transition: `opacity ${CROSSFADE_MS}ms ${CROSSFADE_EASE_CSS}`,
  })

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-visible ${className}`} style={style}>
      <div className="absolute" style={layer(colorway)} />
      {prev && <div className="absolute" style={{ ...layer(prev.colorway), opacity: prev.fading ? 0 : 1 }} />}
    </div>
  )
}
