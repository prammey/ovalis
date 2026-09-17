import {
  HERO_TEXT_CURTAIN_CLEAR_PCT,
  HERO_TEXT_CURTAIN_SOLID_PCT,
} from '../../config/motion'

/**
 * One hero line, revealed and later erased by two navy "curtains" that slide
 * up over it. Each curtain is a gradient from solid navy to transparent, so
 * its leading edge is soft: the line fades in and out through a gradient
 * rather than being cut.
 *
 * The curtains are painted once and moved with `transform` alone, which keeps
 * the whole effect on the compositor — animating a mask or a gradient stop
 * would repaint the type every frame.
 *
 * Geometry: each curtain is three line-heights tall and offset so that at rest
 * the reveal curtain sits solidly over the line and the erase curtain sits
 * just below it. Both travel upward, so the line fills and empties from the
 * bottom up. The line box carries padding (cancelled by an equal negative
 * margin, so spacing is unchanged) to give descenders room inside the
 * `overflow: hidden` that clips the curtains to this line alone.
 */
export function HeroLine({ text }: { text: string }) {
  const solid = `var(--navy) 0%, var(--navy) ${HERO_TEXT_CURTAIN_SOLID_PCT}%`
  const clear = `transparent ${HERO_TEXT_CURTAIN_CLEAR_PCT}%`
  const curtain = 'pointer-events-none absolute left-[-6%] right-[-6%] h-[300%]'

  return (
    <span className="relative block overflow-hidden py-[0.22em] my-[-0.22em]">
      <span className="block">{text}</span>
      <span
        aria-hidden
        data-curtain="reveal"
        className={`${curtain} top-[-100%]`}
        style={{ background: `linear-gradient(to bottom, ${solid}, ${clear})`, willChange: 'transform' }}
      />
      <span
        aria-hidden
        data-curtain="erase"
        className={`${curtain} top-full`}
        style={{ background: `linear-gradient(to top, ${solid}, ${clear})`, willChange: 'transform' }}
      />
    </span>
  )
}
