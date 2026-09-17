import { HERO_TEXT_BANDS } from '../../config/motion'

/**
 * One hero line rendered as N stacked copies, each clipped to a horizontal
 * band. The scrub translates the bands back into alignment so the letters
 * read as assembling. Clip paths are static; only transform and opacity move.
 */
export function SlicedLine({ text, className = '' }: { text: string; className?: string }) {
  const bands = Array.from({ length: HERO_TEXT_BANDS }, (_, i) => i)
  return (
    <span className={`relative block ${className}`} aria-label={text} role="text">
      {bands.map((i) => {
        const top = (i / HERO_TEXT_BANDS) * 100
        const bottom = 100 - ((i + 1) / HERO_TEXT_BANDS) * 100
        return (
          <span
            key={i}
            data-band={i}
            aria-hidden={i !== 0}
            className={i === 0 ? 'relative block' : 'absolute inset-0 block'}
            style={{ clipPath: `inset(${top}% -2% ${bottom}% -2%)`, willChange: 'transform' }}
          >
            {text}
          </span>
        )
      })}
    </span>
  )
}
