export const projects = [
  {
    id: 'storefront',
    slug: 'storefront',
    title: '商城前台',
    english: 'Consumer commerce',
    summary: '從商品瀏覽到購買，分別照顧桌機與手機。',
    role: '前端功能開發與流程改善',
    image: 'images/storefront-demo.jpg',
    imageAlt: '商城重製版：商品分類、活動輪播與熱銷區',
    demo: '/demo/storefront',
    responsibilities: [
      '會員登入、驗證與邀請流程',
      '限時活動、商品詳情與倒數',
      '錢包相關介面與響應式體驗'
    ],
    boundary: '本版重現商品與購物流程；登入、付款、真實錢包與 QR 掃描未納入。所有交易皆為模擬。',
    status: 'published',
    order: 10
  },
  {
    id: 'commerce-admin',
    slug: 'commerce-admin',
    title: '商城後台',
    english: 'Commerce admin',
    summary: '讓客服在同一個工作區查資料、回覆與交接。',
    role: '後台前端主責開發',
    image: 'images/commerce-chat-demo.jpg',
    imageAlt: '商城後台重製版：會話、訊息與會員資訊三欄工作區',
    demo: '/demo/commerce-admin/chat',
    responsibilities: ['會員、商品與訂單管理', '客服會話與訊息互動', '共用表格、分頁與編輯元件'],
    boundary: '聊天使用本機事件模擬，不連接公司 WebSocket；會員、訂單與訊息都是假資料。',
    status: 'published',
    order: 20
  },
  {
    id: 'pos-admin',
    slug: 'pos-admin',
    title: 'POS 後台',
    english: 'Retail operations',
    summary: '把門店營運、商品與庫存整理成每天能用的工具。',
    role: '後台前端主責開發',
    image: 'images/pos-dashboard-demo.jpg',
    imageAlt: 'POS 後台重製版：營運看板、趨勢與單據摘要',
    demo: '/demo/pos-admin/dashboard',
    responsibilities: [
      '門店、商品、庫存與銷售管理',
      '營運看板與批次匯入匯出',
      '角色權限與共用後台元件'
    ],
    boundary: '營運數字與單據為假資料；權限僅模擬前端行為，不能取代後端授權。',
    status: 'published',
    order: 30
  }
]
