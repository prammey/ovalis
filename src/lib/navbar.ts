import { useSyncExternalStore } from 'react'

type NavbarState = {
  /** False while the navy hero covers the top of the page. */
  visible: boolean
}

let state: NavbarState = { visible: true }
const listeners = new Set<() => void>()

export const navbarStore = {
  get: () => state,
  set(partial: Partial<NavbarState>) {
    state = { ...state, ...partial }
    listeners.forEach((l) => l())
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function useNavbarState(): NavbarState {
  return useSyncExternalStore(navbarStore.subscribe, navbarStore.get)
}
