import { HOVER_MS } from '../config/motion'
import { collections, colorwaysIn, type Colorway } from '../data/colorways'
import { isLight } from '../lib/color'

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
        <div key={col.id} className="flex items-center gap-5">
          {labels && (
            <span className="font-mono w-24 shrink-0 text-[11px] tracking-[0.08em] text-slate">{col.name}</span>
          )}
          <div className="flex flex-wrap items-center gap-3">
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
                  className="relative rounded-full"
                  style={{ width: size, height: size }}
                >
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
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
