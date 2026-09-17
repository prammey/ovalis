import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  NAVBAR_COLLAPSE_AFTER_PX,
  NAVBAR_COLLAPSE_DELTA_PX,
  NAVBAR_CONTENT_FADE_MS,
  NAVBAR_DESCEND_MS,
  NAVBAR_DROPDOWN_MS,
  NAVBAR_EXPAND_DELTA_PX,
  NAVBAR_HOVER_LINGER_MS,
  NAVBAR_PILL_WIDTH_PX,
  NAVBAR_SPRING,
  springToCss,
} from "../config/motion";
import { DEFAULT_COLORWAY_ID } from "../data/colorways";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useNavbarState } from "../lib/navbar";
import { TransitionLink } from "../lib/navigation";
import { useLenis } from "../lib/smoothScroll";
import { OvalisMark, Wordmark } from "./Wordmark";

const spring = springToCss(NAVBAR_SPRING);

type NavLinkDef = {
  label: string;
  to: string;
  match: (path: string) => boolean;
};

const LEFT: NavLinkDef[] = [
  { label: "Home", to: "/", match: (p) => p === "/" },
  {
    label: "Luma-One",
    to: `/luma-one/${DEFAULT_COLORWAY_ID}`,
    match: (p) => p.startsWith("/luma-one"),
  },
  {
    label: "Shop",
    to: "/collections",
    match: (p) => p.startsWith("/collections"),
  },
];
const RIGHT: NavLinkDef[] = [
  { label: "Contact", to: "/contact", match: (p) => p === "/contact" },
  { label: "About", to: "/about", match: (p) => p === "/about" },
];

export const TEST_PAGES: { label: string; to: string }[] = [
  { label: "Exploded view", to: "/test/exploded" },
  { label: "Spotlight", to: "/test/spotlight" },
  { label: "Silence", to: "/test/silence" },
  { label: "Typography", to: "/test/typography" },
  { label: "Colorways", to: "/test/colorways" },
  { label: "Opening sequence", to: "/test/opening" },
  { label: "Placeholder", to: "/test/placeholder" },
];

const BAR_HEIGHT = 56;
const RADIUS = BAR_HEIGHT / 2;
const FULL_CLIP = `inset(0 0 0 0 round ${RADIUS}px)`;
const PILL_CLIP = `inset(0 calc(50% - ${NAVBAR_PILL_WIDTH_PX / 2}px) 0 calc(50% - ${NAVBAR_PILL_WIDTH_PX / 2}px) round ${RADIUS}px)`;

/**
 * Amber glass bar. Descends from behind the navy on the home page, contracts
 * into a pill holding just the mark as the user scrolls down, and expands
 * again on a slight upward scroll, on hover, or on keyboard focus.
 */
