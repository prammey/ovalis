import { Footer } from '../components/Footer'
import { ColorwaySelector } from '../sections/ColorwaySelector'
import { Craft } from '../sections/Craft'
import { Opening } from '../sections/opening/Opening'
import { Silence } from '../sections/Silence'

export function Home() {
  return (
    <>
      <Opening />
      <main className="bg-bone">
        <ColorwaySelector />
        <Craft />
        <Silence />
      </main>
      <Footer />
    </>
  )
}
