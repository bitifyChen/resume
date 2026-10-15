export const dashboardDefaults = [
  { id: 'todayOrders', title: '今日訂單', cols: 2, rows: 1 },
  { id: 'todayRevenue', title: '今日營收', cols: 2, rows: 1 },
  { id: 'productSpecs', title: '商品規格數', cols: 2, rows: 1 },
  { id: 'recentOrders', title: '最近訂單', cols: 6, rows: 4 },
  { id: 'salesTrend', title: '銷售趨勢', cols: 6, rows: 3 },
  { id: 'purchaseOrders', title: '進貨單', cols: 6, rows: 2 },
  { id: 'returnOrders', title: '退貨單', cols: 6, rows: 2 },
  { id: 'transferOrders', title: '調撥單', cols: 6, rows: 2 },
  { id: 'damageOrders', title: '報損單', cols: 6, rows: 2 }
]

export function normalizeDashboard(saved) {
  if (!Array.isArray(saved)) return dashboardDefaults.map((item) => ({ ...item }))
  const seen = new Set()
  const valid = saved.flatMap((item) => {
    const original = dashboardDefaults.find((card) => card.id === item?.id)
    if (!original || seen.has(original.id)) return []
    seen.add(original.id)
    const cols = Number.isInteger(item.cols) ? Math.max(2, Math.min(12, item.cols)) : original.cols
    const rows = Number.isInteger(item.rows) ? Math.max(1, Math.min(6, item.rows)) : original.rows
    return [{ ...original, cols, rows }]
  })
  return [
    ...valid,
    ...dashboardDefaults.filter((item) => !seen.has(item.id)).map((item) => ({ ...item }))
  ]
}

export function moveDashboard(cards, fromId, toId) {
  const next = cards.map((card) => ({ ...card }))
  const from = next.findIndex((card) => card.id === fromId)
  const to = next.findIndex((card) => card.id === toId)
  if (from < 0 || to < 0 || from === to) return next
  next.splice(to, 0, next.splice(from, 1)[0])
  return next
}
