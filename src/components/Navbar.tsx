import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  NAVBAR_COLLAPSE_AFTER_PX,
  NAVBAR_COLLAPSE_DELTA_PX,
  NAVBAR_CONTENT_FADE_MS,
  NAVBAR_DESCEND_MS,
  NAVBAR_DOCKED_HEIGHT_PX,
  NAVBAR_DROPDOWN_MS,
  NAVBAR_EXPAND_DELTA_PX,
  NAVBAR_FLOAT_INSET_PX,
  NAVBAR_HOVER_LINGER_MS,
  NAVBAR_MAX_WIDTH_PX,
  NAVBAR_PILL_WIDTH_PX,
  NAVBAR_SPRING,
  springToCss,
} from '../config/motion'
import { DEFAULT_COLORWAY_ID } from '../data/colorways'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { navbarStore, useNavbarState } from '../lib/navbar'
import { TransitionLink } from '../lib/navigation'
import { useLenis } from '../lib/smoothScroll'
import { OvalisMark, Wordmark } from './Wordmark'

const spring = springToCss(NAVBAR_SPRING)

type NavLinkDef = { label: string; to: string; match: (path: string) => boolean }

const LEFT: NavLinkDef[] = [
  { label: 'Home', to: '/', match: (p) => p === '/' },
  { label: 'Luma-One', to: `/luma-one/${DEFAULT_COLORWAY_ID}`, match: (p) => p.startsWith('/luma-one') },
  { label: 'Shop', to: '/collections', match: (p) => p.startsWith('/collections') },
]
const RIGHT: NavLinkDef[] = [
  { label: 'Contact', to: '/contact', match: (p) => p === '/contact' },
  { label: 'About', to: '/about', match: (p) => p === '/about' },
]

export const TEST_PAGES: { label: string; to: string }[] = [
  { label: 'Exploded view', to: '/test/exploded' },
  { label: 'Spotlight', to: '/test/spotlight' },
  { label: 'Silence', to: '/test/silence' },
  { label: 'Typography', to: '/test/typography' },
  { label: 'Colorways', to: '/test/colorways' },
  { label: 'Opening sequence', to: '/test/opening' },
  { label: 'Placeholder', to: '/test/placeholder' },
]

const RADIUS = (NAVBAR_DOCKED_HEIGHT_PX - NAVBAR_FLOAT_INSET_PX) / 2
/** The floating bar and the pill are centred on the shell's lower band, which sits this far below the docked bar's centre. */
const FLOAT_CENTRE_SHIFT_PX = NAVBAR_FLOAT_INSET_PX / 2

/** One glass shell, three shapes, all cut from it with clip-path so the backdrop layer never re-composites. */
const DOCKED_CLIP = 'inset(0px 0px 0px 0px round 0px)'
const PILL_CLIP = `inset(${NAVBAR_FLOAT_INSET_PX}px calc(50% - ${NAVBAR_PILL_WIDTH_PX / 2}px) 0px calc(50% - ${NAVBAR_PILL_WIDTH_PX / 2}px) round ${RADIUS}px)`
const floatClip = (sideInset: number) =>
  `inset(${NAVBAR_FLOAT_INSET_PX}px ${sideInset}px 0px ${sideInset}px round ${RADIUS}px)`

const floatSideInset = () =>
  Math.max(NAVBAR_FLOAT_INSET_PX, Math.round((window.innerWidth - NAVBAR_MAX_WIDTH_PX) / 2))

/**
 * Amber glass bar. Docked — rectangular and edge to edge — at the top of a
 * page; on the home page that top is where the navy has fully scrolled off,
 * and the bar is revealed from behind it. Contracts to a mark-only pill on
 * scroll-down; expands to a floating rounded bar on a slight scroll-up, on
 * hover or on keyboard focus; re-docks on reaching the top again.
 */
