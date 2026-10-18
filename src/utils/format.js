export const money = (value) =>
  new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0
  }).format(value)
export const number = (value) => new Intl.NumberFormat('zh-TW').format(value)
export const time = (value) =>
  new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false }).format(
    new Date(value)
  )
export const date = (value) =>
  new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(value))
export const asset = (path) =>
  /^(?:https?:)?\/\//.test(path)
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
