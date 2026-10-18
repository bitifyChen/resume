import { fileURLToPath, URL } from 'node:url'
import { readdirSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const sideProjectImagesDirectory = fileURLToPath(
  new URL('./public/images/side-projects/', import.meta.url)
)
const sideProjectGalleriesId = 'virtual:side-project-galleries'
const resolvedSideProjectGalleriesId = `\0${sideProjectGalleriesId}`

function sideProjectGalleriesPlugin() {
  const scanGalleries = () => {
    try {
      return Object.fromEntries(
        readdirSync(sideProjectImagesDirectory, { withFileTypes: true })
          .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
          .map((directory) => {
            const projectDirectory = resolve(sideProjectImagesDirectory, directory.name)
            const imageFiles = readdirSync(projectDirectory, { withFileTypes: true })
              .filter(
                (entry) =>
                  entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name)
              )
              .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
            const cleanedReplacements = new Set(
              imageFiles
                .filter((entry) => /-clean\.[^.]+$/i.test(entry.name))
                .map((entry) => entry.name.replace(/-clean(?=\.[^.]+$)/i, ''))
            )
            const images = imageFiles
              .filter(
                (entry) =>
                  /-clean\.[^.]+$/i.test(entry.name) || !cleanedReplacements.has(entry.name)
              )
              .map((entry) => ({
                src: `images/side-projects/${directory.name}/${entry.name}`
              }))

            return [directory.name, images]
          })
      )
    } catch {
      return {}
    }
  }

  return {
    name: 'side-project-gallery-directory-scan',
    resolveId(id) {
      if (id === sideProjectGalleriesId) return resolvedSideProjectGalleriesId
    },
    load(id) {
      if (id === resolvedSideProjectGalleriesId) {
        return `export default ${JSON.stringify(scanGalleries())}`
      }
    },
    configureServer(server) {
      server.watcher.add(sideProjectImagesDirectory)
      server.watcher.on('all', (event, changedPath) => {
        if (!['add', 'addDir', 'unlink', 'unlinkDir'].includes(event)) return

        const pathFromGalleryRoot = relative(sideProjectImagesDirectory, changedPath)
        if (pathFromGalleryRoot.startsWith(`..${sep}`) || pathFromGalleryRoot === '..') return

        const galleryModule = server.moduleGraph.getModuleById(resolvedSideProjectGalleriesId)
        if (galleryModule) server.moduleGraph.invalidateModule(galleryModule)
        server.ws.send({ type: 'full-reload' })
      })
    }
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    Components({ dts: false, resolvers: [ElementPlusResolver()] }),
    sideProjectGalleriesPlugin()
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  optimizeDeps: { include: ['typed.js'] },
  server: { port: 5277, strictPort: true },
  preview: { port: 4277, strictPort: true },
  build: { sourcemap: false, chunkSizeWarningLimit: 700 }
})
