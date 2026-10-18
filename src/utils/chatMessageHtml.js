const escapedCharacters = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => escapedCharacters[character])
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightText(value, keyword) {
  const escaped = escapeHtml(value)
  const term = String(keyword ?? '').trim()
  if (!term) return escaped

  const escapedTerm = escapeHtml(term)
  return escaped.replace(new RegExp(escapeRegExp(escapedTerm), 'gi'), '<mark>$&</mark>')
}

export function formatChatMessageHtml(content, keyword = '') {
  const text = String(content ?? '')
  const urlPattern = /https?:\/\/[^\s<>"']+/gi
  let html = ''
  let lastIndex = 0

  for (const match of text.matchAll(urlPattern)) {
    const rawUrl = match[0]
    const punctuation = rawUrl.match(/[.,!?;:)\]]+$/)?.[0] || ''
    const link = rawUrl.slice(0, rawUrl.length - punctuation.length)
    let safeLink = false

    try {
      const parsed = new URL(link)
      safeLink = parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      safeLink = false
    }

    const start = match.index ?? lastIndex
    html += highlightText(text.slice(lastIndex, start), keyword)
    if (safeLink) {
      const escapedUrl = escapeHtml(link)
      html += `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${highlightText(link, keyword)}</a>`
    } else {
      html += highlightText(link, keyword)
    }
    html += highlightText(punctuation, keyword)
    lastIndex = start + rawUrl.length
  }

  html += highlightText(text.slice(lastIndex), keyword)
  return html
}
