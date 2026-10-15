import test from 'node:test'
import assert from 'node:assert/strict'
import { dashboardDefaults, normalizeDashboard, moveDashboard } from '../src/utils/dashboard.js'

test('dashboard restores all known widgets and validates saved dimensions', () => {
  const cards = normalizeDashboard([
    { id: 'todayOrders', cols: 999, rows: -2 },
    { id: 'unknown' },
    { id: 'todayOrders' }
  ])
  assert.equal(cards.length, 9)
  assert.equal(cards[0].cols, 12)
  assert.equal(cards[0].rows, 1)
  assert.equal(new Set(cards.map((card) => card.id)).size, 9)
  assert.deepEqual(normalizeDashboard(null), dashboardDefaults)
})
test('dashboard move is immutable and preserves widget configuration', () => {
  const original = normalizeDashboard()
  const moved = moveDashboard(original, 'todayOrders', 'todayRevenue')
  assert.equal(moved[0].id, 'todayRevenue')
  assert.equal(moved[1].id, 'todayOrders')
  assert.deepEqual(original, dashboardDefaults)
  assert.deepEqual(moveDashboard(original, 'missing', 'todayOrders'), original)
})
