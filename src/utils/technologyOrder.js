const TECHNOLOGY_ORDER = [
  'Vue 3',
  'Pinia',
  'Vue Router',
  'Vue Flow',
  'Electron',
  'Element Plus',
  'Vant',
  'Chart.js',
  'PDF.js',
  'Tesseract.js',
  'Leaflet',
  'Google Maps',
  'Firebase',
  'Firebase Auth',
  'Firestore',
  'Firebase RTDB',
  'FCM',
  'Supabase',
  'Python',
  'Flask',
  'Python Worker',
  'SQLite',
  'Turso',
  'Ollama',
  'MCP',
  'Base／Delta',
  'Traccar',
  'PWA',
  'Vite PWA',
  'Service Worker',
  'GitHub Actions',
  'Cloudflare R2',
  'Render',
  'Telegram',
  'SHA-256',
  'Ed25519',
  '資料彙整',
  'JSON'
]

const technologyRank = new Map(TECHNOLOGY_ORDER.map((technology, index) => [technology, index]))

export function sortTechnologies(technologies = []) {
  return [...technologies].sort((left, right) => {
    const leftRank = technologyRank.get(left)
    const rightRank = technologyRank.get(right)

    if (leftRank !== undefined || rightRank !== undefined) {
      if (leftRank === undefined) return 1
      if (rightRank === undefined) return -1
      return leftRank - rightRank
    }

    return String(left).localeCompare(String(right), 'en', {
      numeric: true,
      sensitivity: 'base'
    })
  })
}
