import { CARD_HOVER_EASE_CSS, CARD_HOVER_GLOW_GAIN, CARD_HOVER_MS, CARD_LIFT_PX } from '../config/motion'
import { formatPrice, type Colorway } from '../data/colorways'
import { mix } from '../lib/color'
import { TransitionLink } from '../lib/navigation'
import { Glow } from './Glow'
import { ProductShot } from './ProductShot'

/** One finish on a ground tinted from its own hue. Hover lifts it and warms its glow. */
export function ColorwayCard({ colorway }: { colorway: Colorway }) {
  const ground = mix('#E2DACA', colorway.hex, 0.2)
  const motion = `${CARD_HOVER_MS}ms ${CARD_HOVER_EASE_CSS}`
  return (
    <TransitionLink
      to={`/luma-one/${colorway.id}`}
      className="group block rounded-[1.6rem] focus-visible:outline-offset-4"
      aria-label={`Luma-One in ${colorway.name}, ${formatPrice(colorway.price)}`}
    >
      <div
        className="relative overflow-hidden rounded-[1.6rem] will-change-transform"
        style={{ background: ground, transition: `transform ${motion}` }}
      >
        <style>{`.group:hover > div:first-child, .group:focus-visible > div:first-child { transform: translateY(-${CARD_LIFT_PX}px); }`}</style>
        <Glow colorway={colorway} />
        <Glow
          colorway={colorway}
          gain={CARD_HOVER_GLOW_GAIN}
          className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ transition: `opacity ${motion}` }}
        />
        <div className="relative px-[12%] pb-[6%] pt-[10%]">
          <ProductShot colorway={colorway.id} caption={false} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between px-1">
        <span className="font-display text-[1.15rem]">{colorway.name}</span>
        <span className="font-mono text-[11px] tracking-[0.08em] text-slate">{formatPrice(colorway.price)}</span>
      </div>
    </TransitionLink>
  )
}
