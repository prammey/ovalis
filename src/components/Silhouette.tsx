import { useId, type CSSProperties } from 'react'
import type { Colorway } from '../data/colorways'
import { darken, lighten, luminance, rgba } from '../lib/color'

/** Same frame as the real render (1492×1023) so nothing reflows when files arrive. */
export const SHOT_WIDTH = 1492
export const SHOT_HEIGHT = 1023

type Props = { colorway: Colorway; className?: string; style?: CSSProperties }

/**
 * The drawn Luma-One: a tilted ellipse on a flared pedestal, filled in the
 * finish's own hex. Positioned to sit exactly where the render's silhouette
 * sits. Reads as an illustration, not as a missing asset.
 */
export function Silhouette({ colorway, className, style }: Props) {
  const uid = useId().replace(/:/g, '')
  const { hex, materialType } = colorway
  const dark = luminance(hex) < 0.25
  const body = materialType === 'metal' ? hex : dark ? lighten(hex, 0.05) : hex
  const grille = dark ? lighten(hex, 0.09) : darken(hex, 0.14)
  const foot = dark ? lighten(hex, 0.03) : darken(hex, 0.08)
  const edge = dark ? lighten(hex, 0.18) : darken(hex, 0.16)

  const rim = `${uid}-rim`
  const sheen = `${uid}-sheen`
  const footGrad = `${uid}-foot`
  const weave = `${uid}-weave`
  const grain = `${uid}-grain`
  const brushed = `${uid}-brushed`
  const blur = `${uid}-blur`

  return (
    <svg
      viewBox={`0 0 ${SHOT_WIDTH} ${SHOT_HEIGHT}`}
      className={className}
      style={style}
      role="img"
      aria-label={`Luma-One in ${colorway.name}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={rim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity={dark ? 0.55 : 0.7} />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.38" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="0.62" stopColor="#000000" stopOpacity="0.02" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={footGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.28" />
        </linearGradient>
        <pattern id={weave} width="7" height="7" patternUnits="userSpaceOnUse">
          <path d="M0 3.5H7M3.5 0V7" stroke="#000" strokeOpacity={dark ? 0.22 : 0.1} strokeWidth="1.2" />
          <path d="M0 0H7M0 7H7" stroke="#fff" strokeOpacity={dark ? 0.05 : 0.14} strokeWidth="0.6" />
        </pattern>
        <pattern id={grain} width="56" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(-33)">
          <path d="M0 5.5q14-3 28 0t28 0" fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="1.4" />
          <path d="M0 9.5q10 2 28 0t28 0" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="0.8" />
        </pattern>
        <pattern id={brushed} width="6" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-33)">
          <path d="M0 1.5H6" stroke="#000" strokeOpacity="0.09" strokeWidth="0.8" />
        </pattern>
        <filter id={blur} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* contact shadow */}
      <ellipse cx="790" cy="906" rx="330" ry="30" fill="#000" fillOpacity="0.3" filter={`url(#${blur})`} />

      {/* pedestal foot */}
      <ellipse cx="763" cy="880" rx="306" ry="44" fill={foot} />
      <ellipse cx="763" cy="880" rx="306" ry="44" fill={`url(#${footGrad})`} />
      <ellipse cx="763" cy="878" rx="304" ry="42" fill="none" stroke={edge} strokeOpacity="0.5" strokeWidth="1.5" />

      {/* stem: leaves the back of the disc, flares into the foot */}
      <path d="M810 720 C 800 790, 780 830, 700 862 L 1010 862 C 960 830, 950 790, 950 720 Z" fill={foot} />
      <path d="M810 720 C 800 790, 780 830, 700 862 L 1010 862 C 960 830, 950 790, 950 720 Z" fill={`url(#${footGrad})`} />

      {/* the disc: a back shell for thickness, the face, the grille inset into it */}
      <g transform="rotate(-27 770 445)">
        <ellipse cx="796" cy="472" rx="478" ry="318" fill={darken(body, dark ? 0.35 : 0.22)} />
        <ellipse cx="770" cy="445" rx="480" ry="320" fill={body} />
        {materialType === 'metal' && <ellipse cx="770" cy="445" rx="480" ry="320" fill={`url(#${sheen})`} />}
        {materialType === 'metal' && <ellipse cx="770" cy="445" rx="480" ry="320" fill={`url(#${brushed})`} />}
        {materialType === 'wood' && <ellipse cx="770" cy="445" rx="480" ry="320" fill={`url(#${grain})`} />}
        <ellipse cx="762" cy="438" rx="430" ry="282" fill={grille} />
        <ellipse cx="762" cy="438" rx="430" ry="282" fill={`url(#${weave})`} />
        <ellipse cx="762" cy="438" rx="430" ry="282" fill="none" stroke={rgba('#000000', dark ? 0.35 : 0.12)} strokeWidth="2" />
        <ellipse cx="770" cy="445" rx="476" ry="316" fill="none" stroke={`url(#${rim})`} strokeWidth="7" />
        <ellipse cx="770" cy="445" rx="480" ry="320" fill="none" stroke={edge} strokeOpacity="0.45" strokeWidth="1.5" />
      </g>
    </svg>
  )
}
