import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseCsv, toCsv } from '../src/utils/csv.js'

test('CSV round trip preserves Traditional Chinese, commas, quotes and newlines', () => {
  const rows = [
    ['商品', '備註'],
    ['日常選物', '含,逗號'],
    ['收納袋', '"引號"與\n換行']
  ]
  assert.deepEqual(parseCsv(toCsv(rows[0], rows.slice(1))), rows)
})
test('CSV spreadsheet formulas are escaped on export', () => {
  assert.match(toCsv(['name'], [['=HYPERLINK("test")']]), /'=HYPERLINK/)
})
test('malformed quoted CSV is rejected', () => {
  assert.throws(() => parseCsv('SKU,庫存\n"RT-001,3'), /未成對/)
})
