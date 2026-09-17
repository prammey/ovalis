import { GLOW_ALPHA_COOL, GLOW_ALPHA_WARM } from '../config/motion'

export type CollectionId = 'foundations' | 'element' | 'flores'
export type MaterialType = 'fabric' | 'metal' | 'wood'

export type Colorway = {
  /** `<collection>-<finish>`; also the render file name and the URL slug. */
  id: string
  name: string
  collection: CollectionId
  hex: string
  materialType: MaterialType
  /** Alpha of the radial glow behind the unit. Warm hues read brighter, so they get less. */
  glowAlpha: number
  /** USD */
  price: number
}

export type Collection = {
  id: CollectionId
  name: string
  /** One short line, no more. */
  line: string
}

export const collections: Collection[] = [
  { id: 'foundations', name: 'Foundations', line: 'The finishes a room is built around.' },
  { id: 'element', name: 'Element', line: 'Wood, metal, stone. Materials as they are.' },
  { id: 'flores', name: 'Flores', line: 'Five colours cut from a garden.' },
]

const W = GLOW_ALPHA_WARM
const C = GLOW_ALPHA_COOL

const cw = (
  collection: CollectionId,
  slug: string,
  name: string,
  hex: string,
  materialType: MaterialType,
  glowAlpha: number,
  price: number,
): Colorway => ({ id: `${collection}-${slug}`, name, collection, hex, materialType, glowAlpha, price })

export const colorways: Colorway[] = [
  // Foundations
  cw('foundations', 'white', 'White', '#F2EFE9', 'fabric', W, 1290),
  cw('foundations', 'black', 'Black', '#1C1C1E', 'fabric', C, 1290),
  cw('foundations', 'light-grey', 'Light Grey', '#B8B8B6', 'fabric', C, 1290),
  cw('foundations', 'dark-grey', 'Dark Grey', '#4A4A4C', 'fabric', C, 1290),
  cw('foundations', 'navy', 'Navy', '#2A3550', 'fabric', C, 1290),
  cw('foundations', 'maroon', 'Maroon', '#6B2233', 'fabric', W, 1290),
  cw('foundations', 'orange', 'Orange', '#D2662E', 'fabric', W, 1290),
  // Element
  cw('element', 'wood', 'Wood', '#6B4A32', 'wood', W, 1590),
  cw('element', 'pearl', 'Pearl', '#EDE6DA', 'fabric', W, 1390),
  cw('element', 'aluminum-chrome', 'Aluminum Chrome', '#C5C8CB', 'metal', C, 1790),
  cw('element', 'aluminum-gold', 'Aluminum Gold', '#C9A96A', 'metal', W, 1890),
  cw('element', 'aluminum-rose-gold', 'Aluminum Rose Gold', '#D4A198', 'metal', W, 1890),
  cw('element', 'sand', 'Sand', '#D8C4A0', 'fabric', W, 1390),
  cw('element', 'moss', 'Moss', '#7C8968', 'fabric', C, 1390),
  // Flores
  cw('flores', 'stem', 'Stem', '#C3D9A8', 'fabric', C, 1340),
  cw('flores', 'sunshine', 'Sunshine', '#F2D96B', 'fabric', W, 1340),
  cw('flores', 'rose', 'Rosé', '#EFC0C4', 'fabric', W, 1340),
  cw('flores', 'lavender', 'Lavender', '#C9BEDC', 'fabric', C, 1340),
  cw('flores', 'sky', 'Sky', '#AFC9DE', 'fabric', C, 1340),
]

export const DEFAULT_COLORWAY_ID = 'foundations-navy'

const byId = new Map(colorways.map((c) => [c.id, c]))

export function getColorway(id: string | undefined): Colorway | undefined {
  return id ? byId.get(id) : undefined
}

export function colorwaysIn(collection: CollectionId): Colorway[] {
  return colorways.filter((c) => c.collection === collection)
}

/** The finishes either side of `id` in catalogue order — the ones worth preloading. */
export function neighboursOf(id: string): Colorway[] {
  const i = colorways.findIndex((c) => c.id === id)
  if (i < 0) return []
  return [colorways[i - 1], colorways[i + 1]].filter((c): c is Colorway => Boolean(c))
}

export function formatPrice(usd: number): string {
  return `$${usd.toLocaleString('en-US')}`
}

/** Public path a real render would live at. */
export function renderPath(id: string): string {
  return `/colorways/${id}.webp`
}
