import { useRef } from 'react'
import { ColorwayCard } from '../components/ColorwayCard'
import { Footer } from '../components/Footer'
import { collections, colorwaysIn } from '../data/colorways'
import { useReveal } from '../hooks/useReveal'

export function Collections() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <>
      <main ref={ref} className="mx-auto max-w-[1120px] px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <header className="max-w-[34rem]" data-reveal>
          <h1 className="font-display text-[3rem] md:text-[4rem]">Three collections.</h1>
          <p className="mt-4 text-graphite">One object, nineteen ways to sit in a room.</p>
        </header>
        {collections.map((col) => (
          <section key={col.id} id={col.id} className="mt-24 scroll-mt-28 md:mt-32" aria-labelledby={`${col.id}-heading`}>
            <div className="flex flex-col gap-2 border-t border-divider pt-6 md:flex-row md:items-baseline md:justify-between" data-reveal>
              <h2 id={`${col.id}-heading`} className="font-display text-[2rem]">
                {col.name}
              </h2>
              <p className="text-graphite">{col.line}</p>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {colorwaysIn(col.id).map((c) => (
                <li key={c.id} data-reveal>
                  <ColorwayCard colorway={c} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer />
    </>
  )
}
