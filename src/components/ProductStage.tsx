import { useRef, type CSSProperties, type ReactNode } from 'react'
import {
  CONTACT_SHADOW_SHIFT_PX,
  CROSSFADE_EASE_CSS,
  CROSSFADE_MS,
  STAGE_TINT_STRENGTH,
} from '../config/motion'
import type { Colorway } from '../data/colorways'
import { useCursorTilt } from '../hooks/useCursorTilt'
import { useParallax } from '../hooks/useParallax'
import { mix } from '../lib/color'
import { Glow } from './Glow'
import { ProductShot, type ProductShotProps } from './ProductShot'

type Props = {
  colorway: Colorway
  /** Extra props forwarded to the shot (explicit src etc). */
  shot?: Partial<ProductShotProps>
  /** Tint the rounded ground with the finish. */
  tint?: number
  /** Enable the cursor tilt (product page only). */
  tilt?: boolean
  /** Enable the scroll drift. */
  parallax?: boolean
  /** Width of the unit as a fraction of the stage. */
  unitWidth?: string
  radius?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/**
 * The rounded ground the speaker sits on: tinted surface, glow behind, a
 * contact shadow that leans with the light, slow drift on scroll. Used on
 * the home selector, the product page and the collection cards.
 */
export function ProductStage({
  colorway,
  shot,
  tint = STAGE_TINT_STRENGTH,
  tilt = false,
  parallax = true,
  unitWidth = '72%',
  radius = '2rem',
  className = '',
  style,
  children,
}: Props) {
  const areaRef = useRef<HTMLDivElement>(null)
  const unitRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)
  useCursorTilt(areaRef, unitRef, tilt ? undefined : 0)
  useParallax(driftRef, parallax ? undefined : 0)

  const ground = mix('#F9F6F0', colorway.hex, tint)
  // the light sits upper-left, so the shadow leans a touch to the right on warm finishes
  const shadowShift = colorway.glowAlpha < 0.25 ? CONTACT_SHADOW_SHIFT_PX : -CONTACT_SHADOW_SHIFT_PX

  return (
    <div
      ref={areaRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: radius,
        background: ground,
        transition: `background-color ${CROSSFADE_MS}ms ${CROSSFADE_EASE_CSS}`,
        ...style,
      }}
    >
      <Glow colorway={colorway} />
      <div ref={driftRef} className="relative flex h-full w-full items-center justify-center">
        <div ref={unitRef} className="relative" style={{ width: unitWidth }}>
          <div
            aria-hidden
            className="absolute bottom-[6%] left-1/2 h-[6%] w-[52%] rounded-[50%] bg-ink"
            style={{
              opacity: 0.14,
              filter: 'blur(14px)',
              transform: `translateX(calc(-50% + ${shadowShift}px))`,
              transition: `transform ${CROSSFADE_MS}ms ${CROSSFADE_EASE_CSS}`,
            }}
          />
          <ProductShot colorway={colorway.id} caption={false} {...shot} />
        </div>
      </div>
      {children}
    </div>
  )
}
