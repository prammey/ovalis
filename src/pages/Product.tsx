import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Ambient } from '../components/Ambient'
import { ColorwayCard } from '../components/ColorwayCard'
import { ColorwayDots } from '../components/ColorwayDots'
import { Footer } from '../components/Footer'
import { ProductStage } from '../components/ProductStage'
import { CROSSFADE_EASE_CSS, CROSSFADE_MS } from '../config/motion'
import { collections, colorwaysIn, DEFAULT_COLORWAY_ID, formatPrice, getColorway, type Colorway } from '../data/colorways'

const MATERIAL_LABEL: Record<Colorway['materialType'], string> = {
  fabric: 'Wool over ash',
  metal: 'Anodised aluminium',
  wood: 'Oiled walnut',
}

export function Product() {
  const { colorway: id } = useParams()
  const navigate = useNavigate()
  const colorway = getColorway(id)

  useEffect(() => {
    if (colorway) document.title = `Luma-One in ${colorway.name} · Ovalis`
    return () => {
      document.title = 'Ovalis'
    }
  }, [colorway])

  if (!colorway) return <Navigate to={`/luma-one/${DEFAULT_COLORWAY_ID}`} replace />

  const collection = collections.find((c) => c.id === colorway.collection)!
  const siblings = colorwaysIn(colorway.collection).filter((c) => c.id !== colorway.id).slice(0, 4)
  const fade = { animation: `page-in ${CROSSFADE_MS}ms ${CROSSFADE_EASE_CSS}` }

  return (
    <>
      <main className="relative pb-32 pt-32 md:pt-40">
        <Ambient colorway={colorway} fixed />
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-start gap-12 px-6 md:grid-cols-[1.2fr_1fr] md:gap-16 md:px-8">
          <ProductStage
            colorway={colorway}
            tilt
            className="aspect-[4/3] md:sticky md:top-28"
            unitWidth="76%"
            radius="2.5rem"
          />
          <div className="flex flex-col gap-9 md:pt-6">
            <div>
              <h1 className="font-display text-[3rem] md:text-[3.6rem]">Luma-One</h1>
              <p key={colorway.id} className="font-display mt-1 text-[1.6rem] italic text-graphite" style={fade}>
                {colorway.name}
              </p>
              <p key={`${colorway.id}-price`} className="font-mono mt-4 text-[13px] tracking-[0.08em] text-slate" style={fade}>
                {formatPrice(colorway.price)}
              </p>
            </div>

            <ColorwayDots selected={colorway.id} onSelect={(c) => navigate(`/luma-one/${c.id}`)} />

            <dl className="grid grid-cols-[7rem_1fr] gap-y-3 border-t border-divider pt-6 text-[15px]">
              <dt className="font-mono text-[11px] tracking-[0.08em] text-slate">Collection</dt>
              <dd className="m-0">{collection.name}</dd>
              <dt className="font-mono text-[11px] tracking-[0.08em] text-slate">Shell</dt>
              <dd className="m-0">{MATERIAL_LABEL[colorway.materialType]}</dd>
              <dt className="font-mono text-[11px] tracking-[0.08em] text-slate">Size</dt>
              <dd className="font-mono m-0 text-[13px]">372 × 253 × 240 mm</dd>
              <dt className="font-mono text-[11px] tracking-[0.08em] text-slate">Weight</dt>
              <dd className="font-mono m-0 text-[13px]">4.8 kg</dd>
              <dt className="font-mono text-[11px] tracking-[0.08em] text-slate">Code</dt>
              <dd className="font-mono m-0 text-[13px]">{colorway.id}</dd>
            </dl>

            <div className="flex items-center gap-3">
              <span aria-hidden className="h-2 w-2 rounded-full bg-clay" />
              <span className="text-[15px] text-graphite">Made to order. Six weeks.</span>
            </div>
          </div>
        </div>

        <section className="mx-auto mt-32 max-w-[1120px] px-6 md:px-8" aria-labelledby="also-heading">
          <h2 id="also-heading" className="font-display text-[1.6rem]">
            Also in {collection.name}
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {siblings.map((c) => (
              <li key={c.id}>
                <ColorwayCard colorway={c} />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
