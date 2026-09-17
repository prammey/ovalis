import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const NOTES = [
  { index: '01', name: 'Woven wool grille', line: 'Loomed in Tilburg. Cut by hand.' },
  { index: '02', name: 'Turned pedestal', line: 'One piece. Ash or aluminium.' },
  { index: '03', name: 'Stretched shell', line: 'Fabric held by tension, not glue.' },
]

/** Home section 3: three notes on how it is made. Nothing about how it sounds. */
export function Craft() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} className="mx-auto max-w-[1120px] px-6 py-24 md:px-8 md:py-32" aria-labelledby="craft-heading">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <div data-reveal>
          <h2 id="craft-heading" className="font-display text-[2.6rem] md:text-[3.2rem]">
            Made slowly.
          </h2>
          <p className="mt-6 text-graphite">Every Luma-One leaves the studio in a run of forty. We keep one.</p>
        </div>
        <ul className="flex flex-col divide-y divide-divider">
          {NOTES.map((n) => (
            <li key={n.index} data-reveal className="grid grid-cols-[3rem_1fr] items-baseline gap-4 py-6 md:grid-cols-[4rem_1fr_1.3fr]">
              <span className="font-mono text-[11px] tracking-[0.08em] text-slate">{n.index}</span>
              <span className="font-display text-xl">{n.name}</span>
              <span className="col-start-2 text-graphite md:col-start-3">{n.line}</span>
            </li>
          ))}
        </ul>
      </div>
      <blockquote data-reveal className="mt-24 flex max-w-[34rem] gap-6 md:mt-32">
        <span aria-hidden className="mt-3 h-px w-10 shrink-0 bg-clay" />
        <p className="font-display text-2xl italic leading-snug md:text-3xl">It should look right switched off.</p>
      </blockquote>
    </section>
  )
}
