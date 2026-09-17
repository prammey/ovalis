import { ProductShot } from '../../components/ProductShot'
import { ProductStage } from '../../components/ProductStage'
import { getColorway } from '../../data/colorways'
import { TestShell } from './TestShell'

const HERO_SRCSET = '/herospeaker@1x.webp 900w, /herospeaker.webp 1492w'

/** The one real render beside the drawn fallback, and the three material treatments. */
export function Placeholder() {
  const navy = getColorway('foundations-navy')!
  const wood = getColorway('element-wood')!
  const chrome = getColorway('element-aluminum-chrome')!
  const sunshine = getColorway('flores-sunshine')!
  const black = getColorway('foundations-black')!
  const white = getColorway('foundations-white')!

  return (
    <TestShell title="placeholder" note="render vs. drawn silhouette">
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-2 md:px-12">
        <div>
          <ProductShot colorway="foundations-navy" src="/herospeaker@1x.webp" srcSet={HERO_SRCSET} sizes="(min-width: 768px) 40vw, 90vw" priority />
          <p className="mt-4 text-sm text-graphite">The render, through the same component.</p>
        </div>
        <div>
          <ProductShot colorway="foundations-navy" />
          <p className="mt-4 text-sm text-graphite">The same finish with no file present.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 pb-24 md:grid-cols-3 md:px-12">
        {[navy, wood, chrome, sunshine, black, white].map((c) => (
          <ProductStage key={c.id} colorway={c} className="aspect-[4/3]" unitWidth="76%" radius="1.5rem">
            <div className="font-mono absolute bottom-4 left-5 text-[11px] tracking-[0.08em] text-slate">
              {c.name} · {c.materialType}
            </div>
          </ProductStage>
        ))}
      </section>
    </TestShell>
  )
}
