export const DEMO_VERSION = 1

export const productTemplates = [
  {
    id: 'p1',
    name: '隨行保溫瓶',
    english: 'Everyday bottle',
    category: '日常選物',
    price: 680,
    originalPrice: 850,
    stock: 32,
    color: '鼠尾草綠',
    icon: 'Goods',
    tone: 'sage',
    featured: true
  },
  {
    id: 'p2',
    name: '城市帆布袋',
    english: 'City canvas tote',
    category: '通勤配件',
    price: 490,
    originalPrice: 620,
    stock: 18,
    color: '石墨灰',
    icon: 'ShoppingBag',
    tone: 'charcoal',
    featured: false
  },
  {
    id: 'p3',
    name: '晨間陶瓷杯',
    english: 'Morning ceramic',
    category: '居家生活',
    price: 420,
    originalPrice: 520,
    stock: 27,
    color: '霧白',
    icon: 'Collection',
    tone: 'cream',
    featured: true
  },
  {
    id: 'p4',
    name: '無線降噪耳機',
    english: 'Focus headphones',
    category: '通勤配件',
    price: 2380,
    originalPrice: 2980,
    stock: 9,
    color: '岩石灰',
    icon: 'Bell',
    tone: 'stone',
    featured: true
  },
  {
    id: 'p5',
    name: '方格隨身筆記',
    english: 'Pocket notebook',
    category: '日常選物',
    price: 180,
    originalPrice: 220,
    stock: 45,
    color: '森林綠',
    icon: 'Collection',
    tone: 'forest',
    featured: false
  },
  {
    id: 'p6',
    name: '桌面收納盤',
    english: 'Desk organizer',
    category: '居家生活',
    price: 360,
    originalPrice: 450,
    stock: 0,
    color: '淺沙',
    icon: 'Box',
    tone: 'sand',
    featured: false
  },
  {
    id: 'p7',
    name: '輕量旅行收納袋',
    english: 'Travel pouch',
    category: '通勤配件',
    price: 290,
    originalPrice: 350,
    stock: 24,
    color: '霧藍',
    icon: 'ShoppingBag',
    tone: 'blue',
    featured: false
  },
  {
    id: 'p8',
    name: '木質手機立架',
    english: 'Oak phone stand',
    category: '居家生活',
    price: 390,
    originalPrice: 480,
    stock: 12,
    color: '原木',
    icon: 'Box',
    tone: 'sand',
    featured: true
  }
]

export const permissionModules = [
  { id: 'products', name: '商品管理' },
  { id: 'inventory', name: '庫存管理' },
  { id: 'reports', name: '營運報表' },
  { id: 'team', name: '角色權限' }
]

