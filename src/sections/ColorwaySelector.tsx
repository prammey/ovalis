import { useRef, useState } from 'react'
import { ColorwayDots } from '../components/ColorwayDots'
import { Ambient } from '../components/Ambient'
import { ProductStage } from '../components/ProductStage'
import { CROSSFADE_EASE_CSS, CROSSFADE_MS } from '../config/motion'
import { DEFAULT_COLORWAY_ID, formatPrice, getColorway, type Colorway } from '../data/colorways'
import { useReveal } from '../hooks/useReveal'
import { TransitionLink } from '../lib/navigation'

/** Home section 2: pick a finish and the whole section's light follows it. */
export function ColorwaySelector() {
  const [colorway, setColorway] = useState<Colorway>(() => getColorway(DEFAULT_COLORWAY_ID)!)
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32" aria-labelledby="finishes-heading">
      <Ambient colorway={colorway} strength={0.1} />
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-[1.15fr_1fr] md:gap-16 md:px-8">
        <div data-reveal>
          <ProductStage colorway={colorway} className="aspect-[4/3]" unitWidth="74%" radius="2.5rem" />
        </div>
        <div className="flex flex-col gap-8">
          <div data-reveal>
            <h2 id="finishes-heading" className="font-display text-[2.6rem] md:text-[3.2rem]">
              Nineteen finishes.
            </h2>
            <p className="mt-3 text-graphite">Pick one. The room changes with it.</p>
          </div>
          <div data-reveal>
            <ColorwayDots selected={colorway.id} onSelect={setColorway} />
          </div>
          <div data-reveal className="flex items-baseline gap-6 border-t border-divider pt-6">
            <span
              key={colorway.id}
              className="font-display text-2xl italic"
              style={{ animation: `page-in ${CROSSFADE_MS}ms ${CROSSFADE_EASE_CSS}` }}
            >
              {colorway.name}
            </span>
            <span className="font-mono text-[12px] tracking-[0.08em] text-slate">{formatPrice(colorway.price)}</span>
            <TransitionLink to={`/luma-one/${colorway.id}`} className="quiet-link ml-auto text-graphite">
              See it closer
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
