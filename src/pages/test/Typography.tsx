import { Wordmark } from '../../components/Wordmark'
import { TestShell } from './TestShell'

const Label = ({ children }: { children: string }) => (
  <span className="font-mono block text-[11px] tracking-[0.08em] text-slate">{children}</span>
)

/** The type system as a specimen sheet. */
export function Typography() {
  return (
    <TestShell title="typography" note="Fraunces · Inter 300 · JetBrains Mono">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-24 px-6 pb-40 pt-16 md:px-12">
        <section className="flex flex-col gap-6">
          <Label>Wordmark · Fraunces · 0.42em tracking</Label>
          <Wordmark size="2.4rem" />
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-[12rem_1fr]">
          <Label>Display · Fraunces SOFT 100 WONK 1</Label>
          <div className="flex flex-col gap-8">
            <p className="font-display max-w-none text-[6rem] leading-[0.95]">Luma-One</p>
            <p className="font-display max-w-none text-[4rem] italic leading-[1]">An object first.</p>
            <p className="font-display max-w-none text-[2.6rem]">Nineteen finishes.</p>
            <p className="font-display max-w-none text-[1.6rem] italic text-graphite">Made slowly, forty at a time.</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-[12rem_1fr]">
          <Label>Axes · SOFT and WONK</Label>
          <div className="grid grid-cols-2 gap-8">
            {[
              { soft: 0, wonk: 0 },
              { soft: 100, wonk: 0 },
              { soft: 0, wonk: 1 },
              { soft: 100, wonk: 1 },
            ].map(({ soft, wonk }) => (
              <div key={`${soft}-${wonk}`} className="flex flex-col gap-2">
                <p
                  className="max-w-none text-[3rem] italic leading-none"
                  style={{ fontFamily: 'var(--font-display)', fontVariationSettings: `"SOFT" ${soft}, "WONK" ${wonk}` }}
                >
                  Noise
                </p>
                <Label>{`SOFT ${soft} · WONK ${wonk}`}</Label>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-[12rem_1fr]">
          <Label>Body · Inter 300 · 17px · 34em measure</Label>
          <div className="flex flex-col gap-5">
            <p>
              The Luma-One is a flattened ellipse of wool and ash on a turned foot. It leans back a
              little, the way a good chair does, and it takes whatever colour the room gives it.
            </p>
            <p className="text-graphite">
              Secondary copy sits in graphite. Captions and codes sit in mono, in slate, and never
              carry a sentence.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-[12rem_1fr]">
          <Label>Technical · JetBrains Mono · 11–13px</Label>
          <div className="font-mono flex flex-col gap-2 text-[13px]">
            <span>foundations-navy</span>
            <span>372 × 253 × 240 mm</span>
            <span>4.8 kg</span>
            <span className="text-[11px] tracking-[0.08em] text-slate">01  GRILLE RING · ANODISED ALUMINIUM</span>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-[12rem_1fr]">
          <Label>Display on navy · mint</Label>
          <div className="rounded-[2rem] bg-navy px-10 py-14 text-mint">
            <p className="font-display max-w-none text-[5rem] italic leading-[0.94]">
              New-Age
              <br />
              Noise
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-[12rem_1fr]">
          <Label>Palette</Label>
          <ul className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {[
              ['bone', '#E2DACA'],
              ['porcelain', '#F9F6F0'],
              ['ink', '#161A1F'],
              ['graphite', '#5C5A56'],
              ['smoke', '#5D6063'],
              ['slate', '#7A7873'],
              ['navy', '#0A3D6B'],
              ['navy-deep', '#06304F'],
              ['sage', '#8C9B7E'],
              ['sage-deep', '#5A6B4C'],
              ['mint', '#A8CFA0'],
              ['clay', '#C4613A'],
            ].map(([name, hex]) => (
              <li key={name} className="flex flex-col gap-2">
                <span className="block aspect-[4/3] rounded-xl border border-divider" style={{ background: hex }} />
                <span className="font-mono text-[11px] tracking-[0.08em] text-slate">
                  {name} {hex}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </TestShell>
  )
}
