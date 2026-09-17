import type { CSSProperties } from 'react'
import {
  HERO_TEXT_ERASE_FROM,
  HERO_TEXT_MASK_BLEED_EM,
  HERO_TEXT_MASK_SOFT_PCT,
  HERO_TEXT_REVEAL_FROM,
} from '../../config/motion'

/**
 * One hero line, filled and then emptied by a soft gradient edge sweeping up
 * from the bottom.
 *
 * Each sweep is a `mask-image` gradient driven by a CSS custom property that
 * the timeline animates. An earlier version slid opaque navy panels over the
 * type instead — cheaper to composite, but a panel covers whatever it overlaps,
 * and at this leading the descender of "Age" shares vertical space with the
 * line below, so the neighbouring panel cropped it. A mask only ever affects
 * its own element's pixels, so the lines may overlap as much as the type needs.
 *
 * Both wrappers are bled past the line box (cancelled by an equal negative
 * margin, so the leading is unchanged) to bring descenders inside the masked
 * area. One mask per element, so reveal and erase are nested rather than merged.
 */
export function HeroLine({ text }: { text: string }) {
  const soft = HERO_TEXT_MASK_SOFT_PCT
  // Opaque below the edge, clear above it: the line fills from the bottom up.
  const revealMask = `linear-gradient(to top, #000 calc(var(--reveal) * 100% - ${soft}%), transparent calc(var(--reveal) * 100%))`
  // The mirror — clear below the edge, opaque above — so it empties the same way.
  const eraseMask = `linear-gradient(to top, transparent calc(var(--erase) * 100%), #000 calc(var(--erase) * 100% + ${soft}%))`

  const layer = (mask: string, variable: string, value: number): CSSProperties => ({
    paddingTop: `${HERO_TEXT_MASK_BLEED_EM}em`,
    paddingBottom: `${HERO_TEXT_MASK_BLEED_EM}em`,
    marginTop: `-${HERO_TEXT_MASK_BLEED_EM}em`,
    marginBottom: `-${HERO_TEXT_MASK_BLEED_EM}em`,
    [variable]: value,
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  })

  return (
    <span data-sweep="erase" className="block" style={layer(eraseMask, '--erase', HERO_TEXT_ERASE_FROM)}>
      <span data-sweep="reveal" className="block" style={layer(revealMask, '--reveal', HERO_TEXT_REVEAL_FROM)}>
        {text}
      </span>
    </span>
  )
}
