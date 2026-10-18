import test from 'node:test'
import assert from 'node:assert/strict'
import { parseHighlightText } from '../src/utils/highlightText.js'

test('highlight syntax becomes safe text segments without HTML parsing', () => {
  assert.deepEqual(parseHighlightText('前文 ==關鍵技術== 後文'), [
    { text: '前文 ', highlighted: false },
    { text: '關鍵技術', highlighted: true },
    { text: ' 後文', highlighted: false }
  ])
  assert.deepEqual(parseHighlightText('<script>alert(1)</script>'), [
    { text: '<script>alert(1)</script>', highlighted: false }
  ])
})

test('unclosed syntax remains visible and featured titles can highlight as a whole', () => {
  assert.deepEqual(parseHighlightText('尚未完成 ==標記'), [
    { text: '尚未完成 ==標記', highlighted: false }
  ])
  assert.deepEqual(parseHighlightText('==精選標題==', true), [
    { text: '精選標題', highlighted: true }
  ])
})
