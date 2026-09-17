import { TransitionLink } from '../lib/navigation'

export function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-display text-5xl italic">Nothing here.</h1>
      <TransitionLink to="/" className="quiet-link text-graphite">
        Back to the beginning
      </TransitionLink>
    </main>
  )
}
