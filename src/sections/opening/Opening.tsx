import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ProductShot } from '../../components/ProductShot'
import { Wordmark } from '../../components/Wordmark'
import {
  CLEAR_MS,
  HERO_SCROLL_LENGTH_VH,
  HERO_EXIT_EASE,
  HERO_EXIT_TEXT_RISE_PX,
  HERO_EXIT_WINDOW,
  HERO_SCRUB_S,
  HERO_SPEAKER_EASE,
  HERO_SPEAKER_ENTER_GAP_PX,
  HERO_SPEAKER_FROM,
  HERO_SPEAKER_TO,
  HERO_SPEAKER_WINDOW,
  HERO_TEXT_EASE,
  HERO_TEXT_ERASE_FROM,
  HERO_TEXT_ERASE_TO,
  HERO_TEXT_LINE_STAGGER,
  HERO_TEXT_REVEAL_FROM,
  HERO_TEXT_REVEAL_TO,
  HERO_TEXT_WINDOW,
  INDICATOR_DELAY_MS,
  INDICATOR_IN_MS,
  INDICATOR_OUT_MS,
  LOADER_MAX_MS,
  LOADER_MIN_MS,
  LOADER_RULE_CATCHUP_MS,
  LOADER_WORDMARK_IN_MS,
  NAVY_FILL_ANGLE_DEG,
  NAVY_FILL_EASE,
  NAVY_FILL_MS,
} from '../../config/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { navbarStore } from '../../lib/navbar'
import { useLenis } from '../../lib/smoothScroll'
import { HERO_1X, HERO_SIZES, HERO_SRCSET, OPENED_KEY } from './hero'
import { ScrollIndicator } from './ScrollIndicator'
import { HeroLine } from './HeroLine'
import { useAssetProgress } from './useAssetProgress'
import { useHandoffLock } from './useHandoffLock'
import { useHandoffSnap, type SnapZone } from './useHandoffSnap'

type Phase = 'loading' | 'clearing' | 'hero'

function alreadyOpened(): boolean {
  try {
    return sessionStorage.getItem(OPENED_KEY) === '1'
  } catch {
    return false
  }
}

function rememberOpened() {
  try {
    sessionStorage.setItem(OPENED_KEY, '1')
  } catch {
    /* private mode: replay next time, no harm */
  }
}

type Props = {
  /** Replay the load → navy fill even if this session has seen it. */
  force?: boolean
}

/**
 * The opening sequence: load → clear → navy fill → invitation → scroll-driven
 * hero → handoff to the bone page beneath, which snaps into place and holds.
 */
