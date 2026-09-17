import { Footer } from '../components/Footer'

export function Contact() {
  return (
    <>
      <main className="mx-auto max-w-[1120px] px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <h1 className="font-display text-[3rem] md:text-[4rem]">Write to us.</h1>
        <div className="mt-16 grid grid-cols-1 gap-12 text-[17px] md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] tracking-[0.08em] text-slate">Email</span>
            <a href="mailto:hello@ovalis.example" className="quiet-link self-start">
              hello@ovalis.example
            </a>
          </div>
          <div className="flex flex-col gap-2 text-graphite">
            <span className="font-mono text-[11px] tracking-[0.08em] text-slate">Studio</span>
            <span>Kalverstraat 12</span>
            <span>2611 Delft, NL</span>
          </div>
          <div className="flex flex-col gap-2 text-graphite">
            <span className="font-mono text-[11px] tracking-[0.08em] text-slate">Visits</span>
            <span>By appointment.</span>
            <span>Tuesdays and Thursdays.</span>
          </div>
        </div>
        <p className="font-display mt-32 text-2xl italic">We answer slowly, but we answer.</p>
      </main>
      <Footer />
    </>
  )
}
