import type { CSSProperties } from 'react'

type Props = {
  /** Font size of the letters; the mark scales with it. */
  size?: string
  color?: string
  /** Hide the letters and show just the mark. */
  markOnly?: boolean
  className?: string
  style?: CSSProperties
}

/** The tilted-ellipse mark. Drawn once here so it matches everywhere. */
export function OvalisMark({ size = '1em', color = 'currentColor' }: { size?: string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="rotate(-32 12 12)">
        <ellipse cx="12" cy="12" rx="9" ry="6" stroke={color} strokeWidth="1.1" />
        <ellipse cx="12" cy="12" rx="6.2" ry="3.9" stroke={color} strokeWidth="0.8" strokeDasharray="1.6 2.2" />
      </g>
    </svg>
  )
}

export function Wordmark({ size = '1rem', color, markOnly = false, className = '', style }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-[0.55em] ${className}`}
      style={{ fontSize: size, color, ...style }}
      aria-label="Ovalis"
      role="img"
    >
      <OvalisMark size="1.05em" />
      {!markOnly && <span className="wordmark">Ovalis</span>}
    </span>
  )
}