export function Opening({ force = false }: Props) {
  const lenis = useLenis()
  const reduced = useReducedMotion()
  const progress = useAssetProgress()
  const [phase, setPhase] = useState<Phase>(() => (!force && alreadyOpened() ? 'hero' : 'loading'))

  const markRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const navyRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const speakerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  /** From the pin releasing to the home top (navy fully gone, bar docked): the navy scroll-off, which snaps forward to the home top. */
  const zoneRef = useRef<SnapZone>({ start: 0, end: 0 })
  /** The home top, which holds against scrolling back up into the opening. */
  const lockRef = useRef(0)
  const startedAt = useRef(0)
  const indicatorVisible = useRef(false)

  useHandoffSnap(lenis, zoneRef)
  useHandoffLock(lenis, lockRef)

  // Scroll is locked until the navy has filled.
  useEffect(() => {
    if (!lenis) return
    if (phase === 'hero') lenis.start()
    else lenis.stop()
    return () => lenis.start()
  }, [lenis, phase])

  // Navbar stays behind the navy until the hero hands off. Hidden in a layout
  // effect, before the first paint: a plain effect runs after it, and the bar
  // would show for a frame on top of the loader.
  useLayoutEffect(() => {
    navbarStore.set({ visible: false })
    return () => navbarStore.set({ visible: true, top: 0 })
  }, [])

  // Phase 1: wordmark fades up; the rule tracks real progress.
  useEffect(() => {
    if (phase !== 'loading' || !markRef.current) return
    const tween = gsap.fromTo(
      markRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: reduced ? 0 : LOADER_WORDMARK_IN_MS / 1000, ease: 'power2.out' },
    )
    return () => {
      tween.kill()
    }
  }, [phase, reduced])

  useEffect(() => {
    if (phase !== 'loading' || !ruleRef.current) return
    const tween = gsap.to(ruleRef.current, {
      scaleX: progress,
      duration: reduced ? 0 : LOADER_RULE_CATCHUP_MS / 1000,
      ease: 'power2.out',
    })
    return () => {
      tween.kill()
    }
  }, [progress, phase, reduced])

  // Leave the loader once assets are ready and the minimum has elapsed; never later than the maximum.
  useEffect(() => {
    if (phase !== 'loading') return
    if (startedAt.current === 0) startedAt.current = performance.now()
    const elapsed = performance.now() - startedAt.current
    const wait = progress >= 1 ? Math.max(0, LOADER_MIN_MS - elapsed) : Math.max(0, LOADER_MAX_MS - elapsed)
    const timer = window.setTimeout(() => setPhase('clearing'), wait)
    return () => window.clearTimeout(timer)
  }, [progress, phase])

  // Phases 2 + 3: clear, then the navy sweeps up on an angle and levels out.
  useEffect(() => {
    if (phase !== 'clearing') return
    const mark = markRef.current
    const navy = navyRef.current
    if (!mark || !navy) return
    const vh = window.innerHeight
    const tl = gsap.timeline({
      onComplete: () => {
        rememberOpened()
        setPhase('hero')
      },
    })
    if (reduced) {
      tl.set(mark, { opacity: 0 })
      tl.set(navy, { rotate: 0, y: -vh })
      tl.to({}, { duration: 0.05 })
    } else {
      tl.to(mark, { opacity: 0, duration: CLEAR_MS / 1000, ease: 'power2.in' })
      tl.fromTo(
        navy,
        { rotate: NAVY_FILL_ANGLE_DEG, y: vh * 0.45 },
        { rotate: 0, y: -vh, duration: NAVY_FILL_MS / 1000, ease: NAVY_FILL_EASE },
        '>-0.05',
      )
    }
    return () => {
      tl.kill()
    }
  }, [phase, reduced])

  // Phase 4: the invitation.
  useEffect(() => {
    if (phase !== 'hero' || !indicatorRef.current) return
    const el = indicatorRef.current
    const tween = gsap.to(el, {
      opacity: 1,
      delay: reduced ? 0 : INDICATOR_DELAY_MS / 1000,
      duration: reduced ? 0 : INDICATOR_IN_MS / 1000,
      onStart: () => {
        indicatorVisible.current = true
      },
    })
    return () => {
      tween.kill()
    }
  }, [phase, reduced])

  // Phase 5: the scrubbed hero. Built once; it sits under the overlay until the navy fills.
  useEffect(() => {
    const section = sectionRef.current
    const speaker = speakerRef.current
    const text = textRef.current
    const sentinel = sentinelRef.current
    const indicator = indicatorRef.current
    if (!section || !speaker || !text || !sentinel || !indicator) return

    const lines = Array.from(text.querySelectorAll<HTMLElement>('[data-line]'))
    const sweeps = (kind: 'reveal' | 'erase') =>
      lines.map((line) => line.querySelector<HTMLElement>(`[data-sweep="${kind}"]`)!)

    const ctx = gsap.context(() => {
      // The handoff: from the pin releasing (sentinel enters at the bottom) to
      // the navy fully gone (sentinel reaches the top). The navbar becomes
      // visible at the start of it but sits behind the navy (lower z-index),
      // so the panel scrolling off reveals the docked bar; its top edge meets
      // the viewport top exactly at the end, which is where the page snaps to.
      // Created after the pin so it measures the sentinel with the pin spacer
      // already in the layout.
      const createHandoff = () => {
        const sync = (st: ScrollTrigger) => {
          zoneRef.current = { start: st.start, end: st.end }
          lockRef.current = st.end
          navbarStore.set({ top: st.end })
        }
        const handoff = ScrollTrigger.create({
          trigger: sentinel,
          start: 'top bottom',
          end: 'top top',
          onEnter: () => navbarStore.set({ visible: true }),
          onLeaveBack: () => navbarStore.set({ visible: false }),
          onRefresh: sync,
        })
        sync(handoff)
      }

      if (reduced) {
        gsap.set(speaker, HERO_SPEAKER_TO)
        gsap.set(sweeps('reveal'), { '--reveal': HERO_TEXT_REVEAL_TO })
        gsap.set(sweeps('erase'), { '--erase': HERO_TEXT_ERASE_FROM })
        createHandoff()
        ScrollTrigger.refresh()
        return
      }

      const setIndicator = (show: boolean) => {
        if (indicatorVisible.current === show) return
        indicatorVisible.current = show
        gsap.to(indicator, { opacity: show ? 1 : 0, duration: (show ? INDICATOR_IN_MS : INDICATOR_OUT_MS) / 1000 })
      }

      // Where the speaker waits before the first scroll: centred horizontally and
      // just past the bottom edge. Measured against the section (exactly one
      // viewport while pinned) rather than hard-coded, so it holds at any size
      // and across the two breakpoints' different speaker placements. Cached
      // per section size so a refresh costs one reflow, not one per tween value.
      let entryCache: { w: number; h: number; x: number; y: number } | null = null
      const entry = () => {
        const s = section.getBoundingClientRect()
        if (entryCache && entryCache.w === s.width && entryCache.h === s.height) return entryCache
        const previous = speaker.style.transform
        speaker.style.transform = 'none'
        const r = speaker.getBoundingClientRect()
        speaker.style.transform = previous
        const centreX = r.left - s.left + r.width / 2
        const centreY = r.top - s.top + r.height / 2
        entryCache = {
          w: s.width,
          h: s.height,
          x: s.width / 2 - centreX,
          y: s.height + HERO_SPEAKER_ENTER_GAP_PX - (centreY - (r.height * HERO_SPEAKER_FROM.scale) / 2),
        }
        return entryCache
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * HERO_SCROLL_LENGTH_VH)}`,
          pin: true,
          scrub: HERO_SCRUB_S,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            entryCache = null
          },
          onUpdate: (st) => {
            if (st.progress > 0.02) setIndicator(false)
            else if (st.progress < 0.005) setIndicator(true)
          },
        },
      })

      tl.fromTo(
        speaker,
        { ...HERO_SPEAKER_FROM, x: () => entry().x, y: () => entry().y },
        { ...HERO_SPEAKER_TO, ease: HERO_SPEAKER_EASE, duration: HERO_SPEAKER_WINDOW.end - HERO_SPEAKER_WINDOW.start },
        HERO_SPEAKER_WINDOW.start,
      )
      const lineStagger = HERO_TEXT_LINE_STAGGER
      const spread = lineStagger * Math.max(0, lines.length - 1)
      const revealDuration = HERO_TEXT_WINDOW.end - HERO_TEXT_WINDOW.start - spread

      sweeps('reveal').forEach((sweep, index) => {
        tl.fromTo(
          sweep,
          { '--reveal': HERO_TEXT_REVEAL_FROM },
          { '--reveal': HERO_TEXT_REVEAL_TO, ease: HERO_TEXT_EASE, duration: revealDuration },
          HERO_TEXT_WINDOW.start + index * lineStagger,
        )
      })

      // The exit mirrors the entrance: the erase sweep rises through each line
      // in turn, so the type empties from the bottom through the same soft
      // gradient edge it filled through. The block lifts a little as it goes.
      // The speaker holds where it settled and leaves with the panel, so it is
      // never adrift on its own.
      const exitSpan = HERO_EXIT_WINDOW.end - HERO_EXIT_WINDOW.start
      const eraseDuration = exitSpan - spread

      tl.to(
        text,
        { y: -HERO_EXIT_TEXT_RISE_PX, ease: HERO_EXIT_EASE, duration: exitSpan },
        HERO_EXIT_WINDOW.start,
      )
      sweeps('erase').forEach((sweep, index) => {
        tl.fromTo(
          sweep,
          { '--erase': HERO_TEXT_ERASE_FROM },
          { '--erase': HERO_TEXT_ERASE_TO, ease: HERO_EXIT_EASE, duration: eraseDuration },
          HERO_EXIT_WINDOW.start + index * lineStagger,
        )
      })

      tl.set({}, {}, 1)

      createHandoff()
      ScrollTrigger.refresh()
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <>
      {phase !== 'hero' && (
        <div className="fixed inset-0 z-[60] overflow-hidden bg-bone" aria-hidden={phase !== 'loading'}>
          <div
            ref={markRef}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-ink"
            style={{ opacity: 0 }}
            role="status"
            aria-live="polite"
            aria-label={`Loading, ${Math.round(progress * 100)} percent`}
          >
            <Wordmark size="1.3rem" />
            <div
              ref={ruleRef}
              className="h-px w-[min(38vw,300px)] origin-left bg-ink/50"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <div
            ref={navyRef}
            className="absolute left-1/2 top-full h-[220vh] w-[300vw] -translate-x-1/2 bg-navy"
            style={{ transformOrigin: '50% 0%', willChange: 'transform' }}
          />
        </div>
      )}

      <section
        ref={sectionRef}
        className="relative z-[35] h-svh overflow-hidden bg-navy text-mint"
        aria-label="Luma-One. New-Age Noise."
      >
        <div className="absolute inset-0">
          <div className="absolute left-[6vw] top-1/2 -translate-y-[54%]">
            <div
              ref={textRef}
              className="font-display italic text-[clamp(5rem,17vw,19rem)] leading-[0.92]"
              style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
            >
              <div data-line={0}>
                <HeroLine text="New-Age" />
              </div>
              <div data-line={1}>
                <HeroLine text="Noise" />
              </div>
            </div>
          </div>
          <div className="absolute right-[6vw] top-1/2 w-[58vw] -translate-y-[44%] max-md:right-[-10vw] max-md:w-[104vw]">
            <div ref={speakerRef} style={{ willChange: 'transform' }}>
              <ProductShot
                colorway="foundations-navy"
                src={HERO_1X}
                srcSet={HERO_SRCSET}
                sizes={HERO_SIZES}
                priority
                caption={false}
              />
            </div>
          </div>
        </div>
        <ScrollIndicator ref={indicatorRef} />
      </section>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
    </>
  )
}
