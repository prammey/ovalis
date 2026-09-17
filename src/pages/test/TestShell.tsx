import type { ReactNode } from 'react'
import { TransitionLink } from '../../lib/navigation'

type Props = {
  title: string
  note?: string
  /** Use when the page carries its own dark field. */
  dark?: boolean
  children: ReactNode
}

/** Frame for the experimental pages: a small mono header and a way back. */
export function TestShell({ title, note, dark = false, children }: Props) {
  return (
    <main className={`min-h-svh ${dark ? 'bg-ink text-bone' : 'bg-bone text-ink'}`}>
      <header className="flex items-baseline justify-between px-6 pt-8 md:px-12">
        <div className="font-mono text-[11px] tracking-[0.08em] text-slate">
          test / {title}
          {note && <span className="ml-4 hidden md:inline">{note}</span>}
        </div>
        <TransitionLink to="/" className="quiet-link text-sm text-graphite">
          Back to Ovalis
        </TransitionLink>
      </header>
      {children}
    </main>
  )
}