export function Navbar() {
  const { visible } = useNavbarState();
  const { pathname } = useLocation();
  const lenis = useLenis();
  const reduced = useReducedMotion();

  const [scrolledDown, setScrolledDown] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lingerTimer = useRef<number | undefined>(undefined);
  const testTimer = useRef<number | undefined>(undefined);

  const collapsed =
    scrolledDown && !hovered && !focused && !testOpen && !menuOpen;

  // Direction-aware scroll tracking: collapse on a short downward run, expand on a slight upward one.
  useEffect(() => {
    let lastY = window.scrollY;
    let run = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (y <= NAVBAR_COLLAPSE_AFTER_PX) {
        run = 0;
        setScrolledDown(false);
        return;
      }
      run = Math.sign(dy) === Math.sign(run) ? run + dy : dy;
      if (run > NAVBAR_COLLAPSE_DELTA_PX) setScrolledDown(true);
      else if (run < -NAVBAR_EXPAND_DELTA_PX) setScrolledDown(false);
    };
    if (lenis) {
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  // Close menus on navigation.
  useEffect(() => {
    setTestOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!testOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTestOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [testOpen, menuOpen]);

  const onEnter = useCallback(() => {
    window.clearTimeout(lingerTimer.current);
    setHovered(true);
  }, []);
  const onLeave = useCallback(() => {
    window.clearTimeout(lingerTimer.current);
    lingerTimer.current = window.setTimeout(
      () => setHovered(false),
      NAVBAR_HOVER_LINGER_MS,
    );
  }, []);

  const openTest = () => {
    window.clearTimeout(testTimer.current);
    setTestOpen(true);
  };
  const closeTestSoon = () => {
    window.clearTimeout(testTimer.current);
    testTimer.current = window.setTimeout(() => setTestOpen(false), 180);
  };

  const morph = reduced ? "none" : `clip-path ${spring.ms}ms ${spring.easing}`;
  const fade = reduced ? "none" : `opacity ${NAVBAR_CONTENT_FADE_MS}ms ease`;

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-4"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-140%)",
        transition: reduced
          ? "none"
          : `transform ${NAVBAR_DESCEND_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="relative w-full max-w-[1120px]">
        <nav
          aria-label="Primary"
          className="glass pointer-events-auto relative w-full"
          style={{
            height: BAR_HEIGHT,
            borderRadius: RADIUS,
            clipPath: collapsed ? PILL_CLIP : FULL_CLIP,
            transition: morph,
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null))
              setFocused(false);
          }}
        >
          {/* full bar */}
          <div
            className="absolute inset-0 hidden grid-cols-[1fr_auto_1fr] items-center px-7 md:grid"
            style={{
              opacity: collapsed ? 0 : 1,
              visibility: collapsed ? "hidden" : "visible",
              transition: `${fade}, visibility 0s ${collapsed ? NAVBAR_CONTENT_FADE_MS : 0}ms`,
            }}
          >
            <ul className="flex items-center gap-7 text-[14px] text-ink">
              {LEFT.map((l) => (
                <li key={l.to}>
                  <TransitionLink
                    to={l.to}
                    className="quiet-link"
                    aria-current={l.match(pathname) ? "page" : undefined}
                  >
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
            <TransitionLink
              to="/"
              className="text-ink"
              aria-label="Ovalis home"
            >
              <Wordmark size="0.95rem" />
            </TransitionLink>
            <ul className="flex items-center justify-end gap-7 text-[14px] text-ink">
              {RIGHT.map((l) => (
                <li key={l.to}>
                  <TransitionLink
                    to={l.to}
                    className="quiet-link"
                    aria-current={l.match(pathname) ? "page" : undefined}
                  >
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
              <li
                className="relative"
                onMouseEnter={openTest}
                onMouseLeave={closeTestSoon}
              >
                <button
                  type="button"
                  className="quiet-link whitespace-nowrap"
                  aria-haspopup="menu"
                  aria-expanded={testOpen}
                  aria-controls="test-pages-menu"
                  aria-current={
                    pathname.startsWith("/test") ? "page" : undefined
                  }
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
                    <path
                      d="M2 3.5l3 3 3-3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </div>

          {/* small screens: wordmark + menu button */}
          <div
            className="absolute inset-0 flex items-center justify-between px-6 md:hidden"
            style={{
              opacity: collapsed ? 0 : 1,
              visibility: collapsed ? "hidden" : "visible",
              transition: `${fade}, visibility 0s ${collapsed ? NAVBAR_CONTENT_FADE_MS : 0}ms`,
            }}
          >
            <TransitionLink
              to="/"
              className="text-ink"
              aria-label="Ovalis home"
            >
              <Wordmark size="0.9rem" />
            </TransitionLink>
            <button
              type="button"
              className="quiet-link text-[14px] text-ink"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>

          {/* pill */}
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center text-ink"
            style={{
              opacity: collapsed ? 1 : 0,
              pointerEvents: collapsed ? "auto" : "none",
              transition: fade,
            }}
            aria-label="Show navigation"
            tabIndex={collapsed ? 0 : -1}
            onClick={() => setScrolledDown(false)}
          >
            <OvalisMark size="1.25rem" />
          </button>
        </nav>

        {/* Test Pages dropdown; a sibling of the bar so the bar's clip never cuts it */}
        <ul
          id="test-pages-menu"
          role="menu"
          className="glass pointer-events-auto absolute right-0 top-[calc(100%+10px)] hidden min-w-[210px] rounded-2xl py-2 md:block"
          onMouseEnter={openTest}
          onMouseLeave={closeTestSoon}
          style={{
            opacity: testOpen ? 1 : 0,
            transform: testOpen ? "translateY(0)" : "translateY(-6px)",
            visibility: testOpen ? "visible" : "hidden",
            transition: reduced
              ? "none"
              : `opacity ${NAVBAR_DROPDOWN_MS}ms ease, transform ${NAVBAR_DROPDOWN_MS}ms ease, visibility 0s ${testOpen ? 0 : NAVBAR_DROPDOWN_MS}ms`,
          }}
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
        className="glass pointer-events-auto absolute inset-x-4 top-[80px] rounded-3xl px-7 py-6 md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
          visibility: menuOpen ? "visible" : "hidden",
          transition: reduced
            ? "none"
            : `opacity ${NAVBAR_DROPDOWN_MS}ms ease, transform ${NAVBAR_DROPDOWN_MS}ms ease, visibility 0s ${menuOpen ? 0 : NAVBAR_DROPDOWN_MS}ms`,
        }}
      >
        <ul className="flex flex-col gap-3 text-[17px] text-ink">
          {[...LEFT, ...RIGHT].map((l) => (
            <li key={l.to}>
              <TransitionLink
                to={l.to}
                className="quiet-link"
                aria-current={l.match(pathname) ? "page" : undefined}
              >
                {l.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <p className="font-mono mt-6 text-[11px] tracking-[0.08em] text-slate">
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
  );
}
