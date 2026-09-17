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

type Go = (to: string) => void

const NavigateContext = createContext<Go>(() => {})

/**
 * Fades pages rather than cutting between them: a bone veil covers the old
 * page, the route changes underneath it, and the new page animates in.
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
      if (reduced) {
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
      <PageEnter key={pathname}>{children}</PageEnter>
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
 * Fades the new page in, then removes the animation. A filled opacity
 * animation would keep a stacking context on this wrapper and trap the
 * hero's z-index beneath the fixed navbar.
 */
function PageEnter({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false)
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

export function useFadeNavigate(): Go {
  return useContext(NavigateContext)
}

/** A router Link that routes through the page fade. Modifier-clicks fall through to the browser. */
export function TransitionLink({ to, onClick, ...rest }: LinkProps) {
  const go = useFadeNavigate()
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (typeof to !== 'string') return
    e.preventDefault()
    go(to)
  }
  return <Link to={to} onClick={handleClick} {...rest} />
}
