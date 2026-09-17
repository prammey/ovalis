import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

/** Home section 4: one line, enormous margins, nothing else. */
export function Silence({ line = 'An object first.' }: { line?: string }) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} className="flex min-h-[80svh] items-center justify-center px-6 py-32 md:py-48" aria-label={line}>
      <p data-reveal className="font-display max-w-none text-center text-[2.4rem] italic leading-tight md:text-[3.6rem]">
        {line}
      </p>
    </section>
  )
}
