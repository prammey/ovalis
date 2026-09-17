/// <reference types="vite/client" />

declare module 'virtual:colorway-manifest' {
  /** File names present in /public/colorways at build time. */
  const files: string[]
  export default files
}
