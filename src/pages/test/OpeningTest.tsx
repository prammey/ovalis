import { useState } from 'react'
import { Opening } from '../../sections/opening/Opening'
import { TransitionLink } from '../../lib/navigation'

/** Replays the load → navy fill → scroll hero on demand, ignoring the session flag. */
export function OpeningTest() {
  const [run, setRun] = useState(0)
  return (
    <>
      <Opening key={run} force />
      <main className="flex min-h-svh flex-col items-start gap-6 bg-bone px-6 py-24 md:px-12">
        <p className="font-mono text-[11px] tracking-[0.08em] text-slate">test / opening</p>
        <h2 className="font-display text-4xl">The home page would arrive here.</h2>
        <p className="text-graphite">
          Scroll back up to feel the resistance. A sustained upward gesture, or two hard flicks, gets you through.
        </p>
        <div className="flex gap-8">
          <button type="button" className="quiet-link" onClick={() => setRun((n) => n + 1)}>
            Replay
          </button>
          <TransitionLink to="/" className="quiet-link text-graphite">
            Back to Ovalis
          </TransitionLink>
        </div>
      </main>
    </>
  )
}
