import { Footer } from '../components/Footer'
import { ProductStage } from '../components/ProductStage'
import { getColorway } from '../data/colorways'

export function About() {
  const wood = getColorway('element-wood')!
  return (
    <>
      <main className="mx-auto max-w-[1120px] px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <h1 className="font-display max-w-[16ch] text-[2.8rem] italic leading-tight md:text-[4rem]">
          We make one speaker, and we make it slowly.
        </h1>
        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <div className="flex flex-col gap-6 text-graphite">
            <p>
              Ovalis began in a furniture workshop in Delft. Two makers, one lathe, and a
              question about why the objects that fill a room with sound so rarely deserve
              to be looked at.
            </p>
            <p>
              The Luma-One is the answer we kept coming back to. A flattened ellipse on a
              turned foot. Wool, ash, aluminium. Nineteen finishes, forty at a time.
            </p>
            <p>Nothing here is real. But it could be.</p>
          </div>
          <ProductStage colorway={wood} className="aspect-[4/3]" unitWidth="72%" radius="2rem" />
        </div>
      </main>
      <Footer />
    </>
  )
}