export function createSeed(now = Date.now()) {
  const products = productTemplates.map((product, index) => ({
    ...product,
    sku: `ED-${String(index + 1).padStart(3, '0')}`,
    status: '上架中',
    description: '把實用的細節，放進每天都會用到的物品。這是為展示網站獨立建立的虛構商品。'
  }))
  const names = ['林沐晴', '陳以安', '許知遠', '葉書寧', '沈柏宇', '吳若庭', '江予晨', '周宥希']
  const members = names.map((name, index) => ({
    id: `m${index + 1}`,
    name,
    email: `member${index + 1}@example.test`,
    level: index % 3 === 0 ? '金卡會員' : '一般會員',
    joined: '2026-05-18',
    color: ['#657b6c', '#a1775d', '#6c7a96', '#896b87'][index % 4],
    note: index === 0 ? '偏好超商取貨；請協助確認出貨時間。' : '此為虛構的會員資料。'
  }))
  const statuses = ['待出貨', '處理中', '已完成', '待出貨', '已取消']
  const orders = Array.from({ length: 18 }, (_, index) => {
    const product = products[index % products.length]
    const quantity = (index % 3) + 1
    return {
      id: `DEMO-${1048 - index}`,
      memberId: members[index % members.length].id,
      items: [{ productId: product.id, name: product.name, price: product.price, quantity }],
      total: product.price * quantity,
      status: statuses[index % statuses.length],
      payment: index % 2 ? '信用卡' : '展示錢包',
      createdAt: now - index * 4_200_000,
      recipient: names[index % names.length],
      address: '展示市範例區示意路 8 號',
      source: '展示資料'
    }
  })
  const subjects = [
    '想確認這筆訂單的出貨時間',
    '保溫瓶還會補貨嗎？',
    '想修改收件資訊',
    '請問可以退換貨嗎？',
    '發票要如何申請？',
    '商品已收到了，謝謝！'
  ]
  const conversations = subjects.map((subject, index) => ({
    id: `c${index + 1}`,
    memberId: members[index].id,
    subject,
    orderId: orders[index].id,
    assignedTo: index === 2 ? null : index === 3 ? '承翰' : '我',
    status: index === 5 ? '已結案' : '處理中',
    unread: index === 0 ? 2 : index === 2 ? 1 : 0,
    pinned: index === 0,
    messages: [
      {
        id: `seed-${index}-1`,
        sender: 'customer',
        type: 'text',
        text: subject,
        createdAt: now - (index + 1) * 180_000 - 60_000
      },
      ...(index === 0
        ? [
            {
              id: 'seed-0-2',
              sender: 'agent',
              type: 'text',
              text: '您好，我正在幫您確認訂單，請稍等一下。也可查看 https://example.com/orders 訂單狀態。',
              createdAt: now - 120_000
            },
            {
              id: 'seed-0-3',
              sender: 'customer',
              type: 'text',
              text: '好的，這週末前收到就可以，謝謝。',
              createdAt: now - 60_000
            }
          ]
        : [])
    ]
  }))
  const full = Object.fromEntries(
    permissionModules.map((module) => [module.id, ['view', 'edit', 'export']])
  )
  const stores = [
    { id: 's1', name: '青川選物 / 中央店' },
    { id: 's2', name: '青川選物 / 河畔店' },
    { id: 's3', name: '青川選物 / 公園店' }
  ]
  return {
    version: DEMO_VERSION,
    products,
    members,
    orders,
    conversations,
    cart: [],
    favorites: [],
    campaignEndsAt: now + 86_400_000,
    stores,
    inventory: stores.flatMap((store, storeIndex) =>
      products.map((product, index) => ({
        id: `${store.id}-${product.id}`,
        storeId: store.id,
        productId: product.id,
        sku: `RT-${String(index + 1).padStart(3, '0')}`,
        name: product.name,
        category: product.category,
        cost: Math.round(product.price * 0.55),
        price: product.price,
        quantity: (index * 7 + storeIndex * 3 + 4) % 35,
        threshold: 8
      }))
    ),
    inventoryLogs: [],
    roles: [
      {
        id: 'admin',
        name: '系統管理員',
        description: '完整操作權限，保留為展示管理入口。',
        permissions: full
      },
      {
        id: 'manager',
        name: '商家管理者',
        description: '管理商品、庫存與營運報表。',
        permissions: {
          products: ['view', 'edit', 'export'],
          inventory: ['view', 'edit', 'export'],
          reports: ['view', 'export'],
          team: ['view']
        }
      },
      {
        id: 'clerk',
        name: '商家夥伴',
        description: '查看商品與庫存，不可修改或匯出。',
        permissions: { products: ['view'], inventory: ['view'], reports: [], team: [] }
      }
    ],
    sales: Array.from({ length: 14 }, (_, day) => ({
      label: `${new Date(now - (13 - day) * 86_400_000).getMonth() + 1}/${new Date(now - (13 - day) * 86_400_000).getDate()}`,
      revenue: [
        11840, 15620, 13990, 18230, 16480, 22160, 20450, 17820, 19940, 24680, 21750, 26900, 23980,
        28640
      ][day],
      orders: [24, 31, 28, 36, 32, 44, 41, 35, 39, 49, 43, 54, 48, 57][day]
    }))
  }
}
