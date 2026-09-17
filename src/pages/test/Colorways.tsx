import { ProductShot } from '../../components/ProductShot'
import { collections, colorwaysIn, formatPrice } from '../../data/colorways'
import { mix } from '../../lib/color'
import { TransitionLink } from '../../lib/navigation'
import { hasRender } from '../../lib/renders'
import { TestShell } from './TestShell'

/** Every finish as a contact sheet with its data. */
export function Colorways() {
  return (
    <TestShell title="colorways" note="all nineteen, with their data">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-20 px-6 pb-40 pt-16 md:px-12">
        {collections.map((col) => (
          <section key={col.id}>
            <h2 className="font-display text-[1.6rem]">{col.name}</h2>
            <ul className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {colorwaysIn(col.id).map((c) => (
                <li key={c.id}>
                  <TransitionLink to={`/luma-one/${c.id}`} className="block rounded-2xl">
                    <div className="rounded-2xl px-6 pb-3 pt-5" style={{ background: mix('#E2DACA', c.hex, 0.22) }}>
                      <ProductShot colorway={c.id} caption={false} sizes="(min-width: 1024px) 22vw, 45vw" />
                    </div>
                    <dl className="font-mono mt-3 grid grid-cols-[4.5rem_1fr] gap-y-0.5 text-[11px] tracking-[0.06em] text-slate">
                      <dt>name</dt>
                      <dd className="m-0 text-ink">{c.name}</dd>
                      <dt>id</dt>
                      <dd className="m-0">{c.id}</dd>
                      <dt>hex</dt>
                      <dd className="m-0 flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full border border-divider" style={{ background: c.hex }} />
                        {c.hex}
                      </dd>
                      <dt>material</dt>
                      <dd className="m-0">{c.materialType}</dd>
                      <dt>glow α</dt>
                      <dd className="m-0">{c.glowAlpha}</dd>
                      <dt>price</dt>
                      <dd className="m-0">{formatPrice(c.price)}</dd>
                      <dt>render</dt>
                      <dd className="m-0">{hasRender(c.id) ? 'file' : 'drawn'}</dd>
                    </dl>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </TestShell>
  )
}
