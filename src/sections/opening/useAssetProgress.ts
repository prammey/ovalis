import { useEffect, useState } from 'react'
import { HERO_SIZES, HERO_SRCSET, HERO_1X } from './hero'

/**
 * Real readiness, not a timer: each font face and the hero render count as
 * one unit. Returns 0..1. A unit that errors still counts as done so the
 * sequence can never hang on a missing asset.
 */
export function useAssetProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    const tasks: Promise<unknown>[] = [
      document.fonts.load('italic 400 1em Fraunces'),
      document.fonts.load('400 1em Fraunces'),
      document.fonts.load('300 1em Inter'),
      document.fonts.load('400 1em "JetBrains Mono"'),
      document.fonts.ready,
      decodeHero(),
    ]
    let done = 0
    tasks.forEach((t) =>
      t.catch(() => {}).finally(() => {
        done += 1
        if (!cancelled) setProgress(done / tasks.length)
      }),
    )
    return () => {
      cancelled = true
    }
  }, [])

  return progress
}

function decodeHero(): Promise<void> {
  const img = new Image()
  img.srcset = HERO_SRCSET
  img.sizes = HERO_SIZES
  img.src = HERO_1X
  return img.decode()
}
