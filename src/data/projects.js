export const projects = [
  {
    slug: 'storefront',
    title: '商城',
    subtitle: '讓複雜流程，成為自然的購物體驗。',
    english: 'Consumer commerce',
    category: '消費者前台',
    image: 'images/everyday.png',
    imageAlt: '為展示商城生成的日常用品商品攝影',
    coverNote: 'AI 生成商品示意，非原公司素材',
    icon: 'ShoppingBag',
    demo: '/demo/storefront',
    role: '前端功能開發與既有流程改善',
    summary: '從會員、商品到限時活動，整理消費者在桌機與手機上的操作流程。',
    responsibilities: [
      '開發會員登入、註冊、邀請碼及驗證相關流程。',
      '開發限時活動列表、商品詳情與倒數狀態。',
      '整合錢包、QR Code 與商品資訊呈現，改善響應式體驗。'
    ],
    challenge:
      '會員狀態、庫存、活動時間與付款資訊交互影響，介面需要讓使用者知道現在能做什麼，以及下一步要做什麼。',
    approach:
      '把商品、購物袋與訂單資料獨立管理；將庫存檢查和結帳規則集中於資料層，讓頁面專注於呈現與互動。',
    outcomes: [
      '串起商品瀏覽、選擇數量、購物袋與建立訂單的操作流程。',
      '在售罄、已下架與庫存不足時提供明確回饋。',
      '以共用資料狀態，讓新訂單可在商城後台查詢。'
    ],
    steps: [
      { title: '挑選商品', description: '依分類、關鍵字或限時選品找到商品。' },
      { title: '加入購物袋', description: '檢視商品詳情與庫存，調整購買數量。' },
      { title: '展示結帳', description: '填寫虛構收件資訊，建立可於後台查詢的示範訂單。' }
    ],
    engineering: [
      '商品資訊與購物袋衍生狀態使用 computed 計算。',
      '結帳以單次資料操作檢查全部品項，失敗時不扣庫存。',
      '活動倒數由儲存的結束時間計算，卸載頁面時清除計時器。'
    ],
    boundary:
      '本版聚焦購物流程；登入、實際支付與 QR 掃描尚未納入互動展示。所有金額均為示意，不會產生交易。'
  },
  {
    slug: 'commerce-admin',
    title: '商城後台',
    subtitle: '把客服、會員與訂單，放在同一個工作脈絡。',
    english: 'Commerce operations',
    category: '營運與客服',
    image: 'images/commerce-admin.png',
    imageAlt: '商城後台客服工作台概念封面',
    coverNote: 'AI 概念封面，實際 Demo 為獨立重製介面',
    icon: 'ChatDotRound',
    demo: '/demo/commerce-admin/chat',
    role: '後台前端主責開發',
    summary: '主責營運後台核心模組，以完整客服工作台展示跨模組整合與狀態管理。',
    responsibilities: [
      '主責會員、商品、訂單與營運相關後台模組。',
      '建置客服會話、訊息互動及會員／訂單資訊整合流程。',
      '擴充共用表格、搜尋、分頁與抽屜式編輯元件。'
    ],
    challenge:
      '客服回覆時需要反覆查找會員與訂單；會話指派、未讀、處理狀態與訊息操作又有各自的條件。',
    approach:
      '採用會話列表、訊息區、會員資訊三欄工作台，將指派、結案與訊息操作明確化，並提供關聯訂單的就地查詢。',
    outcomes: [
      '在單一工作台完成查詢會員、檢視訂單與回覆訊息。',
      '依會話歸屬與處理狀態限制可執行操作。',
      '共用搜尋與分頁模式，維持商品及訂單頁的一致操作方式。'
    ],
    steps: [
      { title: '接手一則會話', description: '依未讀、我的會話或全部會話篩選，接手或指派客服。' },
      {
        title: '處理問題',
        description: '查詢會員及關聯訂單，傳送文字或展示圖片，編輯與收回自己的訊息。'
      },
      { title: '完成服務', description: '結案、重新開啟，或模擬新訊息觀察未讀狀態。' }
    ],
    engineering: [
      '會話與訊息依識別碼關聯，從資料計算列表摘要及未讀數。',
      '資料存取集中於 api 與 mock repository；互動邏輯放在 hook。',
      '伺服器狀態交由 Vue Query 管理；UI 狀態與跨頁選擇使用 Pinia。'
    ],
    boundary:
      '訊息在本機模擬，不連接原公司的即時服務；「模擬新訊息」用來展示會話狀態轉換。正式系統的雙因素驗證與資產規則不在本版重現。'
  },
  {
    slug: 'pos-admin',
    title: 'POS 後台',
    subtitle: '從營運概況，到每一筆庫存調整。',
    english: 'Retail operations',
    category: '門店與庫存',
    image: 'images/pos-admin.png',
    imageAlt: '零售 POS 營運與庫存管理概念封面',
    coverNote: 'AI 概念封面，實際 Demo 為獨立重製介面',
    icon: 'Grid',
    demo: '/demo/pos-admin/dashboard',
    role: '後台前端主責開發',
    summary: '主責零售後台核心模組，整合門店、商品、庫存、營運概況與角色權限。',
    responsibilities: [
      '主責商品、庫存、門店、銷售與營運 Dashboard 等模組。',
      '開發匯入匯出、付款及幣別相關管理介面。',
      '建置角色權限與可重用的後台元件。'
    ],
    challenge:
      '不同門店、不同工作角色，需要看到不同的資料與操作；庫存調整又必須保持可追蹤且避免無效數量。',
    approach: '以門店作為查詢範圍，將權限規則與資料操作集中處理；庫存異動保留調整前後數量及原因。',
    outcomes: [
      '切換門店即可檢視對應庫存及示意營運數據。',
      '庫存調整與 CSV 匯入都產生可查詢的異動紀錄。',
      '切換角色即可觀察導覽、編輯及匯出權限的差異。'
    ],
    steps: [
      { title: '掌握營運', description: '切換門店與報表期間，檢視營收、訂單與低庫存提醒。' },
      { title: '管理庫存', description: '搜尋商品、調整數量，或預覽 CSV 匯入結果後套用。' },
      { title: '體驗權限', description: '調整店長及夥伴角色，再切換角色觀察功能變化。' }
    ],
    engineering: [
      '門店與目前角色使用 Pinia，表格搜尋與分頁封裝為共用 hook。',
      '單筆調整及批次匯入共用資料驗證，整批驗證成功後才寫入。',
      '權限同時套用於導覽、按鈕與 mock 資料操作，避免只隱藏按鈕。'
    ],
    boundary:
      '本版權限僅模擬前端行為，不是安全認證；正式產品仍需後端授權。銷售報表為虛構資料，付款設定與實際收銀不在本版展示。'
  }
]
export const findProject = (slug) => projects.find((project) => project.slug === slug)
