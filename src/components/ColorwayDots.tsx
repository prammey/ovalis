import { HOVER_MS } from '../config/motion'
import { collections, colorwaysIn, type Colorway } from '../data/colorways'
import { isLight } from '../lib/color'

/** Padding around each dot, so the tap target clears the dot's own 22px. */
const TOUCH_PADDING_PX = 18

type Props = {
  selected: string
  onSelect: (c: Colorway) => void
  /** Show the collection name beside each row. */
  labels?: boolean
  size?: number
  className?: string
}

/** The nineteen finishes as small dots, grouped by collection. The active one carries the clay ring. */
export function ColorwayDots({ selected, onSelect, labels = true, size = 22, className = '' }: Props) {
  return (
    <div className={`flex flex-col gap-4 ${className}`} role="radiogroup" aria-label="Finish">
      {collections.map((col) => (
        // On a phone the label sits above the dots: beside them it stole enough
        // width to wrap a seven-finish collection onto a second row, orphaning
        // a single dot.
        <div key={col.id} className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-5">
          {labels && (
            <span className="font-mono text-[11px] tracking-[0.08em] text-slate md:w-24 md:shrink-0">{col.name}</span>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            {colorwaysIn(col.id).map((c) => {
              const active = c.id === selected
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => onSelect(c)}
                  className="grid place-items-center rounded-full"
                  // The dot stays its own size; the button around it is padded
                  // out to something a thumb can actually hit.
                  style={{ width: size + TOUCH_PADDING_PX, height: size + TOUCH_PADDING_PX }}
                >
                  <span className="relative block" style={{ width: size, height: size }}>
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: c.hex,
                        boxShadow: `inset 0 0 0 1px rgba(22,26,31,${isLight(c.hex) ? 0.18 : 0.08})`,
                        transform: active ? 'scale(0.78)' : 'scale(1)',
                        transition: `transform ${HOVER_MS}ms ease`,
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute -inset-[3px] rounded-full border border-clay"
                      style={{ opacity: active ? 1 : 0, transition: `opacity ${HOVER_MS}ms ease` }}
                    />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
