import { useEffect, useRef, useState } from 'react'
import { ProductShot } from '../../components/ProductShot'
import { Wordmark } from '../../components/Wordmark'
import {
  CLEAR_MS,
  HERO_SCROLL_LENGTH_VH,
  HERO_SCRUB_S,
  HERO_SPEAKER_EASE,
  HERO_SPEAKER_FROM,
  HERO_SPEAKER_TO,
  HERO_SPEAKER_WINDOW,
  HERO_TEXT_EASE,
  HERO_TEXT_FROM_OPACITY,
  HERO_TEXT_SHIFT_PX,
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
import { SlicedLine } from './SlicedLine'
import { useAssetProgress } from './useAssetProgress'
import { useHandoffResistance } from './useHandoffResistance'

type Phase = 'loading' | 'clearing' | 'hero'

/** Per-band horizontal displacement at the distorted start, as a multiple of HERO_TEXT_SHIFT_PX. */
const BAND_SHIFTS = [-1, 0.7, -0.45, 1, -0.8, 0.55, -0.35]

function shiftFor(band: number, line: number): number {
  const base = BAND_SHIFTS[band % BAND_SHIFTS.length]
  // second line runs the pattern the other way so the two lines don't shear together
  return (line % 2 === 0 ? base : -base) * HERO_TEXT_SHIFT_PX
}

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
 * hero → handoff to the bone page beneath, with resistance on the way back up.
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
  const boundaryRef = useRef(0)
  const startedAt = useRef(performance.now())
  const indicatorVisible = useRef(false)

  useHandoffResistance(lenis, boundaryRef)

  // Scroll is locked until the navy has filled.
  useEffect(() => {
    if (!lenis) return
    if (phase === 'hero') lenis.start()
    else lenis.stop()
    return () => lenis.start()
  }, [lenis, phase])

  // Navbar stays behind the navy until the hero hands off.
  useEffect(() => {
    navbarStore.set({ visible: false })
    return () => navbarStore.set({ visible: true })
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

    const bands = Array.from(text.querySelectorAll<HTMLElement>('[data-band]'))

    const ctx = gsap.context(() => {
      // navbar descends the moment the pin releases; it sits behind the navy
      // (lower z-index) so the panel scrolling off reveals it
      ScrollTrigger.create({
        trigger: sentinel,
        start: 'top bottom',
        onEnter: () => navbarStore.set({ visible: true }),
        onLeaveBack: () => navbarStore.set({ visible: false }),
      })

      if (reduced) {
        gsap.set(speaker, HERO_SPEAKER_TO)
        gsap.set(bands, { x: 0, opacity: 1 })
        boundaryRef.current = 0
        return
      }

      const setIndicator = (show: boolean) => {
        if (indicatorVisible.current === show) return
        indicatorVisible.current = show
        gsap.to(indicator, { opacity: show ? 1 : 0, duration: (show ? INDICATOR_IN_MS : INDICATOR_OUT_MS) / 1000 })
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
          onRefresh: (st) => {
            boundaryRef.current = st.end
          },
          onUpdate: (st) => {
            if (st.progress > 0.02) setIndicator(false)
            else if (st.progress < 0.005) setIndicator(true)
          },
        },
      })

      tl.fromTo(
        speaker,
        HERO_SPEAKER_FROM,
        { ...HERO_SPEAKER_TO, ease: HERO_SPEAKER_EASE, duration: HERO_SPEAKER_WINDOW.end - HERO_SPEAKER_WINDOW.start },
        HERO_SPEAKER_WINDOW.start,
      )
      bands.forEach((band) => {
        const i = Number(band.dataset.band ?? 0)
        const line = Number(band.closest<HTMLElement>('[data-line]')?.dataset.line ?? 0)
        tl.fromTo(
          band,
          { x: shiftFor(i, line), opacity: HERO_TEXT_FROM_OPACITY },
          { x: 0, opacity: 1, ease: HERO_TEXT_EASE, duration: HERO_TEXT_WINDOW.end - HERO_TEXT_WINDOW.start },
          HERO_TEXT_WINDOW.start,
        )
      })
      tl.set({}, {}, 1)
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
          <div className="absolute left-[7vw] top-1/2 -translate-y-[54%]">
            <div
              ref={textRef}
              className="font-display italic text-[clamp(4.5rem,15vw,17rem)] leading-[0.94]"
              style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
            >
              <div data-line={0}>
                <SlicedLine text="New-Age" />
              </div>
              <div data-line={1}>
                <SlicedLine text="Noise" />
              </div>
            </div>
          </div>
          <div className="absolute right-[3vw] top-1/2 w-[52vw] -translate-y-[42%] max-md:right-[-8vw] max-md:w-[92vw]">
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
