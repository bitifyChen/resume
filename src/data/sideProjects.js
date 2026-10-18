export const sideProjects = [
  {
    id: 'guidebook',
    slug: 'guidebook',
    title: 'Guidebook',
    summary:
      '為多人旅行打造的 PWA，把共同行程、費用分攤、行李清單與即時位置整合在同一個手機工作區。',
    role: '產品規劃、UI／UX、前後端與部署獨立完成',
    roleEmphasis: true,
    description:
      'Guidebook 是我從實際旅行需求出發打造的多人協作工具。成員可依日期查看行程、掌握目前與下一站、記錄共同支出與結算、確認行李進度，並在地圖查看成員位置與歷史軌跡；管理端則集中維護旅程、成員、行程、通知與定位紀錄。從產品規劃、介面設計、前端狀態管理，到 Firebase、定位後端與部署流程皆由我獨立完成，並持續依真實使用情境迭代。',
    architecture:
      '以 Vue 3、Pinia 與 Vue Router 建立旅客端及管理端；Firebase Auth、Firestore、Realtime Database 與 FCM 負責身分、共享資料、即時同步及推播，定位服務另由 Render 後端串接 Traccar，並以 Leaflet 呈現即時位置與歷史軌跡。',
    featured: true,
    liveUrl: 'https://guidebook.chenchenworkshop.com',
    repositoryUrl: 'https://github.com/bitifyChen/guidebook',
    technologies: ['Vue 3', 'Pinia', 'Firebase', 'Leaflet', 'PWA', 'Render'],
    highlights: [
      {
        id: 'adaptive-itinerary',
        title: '行程隨實際進度持續校正',
        text: '記錄實際抵達與離開時間後，==重新計算後續行程，並透過共享資料與同步訊號更新同行成員的安排==。',
        technologies: ['Vue 3', 'Pinia', 'Firebase'],
        featured: true
      },
      {
        id: 'location-history',
        title: '多人位置與歷史軌跡',
        text: '==以 Traccar、自建後端、Firebase Realtime Database 與 Leaflet 串起背景定位資料流==，呈現成員位置、集合點與軌跡回放；管理端亦可匯出、封存及管理保留期限。',
        technologies: ['Traccar', 'Firebase RTDB', 'Leaflet', 'Render'],
        featured: true
      },
      {
        id: 'expense-settlement',
        title: '旅行支出、分攤與結算',
        text: '記錄付款人與分攤成員，彙整總支出、分類分析及成員間的應收應付，讓多人旅費不再依賴額外試算表。',
        technologies: ['Vue 3', 'Pinia', 'Firestore']
      },
      {
        id: 'controlled-pwa-update',
        title: '可安裝、可控版本更新的 PWA',
        text: '除了安裝與離線資源，也加入==版本清單、選擇性與強制更新提示，以及 Service Worker 啟用與重新載入流程==，降低使用者停留在舊版的風險。',
        technologies: ['Vite PWA', 'Service Worker'],
        featured: true
      },
      {
        id: 'route-planning',
        title: '行程匯入與路線規劃',
        text: '支援地點資料與 Google Maps 路線連結整理，並以地圖、時間軸與 JSON 輔助工具加速多日行程建立及調整。',
        technologies: ['Leaflet', 'Google Maps', 'JSON']
      },
      {
        id: 'multi-trip-admin',
        title: '多旅程管理工作區',
        text: '後台統一管理旅程、成員、行程、行李、通知與定位紀錄，並==將抽屜、表格與工作區流程拆成可複用的管理端元件==。',
        technologies: ['Vue Router', 'Element Plus']
      }
    ],
    icon: 'images/side-projects/guidebook/app-icon.png',
    image: 'images/side-projects/guidebook/overview-mobile.png',
    imageAlt: 'Guidebook 手機版旅程概覽，整合旅程片刻、天氣與快捷資訊',
    gallery: [
      {
        src: 'images/side-projects/guidebook/overview-mobile.png',
        alt: 'Guidebook 手機版旅程概覽，整合旅程片刻、天氣與快捷資訊'
      },
      {
        src: 'images/side-projects/guidebook/itinerary-mobile.png',
        alt: 'Guidebook 手機版行程時間軸，依日期呈現地點、時段與交通資訊'
      },
      {
        src: 'images/side-projects/guidebook/converter-mobile.png',
        alt: 'Guidebook 手機版匯率換算工具，以旅途中可單手操作的數字鍵盤快速換算'
      }
    ],
    contentStatus: 1,
    status: 'published',
    order: 10
  },
  {
    id: 'dividend-helper',
    slug: 'dividend-helper',
    title: '股利計算幫手',
    summary:
      '為手機日常查詢設計的 PWA，整合年度股利、持股與交易紀錄，讓配息查詢和持股維護集中在同一個入口。',
    role: '產品規劃、UI／UX、Vue 前端、Firebase 資料模型與 Flask API',
    description:
      '股利計算幫手最初以手機日常使用情境規劃。首頁集中呈現當年度股利摘要與配息清單，使用者可透過底部導覽切換持股頁，滑動持股卡片查看詳情、修改、售出或刪除，新增與賣出則在全頁表單完成。後續再加入股利試算與券商對帳單匯入，將日常查詢、交易維護和資料整理放在同一套工具。',
    architecture:
      '前台以 Vue 3、Vue Router、Pinia 與 Vant 建立手機操作介面，透過 Vite PWA 提供可安裝的 Web App；Firebase Auth 與 Firestore 保存帳號及個人投資資料。Python Flask API 整合證交所、櫃買中心股利資料，並以 FinMind 補充歷史紀錄。券商 PDF 與對帳單截圖由 PDF.js、Tesseract.js 在瀏覽器端解析，再進入交易去重與持股對帳流程。',
    featured: true,
    technologies: [
      'Vue 3',
      'Pinia',
      'Firebase',
      'Python',
      'Flask',
      'Vant',
      'Chart.js',
      'PDF.js',
      'Tesseract.js',
      'PWA'
    ],
    highlights: [
      {
        id: 'mobile-pwa',
        title: '以手機操作為核心的 PWA',
        text: '首頁先呈現當年度股利摘要與配息清單，底部導覽串起主要頁面；==持股卡片支援滑動操作，新增與賣出使用全頁表單==，並可將 PWA 安裝到手機桌面。',
        technologies: ['Vue 3', 'Vant', 'PWA'],
        featured: true
      },
      {
        id: 'dividend-benefits',
        title: '依持股期間試算股利與股票權益',
        text: '==依每筆買賣日期與除權息日判斷可參與股數==，分別計算現金收入、預估股票股數與股票權益參考市值，再彙整成個股及年度摘要。',
        technologies: ['Vue 3', 'Pinia', 'Chart.js'],
        featured: true
      },
      {
        id: 'statement-import',
        title: '券商對帳單匯入與本機 OCR',
        text: '支援集保 PDF 與券商對帳單截圖；==透過 PDF.js、Tesseract.js 在瀏覽器端解析，轉成可預覽、修正後再匯入的交易資料==。',
        technologies: ['PDF.js', 'Tesseract.js'],
        featured: true
      },
      {
        id: 'transaction-reconciliation',
        title: '交易去重與持股對帳',
        text: '==以來源指紋與交易特徵辨識重複檔案及重疊紀錄==，依券商帳戶比對實際股數；可補正的正向差額建立調整紀錄，其餘保留人工確認。',
        technologies: ['Pinia', 'Firestore']
      },
      {
        id: 'dividend-data-pipeline',
        title: '官方資料優先的股利更新流程',
        text: 'Flask API 整合證交所與櫃買中心股利資料，以 FinMind 補齊歷史紀錄；==正規化不同來源後合併股利事件，避免同一筆資料重複寫入==。',
        technologies: ['Python', 'Flask']
      }
    ],
    image: 'images/side-projects/dividend-helper/dividend-summary-mobile.png',
    imageAlt: '股利計算幫助手機版首頁，以去識別示範資料呈現年度股利摘要與配息清單',
    gallery: [
      {
        src: 'images/side-projects/dividend-helper/dividend-summary-mobile.png',
        alt: '手機版已領取股利總覽與近期配息清單'
      },
      {
        src: 'images/side-projects/dividend-helper/dividend-yearly-summary-mobile.png',
        alt: '個股年度股利合計與年度分布圖表'
      },
      {
        src: 'images/side-projects/dividend-helper/dividend-holdings-mobile.png',
        alt: '手機版持股明細、已領股利與預期收益資訊'
      }
    ],
    contentStatus: 1,
    status: 'published',
    order: 20
  },
  {
    id: 'active-etf-daily',
    slug: 'active-etf-daily',
    title: '主動式 ETF 每日追蹤與日報',
    summary:
      '彙整多家投信每日公布的 ETF 持股，辨識首買、加碼、減碼與出清，並從 ETF、個股、產業及產業鏈追蹤異動方向。',
    role: '產品規劃、Vue 儀表板、Python 資料管線、每日批次與 Telegram 日報',
    description:
      '系統每日取得多家投信公布的 ETF 持股快照，正規化不同來源後與前一交易日比較，辨識首買、加碼、首賣、減碼與出清。使用者可從 ETF、個股、產業與產業鏈查看異動股數、參與 ETF 家數及估算買賣金額，也能追蹤首次建倉後的目前部位與加碼速度。整理結果會產生文字摘要與 PNG 日報，透過 Telegram 發送。',
    architecture:
      'Vue 3 儀表板透過 Flask API 讀取 Supabase 的 ETF 快照與事件資料，並以 Turso OHLC 補上參考價格、估算交易金額及成交額占比。Python 後端負責多來源抓取、日期校正、資料正規化與事件比對；每日批次完成後彙整 ETF、個股、產業及產業鏈方向，產生 JSON、HTML 與 PNG 日報並交由 Telegram 發送。',
    featured: true,
    technologies: ['Vue 3', 'Supabase', 'Python', 'Flask', 'Turso', 'Telegram'],
    highlights: [
      {
        id: 'multi-source-event-pipeline',
        title: '多來源持股快照轉為每日異動事件',
        text: '整合多家投信不同格式的持股資料，==校正來源日期並正規化成共用快照，再與前一交易日比較==，辨識首買、加碼、首賣、減碼與出清。',
        technologies: ['Python', 'Flask', 'Supabase'],
        featured: true
      },
      {
        id: 'multi-angle-market-flow',
        title: '四種視角追蹤 ETF 異動方向',
        text: '同一批事件可依 ETF、個股、產業與產業鏈彙整，並以異動股數、參與 ETF 家數及估算買賣金額排序，==快速找到共同加減碼與集中方向==。',
        technologies: ['Vue 3', '資料彙整'],
        featured: true
      },
      {
        id: 'first-buy-follow-up',
        title: '追蹤首次建倉後的部位變化',
        text: '將首次買入事件與目前持股對照，==計算建倉後的持有天數與每日加碼速度==，區分持續加碼、減碼持有或已出清。',
        technologies: ['Vue 3', 'Python']
      },
      {
        id: 'ohlc-enrichment',
        title: '以行情資料補足異動金額',
        text: '將 ETF 持股異動與當日 OHLC 對齊，補上參考價格、估算交易額及成交額占比，並保留補值狀態與覆蓋率供介面及日報判讀。',
        technologies: ['Python', 'Turso']
      },
      {
        id: 'etf-daily-report',
        title: '自動產生並發送每日異動日報',
        text: '每日批次完成後整合市場摘要、事件分類、產業、產業鏈與個股方向，==輸出 JSON、HTML 與 PNG，並透過 Telegram 發送文字摘要及圖片日報==。',
        technologies: ['Python', 'Flask', 'Telegram']
      }
    ],
    image: 'images/side-projects/active-etf-daily/daily-report-20261006.jpg',
    imageAlt: 'ETF 今日資金方向日報，彙整估買賣金額、事件雷達、產業方向與個股動態',
    imageFit: 'cover-top',
    gallery: [
      {
        src: 'images/side-projects/active-etf-daily/daily-flow-overview.png',
        alt: '主動式 ETF 每日追蹤桌面儀表板，彙整更新狀態與當日持股異動'
      },
      {
        src: 'images/side-projects/active-etf-daily/first-buy-tracking.png',
        alt: '主動式 ETF 首次建倉追蹤，對照建倉股數、目前持有量、加碼速度與狀態'
      },
      {
        src: 'images/side-projects/active-etf-daily/daily-report-20261006.jpg',
        alt: 'ETF 今日資金方向日報，彙整估買賣金額、事件雷達、產業方向與個股動態'
      }
    ],
    contentStatus: 1,
    status: 'published',
    order: 30
  },
  {
    id: 'quantweave',
    slug: 'quantweave',
    title: '策流 QuantWeave',
    summary:
      '以本機資料為核心的台股研究桌面工具，整合行情與籌碼、n8n 式視覺選股、point-in-time 回測、AI 研究助理及可驗證的資料更新。',
    role: '產品規劃、Electron 桌面架構、Vue 介面、Python 研究引擎與資料發布流程',
    description:
      '策流 QuantWeave 將台股研究流程整合在 Windows 桌面應用中。使用者可搜尋上市櫃股票與 ETF、查看 K 線、技術指標及籌碼資料、探索產業鏈，並以節點編排選股策略。策略可接續指定日期快照、回測、walk-forward 與結果比較；AI 研究助理則透過受控工具查詢本機資料、建立研究草稿及執行回測，正式策略仍須由使用者確認。',
    architecture:
      'Electron 負責桌面視窗、系統通知與程式更新，Vue 3 呈現操作介面，Python Worker 處理資料同步、技術指標、策略、回測與研究工具。行情、基本面、籌碼、研究及工作狀態分開保存在本機 SQLite；市場資料與程式更新由 Cloudflare R2 提供，完成版本、來源與檔案完整性檢查後才套用。',
    featured: true,
    technologies: [
      'Electron',
      'Vue 3',
      'Vue Flow',
      'Python',
      'SQLite',
      'Ollama',
      'MCP',
      'Cloudflare R2'
    ],
    highlights: [
      {
        id: 'visual-strategy-builder',
        title: 'n8n 式視覺選股策略',
        text: '參考 n8n 的節點編排方式，以 Vue Flow 將技術面、估值、財務、月營收、籌碼及產業鏈條件組成 typed-port DAG；==執行前檢查節點輸入、重複連線與循環依賴==，輸出操作先預覽再由使用者確認。',
        technologies: ['Vue 3', 'Vue Flow', 'Python', 'SQLite'],
        featured: true
      },
      {
        id: 'point-in-time-backtest',
        title: '避免未來資料滲入的回測流程',
        text: '以公告日、歷史上市期間、公司行動與資料版本還原指定時間點，==只使用當時可取得的財務與市場資料==；支援交易成本、基準比較、walk-forward 及多組結果比較。',
        technologies: ['Python', 'SQLite'],
        featured: true
      },
      {
        id: 'desktop-process-boundary',
        title: '桌面介面與資料處理分工',
        text: 'Vue 3 專注畫面與操作，Electron 管理桌面視窗、通知與更新，Python Worker 負責資料同步、策略及回測；耗時工作與介面分開執行，也避免前端直接操作資料庫。',
        technologies: ['Vue 3', 'Electron', 'Python Worker', 'SQLite']
      },
      {
        id: 'controlled-ai-research',
        title: '受控工具驅動的 AI 研究助理',
        text: '研究助理以版本化工具讀取行情、基本面、籌碼與策略訊號，==可建立隔離草稿、執行回測及比較結果，寫入操作仍須在 App 內核可==；Ollama 與本機 MCP 共用能力契約。',
        technologies: ['Ollama', 'MCP', 'Python']
      },
      {
        id: 'local-market-data',
        title: '可恢復的資料同步與定期維護',
        text: '行情、基本面與籌碼透過 Base／Delta 套件更新至本機 SQLite；==同步工作可保存進度、暫停及續跑==。GitHub Actions 定期整併資料套件、清理過期版本，並將月度 Base 備份至 Google Drive。',
        technologies: ['Python Worker', 'SQLite', 'Base／Delta', 'GitHub Actions', 'Cloudflare R2']
      },
      {
        id: 'signed-desktop-updates',
        title: '保留使用者資料的安全更新流程',
        text: 'Windows 安裝檔發布至 Cloudflare R2；桌面端下載後先確認版本、檔案來源及內容是否完整，再啟動更新，過程中保留自選股、策略與本機研究資料。',
        technologies: ['Electron', 'Cloudflare R2']
      }
    ],
    image: 'images/side-projects/quantweave/overview-clean.png',
    imageAlt: '策流 QuantWeave 台股研究總覽，整合市場廣度、成交排行、自選股與策略選股結果',
    gallery: [
      {
        src: 'images/side-projects/quantweave/overview-clean.png',
        alt: '策流 QuantWeave 台股研究總覽，整合市場廣度、成交排行、自選股與策略選股結果'
      },
      {
        src: 'images/side-projects/quantweave/strategy-workflow-clean.png',
        alt: '以視覺節點編排量價突破策略，並在左右面板設定條件與檢查策略結構'
      },
      {
        src: 'images/side-projects/quantweave/backtest-lab-clean.png',
        alt: '回測實驗室同時呈現回測條件、執行設定與歷史結果，便於比較策略表現'
      },
      {
        src: 'images/side-projects/quantweave/stock-research-clean.png',
        alt: '台積電個股研究畫面，整合基本面、技術指標、籌碼選項與公司事件圖層'
      },
      {
        src: 'images/side-projects/quantweave/industry-chain-clean.png',
        alt: '產業鏈研究畫面，整理水泥產業的上中下游節點與相關上市櫃股票'
      }
    ],
    contentStatus: 1,
    status: 'published',
    order: 40
  },
  {
    id: 'roadloop',
    slug: 'roadloop',
    title: 'RoadLoop 路譜',
    summary:
      '將臺中市道路施工 Open Data 轉成可搜尋、可驗證的互動地圖，清楚區分已開工、核准未開工與資料更新狀態。',
    role: '產品規劃、UI／UX、Vue 地圖介面、資料正規化、測試與部署獨立完成',
    roleEmphasis: true,
    description:
      'RoadLoop 從「這裡怎麼又在施工？」的生活觀察出發，目標是建立以道路為主角的施工履歷。第一階段先完成可公開驗證的臺中今日施工 MVP：將官方案件轉為地圖圖層，提供道路、行政區及許可證搜尋，並呈現施工範圍、案件狀態、核准期間與官方欄位。產品刻意區分已開工、核准未開工及資料更新狀態，避免把許可期間誤解為此刻施工，也為後續道路履歷與重複施工分析建立可信任的資料基礎。',
    architecture:
      '前端以 Vue 3、TypeScript 與 Vite 建立單頁 GIS 介面；Web Worker 在背景取得臺中市官方資料，將民國日期及 WKT Polygon／MultiPolygon 驗證、正規化為 GeoJSON。頁面優先載入去識別的安全快照，官方端點失敗時仍保留可操作內容；MapLibre GL JS 負責群聚、施工範圍與 3D 案件檢視，Turf.js 合併同案相鄰區塊，最後透過 GitHub Actions 發布至 GitHub Pages。',
    featured: false,
    liveUrl: 'https://bitifyChen.github.io/RoadLoop/',
    repositoryUrl: 'https://github.com/bitifyChen/RoadLoop',
    technologies: [
      'Vue 3',
      'TypeScript',
      'MapLibre GL JS',
      'Turf.js',
      'Web Worker',
      'Vitest',
      'Playwright',
      'GitHub Actions'
    ],
    highlights: [
      {
        id: 'official-data-normalization',
        title: '將官方資料轉成可驗證的 GIS 資料',
        text: '集中處理官方中文欄位、民國日期、UTF-8 內容與 WKT 幾何，==驗證臺灣座標範圍、Polygon／MultiPolygon、案件期間及開工狀態==；無效資料、重複紀錄與資料品質統計分開保留，介面只接觸穩定的內部型別。',
        technologies: ['TypeScript', 'GeoJSON', 'WKT'],
        featured: true
      },
      {
        id: 'snapshot-first-loading',
        title: '快照優先、背景更新的容錯流程',
        text: '進站先載入去識別的官方資料快照，讓地圖立即可用，再由 Web Worker 背景更新即時資料；==請求逾時、格式異常或官方端點失敗時仍保留可操作的既有快照==，並明確顯示資料時間及重新取得狀態。',
        technologies: ['Vue 3', 'Web Worker', 'TypeScript'],
        featured: true
      },
      {
        id: 'multi-scale-map-exploration',
        title: '從全市群聚切換到實際施工範圍',
        text: '==縮放較遠時以案件群聚控制資訊密度，靠近後切換為施工點與官方 Geometry==；搭配道路、行政區及許可證搜尋，以及已開工／核准未開工篩選，讓使用者能從全市概況快速定位單一案件。',
        technologies: ['MapLibre GL JS', 'GeoJSON', 'Vue 3'],
        featured: true
      },
      {
        id: 'case-geometry-focus',
        title: '同案幾何合併與 3D 聚焦',
        text: '同一案件包含多個施工區塊時，保留原始 Geometry 並以 Turf.js 合併選取外框；地圖依施工範圍計算視角與道路方向，進入 3D 建物斜視，關閉詳情後再回到使用者原先的全市視角。',
        technologies: ['MapLibre GL JS', 'Turf.js', 'GeoJSON']
      },
      {
        id: 'evidence-aware-presentation',
        title: '把事實、狀態與推論清楚分開',
        text: '==介面不把核准期間直接描述成現場施工，也不以道路名稱推論同一路段==；案件詳情保留官方資料來源、更新時間與判讀提示，讓地圖呈現可追溯的事實，而不是先替資料下結論。',
        technologies: ['產品設計', '資料驗證']
      },
      {
        id: 'responsive-map-quality',
        title: '跨裝置互動測試與自動部署',
        text: '==以 Vitest 驗證資料規則，並由 Playwright 覆蓋桌面、寬螢幕與手機的主要地圖流程==；推送後由 GitHub Actions 自動建置與發布。',
        technologies: ['Vitest', 'Playwright', 'GitHub Actions']
      }
    ],
    gallery: [
      {
        src: 'images/side-projects/roadloop/city-overview.png',
        alt: 'RoadLoop 臺中市道路施工總覽，以案件群聚、行政區分布與施工狀態呈現全市資料'
      },
      {
        src: 'images/side-projects/roadloop/construction-detail-3d.png',
        alt: 'RoadLoop 施工案件詳情，以三維地圖標示同一案件的多個施工區塊與官方資料'
      }
    ],
    contentStatus: 1,
    status: 'published',
    order: 50
  },
  {
    id: 'coolker-tour-explorer',
    slug: 'coolker-tour-explorer',
    title: '旅行社行程系統再造',
    summary: '從公開行程探索到營運後台，重整行程內容、多語系、詢問單與 AI 建立行程草稿的工作流程。',
    role: '產品規劃、UI／UX、Vue 前台與後台、Django API、權限及部署流程獨立完成',
    roleEmphasis: true,
    description:
      '以旅行社行程系統再造為目標，串接旅客端的行程探索與管理端營運流程。公開前台提供行程列表與詳情、日期篩選、最新消息、常見問題及詢問表單；後台集中管理行程梯次、景點、目的地、媒體、多語系內容、詢問單、使用者及角色權限。我負責規劃並完成前後台與 Django API 串接，整理資料契約、權限及部署流程；另加入 LLM 行程助手，將自然語言需求整理成可檢查、補齊並套用的結構化行程草稿。',
    architecture:
      '前端以 Vue 3、Pinia、Vue Router、Vue I18n 與 Element Plus 建立公開網站及管理後台，Axios 統一處理 JWT、Token 更新與公開／管理 API 的錯誤流程。後端以 Django REST Framework、MySQL 與 Simple JWT 提供內容、媒體、詢問單、多語系與角色權限 API；LLM 由後端代理 Gemini，限制可輸出欄位並管理加密 API Key。Dev／正式環境依分支建置，由 GitHub Actions 發布至自有伺服器。',
    featured: true,
    liveUrl: 'https://test-explorer.coolkertour.com/',
    technologies: [
      'Vue 3',
      'Pinia',
      'Vue Router',
      'Vue I18n',
      'Element Plus',
      'Django REST Framework',
      'MySQL',
      'JWT',
      'Gemini API',
      'GitHub Actions'
    ],
    highlights: [
      {
        id: 'llm-journey-workflow',
        title: '以 LLM 對話建立可套用的行程草稿',
        text: '使用者以自然語言描述旅遊需求後，==後端限制 LLM 可輸出欄位，前端補齊未能自動對應的資料，確認後才套回原表單==。',
        technologies: ['Vue 3', 'Gemini API', 'Django REST Framework'],
        featured: true
      },
      {
        id: 'ai-image-workflow',
        title: '從行程內容延伸圖片生成與素材確認',
        text: 'LLM 草稿同步產生主圖、手機圖及橫幅圖的素材建議；管理者可編輯 Prompt、選擇圖片比例及尺寸，==預覽並接受結果後才建立 Media 並寫回行程，避免 AI 內容直接覆蓋正式資料==。',
        technologies: ['Gemini API', 'Vue 3', 'UploadImage'],
        featured: true
      },
      {
        id: 'public-admin-platform',
        title: '公開前台與營運後台共用內容模型',
        text: '公開端提供行程列表與詳情、日期篩選、消息、FAQ 及詢問表單；後台以同一套 API 管理行程梯次、景點、目的地、標籤、媒體及網站內容，==後台保留完整資料，公開端只呈現有效且可報名的內容==。',
        technologies: ['Vue 3', 'Django REST Framework', 'MySQL'],
        featured: true
      },
      {
        id: 'multilingual-content',
        title: '多語系介面與內容管理分層',
        text: '介面文案由 Vue I18n 管理，行程、消息、FAQ、目的地及標籤則以後端語系資料維護；管理者可切換工作語系編輯內容，公開 API 依語系回傳對應資料，避免把 UI 翻譯與營運內容綁在同一層。',
        technologies: ['Vue I18n', 'Vue 3', 'Django REST Framework']
      },
      {
        id: 'dual-layer-rbac',
        title: '前後端雙層角色權限控管',
        text: '登入後取得角色及權限清單，==前端 Router Guard 控制頁面與導覽，後端再以 DRF Permission 驗證操作權限==；Superuser 專屬的 AI、語系、API 與 QA 頁面另行隔離，不將前端隱藏視為唯一保護。',
        technologies: ['Vue Router', 'JWT', 'Django REST Framework']
      },
      {
        id: 'reusable-admin-components',
        title: '資料驅動的管理後台元件',
        text: '==將列表行為收斂為 DynamicTable，將欄位設定、驗證與編輯狀態交由 DynamicForm==；搭配 UploadImage、DynamicDrawer、排序抽屜及共用資料映射，讓行程、消息、FAQ、使用者與角色頁沿用一致的管理流程。',
        technologies: ['Vue 3', 'Element Plus', 'DynamicTable', 'DynamicForm']
      },
      {
        id: 'controlled-ai-configuration',
        title: '可管理且不暴露密鑰的 AI 設定',
        text: 'Gemini API Key 只在後端加密保存，管理頁僅取得遮罩值與啟用狀態；模型清單、連線測試、文字與圖片模型分開管理，並記錄 Token 使用量、辨識配額錯誤及冷卻時間，讓 AI 功能可以維運，而不是把固定設定寫死在前端。',
        technologies: ['Django', 'Gemini API', 'Pinia']
      },
      {
        id: 'api-contract-and-delivery',
        title: '從 API 契約、QA 到環境部署',
        text: '以前後端指南記錄 API 欄位及相容策略，使用分割來源維護 OpenAPI 文件，並以 QA Runner、測試資料與驗收紀錄追蹤公開端及後台流程；Dev 與正式分支各自建置，透過 GitHub Actions 部署至對應環境。',
        technologies: ['OpenAPI', 'QA', 'GitHub Actions']
      }
    ],
    gallery: [
      {
        src: 'images/side-projects/coolker-tour-explorer/admin-ai-journey-assistant.jpg',
        alt: '旅行社行程管理後台新增行程與 AI 行程助手，並列呈現結構化表單及對話工作區'
      },
      {
        src: 'images/side-projects/coolker-tour-explorer/admin-journey-list.jpg',
        alt: '旅行社行程管理後台列表，集中搜尋、篩選、發布狀態及行程管理操作'
      },
      {
        src: 'images/side-projects/coolker-tour-explorer/front-home.jpg',
        alt: '旅行社公開網站首頁，以主視覺與精選行程引導旅客探索內容'
      },
      {
        src: 'images/side-projects/coolker-tour-explorer/front-journey-list.jpg',
        alt: '旅行社前台行程探索，可依天數、月份、標籤及目的地篩選旅遊產品'
      },
      {
        src: 'images/side-projects/coolker-tour-explorer/front-journey-detail.jpg',
        alt: '旅行社行程詳情首屏，整合主視覺、天數、目的地、成團人數及交通方式'
      }
    ],
    contentStatus: 1,
    status: 'published',
    order: 60
  },
  {
    id: 'sosobook',
    slug: 'sosobook',
    title: 'SosoBook減重競賽日記',
    summary:
      '以手帳與校園運動會為視覺語言的手機 PWA，將每日體重、貼紙打卡、多人競賽、排行榜與結算證書整合成持續使用的健身紀錄。',
    role: '產品規劃、UI／UX、Vue PWA、Firebase 資料模型、權限規則與自動結算獨立完成',
    roleEmphasis: true,
    description:
      'SosoBook 是一套以「手帳 × 校園運動會 × 健身競賽」為世界觀的手機優先 PWA。使用者可透過 Google 登入建立健身卡，以日曆記錄體重、BMI、貼紙與連續打卡，也能用邀請碼建立或加入多人競賽。競賽採個人起始體重計算相對變化，搭配填寫率、排行榜、曲線及結算證書；其他參賽者只看得到百分比與公開資料，實際體重仍維持個人私密。',
    architecture:
      '前端以 Vue 3、Pinia、Vue Router 與 Vite PWA 建立手機操作介面，Firebase Authentication 提供 Google 登入，Cloud Firestore 保存個人紀錄與競賽資料，並啟用多分頁離線快取。Firestore Rules 隔離個人體重及競賽公開資料；GitHub Actions 每日以 Firebase Admin SDK 結算已結束競賽，建立不可變證書快照。版本清單搭配 Service Worker 處理選擇性與強制更新，避免舊版資料格式持續寫入。',
    featured: false,
    liveUrl: 'https://sosobook.chenchenworkshop.com',
    repositoryUrl: 'https://github.com/bitifyChen/sosobook',
    technologies: [
      'Vue 3',
      'Pinia',
      'Firebase',
      'Firestore Rules',
      'PWA',
      'Vitest',
      'GitHub Actions'
    ],
    highlights: [
      {
        id: 'journal-check-in',
        title: '把每日體重記錄設計成手帳打卡',
        text: '以月份日曆呈現每日體重、BMI、貼紙與補登狀態，支援修改歷史紀錄、最近七天補登、多張貼紙及連續打卡；==首頁以近三個月體重與 BMI 曲線，將單次輸入整理成可閱讀的長期變化==。',
        technologies: ['Vue 3', 'Pinia', 'Firebase'],
        featured: true
      },
      {
        id: 'multiplayer-competition',
        title: '以邀請碼串起完整多人競賽流程',
        text: '使用者可建立競賽、分享六碼邀請碼、加入房間並查看排行榜；==以競賽期間第一筆紀錄作為個人基準，並處理同分、缺少紀錄與填寫率不足==。',
        technologies: ['Vue 3', 'Firebase', '競賽規則'],
        featured: true
      },
      {
        id: 'privacy-aware-ranking',
        title: '排行榜公開成果，不公開實際體重',
        text: '多人模式只同步暱稱、角色、減重百分比、填寫率與百分比曲線；==只有本人能讀取原始體重，Firestore Rules 再依使用者及競賽成員身分限制讀寫==，將社交競賽與敏感健康資料分開保存。',
        technologies: ['Firestore Rules', 'Firebase Auth', '資料隱私'],
        featured: true
      },
      {
        id: 'automated-settlement',
        title: '每日自動結算並建立不可變證書',
        text: '==GitHub Actions 每日啟動結算程序，建立證書後鎖定結果，重複執行會略過既有證書==；依競賽期間、填寫率及排名規則產生公開成績與個人私密曲線。',
        technologies: ['GitHub Actions', 'Firebase Admin', 'Node.js']
      },
      {
        id: 'controlled-pwa-release',
        title: '可離線使用、可控版本更新的 PWA',
        text: 'Firestore 使用持久化本機快取支援多分頁與離線操作，App Shell 由 Service Worker 管理；版本清單區分最新版本與最低支援版本，提供可延後更新或強制更新流程，並在啟用失敗時保留重新載入備援。',
        technologies: ['PWA', 'Service Worker', 'Firebase']
      },
      {
        id: 'safe-schema-migration',
        title: '跨版本貼紙資料相容與安全遷移',
        text: '多貼紙改版期間==以新欄位作為正式來源，同時保留舊欄位相容讀取與雙寫；遷移工具預設只執行 Dry Run==，再透過最低版本限制逐步淘汰舊用戶端，降低一次性改版造成資料不一致的風險。',
        technologies: ['資料遷移', 'Firebase Admin', 'PWA']
      },
      {
        id: 'tested-product-rules',
        title: '以測試固定日期、競賽與版本規則',
        text: '使用 Vitest 驗證體重格式、日期邊界、連續打卡、減重百分比、排名、填寫率、貼紙相容、資料遷移、結算通知與版本比較；部署前依序執行格式檢查、測試與正式建置。',
        technologies: ['Vitest', 'GitHub Actions']
      }
    ],
    gallery: [
      {
        src: 'images/side-projects/sosobook/fitness-card.png',
        alt: 'SosoBook 手機健身會員卡，呈現個人卡片、連續天數、參賽資訊與成就徽章'
      },
      {
        src: 'images/side-projects/sosobook/competition-detail.png',
        alt: 'SosoBook 手機競賽詳情頁，呈現排行榜、填寫率、比賽曲線與成績摘要'
      },
      {
        src: 'images/side-projects/sosobook/daily-check-in.png',
        alt: 'SosoBook 每日打卡視窗，可記錄當日狀態並選擇飲食與運動貼紙'
      }
    ],
    contentStatus: 1,
    status: 'published',
    order: 70
  }
]
