import type { ReactNode } from 'react'
import { collections } from '../data/colorways'
import { TransitionLink } from '../lib/navigation'
import { TEST_PAGES } from './Navbar'
import { Wordmark } from './Wordmark'

/** Procedural concrete: fine grain over a slow mottle, both from feTurbulence. */
function Concrete() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
      <filter id="footer-mottle" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="3" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" intercept="-0.05" />
        </feComponentTransfer>
      </filter>
      <filter id="footer-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#footer-mottle)" style={{ mixBlendMode: 'soft-light' }} opacity="0.9" />
      <rect width="100%" height="100%" filter="url(#footer-grain)" style={{ mixBlendMode: 'soft-light' }} opacity="0.35" />
      <rect width="100%" height="100%" filter="url(#footer-grain)" style={{ mixBlendMode: 'multiply' }} opacity="0.08" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-smoke text-porcelain">
      <Concrete />
      <div className="relative mx-auto max-w-[1120px] px-6 pb-10 pt-20 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Wordmark size="1rem" />
            <p className="font-display text-2xl italic text-porcelain/90">Speakers made like furniture.</p>
          </div>
          <FooterColumn title="Luma-One">
            <TransitionLink to="/collections" className="quiet-link">
              All finishes
            </TransitionLink>
            {collections.map((c) => (
              <TransitionLink key={c.id} to={`/collections#${c.id}`} className="quiet-link">
                {c.name}
              </TransitionLink>
            ))}
          </FooterColumn>
          <FooterColumn title="Ovalis">
            <TransitionLink to="/about" className="quiet-link">
              About
            </TransitionLink>
            <TransitionLink to="/contact" className="quiet-link">
              Contact
            </TransitionLink>
            <TransitionLink to={TEST_PAGES[0].to} className="quiet-link">
              Test pages
            </TransitionLink>
          </FooterColumn>
          <FooterColumn title="Studio">
            <span>Kalverstraat 12</span>
            <span>Delft, NL</span>
            <span className="mt-2 text-porcelain/60">Made in small runs.</span>
          </FooterColumn>
        </div>
        <div className="mt-20 flex flex-col gap-2 border-t border-porcelain/15 pt-6 text-[12px] text-porcelain/60 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Ovalis</span>
          <span className="font-mono tracking-[0.08em]">A fictional brand. Nothing here is for sale.</span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 text-[15px]">
      <span className="font-mono mb-2 text-[11px] tracking-[0.08em] text-porcelain/55">{title}</span>
      {children}
    </div>
  )
}
