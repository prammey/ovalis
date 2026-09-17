import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CROSSFADE_EASE_CSS, CROSSFADE_MS } from '../config/motion'
import { colorways, getColorway, type Colorway } from '../data/colorways'
import { preloadNeighbours, renderSrc } from '../lib/renders'
import { SHOT_HEIGHT, SHOT_WIDTH, Silhouette } from './Silhouette'

export type ProductShotProps = {
  /** Colorway id, e.g. `flores-sunshine`. */
  colorway: string
  /** Explicit render. Overrides the /colorways lookup. */
  src?: string
  srcSet?: string
  sizes?: string
  /** Show the finish name beneath in mono. */
  caption?: boolean
  /** Load eagerly and at high priority (the hero). Everything else is lazy. */
  priority?: boolean
  className?: string
  style?: CSSProperties
}

type Layer = {
  key: string
  colorway: Colorway
  src?: string
  srcSet?: string
}

/**
 * Every appearance of the Luma-One. Resolves a source in order:
 * explicit `src` → `/colorways/<id>.webp` (if present) → drawn silhouette.
 * Changing `colorway` cross-fades between the two states rather than cutting.
 */
export function ProductShot({
  colorway,
  src,
  srcSet,
  sizes,
  caption = true,
  priority = false,
  className = '',
  style,
}: ProductShotProps) {
  const data = getColorway(colorway) ?? colorways[0]
  const resolvedSrc = src ?? renderSrc(data.id)
  const current: Layer = { key: `${data.id}|${resolvedSrc ?? ''}`, colorway: data, src: resolvedSrc, srcSet }

  const last = useRef<Layer>(current)
  const [leaving, setLeaving] = useState<{ layer: Layer; fading: boolean } | null>(null)

  useEffect(() => {
    if (last.current.key === current.key) return
    const previous = last.current
    last.current = current
    setLeaving({ layer: previous, fading: false })
    const raf = requestAnimationFrame(() => setLeaving((l) => (l ? { ...l, fading: true } : l)))
    const timer = window.setTimeout(() => setLeaving(null), CROSSFADE_MS + 50)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.key])

  useEffect(() => {
    preloadNeighbours(data.id)
  }, [data.id])

  return (
    <figure className={`m-0 ${className}`} style={style}>
      <div className="relative w-full" style={{ aspectRatio: `${SHOT_WIDTH} / ${SHOT_HEIGHT}` }}>
        <ShotLayer layer={current} priority={priority} sizes={sizes} />
        {leaving && (
          <div
            className="absolute inset-0"
            style={{
              opacity: leaving.fading ? 0 : 1,
              transition: `opacity ${CROSSFADE_MS}ms ${CROSSFADE_EASE_CSS}`,
              pointerEvents: 'none',
            }}
          >
            <ShotLayer layer={leaving.layer} priority={false} sizes={sizes} />
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="font-mono mt-3 text-center text-[11px] tracking-[0.08em] text-slate">
          {data.name}
        </figcaption>
      )}
    </figure>
  )
}

function ShotLayer({ layer, priority, sizes }: { layer: Layer; priority: boolean; sizes?: string }) {
  const [state, setState] = useState<'pending' | 'loaded' | 'failed'>('pending')
  const showImage = Boolean(layer.src) && state !== 'failed'

  return (
    <>
      {/* silhouette always sits underneath; the render fades over it once decoded */}
      <Silhouette colorway={layer.colorway} className="absolute inset-0 h-full w-full" />
      {showImage && (
        <img
          src={layer.src}
          srcSet={layer.srcSet}
          sizes={sizes}
          width={SHOT_WIDTH}
          height={SHOT_HEIGHT}
          alt={`Luma-One in ${layer.colorway.name}`}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          draggable={false}
          onLoad={() => setState('loaded')}
          onError={() => setState('failed')}
          className="absolute inset-0 h-full w-full object-contain select-none"
          style={{
            opacity: state === 'loaded' ? 1 : 0,
            transition: `opacity ${CROSSFADE_MS}ms ${CROSSFADE_EASE_CSS}`,
          }}
        />
      )}
    </>
  )
}
