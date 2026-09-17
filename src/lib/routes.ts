/**
 * Pages that should not re-mount (and fade) when only a parameter changes
 * share a key. Switching finishes on the product page cross-fades in place.
 */
export function routeKey(pathname: string): string {
  if (pathname.startsWith('/luma-one/')) return '/luma-one'
  return pathname
}