export function Navbar() {
  const { visible, top } = useNavbarState()
  const { pathname } = useLocation()
  const lenis = useLenis()
  const reduced = useReducedMotion()

  const [docked, setDocked] = useState(true)
  const [scrolledDown, setScrolledDown] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [testOpen, setTestOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sideInset, setSideInset] = useState(floatSideInset)
  const lingerTimer = useRef<number | undefined>(undefined)
  const testTimer = useRef<number | undefined>(undefined)

  const collapsed = !docked && scrolledDown && !hovered && !focused && !testOpen && !menuOpen
  const clip = docked ? DOCKED_CLIP : collapsed ? PILL_CLIP : floatClip(sideInset)

  // Direction-aware scroll tracking, measured from the page's own top:
  // dock within the first stretch, collapse on a short downward run past it,
  // expand on a slight upward one.
  useEffect(() => {
    let lastY = window.scrollY
    let run = 0
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      if (y - navbarStore.get().top <= NAVBAR_COLLAPSE_AFTER_PX) {
        run = 0
        setDocked(true)
        setScrolledDown(false)
        return
      }
      setDocked(false)
      run = Math.sign(dy) === Math.sign(run) ? run + dy : dy
      if (run > NAVBAR_COLLAPSE_DELTA_PX) setScrolledDown(true)
      else if (run < -NAVBAR_EXPAND_DELTA_PX) setScrolledDown(false)
    }
    if (lenis) {
      lenis.on('scroll', onScroll)
      return () => lenis.off('scroll', onScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lenis])

  // The page top can move (the home page sets it once the hero is measured).
  useEffect(() => {
    setDocked(window.scrollY - top <= NAVBAR_COLLAPSE_AFTER_PX)
  }, [top])

  useEffect(() => {
    const onResize = () => setSideInset(floatSideInset())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Close menus on navigation.
  useEffect(() => {
    setTestOpen(false)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!testOpen && !menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTestOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [testOpen, menuOpen])

  const onEnter = useCallback(() => {
    window.clearTimeout(lingerTimer.current)
    setHovered(true)
  }, [])
  const onLeave = useCallback(() => {
    window.clearTimeout(lingerTimer.current)
    lingerTimer.current = window.setTimeout(() => setHovered(false), NAVBAR_HOVER_LINGER_MS)
  }, [])

  const openTest = () => {
    window.clearTimeout(testTimer.current)
    setTestOpen(true)
  }
  const closeTestSoon = () => {
    window.clearTimeout(testTimer.current)
    testTimer.current = window.setTimeout(() => setTestOpen(false), 180)
  }

  const morph = reduced ? 'none' : `clip-path ${spring.ms}ms ${spring.easing}, transform ${spring.ms}ms ${spring.easing}`
  const fade = reduced ? 'none' : `opacity ${NAVBAR_CONTENT_FADE_MS}ms ease`
  const contentFade = (shown: boolean) => ({
    opacity: shown ? 1 : 0,
    visibility: shown ? ('visible' as const) : ('hidden' as const),
    transition: `${fade}, visibility 0s ${shown ? 0 : NAVBAR_CONTENT_FADE_MS}ms`,
  })
  const popover = (open: boolean) => ({
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0)' : 'translateY(-6px)',
    visibility: open ? ('visible' as const) : ('hidden' as const),
    transition: reduced
      ? 'none'
      : `opacity ${NAVBAR_DROPDOWN_MS}ms ease, transform ${NAVBAR_DROPDOWN_MS}ms ease, visibility 0s ${open ? 0 : NAVBAR_DROPDOWN_MS}ms`,
  })

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-30"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-140%)',
        transition: reduced ? 'none' : `transform ${NAVBAR_DESCEND_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <nav
        aria-label="Primary"
        className="glass pointer-events-auto relative w-full"
        style={{ height: NAVBAR_DOCKED_HEIGHT_PX, clipPath: clip, transition: morph }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
        }}
      >
        {/* content rides the shell's centre when docked and its lower band otherwise */}
        <div
          className="relative mx-auto h-full"
          style={{
            maxWidth: NAVBAR_MAX_WIDTH_PX,
            transform: docked ? 'translateY(0)' : `translateY(${FLOAT_CENTRE_SHIFT_PX}px)`,
            transition: morph,
          }}
        >
          {/* full bar */}
          <div className="absolute inset-0 hidden grid-cols-[1fr_auto_1fr] items-center px-7 md:grid" style={contentFade(!collapsed)}>
            <ul className="flex items-center gap-7 text-[14px] text-ink">
              {LEFT.map((l) => (
                <li key={l.to}>
                  <TransitionLink to={l.to} className="quiet-link" aria-current={l.match(pathname) ? 'page' : undefined}>
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
            <TransitionLink to="/" className="text-ink" aria-label="Ovalis home">
              <Wordmark size="0.95rem" />
            </TransitionLink>
            <ul className="flex items-center justify-end gap-7 text-[14px] text-ink">
              {RIGHT.map((l) => (
                <li key={l.to}>
                  <TransitionLink to={l.to} className="quiet-link" aria-current={l.match(pathname) ? 'page' : undefined}>
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
              <li onMouseEnter={openTest} onMouseLeave={closeTestSoon}>
                <button
                  type="button"
                  className="quiet-link whitespace-nowrap"
                  aria-haspopup="menu"
                  aria-expanded={testOpen}
                  aria-controls="test-pages-menu"
                  aria-current={pathname.startsWith('/test') ? 'page' : undefined}
                  onClick={() => setTestOpen((o) => !o)}
                >
                  Test Pages
                  <svg
                    className="ml-1.5 inline-block align-[1px]"
                    width="9"
                    height="9"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    aria-hidden
                  >
                    <path d="M2 3.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>

          {/* small screens: wordmark + menu button */}
          <div className="absolute inset-0 flex items-center justify-between px-6 md:hidden" style={contentFade(!collapsed)}>
            <TransitionLink to="/" className="text-ink" aria-label="Ovalis home">
              <Wordmark size="0.9rem" />
            </TransitionLink>
            <button
              type="button"
              className="quiet-link text-[14px] text-ink"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          {/* pill */}
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center text-ink"
            style={{ opacity: collapsed ? 1 : 0, pointerEvents: collapsed ? 'auto' : 'none', transition: fade }}
            aria-label="Show navigation"
            tabIndex={collapsed ? 0 : -1}
            onClick={() => setScrolledDown(false)}
          >
            <OvalisMark size="1.25rem" />
          </button>
        </div>
      </nav>

      {/* Test Pages dropdown: outside the shell so its clip never cuts it, aligned to the content column */}
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto" style={{ maxWidth: NAVBAR_MAX_WIDTH_PX, height: NAVBAR_DOCKED_HEIGHT_PX }}>
        <ul
          id="test-pages-menu"
          role="menu"
          className="glass pointer-events-auto absolute right-7 top-[calc(100%+10px)] hidden min-w-[210px] rounded-2xl py-2 md:block"
          onMouseEnter={openTest}
          onMouseLeave={closeTestSoon}
          style={popover(testOpen)}
        >
          {TEST_PAGES.map((t) => (
            <li key={t.to} role="none">
              <TransitionLink
                role="menuitem"
                to={t.to}
                tabIndex={testOpen ? 0 : -1}
                className="block px-5 py-2 text-[14px] text-ink hover:bg-ink/5 focus-visible:bg-ink/5"
              >
                {t.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>

      {/* small-screen sheet */}
      <div
        id="mobile-menu"
        className="glass pointer-events-auto absolute inset-x-4 rounded-3xl px-7 py-6 md:hidden"
        style={{ top: NAVBAR_DOCKED_HEIGHT_PX + 8, ...popover(menuOpen) }}
      >
        <ul className="flex flex-col gap-3 text-[17px] text-ink">
          {[...LEFT, ...RIGHT].map((l) => (
            <li key={l.to}>
              <TransitionLink to={l.to} className="quiet-link" aria-current={l.match(pathname) ? 'page' : undefined}>
                {l.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <p className="font-mono mt-7 border-t border-divider pt-6 text-[11px] tracking-[0.08em] text-slate">
          Test pages
        </p>
        <ul className="mt-2 flex flex-col gap-2 text-[15px] text-ink">
          {TEST_PAGES.map((t) => (
            <li key={t.to}>
              <TransitionLink to={t.to} className="quiet-link">
                {t.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
