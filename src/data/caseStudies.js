export const caseStudies = [
  {
    id: 'member-context',
    title: '對話優化提升工作效率',
    subtitle: '會員快速選單，客服即時查看訂單',
    teaser: '訊息辨識訂單編號，點擊即開啟詳情',
    description:
      '我觀察到客服處理訂單問題時，常得複製編號、切到訂單列表再搜尋。我在會員對話加入近期訂單快捷入口，並讓客服工作台直接從訊息文字辨識訂單編號；即使訊息含其他文字也能顯示可點選的訂單標籤，開啟側欄詳情，無須調整後端 API。',
    story: {
      problem: '客服要查會員提到的訂單，常需複製訂單編號、切到訂單列表貼上搜尋，再返回聊天，操作往返也打斷了原本的處理脈絡。',
      role: '我規劃並實作會員端的近期訂單快捷入口，以及客服工作台的訊息辨識、訂單標籤與詳情側欄互動。',
      action: '會員可從對話中的「訂單」按鈕選取近期訂單，系統自動送出查詢訊息；客服端掃描每則訊息並標示符合格式的訂單編號，點選標籤即可展開對應詳情。',
      technology: '在客服工作台以正規表達式從訊息文字擷取訂單編號，不限定固定問句，混有其他文字或多筆編號也可辨識；由前端狀態開啟右側訂單詳情，不需調整後端 API。',
      result: '客服可直接從對話中的訂單編號開啟詳情；會員使用快捷入口可帶入標準查詢文字，一般訊息只要包含符合格式的編號也能觸發，對話不必切離目前工作區。'
    },
    before: {
      title: '複製編號，再切頁搜尋',
      description: '客服從訊息複製訂單編號，切到訂單列表貼上搜尋，查完後再回到原對話。',
      steps: ['複製訊息中的訂單編號', '切到訂單列表貼上搜尋', '返回聊天繼續處理']
    },
    after: {
      title: '訊息偵測編號，點擊即查訂單',
      description: '會員可選近期訂單發送查詢訊息；客服端也能從任意含有符合格式編號的訊息中辨識訂單，點擊標籤便在右側開啟詳情。',
      steps: ['會員選取近期訂單或直接傳送編號', '客服端顯示可點選的訂單標籤', '點擊標籤，在側欄查看訂單詳情']
    },
    images: [
      {
        src: 'images/cases/chat-order-detected.png',
        label: '訊息偵測訂單並顯示詳情',
        alt: '虛構客服對話訊息下方出現訂單編號標籤，右側同時顯示相同訂單的詳情',
        caption: '點選訊息中的訂單編號標籤後，右側顯示同一筆訂單詳情，客服無須離開對話。'
      }
    ],
    details: [
      {
        label: '【會員端】近期訂單快捷入口',
        text: '會員點擊對話中的「訂單」按鈕，可選取近期訂單；選定後自動送出「我要查詢 XXX-XXXXX 訂單」格式的訊息。'
      },
      {
        label: '訊息訂單編號辨識',
        text: '客服工作台以正規表達式掃描訊息文字，擷取符合訂單編號結構的內容；不依賴固定句型，訊息含其他文字或多筆編號仍可辨識。'
      },
      {
        label: '訂單標籤與側欄詳情',
        text: '在原訊息下方顯示偵測到的訂單編號，客服點選任一標籤後，右側資訊面板延展並載入對應訂單詳情。'
      },
      {
        label: '不需調整後端 API',
        text: '沿用既有聊天訊息承載訂單編號，由客服工作台解析文字並觸發詳情檢視，完成訂單查詢入口與對話介面的串接。'
      }
    ],
    projectId: 'commerce-admin',
    featured: true,
    contentStatus: 1,
    status: 'published',
    order: 0
  },
  {
    id: 'dashboard-layout',
    title: '看板自由編排，營運重點一目了然',
    subtitle: '看板，依工作重點重新排列',
    teaser: '卡片排序、尺寸與排列儲存',
    description:
      '我負責 POS 營運看板的元件結構與編輯流程，將卡片位置和尺寸轉為可儲存的排列設定，並以 12 欄網格支援拖曳排序、尺寸調整與重設。使用者可依商家工作重點編排資訊，儲存後再次進入仍可還原排列。',
    story: {
      problem: '不同商家關注的營運資訊不同，固定順序與尺寸無法配合各自的工作情境。',
      role: '我負責看板的元件結構、編輯模式與排列儲存流程。',
      action: '設計可排序、調整尺寸與重設的 12 欄網格，將編排操作集中在編輯模式。',
      technology: '以設定資料描述卡片位置與尺寸，並依商家儲存排列方式，讓瀏覽與編輯模式共用同一份結構。',
      result: '使用者可以依商家工作重點調整資訊層級，平常瀏覽時仍保留清楚的營運畫面。'
    },
    before: {
      title: '各商家關注的營運重點不同',
      description: '若卡片順序與尺寸固定，就難配合目前的工作重點。',
      steps: ['營收與訂單', '商品與各類單據']
    },
    after: {
      title: '把編排權交給使用者',
      description: '編輯模式可排序、調整尺寸與重設，排列設定會依商家儲存。',
      steps: ['進入編輯', '調整位置與尺寸', '儲存排列設定']
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
    walkthrough: [
      {
        title: '檢視營運總覽',
        description: '一般模式集中呈現營收、訂單、趨勢與單據摘要。',
        imageIndex: 1
      },
      {
        title: '調整卡片排列',
        description: '進入編輯模式後，可重新排序、調整卡片尺寸。',
        imageIndex: 0
      },
      {
        title: '儲存商家看板設定',
        description: '完成編排後退出編輯，排列會依目前商家儲存在本機。',
        imageIndex: 0
      }
    ],
    details: [
      {
        label: '我的處理',
        text: '以 12 欄網格描述卡片位置與寬度，加入拖曳排序、尺寸調整、重設與編輯模式。'
      },
      {
        label: '排列設定整理',
        text: '載入既有設定時補齊缺少的卡片並限制欄寬，避免版本更新後出現無效版面。'
      },
      {
        label: '狀態儲存',
        text: '排列設定依商家儲存；重新載入後仍能還原各自的排列與尺寸。'
      },
      {
        label: '響應式處理',
        text: '桌機使用 12 欄網格，較窄畫面改為雙欄與單欄，避免自訂寬度破壞閱讀順序。'
      }
    ],
    projectId: 'pos-admin',
    contentStatus: 1,
    status: 'published',
    order: 20
  },
  {
    id: 'realtime-chat',
    type: 'feature',
    title: '即時客服對話與訊息管理',
    subtitle: '會員即時對話，客服多會話管理',
    teaser: '前台互動、客服端訊息管理與常見問答',
    description:
      '我負責商城會員端與客服桌面端的聊天前端，使用 Vue、Pinia 管理對話狀態，並串接 Laravel Echo / Pusher 即時事件。功能涵蓋未讀提醒、客服會話更新、訊息編輯與收回、關鍵字高亮、網址辨識，以及 FAQ 預設回覆。',
    previewType: 'realtime-chat',
    details: [
      {
        label: '即時連線與事件訂閱',
        text: '以 Vue、Pinia 管理聊天狀態，於前端應用啟動時建立共用連線，並透過 Laravel Echo / Pusher 依登入狀態訂閱會員專屬頻道，接收即時訊息事件。'
      },
      {
        label: '會員未讀提醒',
        text: '收到新訊息時更新聊天入口的未讀數；會員開啟對話後清除提醒，並在目前對話中接收後續訊息。'
      },
      {
        label: '客服會話排序與自動捲動',
        text: '新訊息更新會話的最新互動時間，並依釘選與最新互動調整列表順序；若客服正查看該會話，訊息區自動捲至最新內容。'
      },
      {
        label: '訊息編輯與收回',
        text: '客服可編輯或收回已送出的訊息，工作台的對話內容會呈現更新狀態。'
      },
      {
        label: '訊息搜尋、高亮與網址辨識',
        text: '依關鍵字搜尋對話訊息，先跳脫文字內容再透過 v-html 標示命中；偵測訊息中的 HTTP / HTTPS 網址並轉為可點擊連結。'
      },
      {
        label: '常見問題選取與預設答覆',
        text: '會員點選常見問題後，聊天視窗顯示對應的預設答覆，作為常見諮詢的快速入口。'
      }
    ],
    projectId: 'storefront',
    projectIds: ['storefront', 'commerce-admin'],
    featured: true,
    contentStatus: 1,
    status: 'published',
    order: 5
  },
  {
    id: 'store-permissions',
    title: '多角色權限、路由與畫面聯合控管',
    subtitle: '以 Route Meta 與 v-permission 控制頁面及操作權限',
    teaser: '登入彙整角色權限，meta 與 v-permission 共用判斷',
    description:
      '我負責 POS 後台角色權限的前端應用層：將資料讀取、新增、更新與刪除對應到獨立權限，並在登入後彙整使用者綁定的多個角色。頁面以 route meta 宣告進入條件，由 router.beforeEach 控制路由；側邊欄依相同設定篩選選單。我建立 v-permission 指令控制頁面內的操作入口。',
    previewType: 'role-permission',
    story: {
      problem: '一位使用者可能同時具備多個角色，而每種資料的讀取、新增、更新與刪除權限又各自不同；路由、側邊欄與頁面操作都需要依同一套授權結果呈現。',
      technology: '以 Pinia 儲存使用者角色與合併後的權限清單，透過共用 hasPermission 判斷單項或多項條件；router.beforeEach 保護路由，SidebarData 依 route meta 篩選選單，自訂 v-permission 指令則監聽權限狀態並更新操作入口。',
      result: '同一套權限資料涵蓋頁面進入、側邊導覽與元件操作；不同角色組合可共用頁面結構，只呈現帳號獲授權的功能。'
    },
    before: {
      title: '多角色與多種操作權限交錯',
      description: '頁面、側欄與操作入口都要依授權呈現，且需維持一致的權限判斷。',
      steps: ['資料讀取與 CRUD 分開授權', '頁面及操作各自檢查']
    },
    after: {
      title: '一組權限規則涵蓋路由與操作',
      description: '登入後彙整角色權限，route meta 與 v-permission 分別控制路由、側欄和頁面操作。',
      steps: ['角色勾選資料與 CRUD 權限', '登入彙整使用者的角色權限', '路由、導覽與操作套用檢查']
    },
    details: [
      {
        label: '角色設定與 CRUD 權限',
        text: '可為角色設定多項資料權限，並將讀取、新增、更新與刪除拆成獨立代碼；角色設定介面提供權限清單供搜尋與勾選，permissions.json 對應權限代碼及繁中說明。'
      },
      {
        label: '多角色權限彙整',
        text: '使用者可綁定多個角色；登入資料中的角色權限由 Pinia 整合成同一份權限清單，供全站共用檢查。'
      },
      {
        label: 'Route Meta 與路由守衛',
        text: '各頁在 route meta 宣告必要權限；router.beforeEach 依權限檢查進入資格，側邊欄資料則讀取同一份 meta 篩選可見選單。多項必要權限需全部符合。'
      },
      {
        label: '自訂 v-permission 指令',
        text: '我建立類似條件式顯示的 v-permission 指令，在元件層檢查所需權限，控制按鈕及操作入口的顯示，並監聽權限變動後更新畫面。'
      }
    ],
    projectId: 'pos-admin',
    featured: true,
    contentStatus: 1,
    status: 'published',
    order: 30
  },
  {
    id: 'product-review-diff',
    type: 'issue',
    title: '商品改版差異可視化',
    subtitle: '集中比較前後版本，讓審核決策更明確',
    teaser: '標示商品異動並串接審核操作',
    description:
      '商城商品重新送審時，審核人員需要確認名稱與多組規格究竟修改了什麼。我負責商品審核詳情與版本比較，將前次上架資料和本次內容並列，標示新增、移除與變更項目，再依商品及店家狀態提供通過、退回或下架操作。',
    previewType: 'product-review-diff',
    story: {
      problem: '商品重新送審後，名稱與多組規格可能同時異動；若只查看最新資料，審核人員需要自行回想或逐欄比對前次上架內容。',
      role: '我負責商城後台的商品審核詳情、版本差異呈現，以及通過、退回與下架的前端操作流程。',
      action: '整理前次上架紀錄與本次送審資料，先排除不影響審核的欄位，再依規格識別資料判斷新增、移除或內容變更，並以一致的顏色與符號呈現差異。',
      technology: '使用 Lodash 比對商品結構，並透過 DOMPurify 清理產生的差異標記；審核按鈕再依商品與店家狀態決定是否顯示。',
      result: '審核人員能在同一個商品詳情中確認前後版本及異動位置，再直接完成通過或填寫原因退回，無須自行往返查找舊資料。'
    },
    before: {
      title: '只看最新內容，逐欄尋找異動',
      description: '名稱與規格同時修改時，審核人員需另查前次資料，才能確認異動內容。',
      steps: ['開啟本次送審資料', '另外查找前次上架內容', '逐欄確認名稱與規格差異']
    },
    after: {
      title: '自動整理差異，再接續審核決策',
      description: '系統標示移除、新增與變更，確認後可直接通過或填寫原因退回。',
      steps: ['讀取前次與本次版本', '標示名稱及規格異動', '依狀態完成審核操作']
    },
    details: [
      {
        label: '版本資料正規化',
        text: '比較前先排除刪除時間、商品 ID 與庫存等不屬於本次審核重點的欄位，避免無關資料造成差異誤判。'
      },
      {
        label: '名稱與規格差異運算',
        text: '名稱直接比較前後內容；規格則依識別資料配對，分別整理被移除、新增及欄位內容已變更的項目。'
      },
      {
        label: '安全呈現差異標記',
        text: '以紅色減號與綠色加號建立清楚的前後版本層級，產生的 HTML 差異內容透過 DOMPurify 清理後再呈現。'
      },
      {
        label: '狀態驅動審核操作',
        text: '只有送審或重新送審中的商品可進行審核，通過操作也會檢查店家狀態；退回與下架則要求填寫原因。'
      }
    ],
    projectId: 'commerce-admin',
    contentStatus: 1,
    status: 'published',
    order: 12
  },
  {
    id: 'two-factor-auth',
    title: '雙步驟驗證保護後台登入',
    subtitle: '依帳號條件組合 Email 與 Google 驗證',
    teaser: '登入後的必要安全檢查',
    description:
      '我負責後台登入與雙步驟驗證畫面的前端流程，依登入結果決定是否要求 Email、Google Authenticator 或兩者驗證。畫面會帶入並鎖定帳號信箱、處理寄送倒數與六位數驗證碼輸入，並在必要條件完成前阻止提交，讓不同帳號都能沿著明確步驟完成登入。',
    story: {
      problem: '帳號密碼通過後，部分帳號仍需要 Email 或 Google Authenticator 驗證，流程必須清楚處理不同組合。',
      role: '我負責後台登入頁與 2FA 驗證畫面的前端流程、狀態判斷及錯誤回饋。',
      action: '依登入 API 回傳條件開啟對應驗證，Email 欄位可自動帶入並鎖定，驗證碼完整後才允許提交。',
      technology: '依登入 API 回傳的驗證條件，分別呈現 Email 與 Google Authenticator 欄位；帳號需要雙重驗證時，兩項條件會一併顯示並納入提交檢查。',
      result: '同一個登入入口可處理單一或複合驗證，使用者也能理解目前缺少哪一項條件。'
    },
    before: {
      title: '登入條件分散且不固定',
      description: '不同帳號需要的驗證方式不同，不能只依賴一種固定表單。',
      steps: ['提交帳號密碼', '判斷驗證條件', '分別完成驗證']
    },
    after: {
      title: '讓登入結果決定驗證畫面',
      description: '依需求顯示 Email、Google 驗證或兩者，條件完成後才建立登入狀態。',
      steps: ['取得驗證需求', '引導完成代碼', '通過後登入']
    },
    images: [
      {
        src: 'images/cases/two-factor-auth.svg',
        label: '後台登入與雙步驟驗證',
        alt: '後台登入頁上顯示安全驗證彈窗，包含遮蔽信箱、Email 驗證碼與 Google Authenticator 六位數欄位',
        caption: '依帳號需求顯示 Email 與 Google 驗證欄位，必要時同時完成兩項驗證。'
      }
    ],
    details: [
      { label: '條件式畫面', text: '以 needEmailAuth 與 needGoogleAuth 控制區塊，支援單一或複合驗證。' },
      { label: 'Email 流程', text: '處理信箱格式、自動帶入、寄送中狀態與 60 秒重送倒數。' },
      { label: '提交防護', text: '必要的六位數代碼未完成前停用提交，避免送出不完整驗證資料。' },
      { label: '公開版', text: '此頁使用虛構信箱與本機狀態重製，不會寄信或連接公司驗證服務。' }
    ],
    projectId: 'commerce-admin',
    contentStatus: 1,
    status: 'published',
    order: 15
  },
  {
    id: 'upload-image-component',
    title: 'UploadImage 圖片上傳元件',
    subtitle: '貼上、裁切、排序與唯讀預覽，打造可擴充的圖片管理流程',
    teaser: '完整媒體上傳互動規範',
    description:
      '我主導 UploadImage 的元件設計、改版與跨頁導入，將圖片貼上、格式驗證、裁切、封面提示、多圖排序及唯讀預覽整理成一致介面。元件以 Props 與 v-model 設定行為，並提供清除、取得列表與完成檢查方法；同一套互動指引也延伸至大型影片分段上傳。',
    kind: 'team-component',
    component: {
      name: 'UploadImage',
      group: 'Media / Form',
      summary: '圖片選取、驗證、裁切、排序與預覽',
      preview: 'upload',
      props: [
        { name: 'modelValue', type: 'String | Array', description: '單張回傳 ID，多張回傳 ID 陣列。' },
        { name: 'maxSize', type: 'Number', description: '設定單張圖片的大小上限。' },
        { name: 'limit', type: 'Number', description: '限制可選圖片數量。' },
        { name: 'multiple', type: 'Boolean', description: '切換單張或多張選取。' },
        { name: 'crop', type: 'Boolean | String', description: '啟用自由裁切或指定裁切比例。' },
        { name: 'required', type: 'Boolean', description: '標示此圖片欄位為必填。' },
        { name: 'sortable', type: 'Boolean', description: '允許拖曳調整圖片順序。' },
        { name: 'readonly', type: 'Boolean', description: '切換為唯讀圖片預覽。' },
        { name: 'coverPlaceholder', type: 'String', description: '設定第一張圖片的封面提示內容。' }
      ],
      slots: [],
      events: ['update:modelValue', 'update:detail', 'clearUploadList()', 'getUploadList()', 'isFinish()'],
      extensionNote: '對外暴露清除、取得列表與完成檢查，讓表單送出前能確認必要圖片已上傳。'
    },
    story: {
      problem: '商品、品牌、聊天與內容表單都需要圖片，但單張、多張、裁切、排序與唯讀狀態若各自實作，很容易不一致。',
      role: '我主導 UploadImage 的元件設計、改版與跨頁導入，並延伸同一套互動規則到影片上傳。',
      action: '將圖片驗證、貼上、裁切、排序、封面提示與唯讀預覽收斂成 Props 與公開方法。',
      technology: '使用 Vue v-model 統一單張與多張輸出，以 Cropper、拖曳排序及 Expose API 支援不同表單流程。',
      result: '頁面能用一致介面處理媒體，不必各自維護上傳中、預覽、移除與完成檢查。'
    },
    before: {
      title: '每個頁面各自處理圖片',
      description: '上傳、裁切、排序與預覽規則分散，表單也難判斷圖片是否完成。',
      steps: ['頁面自行驗證', '各自處理預覽', '送出時另外確認']
    },
    after: {
      title: '以共用介面涵蓋多種情境',
      description: '透過 Props 切換行為，並提供公開方法銜接表單驗證。',
      steps: ['設定限制與裁切', '統一預覽及排序', '檢查完成後送出']
    },
    walkthrough: [],
    details: [
      { label: '貼上圖片', text: '支援從剪貼簿直接建立圖片檔，通過格式與大小驗證後進入上傳流程。' },
      { label: '裁切與封面', text: '可指定裁切比例，並讓第一張圖片顯示封面提示。' },
      { label: '排序與唯讀', text: '多張圖片可拖曳排序，同一元件也能切換為預覽模式。' },
      { label: '影片延伸', text: 'UploadVideo 沿用相同 UI 規則，將大型 MP4 切成 10 MB 片段依序上傳，並合併顯示整體進度。' },
      { label: 'UI／UX 指引', text: '選取、驗證、上傳中、成功、預覽、移除與唯讀皆有明確狀態，頁面不自行改寫互動。' }
    ],
    projectId: 'commerce-admin',
    featured: true,
    contentStatus: 1,
    status: 'published',
    order: 17
  },
  {
    id: 'dynamic-table-component',
    title: 'DynamicTable 動態表格',
    subtitle: '設定驅動、Slot 擴充與網址狀態還原',
    teaser: '列表共通行為與擴充介面',
    description:
      '我主導 DynamicTable 的介面設計與資料流程改版，透過設定整合搜尋、分頁、選取、匯出、展開列與操作欄，再以動態 Slot 保留各頁特殊內容。查詢條件與頁碼可同步至網址，返回或重新載入時仍能還原操作狀態；元件也提供重新整理、清除條件與選取控制方法，讓後台列表共用一致的實作方式。',
    kind: 'team-component',
    component: {
      name: 'DynamicTable',
      group: 'Data Display',
      summary: '搜尋、分頁、選取、匯出與 URL 狀態',
      preview: 'table',
      props: [
        { name: 'data', type: 'Array', description: '提供目前頁面的列表資料。' },
        { name: 'table', type: 'Array', description: '設定欄位、呈現方式與欄位 Slot。' },
        { name: 'search', type: 'Array', description: '設定共用搜尋欄位與查詢條件。' },
        { name: 'page', type: 'Number | null', description: '設定總筆數；設為 null 可隱藏分頁。' },
        { name: 'urlDriven', type: 'Boolean', description: '將查詢與分頁狀態同步到網址。' },
        { name: 'selection', type: 'Boolean', description: '開啟表格多選功能。' },
        { name: 'reserveSelection', type: 'Boolean', description: '跨頁保留已選資料。' },
        { name: 'expandable', type: 'Boolean', description: '開啟可展開的資料列。' },
        { name: 'export', type: 'String', description: '設定共用匯出功能使用的資料來源。' },
        { name: 'rowKey', type: 'String', description: '指定資料列識別欄位，支援選取狀態保留。' },
        { name: 'loading', type: 'Boolean', description: '顯示資料載入狀態。' },
        { name: 'detailMethod / editMethod / delMethod', type: 'Function', description: '設定列操作欄的詳情、編輯與刪除事件。' }
      ],
      slots: ['header', '欄位設定中的 slot', 'expand', 'tableExtensions', 'footer'],
      events: ['getData', 'selection-change', 'select', 'select-all', 'current-change', 'clearMethod()', 'refresh()', 'clearSelectionMethod()', 'toggleRowSelectionMethod()', 'getSelectionRowsMethod()'],
      extensionNote: '共通資料流程留在元件內，頁面透過設定描述列表，只有特殊欄位與額外操作交由 Slot 擴充。'
    },
    story: {
      problem: '後台列表重複處理搜尋、分頁、選取與匯出，但商品、庫存和單據又各有特殊欄位。',
      role: '我主導 DynamicTable 的 API、資料流程、改版與團隊導入。',
      action: '以搜尋與欄位設定承接共通需求，統一資料取得、重設與分頁流程，再開放 Header、Footer、展開列及動態欄位 Slot，避免為單一頁面硬編碼。',
      technology: '以 Vue Props、動態 Slot 與 Events 建立擴充介面；將搜尋條件與頁碼同步至 Router Query，並透過頁面生命週期與 Query 監聽還原狀態，再以 defineExpose 提供外部控制方法。',
      result: '後台頁面只需提供欄位設定、資料與特殊 Slot，即可共用一致的列表流程；返回頁面、重新載入或分享網址時，也能保留原本的查詢情境。'
    },
    before: {
      title: '列表流程重複，特殊需求又分散',
      description: '每頁自行串接搜尋與分頁，改版時難以確認所有列表是否一致。',
      steps: ['各頁建立欄位', '重複維護查詢狀態', '另外處理選取與匯出']
    },
    after: {
      title: '共通流程設定化，差異交給 Slot',
      description: '元件管理搜尋、分頁與選取狀態，頁面用設定與 Slot 描述真正不同的內容。',
      steps: ['設定搜尋與欄位', 'Slot 擴充特殊內容', '網址還原操作狀態']
    },
    walkthrough: [],
    details: [
      { label: '設定驅動的列表結構', text: '以 search 與 table 設定描述搜尋欄位、資料欄位和呈現方式，頁面不必重複建立相同的列表骨架。' },
      { label: '動態 Slot 與操作事件', text: '依欄位設定產生具名 Slot，並保留 Header、Footer、展開列與額外操作區；詳情、編輯及刪除則透過函式交由頁面處理。' },
      { label: 'URL Driven 狀態還原', text: '搜尋條件與頁碼可同步至 Router Query；初次載入、返回快取頁面或網址條件改變時，會還原同一組查詢情境。網址帶入 autoOpen 時，也能直接開啟指定資料詳情。' },
      { label: '選取與公開控制方法', text: '支援多選、跨頁保留與目前列事件，並透過 defineExpose 提供重新整理、清除條件、清除選取、指定選取及取得已選資料等方法。' }
    ],
    projectId: 'pos-admin',
    featured: true,
    contentStatus: 1,
    status: 'published',
    order: 35
  },
  {
    id: 'dynamic-form-component',
    title: 'DynamicForm 動態表單',
    subtitle: '欄位設定、驗證與 Slot，統一後台表單流程',
    teaser: '一致表單結構與特殊欄位彈性',
    description:
      '我主導 DynamicForm 的欄位模型、驗證介面與後續改版，以 fields 設定統一文字、選擇、日期、開關等輸入型別，並承接預設值、唯讀、送出與確認流程。一般欄位由設定產生，特殊互動透過欄位、Label、Bottom 與 Submit After Slot 擴充；目前已應用於商品、庫存、商家、員工、訂單與系統設定等後台流程。',
    kind: 'team-component',
    component: {
      name: 'DynamicForm',
      group: 'Form',
      summary: '欄位 Schema、驗證、唯讀與送出流程',
      preview: 'form',
      props: [
        { name: 'fields', type: 'Array', description: '描述輸入型別、欄位順序、寬度、預設值與個別狀態。' },
        { name: 'data', type: 'Object', description: '以受控資料物件承接表單值與預設值。' },
        { name: 'rules', type: 'Object', description: '加入頁面層驗證，並與欄位必填規則合併。' },
        { name: 'submitHide', type: 'Boolean', description: '依使用情境隱藏元件內建送出按鈕。' },
        { name: 'loading', type: 'Boolean', description: '顯示處理中狀態。' },
        { name: 'submitDisabled', type: 'Boolean', description: '依表單狀態控制送出按鈕。' },
        { name: 'submitAlert', type: 'String', description: '顯示送出前的提醒訊息。' },
        { name: 'submitText', type: 'String', description: '自訂送出按鈕文字。' },
        { name: 'readonly', type: 'Boolean', description: '用同一份設定呈現唯讀內容。' }
      ],
      slots: ['欄位名稱', 'labelSlot', 'bottom', 'submitAfter'],
      events: ['update:data', 'submitFn', 'resetFormMethod()', 'validateFormMethod()', 'validateFieldMethod()'],
      extensionNote: '一般欄位由 Schema 產生，特殊互動透過明確 Slot 插入；頁面也能呼叫重設、整份驗證或單欄驗證，不必複製表單核心。'
    },
    story: {
      problem: '新增與編輯頁面有大量重複欄位、驗證和送出狀態，但少數業務欄位仍需要客製互動。',
      role: '我主導 DynamicForm 的欄位模型、驗證方式、插槽邊界與後續改版。',
      action: '將文字、選擇、日期、開關等輸入型別與 Grid 寬度改為設定資料，並以欄位、Label、Bottom 與 Submit After Slot 保留擴充點。',
      technology: '以 Vue 受控資料、欄位 Schema、Rules、validateKey 與動態 Slot 統一預設值、唯讀、驗證、確認及送出流程。',
      result: '同一元件已承接商品、庫存、商家、員工、訂單與系統設定等後台表單；頁面專注描述欄位和業務差異，共通狀態維持一致。'
    },
    before: {
      title: '相似表單各自維護',
      description: '欄位、驗證與送出狀態散落在頁面，特殊需求常導致整份表單複製。',
      steps: ['重複建立欄位', '各頁維護驗證', '另外處理載入與提交']
    },
    after: {
      title: 'Schema 處理共通，Slot 保留業務彈性',
      description: '一般欄位、驗證與送出流程設定化，特殊內容只在對應位置插入。',
      steps: ['設定欄位與版面', '統一驗證與送出', 'Slot 擴充特殊流程']
    },
    walkthrough: [],
    details: [
      { label: '多型別與 Grid 欄位設定', text: 'fields 支援文字、密碼、數字、文字區塊、單選／多選、Tree Select、Radio、Switch 與日期時間等型別，並以 col 控制欄位寬度；單位、幣別、提示與預設值也由同一份設定描述。' },
      { label: '必填規則與 validateKey', text: '元件會合併頁面 Rules 與欄位 required 設定，自動產生對應訊息；客製 Slot 也可透過 validateKey 指向實際需要驗證的資料欄位。' },
      { label: '受控資料與預設值', text: '表單透過 update:data 回傳資料，掛載時依欄位 default 初始化缺少的值，讓新增、編輯與唯讀流程沿用同一份欄位模型。' },
      { label: '明確的 Slot 邊界', text: '欄位內容、Label、Bottom 與 Submit After 各自保留插槽，特殊業務操作可放在正確位置，不必修改共用表單核心。' },
      { label: '送出與公開控制方法', text: '統一處理 Loading、Disabled、Readonly、Submit Alert 與送出事件，並公開重設、整份驗證及單欄驗證方法，讓外層頁面可依流程控制。' }
    ],
    projectId: 'pos-admin',
    contentStatus: 1,
    status: 'published',
    order: 36
  },
  {
    id: 'localization-sync',
    title: 'Google Sheet 同步多語系',
    subtitle: '讓 PM 與翻譯人員在熟悉的地方協作多語系',
    teaser: '翻譯維護與程式資源分離',
    description:
      '我完成商城前後台的 Google Sheet 多語系同步流程，讓 PM 與專業翻譯人員在熟悉的表格中編寫、透過版本紀錄追蹤修改，並用內建自動翻譯建立初稿；同步腳本再將各語系轉為前後台使用的 JSON。',
    previewType: 'localization-sync',
    story: {
      problem: '多語系內容若分散在多份 JSON，PM 與翻譯人員不易直接參與編寫，開發者也需逐檔同步更新，讓版本追蹤與語系一致性都變得不易。',
      role: '我完成 Google Sheet 語系同步模式，整理欄位格式與 JSON 產生流程，並導入商城前後台。',
      action: '以 Google Sheet 作為翻譯協作來源，利用固定 key 與語系欄位集中編寫，再同步轉換為商城前後台可載入的 JSON。',
      technology: '以 spreadsheet-to-json 讀取試算表，搭配 flat / unflatten 整理鍵值結構；並運用 Google Sheet 內建版本紀錄與自動翻譯輔助協作。',
      result: 'PM 與專業翻譯人員可在熟悉的 Google Sheet 編寫及追蹤修改，內建自動翻譯也能先產出各語系初稿，再由人員校對；前後台沿用同步產生的語系 JSON。'
    },
    before: {
      title: '翻譯散落在多份 JSON',
      description: '語系內容由開發端逐檔維護，PM 與翻譯人員不易在熟悉的工具中協作，也缺少集中檢視各次修改的方式。',
      steps: ['尋找對應 JSON', '逐檔修改文字', '人工比對缺漏']
    },
    after: {
      title: '以 Google Sheet 協作並同步語系資源',
      description: 'PM 與翻譯人員在表格編寫、查看版本紀錄，並以內建自動翻譯建立初步譯文；同步流程再產生前後台使用的 JSON。',
      steps: ['編寫與追蹤表格版本', '建立並校對初步翻譯', '同步產生前後台 JSON']
    },
    walkthrough: [],
    details: [
      { label: 'Google Sheet 翻譯協作', text: '以穩定 key 對應各語系欄位，讓 PM 與專業翻譯人員直接在熟悉的試算表中編寫及更新內容。' },
      { label: '版本紀錄與修改追蹤', text: '運用 Google Sheet 內建版本紀錄檢視翻譯表的修改歷程，方便協作者確認內容變更。' },
      { label: '自動翻譯初稿', text: '使用 Google Sheet 內建自動翻譯協助建立各語系初步譯文，作為後續人工校對與調整的起點。' },
      { label: 'JSON 同步轉換', text: '透過 spreadsheet-to-json 讀取表格資料，依語系拆分並以 flat / unflatten 整理巢狀結構，產生可載入的語系 JSON。' }
    ],
    projectId: 'storefront',
    featured: true,
    contentStatus: 1,
    status: 'published',
    order: 60
  }
]
