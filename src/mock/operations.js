import { createSeed } from './seed.js'

const required = (value, message) => {
  if (!value) throw new Error(message)
}
const find = (list, id, label) => {
  const item = list.find((entry) => entry.id === id)
  required(item, `找不到${label}`)
  return item
}
const positiveInteger = (value) => Number.isInteger(value) && value > 0
export const can = (database, roleId, module, action) =>
  database.roles.find((role) => role.id === roleId)?.permissions[module]?.includes(action) || false

export function applyOperation(
  database,
  { type, payload = {}, roleId = 'admin' },
  now = Date.now()
) {
  const db = structuredClone(database)
  const id = () => `demo-${now}-${Math.random().toString(36).slice(2, 8)}`
  const requirePermission = (module, action = 'edit') =>
    required(can(db, roleId, module, action), '目前角色沒有此操作權限')
  switch (type) {
    case 'reset':
      return createSeed(now)
    case 'cart.add': {
      const product = find(db.products, payload.productId, '商品')
      required(product.status === '上架中', '此商品尚未上架')
      required(positiveInteger(payload.quantity), '數量必須是正整數')
      const line = db.cart.find((item) => item.productId === product.id)
      const quantity = (line?.quantity || 0) + payload.quantity
      required(quantity <= product.stock, '商品庫存不足')
      if (line) line.quantity = quantity
      else db.cart.push({ productId: product.id, quantity })
      break
    }
    case 'cart.set': {
      const line = db.cart.find((item) => item.productId === payload.productId)
      required(line, '購物車沒有這個商品')
      required(Number.isInteger(payload.quantity) && payload.quantity >= 0, '數量不正確')
      required(
        payload.quantity <= find(db.products, payload.productId, '商品').stock,
        '商品庫存不足'
      )
      if (payload.quantity === 0)
        db.cart = db.cart.filter((item) => item.productId !== payload.productId)
      else line.quantity = payload.quantity
      break
    }
    case 'favorite.toggle': {
      find(db.products, payload.productId, '商品')
      db.favorites = db.favorites.includes(payload.productId)
        ? db.favorites.filter((entry) => entry !== payload.productId)
        : [...db.favorites, payload.productId]
      break
    }
    case 'checkout': {
      required(db.cart.length, '請先加入商品')
      required(payload.recipient?.trim() && payload.address?.trim(), '請填寫收件人與收件地址')
      required(['展示錢包', '信用卡'].includes(payload.payment), '請選擇付款方式')
      const items = db.cart.map((line) => {
        const product = find(db.products, line.productId, '商品')
        required(
          product.status === '上架中' &&
            positiveInteger(line.quantity) &&
            product.stock >= line.quantity,
          `${product.name} 庫存不足或已下架`
        )
        product.stock -= line.quantity
        return {
          productId: product.id,
          name: product.name,
          quantity: line.quantity,
          price: product.price
        }
      })
      db.orders.unshift({
        id: `DEMO-${now}`,
        memberId: 'm1',
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: '待出貨',
        payment: payload.payment,
        createdAt: now,
        recipient: payload.recipient.trim(),
        address: payload.address.trim(),
        source: '商城展示結帳'
      })
      db.cart = []
      break
    }
    case 'product.save': {
      const product = find(db.products, payload.id, '商品')
      required(payload.name?.trim(), '請輸入商品名稱')
      required(Number.isFinite(payload.price) && payload.price > 0, '售價必須大於 0')
      required(Number.isInteger(payload.stock) && payload.stock >= 0, '庫存必須是非負整數')
      required(['上架中', '已下架'].includes(payload.status), '商品狀態不正確')
      Object.assign(product, {
        name: payload.name.trim(),
        price: payload.price,
        stock: payload.stock,
        status: payload.status
      })
      break
    }
    case 'order.ship': {
      const order = find(db.orders, payload.id, '訂單')
      required(order.status === '待出貨', '只有待出貨訂單可以標記出貨')
      order.status = '配送中'
      break
    }
    case 'chat.read':
      find(db.conversations, payload.id, '會話').unread = 0
      break
    case 'chat.pin': {
      const chat = find(db.conversations, payload.id, '會話')
      chat.pinned = !chat.pinned
      break
    }
    case 'chat.assign': {
      required(['我', '承翰', '怡君', null].includes(payload.agent), '客服人員不正確')
      find(db.conversations, payload.id, '會話').assignedTo = payload.agent
      break
    }
    case 'chat.status': {
      required(['處理中', '已結案'].includes(payload.status), '會話狀態不正確')
      find(db.conversations, payload.id, '會話').status = payload.status
      break
    }
    case 'chat.send': {
      const chat = find(db.conversations, payload.id, '會話')
      required(chat.status !== '已結案', '請先重新開啟會話')
      required(chat.assignedTo === '我', '請先加入或將會話指派給自己')
      required(payload.messageType === 'image' || payload.text?.trim(), '請輸入訊息')
      required((payload.text || '').length <= 2000, '訊息不能超過 2000 字')
      chat.messages.push({
        id: id(),
        sender: 'agent',
        type: payload.messageType === 'image' ? 'image' : 'text',
        text: payload.text?.trim() || '展示商品照片',
        createdAt: now
      })
      break
    }
    case 'chat.edit': {
      const message = find(
        find(db.conversations, payload.id, '會話').messages,
        payload.messageId,
        '訊息'
      )
      required(
        message.sender === 'agent' && !message.retracted && message.type === 'text',
        '此訊息無法編輯'
      )
      required(payload.text?.trim() && payload.text.length <= 2000, '請輸入 1 到 2000 字的訊息')
      message.text = payload.text.trim()
      message.edited = true
      break
    }
    case 'chat.retract': {
      const message = find(
        find(db.conversations, payload.id, '會話').messages,
        payload.messageId,
        '訊息'
      )
      required(message.sender === 'agent' && !message.retracted, '此訊息無法收回')
      message.retracted = true
      message.text = ''
      break
    }
    case 'chat.receive': {
      const chat = find(db.conversations, payload.id, '會話')
      chat.messages.push({
        id: id(),
        sender: 'customer',
        type: 'text',
        text: '了解，謝謝您的協助！想再確認是否會收到出貨通知？',
        createdAt: now
      })
      chat.unread += 1
      break
    }
    case 'inventory.adjust': {
      requirePermission('inventory')
      const item = find(db.inventory, payload.id, '庫存資料')
      required(Number.isInteger(payload.delta) && payload.delta !== 0, '調整數量須為非零整數')
      required(item.quantity + payload.delta >= 0, '調整後庫存不能小於 0')
      required(payload.reason?.trim(), '請填寫調整原因')
      db.inventoryLogs.unshift({
        id: id(),
        inventoryId: item.id,
        name: item.name,
        storeId: item.storeId,
        before: item.quantity,
        after: item.quantity + payload.delta,
        reason: payload.reason.trim(),
        roleId,
        createdAt: now
      })
      item.quantity += payload.delta
      break
    }
    case 'inventory.import': {
      requirePermission('inventory')
      required(Array.isArray(payload.rows) && payload.rows.length > 0, '沒有可匯入的資料')
      const seen = new Set()
      payload.rows.forEach((row) => {
        required(!seen.has(row.id), '匯入資料包含重複商品')
        seen.add(row.id)
        const item = find(db.inventory, row.id, '庫存資料')
        required(Number.isInteger(row.quantity) && row.quantity >= 0, '匯入庫存必須是非負整數')
        db.inventoryLogs.unshift({
          id: id(),
          inventoryId: item.id,
          name: item.name,
          storeId: item.storeId,
          before: item.quantity,
          after: row.quantity,
          reason: 'CSV 匯入',
          roleId,
          createdAt: now
        })
        item.quantity = row.quantity
      })
      break
    }
    case 'role.save': {
      requirePermission('team')
      const role = find(db.roles, payload.id, '角色')
      required(role.id !== 'admin', '系統管理員權限保留，請調整其他角色')
      for (const module of Object.keys(role.permissions)) {
        const actions = payload.permissions?.[module]
        required(
          Array.isArray(actions) &&
            actions.every((action) => ['view', 'edit', 'export'].includes(action)),
          '權限設定不正確'
        )
        required(actions.includes('view') || !actions.length, '編輯及匯出需同時開啟檢視權限')
      }
      role.permissions = structuredClone(payload.permissions)
      break
    }
    default:
      throw new Error('不支援的展示操作')
  }
  return db
}
