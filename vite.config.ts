import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const colorwayDir = path.resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  'public/colorways',
)

// Exposes the list of files present in /public/colorways as a virtual module.
// ProductShot reads it so a missing render never triggers a network request
// (no 404 noise, no broken-image flash). Dropping a WebP into the folder is
// picked up on the next dev-server reload or build — no code change needed.
function colorwayManifest(): Plugin {
  const id = 'virtual:colorway-manifest'
  const resolved = '\0' + id
  const read = () => {
    try {
      return fs.readdirSync(colorwayDir).filter((f) => f.endsWith('.webp'))
    } catch {
      return []
    }
  }
  return {
    name: 'ovalis-colorway-manifest',
    resolveId(source) {
      return source === id ? resolved : undefined
    },
    load(moduleId) {
      return moduleId === resolved
        ? `export default ${JSON.stringify(read())}`
        : undefined
    },
    configureServer(server) {
      server.watcher.add(colorwayDir)
      const onChange = (file: string) => {
        if (!file.startsWith(colorwayDir)) return
        const mod = server.moduleGraph.getModuleById(resolved)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), colorwayManifest()],
})
