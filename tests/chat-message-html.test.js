import test from 'node:test'
import assert from 'node:assert/strict'
import { formatChatMessageHtml } from '../src/utils/chatMessageHtml.js'

test('chat message HTML escapes content, highlights keywords, and links only http URLs', () => {
  const html = formatChatMessageHtml(
    '<img src=x onerror=alert(1)> Track at https://example.test/orders?a=1&b=2.',
    'example'
  )

  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/)
  assert.doesNotMatch(html, /<img\b/i)
  assert.match(html, /<mark>example<\/mark>/)
  assert.match(html, /href="https:\/\/example\.test\/orders\?a=1&amp;b=2"/)
  assert.match(html, /rel="noopener noreferrer"/)
  assert.match(html, /\.<\/mark>|<\/a>\./)

  const unsafe = formatChatMessageHtml('javascript://not-a-link.test')
  assert.doesNotMatch(unsafe, /<a\b/i)
})
