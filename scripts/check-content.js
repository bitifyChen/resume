import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
const roots = ['src', 'docs', 'scripts', 'tests']
const decoder = new TextDecoder('utf-8', { fatal: true })
const extensions = new Set(['.vue', '.js', '.md', '.scss', '.json', '.html', '.yml'])
const corruptionMarkers = [0xfffd, 0x929d, 0x8763, 0x648c, 0x96a2, 0x61ad, 0x6470, 0x95ae].map(
  (code) => String.fromCodePoint(code)
)
const files = ['README.md', 'index.html', 'package.json', '.github/workflows/pages.yml']
const approvedExternalUrls = [
  'https://chenchenworkshop.com/project',
  'https://guidebook.chenchenworkshop.com',
  'https://github.com/bitifyChen/guidebook',
  'https://bitifyChen.github.io/RoadLoop',
  'https://github.com/bitifyChen/RoadLoop',
  'https://test-explorer.coolkertour.com',
  'https://sosobook.chenchenworkshop.com',
  'https://github.com/bitifyChen/sosobook',
  'https://www.googletagmanager.com'
].map((url) => url.toLowerCase())
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await collect(path)
    else if (extensions.has(extname(path))) files.push(path)
  }
}
for (const root of roots) await collect(root)
let errors = 0
for (const file of files) {
  try {
    const text = decoder.decode(await readFile(file))
    if (/\?{3,}/.test(text) || corruptionMarkers.some((marker) => text.includes(marker)))
      throw new Error('可能有中文編碼異常')
    const externalUrls = [...text.matchAll(/https?:\/\/[^\s"'<>]+/g)].map(([url]) =>
      url.toLowerCase()
    )
    const unapprovedUrl = externalUrls.find(
      (url) =>
        !url.startsWith('https://example.com') &&
        !approvedExternalUrls.some((approvedUrl) => url === approvedUrl || url.startsWith(`${approvedUrl}/`))
    )
    if (file.startsWith('src') && unapprovedUrl)
      throw new Error(`展示程式出現未核對的外部網址：${unapprovedUrl}`)
  } catch (error) {
    errors++
    console.error(`${file}: ${error.message}`)
  }
}
if (errors) process.exitCode = 1
else console.log(`UTF-8 and public-content check passed (${files.length} files).`)
