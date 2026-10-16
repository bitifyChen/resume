# 面試作品集：議題型改版

此頁記錄第三版設計判讀。2026-10-16 依新需求改為 Case Study → Project → Side Project，僅保留淺色；目前的資料維護方式見 `portfolio-content.md`。保留既有配色、字體與案例網址，設計設定仍為 5／3／5。

## 參考分析

- [1wei.dev](https://1wei.dev/)：Projects 使用預覽、專案名稱、短用途與直接連結，容易掃讀；不套用其個人介紹或品牌。
- [Chenchen 專案入口](https://chenchenworkshop.com/project)：粗重黑字、淡粉底、圖片優先、有分類。保留字重與色感，減少裝飾虛線與大面積開場。
- [Chenchen 的 DemoX 案例](https://chenchenworkshop.com/project/21)：現有閱讀順序偏設計概念、客戶背景、專案目標。面試版改以工程議題安排內容，不修改原官網。

## 設計判讀

面向面試官的前端案例集。Projects 是首頁主內容，不先閱讀自我宣言。沿用 Vue、JavaScript、SCSS 與現有元件，沒有移植框架。

DESIGN_VARIANCE: 5；MOTION_INTENSITY: 3；VISUAL_DENSITY: 5。

視覺採原官網淡粉／黑字的克制版本；深色模式維持相同層級。圖片與按鈕使用 6px 與 4px 圓角。頁首 72px，內容導覽 sticky 10，圖片檢視使用既有 Element Plus 覆蓋層。

## 資訊結構

- Projects：每個專案有實際預覽、一句範圍、兩個可直接進入的議題。
- 專案：議題導覽、目前議題、Before／After 操作對照、實際重製畫面與操作入口。
- 實作細節與負責範圍預設收合，讓讀者依需要展開。
- 保留既有專案與 Demo 路徑；以 query 選擇議題，支援分享與返回。

## 敘事與證據

Before 是問題情境重建，不是未取得的公司舊版截圖。After 是目前方案的去識別重製，不把模型示範或假資料當成正式效益。不得暗示原公司曾有未驗證的安全缺陷、錯誤或營運數字。沒有真實前後測，不寫節省百分比或效率倍數。

使用真實重製網站截圖，不另生成概念封面。此次只改作品集與案例說明，不變更三套 Demo 的產品 UI。
