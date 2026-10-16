export const comparisonNote =
  'Before 為問題情境重建；After 為目前方案的去識別重製，並非公司舊版截圖。'

export const caseStudies = [
  {
    id: 'member-context',
    title: '查訂單，不切走對話',
    teaser: '會員與訂單就地查詢',
    description: '客服回覆需要脈絡，不只是一個輸入框。',
    before: {
      title: '資料分散在不同頁面',
      description: '若查資料必須離開聊天室，回覆就會被切斷。',
      steps: ['查看會話', '另查會員與訂單', '返回對話']
    },
    after: {
      title: '把資料帶進對話旁邊',
      description: '會員摘要、詳情與訂單在右側切換，訊息區保持開啟。',
      steps: ['選擇會話', '側欄查詢與返回', '繼續回覆']
    },
    images: [
      {
        src: 'images/cases/chat-order.jpg',
        label: '側欄查訂單',
        alt: '虛構會話旁的會員訂單詳情',
        caption: '右側查看訂單，中央對話仍保留。'
      },
      {
        src: 'images/commerce-chat-demo.jpg',
        label: '會員摘要',
        alt: '三欄聊天工作台與會員摘要',
        caption: '會話、訊息、會員資訊各自保留位置。'
      }
    ],
    details: [
      {
        label: '我的處理',
        text: '建立三欄工作台，讓摘要、會員詳情、訂單列表與詳情共用右側資訊流程。'
      },
      {
        label: '狀態處理',
        text: '面板依目前會員切換；在訂單詳情返回時，回到同一會員的訂單列表。'
      }
    ],
    try: '選一則會話，點右側「訂單」，查看詳情後返回。',
    demo: '/demo/commerce-admin/chat',
    projectId: 'commerce-admin',
    status: 'published',
    order: 0
  },
  {
    id: 'conversation-state',
    title: '誰接手、能否回覆，要看得懂',
    teaser: '指派、未讀與回覆狀態',
    description: '多人客服需要清楚的會話歸屬與操作條件。',
    before: {
      title: '一則會話，有多個狀態',
      description: '未加入、未讀與已結案，不能共用同一種回覆狀態。',
      steps: ['辨識會話歸屬', '確認處理狀態']
    },
    after: {
      title: '讓狀態決定可用操作',
      description: '未加入時提供加入入口；結案後停用回覆，仍可重新開啟。',
      steps: ['加入或指派', '回覆與訊息操作', '結案或重開']
    },
    images: [
      {
        src: 'images/cases/chat-assignment.jpg',
        label: '尚未加入',
        alt: '未指派會話顯示加入入口與停用的輸入區',
        caption: '不能回覆時，直接說明原因與下一步。'
      }
    ],
    details: [
      {
        label: '我的處理',
        text: '實作會話加入與指派、未讀、釘選，以及文字、圖片、編輯與收回等訊息互動。'
      },
      {
        label: '公開版邊界',
        text: '原專案有歷史訊息與 WebSocket 更新；此處以本機事件展示狀態，不模擬真實連線成效。'
      }
    ],
    try: '選擇許知遠的會話，加入後回覆，再試著結案。',
    demo: '/demo/commerce-admin/chat',
    projectId: 'commerce-admin',
    status: 'published',
    order: 10
  },
  {
    id: 'dashboard-layout',
    title: '看板，依工作重點重新排列',
    teaser: '卡片排序、尺寸與配置保存',
    description: '營收、訂單和單據，不必一直占用固定位置。',
    before: {
      title: '每間門店關注的事不同',
      description: '若卡片順序與尺寸固定，就難配合目前的工作重點。',
      steps: ['營收與訂單', '商品與各類單據']
    },
    after: {
      title: '把編排權交給使用者',
      description: '編輯模式可排序、調整尺寸與重設，配置依門店保存。',
      steps: ['進入編輯', '調整位置與尺寸', '保存配置']
    },
    images: [
      {
        src: 'images/cases/pos-edit.jpg',
        label: '編輯看板',
        alt: 'POS 看板編輯模式中的排序與尺寸控制',
        caption: '編輯時才顯示控制項，平常保留乾淨的營運資訊。'
      },
      {
        src: 'images/pos-dashboard-demo.jpg',
        label: '營運總覽',
        alt: 'POS 看板的一般瀏覽模式',
        caption: '一般模式集中呈現營收、趨勢與單據摘要。'
      }
    ],
    details: [
      {
        label: '我的處理',
        text: '以 12 欄網格組織九個卡片，加入編輯模式、排序、尺寸調整與重設操作。'
      },
      {
        label: '展示版實作',
        text: '配置依門店在本機保存；重新載入仍保留。另提供按鈕排序與鍵盤尺寸控制。'
      }
    ],
    try: '點「編輯看板」，調整一個卡片，再重新載入。',
    demo: '/demo/pos-admin/dashboard',
    projectId: 'pos-admin',
    status: 'published',
    order: 20
  },
  {
    id: 'store-permissions',
    title: '同一套後台，不同的操作範圍',
    teaser: '門店資料與角色權限',
    description: '店長與夥伴的工作不同，畫面也要反映差異。',
    before: {
      title: '資料範圍與職責不同',
      description: '查哪間店、能否修改或匯出，必須一起考慮。',
      steps: ['選擇門店', '辨識角色', '確認可用操作']
    },
    after: {
      title: '依門店與角色呈現',
      description: '切店更新庫存；切換角色時同步調整導覽與可用操作。',
      steps: ['切換門店', '切換角色', '查看可用功能']
    },
    images: [
      {
        src: 'images/cases/pos-permissions.jpg',
        label: '門店夥伴',
        alt: '門店夥伴角色下的唯讀商品庫存列表',
        caption: '唯讀角色保留查詢，不提供庫存編輯與匯出。'
      }
    ],
    details: [
      {
        label: '我的處理',
        text: '實作角色管理、權限判斷，以及與門店資料對應的商品、庫存查詢流程。'
      },
      {
        label: '展示版邊界',
        text: '導覽、按鈕與 mock 操作都檢查權限；這仍不是安全認證，正式系統需要後端授權。'
      }
    ],
    try: '在商品與庫存頁切換門店，再把角色改為門店夥伴。',
    demo: '/demo/pos-admin/inventory',
    projectId: 'pos-admin',
    status: 'published',
    order: 30
  },
  {
    id: 'device-navigation',
    title: '手機，不是縮小的桌機',
    teaser: '桌機導覽與手機操作',
    description: '保留資訊完整度，也要讓手機找得到下一步。',
    before: {
      title: '桌機的資訊密度較高',
      description: '分類、新品和活動同時出現，直接縮小容易擠在一起。',
      steps: ['分類側欄', '活動與新品', '商品推薦']
    },
    after: {
      title: '依裝置重新安排入口',
      description: '桌機保留分類與新品區，手機改用分類捷徑與底部導覽。',
      steps: ['分類捷徑', '觸控瀏覽', '底部導覽']
    },
    images: [
      {
        src: 'images/cases/storefront-mobile.jpg',
        label: '手機',
        alt: '手機商城的分類捷徑與底部導覽',
        caption: '手機以分類捷徑與底部導覽集中主要入口。'
      },
      {
        src: 'images/storefront-demo.jpg',
        label: '桌機',
        alt: '桌機商城的分類、新品與活動區',
        caption: '桌機保留分類側欄、新品與較高的商品資訊密度。'
      }
    ],
    details: [
      {
        label: '我的處理',
        text: '維護桌機與行動版頁面、導覽及商品元件，依裝置安排入口，而不只縮小畫面。'
      },
      {
        label: '公開版',
        text: '以同一份虛構商品資料重製兩種布局，方便對照操作差異。'
      }
    ],
    try: '用手機開啟商城，或調整瀏覽器寬度比較導覽。',
    demo: '/demo/storefront',
    projectId: 'storefront',
    status: 'published',
    order: 40
  },
  {
    id: 'purchase-feedback',
    title: '不能購買時，也要有下一步',
    teaser: '售罄、數量與結帳回饋',
    description: '商品狀態會變，購買操作不能只處理成功情況。',
    before: {
      title: '購買條件不只一種',
      description: '庫存、數量與上架狀態，都會影響是否能購買。',
      steps: ['檢查商品', '選擇數量', '確認可購買']
    },
    after: {
      title: '讓狀態與操作一致',
      description: '售罄停用購買，數量受庫存限制，結帳後可到後台查訂單。',
      steps: ['顯示可購買狀態', '檢查整筆購物車', '建立展示訂單']
    },
    images: [
      {
        src: 'images/cases/storefront-stock.jpg',
        label: '售罄狀態',
        alt: '售罄商品的數量與購買按鈕停用',
        caption: '售罄仍保留商品資訊，並明確停用購買操作。'
      }
    ],
    details: [
      {
        label: '原工作範圍',
        text: '實作商品詳情、限時活動與會員相關狀態介面。'
      },
      {
        label: '展示版驗證',
        text: '結帳集中檢查全部品項；失敗不扣庫存。這是公開重製版的規則，不拿來宣稱原系統的商業成效。'
      }
    ],
    try: '查看售罄商品，或選一件有庫存商品完成模擬結帳。',
    demo: '/demo/storefront?product=p6',
    projectId: 'storefront',
    status: 'published',
    order: 50
  }
]
