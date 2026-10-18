const HIGHLIGHT_DELIMITER = '=='

export function parseHighlightText(value, highlightAll = false) {
  const text = String(value ?? '')

  if (highlightAll) {
    return [
      {
        text: text.split(HIGHLIGHT_DELIMITER).join(''),
        highlighted: true
      }
    ]
  }

  const segments = []
  let cursor = 0
  let isHighlighted = false

  while (cursor < text.length) {
    const delimiterIndex = text.indexOf(HIGHLIGHT_DELIMITER, cursor)

    if (delimiterIndex === -1) {
      segments.push({ text: text.slice(cursor), highlighted: isHighlighted })
      break
    }

    if (delimiterIndex > cursor) {
      segments.push({ text: text.slice(cursor, delimiterIndex), highlighted: isHighlighted })
    }

    isHighlighted = !isHighlighted
    cursor = delimiterIndex + HIGHLIGHT_DELIMITER.length
  }

  if (isHighlighted) return [{ text, highlighted: false }]

  return segments.filter((segment) => segment.text)
}
