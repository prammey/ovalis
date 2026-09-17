import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Link, useLocation, useNavigate, type LinkProps } from 'react-router-dom'
import { PAGE_FADE_EASE_CSS, PAGE_FADE_IN_MS, PAGE_FADE_OUT_MS } from '../config/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { routeKey } from './routes'

type Go = (to: string) => void

/**
 * Null when there is no provider above, which lets TransitionLink fall back to
 * an ordinary router Link instead of swallowing the click. A no-op default
 * silently kills every link outside the provider.
 */
const NavigateContext = createContext<Go | null>(null)

/**
 * Supplies the fade navigation and renders the veil. Wrap everything that
 * holds links — including the persistent chrome, which must sit inside this
 * provider but outside PageFrame so it neither re-mounts nor fades per route.
 */
export function PageTransitions({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const [veiled, setVeiled] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const go = useCallback<Go>(
    (to) => {
      if (to === pathname) return
      if (reduced || routeKey(to) === routeKey(pathname)) {
        navigate(to)
        return
      }
      setVeiled(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        navigate(to)
        requestAnimationFrame(() => setVeiled(false))
      }, PAGE_FADE_OUT_MS)
    },
    [navigate, pathname, reduced],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <NavigateContext.Provider value={go}>
      {children}
      <div
        aria-hidden
        className="fixed inset-0 z-40 bg-bone"
        style={{
          opacity: veiled ? 1 : 0,
          pointerEvents: veiled ? 'auto' : 'none',
          transition: `opacity ${PAGE_FADE_OUT_MS}ms ${PAGE_FADE_EASE_CSS}`,
        }}
      />
    </NavigateContext.Provider>
  )
}

/**
 * Wraps the routed page so it fades in on each navigation. The animation is
 * removed once it ends: a filled opacity animation would keep a stacking
 * context here and trap the hero's z-index beneath the fixed navbar.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const key = routeKey(pathname)
  // The first page of the session must not fade in: the opening sequence is
  // its own entrance, and a running opacity animation here would give this
  // wrapper a stacking context, trapping the loader's z-index underneath the
  // fixed navbar. Every later page, arrived at however, fades normally —
  // PageEnter reads `animate` only when it mounts, which is on each key change.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <PageEnter key={key} animate={mounted}>
      {children}
    </PageEnter>
  )
}

function PageEnter({ animate, children }: { animate: boolean; children: ReactNode }) {
  const [entered, setEntered] = useState(!animate)
  return (
    <div
      className={entered ? undefined : 'page-enter'}
      style={entered ? undefined : { animationDuration: `${PAGE_FADE_IN_MS}ms`, animationTimingFunction: PAGE_FADE_EASE_CSS }}
      onAnimationEnd={() => setEntered(true)}
    >
      {children}
    </div>
  )
}

export function useFadeNavigate(): Go | null {
  return useContext(NavigateContext)
}

/**
 * A router Link that routes through the page fade. Modifier-clicks fall
 * through to the browser, and with no provider above it behaves as a plain
 * router Link — navigation still works, it just does not fade.
 */
export function TransitionLink({ to, onClick, ...rest }: LinkProps) {
  const go = useFadeNavigate()
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (!go || typeof to !== 'string') return
    e.preventDefault()
    go(to)
  }
  return <Link to={to} onClick={handleClick} {...rest} />
}
