/** The one real render, exported at two widths from one master. */
export const HERO_1X = '/herospeaker@1x.webp'
export const HERO_2X = '/herospeaker.webp'
export const HERO_SRCSET = `${HERO_1X} 900w, ${HERO_2X} 1492w`
/** Matches the hero's rendered width so 1x screens fetch the 900w file. */
export const HERO_SIZES = '(min-width: 1024px) 54vw, 92vw'

export const OPENED_KEY = 'ovalis:opened'
