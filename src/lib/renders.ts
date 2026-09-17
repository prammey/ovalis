import manifest from 'virtual:colorway-manifest'
import { neighboursOf, renderPath } from '../data/colorways'

const present = new Set(manifest)

/** True when a real render for this finish exists in /public/colorways. */
export function hasRender(colorwayId: string): boolean {
  return present.has(`${colorwayId}.webp`)
}

/** Path to the real render, or undefined when the finish is still a placeholder. */
export function renderSrc(colorwayId: string): string | undefined {
  return hasRender(colorwayId) ? renderPath(colorwayId) : undefined
}

const warmed = new Set<string>()

/**
 * Warms the browser cache for the finishes either side of `colorwayId` so a
 * switch is instant. Skips finishes with no render, so nothing is requested
 * that would 404, and swallows any failure.
 */
export function preloadNeighbours(colorwayId: string): void {
  for (const n of neighboursOf(colorwayId)) {
    const src = renderSrc(n.id)
    if (!src || warmed.has(src)) continue
    warmed.add(src)
    try {
      const img = new Image()
      img.onerror = () => {}
      img.decoding = 'async'
      img.src = src
    } catch {
      /* never block a render over a warm-up */
    }
  }
}
