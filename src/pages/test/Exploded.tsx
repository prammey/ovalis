import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { gsap } from '../../lib/gsap'
import { TestShell } from './TestShell'

/** Direction the front of the unit travels when exploded (unit vector, up-left). */
const AXIS = { x: -0.8, y: -0.6 }
/** Distance in viewBox units between adjacent parts at full explosion. */
const SPREAD = 78
/** Scroll distance the drawing is pinned for, as a multiple of viewport height. */
const PIN_VH = 2.4

type Part = {
  id: string
  /** Position along the axis: positive is toward the viewer. */
  k: number
  label: string
  note: string
  /** Where the leader line starts on the part (viewBox coords, unrotated frame). */
  anchor: [number, number]
  /** Where the label sits. */
  labelAt: [number, number]
}

const PARTS: Part[] = [
  { id: 'ring', k: 3, label: '01  Grille ring', note: 'anodised aluminium', anchor: [-330, -140], labelAt: [-250, 60] },
  { id: 'grille', k: 2, label: '02  Wool grille', note: 'loomed, cut by hand', anchor: [-200, -230], labelAt: [-250, 140] },
  { id: 'baffle', k: 1, label: '03  Baffle', note: 'three drivers', anchor: [0, -260], labelAt: [-250, 220] },
  { id: 'brace', k: 0, label: '04  Chamber brace', note: 'cast, single piece', anchor: [300, -120], labelAt: [1190, 120] },
  { id: 'board', k: -1, label: '05  Amplifier board', note: 'behind the brace', anchor: [280, 60], labelAt: [1190, 260] },
  { id: 'shell', k: -2, label: '06  Back shell', note: 'stretched, not glued', anchor: [360, 200], labelAt: [1190, 400] },
  { id: 'pedestal', k: -3.2, label: '07  Pedestal', note: 'turned ash', anchor: [80, 330], labelAt: [1190, 700] },
]

const CX = 560
const CY = 400
const TILT = -27

