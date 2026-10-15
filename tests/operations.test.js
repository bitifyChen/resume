import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createSeed } from '../src/mock/seed.js'
import { applyOperation, can } from '../src/mock/operations.js'
const now = 1_790_000_000_000
const seed = () => createSeed(now)

test('checkout creates a linked order, deducts stock and empties cart without mutating input', () => {
  const before = seed()
  const cart = applyOperation(before, {
    type: 'cart.add',
    payload: { productId: 'p1', quantity: 2 }
  })
  const after = applyOperation(
    cart,
    {
      type: 'checkout',
      payload: { recipient: '展示收件人', address: '展示地址', payment: '展示錢包' }
    },
    now
  )
  assert.equal(after.products[0].stock, before.products[0].stock - 2)
  assert.equal(after.orders[0].total, before.products[0].price * 2)
  assert.equal(after.orders[0].memberId, 'm1')
  assert.equal(after.cart.length, 0)
  assert.equal(before.products[0].stock, 32)
  assert.equal(before.cart.length, 0)
})
test('checkout validates the complete cart before committing any changes', () => {
  const db = seed()
  db.cart = [
    { productId: 'p1', quantity: 1 },
    { productId: 'p6', quantity: 1 }
  ]
  assert.throws(
    () =>
      applyOperation(db, {
        type: 'checkout',
        payload: { recipient: '展示', address: '展示', payment: '信用卡' }
      }),
    /庫存不足/
  )
  assert.equal(db.products[0].stock, 32)
  assert.equal(db.orders.length, 18)
})
test('unlisted products and excess cart quantities are rejected', () => {
  const db = seed()
  db.products[0].status = '已下架'
  assert.throws(
    () => applyOperation(db, { type: 'cart.add', payload: { productId: 'p1', quantity: 1 } }),
    /尚未上架/
  )
  assert.throws(
    () => applyOperation(seed(), { type: 'cart.add', payload: { productId: 'p1', quantity: 33 } }),
    /庫存不足/
  )
})
test('messages require ownership and an open conversation', () => {
  assert.throws(
    () => applyOperation(seed(), { type: 'chat.send', payload: { id: 'c3', text: 'hello' } }),
    /指派/
  )
  assert.throws(
    () => applyOperation(seed(), { type: 'chat.send', payload: { id: 'c6', text: 'hello' } }),
    /重新開啟/
  )
})
test('sent messages can be edited and retracted, customer messages cannot', () => {
  const sent = applyOperation(
    seed(),
    { type: 'chat.send', payload: { id: 'c1', text: '  展示回覆  ' } },
    now
  )
  const messageId = sent.conversations[0].messages.at(-1).id
  const edited = applyOperation(sent, {
    type: 'chat.edit',
    payload: { id: 'c1', messageId, text: '新的回覆' }
  })
  assert.equal(edited.conversations[0].messages.at(-1).edited, true)
  const retracted = applyOperation(edited, {
    type: 'chat.retract',
    payload: { id: 'c1', messageId }
  })
  assert.equal(retracted.conversations[0].messages.at(-1).text, '')
  assert.equal(retracted.conversations[0].messages.at(-1).retracted, true)
  assert.throws(
    () =>
      applyOperation(seed(), {
        type: 'chat.edit',
        payload: { id: 'c1', messageId: 'seed-0-1', text: '改寫' }
      }),
    /無法編輯/
  )
})
test('unread counters reflect incoming messages and reading', () => {
  const received = applyOperation(seed(), { type: 'chat.receive', payload: { id: 'c2' } })
  assert.equal(received.conversations[1].unread, 1)
  assert.equal(
    applyOperation(received, { type: 'chat.read', payload: { id: 'c2' } }).conversations[1].unread,
    0
  )
})
test('inventory adjustments enforce role permissions and record before and after', () => {
  assert.throws(
    () =>
      applyOperation(seed(), {
        type: 'inventory.adjust',
        roleId: 'clerk',
        payload: { id: 's1-p1', delta: 2, reason: '入庫' }
      }),
    /權限/
  )
  const after = applyOperation(
    seed(),
    {
      type: 'inventory.adjust',
      roleId: 'manager',
      payload: { id: 's1-p1', delta: 2, reason: '盤點' }
    },
    now
  )
  assert.equal(after.inventory[0].quantity, 6)
  assert.equal(after.inventoryLogs[0].before, 4)
  assert.equal(after.inventoryLogs[0].after, 6)
  assert.equal(after.inventory.find((item) => item.id === 's2-p1').quantity, 7)
})
test('negative inventory and partially invalid imports leave original data intact', () => {
  const db = seed()
  assert.throws(
    () =>
      applyOperation(db, {
        type: 'inventory.adjust',
        payload: { id: 's1-p1', delta: -5, reason: '出庫' }
      }),
    /小於 0/
  )
  assert.throws(
    () =>
      applyOperation(db, {
        type: 'inventory.import',
        payload: {
          rows: [
            { id: 's1-p1', quantity: 10 },
            { id: 's1-p2', quantity: -1 }
          ]
        }
      }),
    /非負整數/
  )
  assert.equal(db.inventory[0].quantity, 4)
  assert.equal(db.inventoryLogs.length, 0)
})
test('CSV import rejects duplicate rows and commits valid rows with logs', () => {
  assert.throws(
    () =>
      applyOperation(seed(), {
        type: 'inventory.import',
        payload: {
          rows: [
            { id: 's1-p1', quantity: 10 },
            { id: 's1-p1', quantity: 20 }
          ]
        }
      }),
    /重複/
  )
  const after = applyOperation(seed(), {
    type: 'inventory.import',
    payload: {
      rows: [
        { id: 's1-p1', quantity: 10 },
        { id: 's1-p2', quantity: 20 }
      ]
    }
  })
  assert.equal(after.inventory[0].quantity, 10)
  assert.equal(after.inventory[1].quantity, 20)
  assert.equal(after.inventoryLogs.length, 2)
})
test('role edits require admin permission and maintain a recoverable admin role', () => {
  const db = seed()
  assert.equal(can(db, 'clerk', 'reports', 'view'), false)
  assert.throws(
    () =>
      applyOperation(db, {
        type: 'role.save',
        roleId: 'manager',
        payload: { id: 'clerk', permissions: db.roles[1].permissions }
      }),
    /權限/
  )
  assert.throws(
    () =>
      applyOperation(db, {
        type: 'role.save',
        payload: { id: 'admin', permissions: db.roles[1].permissions }
      }),
    /保留/
  )
  const permissions = { products: ['view'], inventory: ['view', 'edit'], reports: [], team: [] }
  const after = applyOperation(db, { type: 'role.save', payload: { id: 'clerk', permissions } })
  assert.equal(can(after, 'clerk', 'inventory', 'edit'), true)
})
test('reset restores the fictional seed without affecting unrelated storage', () => {
  const db = seed()
  db.cart.push({ productId: 'p1', quantity: 1 })
  const reset = applyOperation(db, { type: 'reset' }, now)
  assert.equal(reset.cart.length, 0)
  assert.equal(reset.version, 1)
})
