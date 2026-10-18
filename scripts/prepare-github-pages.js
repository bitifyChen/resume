import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { caseStudies, projects, sideProjects } from '../src/data/portfolio.js'

const outputDirectory = resolve('dist')
const appShell = join(outputDirectory, 'index.html')
const galleryRoot = join(outputDirectory, 'images', 'side-projects')
const routes = [
  ...projects.map(({ slug }) => `/projects/${slug}`),
  ...sideProjects.map(({ slug }) => `/side-projects/${slug}`),
  ...caseStudies.map(({ id }) => `/case-studies/${id}`)
]

for (const route of routes) {
  if (!/^\/(?:projects|side-projects|case-studies)\/[a-z0-9-]+$/.test(route)) {
    throw new Error(`Invalid static route for GitHub Pages: ${route}`)
  }

  const routeDirectory = join(outputDirectory, route.slice(1))
  mkdirSync(routeDirectory, { recursive: true })
  copyFileSync(appShell, join(routeDirectory, 'index.html'))
}

for (const projectDirectory of readdirSync(galleryRoot, { withFileTypes: true }).filter(
  (entry) => entry.isDirectory()
)) {
  const projectPath = join(galleryRoot, projectDirectory.name)
  const entries = readdirSync(projectPath, { withFileTypes: true })
  for (const entry of entries.filter((item) => item.isDirectory() && item.name.startsWith('_'))) {
    rmSync(join(projectPath, entry.name), { recursive: true, force: true })
  }

  const imageFiles = entries
    .filter((entry) => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
    .map((entry) => entry.name)
  const cleanedReplacements = new Set(
    imageFiles
      .filter((name) => /-clean\.[^.]+$/i.test(name))
      .map((name) => name.replace(/-clean(?=\.[^.]+$)/i, ''))
  )
  for (const name of cleanedReplacements) {
    rmSync(join(projectPath, name), { force: true })
  }
}

copyFileSync(appShell, join(outputDirectory, '404.html'))
console.log(`Prepared ${routes.length} direct routes and the GitHub Pages fallback.`)