/** Scroll-driven technical drawing: the unit's parts separate along its axis with mono annotations. */
export function Exploded() {
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const svg = svgRef.current
    if (!section || !svg) return
    const parts = PARTS.map((p) => ({ p, el: svg.querySelector<SVGGElement>(`[data-part="${p.id}"]`)! }))
    const annotations = Array.from(svg.querySelectorAll<SVGGElement>('[data-annotation]'))

    if (prefersReducedMotion()) {
      parts.forEach(({ p, el }) => gsap.set(el, { x: AXIS.x * SPREAD * p.k, y: AXIS.y * SPREAD * p.k }))
      gsap.set(annotations, { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * PIN_VH)}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      parts.forEach(({ p, el }) => {
        tl.fromTo(el, { x: 0, y: 0 }, { x: AXIS.x * SPREAD * p.k, y: AXIS.y * SPREAD * p.k, ease: 'power2.inOut', duration: 0.7 }, 0)
      })
      gsap.set(annotations, { opacity: 0 })
      tl.to(annotations, { opacity: 1, duration: 0.25, stagger: 0.03, ease: 'none' }, 0.55)
      tl.set({}, {}, 1)
    }, section)
    return () => ctx.revert()
  }, [])

  const stroke = 'var(--ink)'
  const thin = 'var(--slate)'

  return (
    <TestShell title="exploded" note="scroll to separate the parts">
      <section ref={sectionRef} className="relative h-svh w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="-320 -220 1840 1240"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Exploded drawing of the Luma-One: grille ring, wool grille, baffle with three drivers, chamber brace, amplifier board, back shell and pedestal."
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <pattern id="weave-lines" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform={`rotate(${TILT})`}>
              <path d="M0 5H10M5 0V10" stroke={thin} strokeWidth="0.5" strokeOpacity="0.5" />
            </pattern>
          </defs>

          {/* 07 pedestal */}
          <g data-part="pedestal" stroke={stroke} strokeWidth="1.2">
            <ellipse cx={CX + 20} cy={CY + 330} rx="170" ry="26" />
            <ellipse cx={CX + 20} cy={CY + 322} rx="160" ry="20" stroke={thin} strokeWidth="0.7" />
            <path d={`M${CX + 40} ${CY + 210} C ${CX + 34} ${CY + 260}, ${CX + 20} ${CY + 290}, ${CX - 40} ${CY + 314} M${CX + 120} ${CY + 210} C ${CX + 100} ${CY + 260}, ${CX + 105} ${CY + 290}, ${CX + 160} ${CY + 314}`} />
            <path d={`M${CX + 40} ${CY + 210} Q ${CX + 80} ${CY + 200} ${CX + 120} ${CY + 210}`} stroke={thin} strokeWidth="0.8" />
          </g>

          {/* 06 back shell */}
          <g data-part="shell" stroke={stroke} strokeWidth="1.2">
            <g transform={`rotate(${TILT} ${CX} ${CY})`}>
              <path d={`M${CX} ${CY - 300} A 460 300 0 0 1 ${CX} ${CY + 300}`} />
              <path d={`M${CX} ${CY - 300} A 120 300 0 0 0 ${CX} ${CY + 300}`} stroke={thin} strokeWidth="0.8" />
              <path d={`M${CX + 60} ${CY - 240} A 300 240 0 0 1 ${CX + 60} ${CY + 240}`} stroke={thin} strokeWidth="0.6" strokeDasharray="3 5" />
            </g>
          </g>

          {/* 05 amplifier board */}
          <g data-part="board" stroke={stroke} strokeWidth="1">
            <g transform={`rotate(${TILT} ${CX} ${CY})`}>
              <rect x={CX - 90} y={CY - 130} width="180" height="260" rx="8" />
              <rect x={CX - 60} y={CY - 100} width="50" height="50" rx="3" stroke={thin} strokeWidth="0.8" />
              <rect x={CX + 10} y={CY - 100} width="50" height="80" rx="3" stroke={thin} strokeWidth="0.8" />
              <circle cx={CX - 35} cy={CY + 40} r="22" stroke={thin} strokeWidth="0.8" />
              <circle cx={CX + 35} cy={CY + 40} r="22" stroke={thin} strokeWidth="0.8" />
              <path d={`M${CX - 70} ${CY + 90} H ${CX + 70} M${CX - 70} ${CY + 104} H ${CX + 40}`} stroke={thin} strokeWidth="0.6" />
            </g>
          </g>

          {/* 04 chamber brace */}
          <g data-part="brace" stroke={stroke} strokeWidth="1.1">
            <g transform={`rotate(${TILT} ${CX} ${CY})`}>
              <ellipse cx={CX} cy={CY} rx="420" ry="270" />
              <ellipse cx={CX} cy={CY} rx="300" ry="190" stroke={thin} strokeWidth="0.8" />
              <path d={`M${CX - 420} ${CY} H ${CX + 420} M${CX} ${CY - 270} V ${CY + 270} M${CX - 300} ${CY - 190} L ${CX + 300} ${CY + 190} M${CX - 300} ${CY + 190} L ${CX + 300} ${CY - 190}`} stroke={thin} strokeWidth="0.6" />
            </g>
          </g>

          {/* 03 baffle with drivers */}
          <g data-part="baffle" stroke={stroke} strokeWidth="1.2">
            <g transform={`rotate(${TILT} ${CX} ${CY})`}>
              <ellipse cx={CX} cy={CY} rx="440" ry="285" />
              <circle cx={CX - 150} cy={CY + 20} r="118" />
              <circle cx={CX - 150} cy={CY + 20} r="80" stroke={thin} strokeWidth="0.8" />
              <circle cx={CX - 150} cy={CY + 20} r="22" stroke={thin} strokeWidth="0.8" />
              <circle cx={CX + 120} cy={CY - 80} r="74" />
              <circle cx={CX + 120} cy={CY - 80} r="36" stroke={thin} strokeWidth="0.8" />
              <circle cx={CX + 190} cy={CY + 110} r="40" />
              <circle cx={CX + 190} cy={CY + 110} r="14" stroke={thin} strokeWidth="0.8" />
            </g>
          </g>

          {/* 02 wool grille */}
          <g data-part="grille" stroke={stroke} strokeWidth="1.1">
            <g transform={`rotate(${TILT} ${CX} ${CY})`}>
              <ellipse cx={CX} cy={CY} rx="430" ry="278" fill="url(#weave-lines)" />
            </g>
          </g>

          {/* 01 grille ring */}
          <g data-part="ring" stroke={stroke} strokeWidth="1.4">
            <g transform={`rotate(${TILT} ${CX} ${CY})`}>
              <ellipse cx={CX} cy={CY} rx="480" ry="320" />
              <ellipse cx={CX} cy={CY} rx="440" ry="285" stroke={thin} strokeWidth="0.8" />
            </g>
          </g>

          {/* annotations */}
          {PARTS.map((p) => {
            const a = rotate(p.anchor, TILT)
            const ax = CX + a[0] + AXIS.x * SPREAD * p.k
            const ay = CY + a[1] + AXIS.y * SPREAD * p.k
            const [lx, ly] = p.labelAt
            const right = lx > CX
            const elbowX = right ? lx - 24 : lx + 190
            return (
              <g key={p.id} data-annotation stroke={thin} strokeWidth="0.7">
                <path d={`M${ax} ${ay} L ${elbowX} ${ly - 4} L ${right ? lx - 8 : lx + 176} ${ly - 4}`} />
                <circle cx={ax} cy={ay} r="2.2" fill={thin} stroke="none" />
                <text
                  x={lx}
                  y={ly}
                  fill="var(--ink)"
                  stroke="none"
                  fontFamily="var(--font-mono)"
                  fontSize="12"
                  letterSpacing="0.06em"
                >
                  {p.label}
                </text>
                <text x={lx} y={ly + 16} fill={thin} stroke="none" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="0.06em">
                  {p.note}
                </text>
              </g>
            )
          })}

          <text x="-250" y="960" fill={thin} fontFamily="var(--font-mono)" fontSize="11" letterSpacing="0.06em" stroke="none">
            LUMA-ONE · SECTION A–A · SCALE 1:2
          </text>
        </svg>
      </section>
      <div className="mx-auto max-w-[34rem] px-6 py-32 text-center text-graphite">
        Seven parts. Nothing hidden that isn't drawn.
      </div>
    </TestShell>
  )
}

function rotate([x, y]: [number, number], deg: number): [number, number] {
  const r = (deg * Math.PI) / 180
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]
}
