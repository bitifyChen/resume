const quote = (value) =>
  `"${String(value ?? '')
    .replace(/^[=+@\-\t\r]/, "'$&")
    .replaceAll('"', '""')}"`
export function toCsv(headers, rows) {
  return '\uFEFF' + [headers, ...rows].map((row) => row.map(quote).join(',')).join('\r\n')
}
export function downloadCsv(filename, headers, rows) {
  const url = URL.createObjectURL(
    new Blob([toCsv(headers, rows)], { type: 'text/csv;charset=utf-8' })
  )
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  const source = text.replace(/^\uFEFF/, '')
  for (let index = 0; index < source.length; index++) {
    const char = source[index]
    if (char === '"' && source[index + 1] === '"' && quoted) {
      cell += '"'
      index++
    } else if (char === '"') quoted = !quoted
    else if (char === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[index + 1] === '\n') index++
      row.push(cell)
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
      cell = ''
    } else cell += char
  }
  if (quoted) throw new Error('CSV 引號未成對')
  row.push(cell)
  if (row.some((value) => value.trim())) rows.push(row)
  return rows
}
