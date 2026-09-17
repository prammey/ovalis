import { GRAIN_OPACITY } from '../config/motion'

/** Fixed film grain over everything. Does not scroll with content. */
export function GrainOverlay() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] h-full w-full mix-blend-multiply"
      style={{ opacity: GRAIN_OPACITY }}
    >
      <filter id="ovalis-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ovalis-grain)" />
    </svg>
  )
}
