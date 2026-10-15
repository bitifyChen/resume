# 2027Resume

Chenchen 的獨立產品工程展示。一個入口，三個案例與互動展示：商城、商城後台、POS 後台。

本專案依實務經驗重新實作，所有品牌、商品、會員、訂單及營運數字皆為虛構。沒有複製公司程式、環境設定、API、圖片、資料庫或 Git 歷史，也不連接公司的任何服務。這裡的 clean-room 指獨立重製做法，不代表經過法律或正式隔離流程認證。

## 開始開發

需求：Node.js 22.14 以上、npm。

```sh
npm install
npm run dev
```

開啟 http://127.0.0.1:5277。展示不需帳密，預設使用虛構會員；資料保存在本機瀏覽器，右上方可「重設資料」。無法使用本機儲存時會退回記憶體模式。

```sh
npm run check
npm run preview
```

`check` 包含 ESLint、資料規則測試、UTF-8 與外部網址檢查及正式建置。

## 熟悉的技術與目錄

Vue 3 Composition API、`<script setup>`、JavaScript、Vite、Vue Router、Pinia、Element Plus、Vue Query、SCSS、ECharts。維持明確 import；Element Plus 元件透過 resolver 按需載入。沒有引入 React 或 TypeScript。

```text
src/
  api/          非同步展示資料介面，無網路請求
  assets/       共用視覺樣式與主題變數
  components/   Showcase、Chat、Pos、Storefront、Table、Shared
  data/         案例敘事與負責範圍
  hook/         畫面互動、查詢與共用分頁邏輯
  layouts/      商城／POS 共用後台框架
  mock/         虛構種子資料、純函式規則、儲存介面
  pages/        路由頁面
  router/       明確的路由定義，採 hash 模式支援 Pages
  store/        Pinia：主題、角色、門店、行動版導覽
  utils/        格式化與 CSV
```

頁面呼叫 `hook/useDemoData`，由 Vue Query 統一快取；操作交給 `api/demo`，再由 `mock/operations` 驗證及計算下一份資料，最後才寫入 repository。Pinia 僅保存 UI 與展示角色選擇，不重複存放查詢資料。

## 已可操作的範圍

| 展示     | 可操作功能                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 商城     | 分類、搜尋、排序、收藏、商品詳情、倒數、購物袋、庫存檢查、虛構結帳                                                             |
| 商城後台 | 會話搜尋／篩選、加入／指派、未讀、釘選、文字與展示圖片、編輯／收回、結案／重開、會員及訂單資訊、訂單查詢／匯出／出貨、商品編輯 |
| POS 後台 | 門店切換、期間報表、圖表與數值表、低庫存、庫存調整及異動紀錄、CSV 範本／預覽／匯入／匯出、角色權限矩陣及角色切換               |

建議走一次：商城選購 → 建立展示訂單 → 後台檢視 → 客服處理；再到 POS 調整庫存 → 檢視紀錄 → 切換角色。

## 展示邊界

- 聊天僅在本機模擬；「模擬新訊息」會讓另一個會話收到新訊息。圖片按鈕傳送本專案的固定展示圖，不會上傳檔案。
- 付款、帳號驗證、雙因素驗證、錢包、真實通知、真正的 WebSocket 與收銀未實作。
- POS 權限是可體驗的前端模擬，不能取代後端身分認證及授權。角色從右上選單隨時可切回管理員。
- 商城庫存與 POS 庫存彼此獨立。商城及商城後台共用商品和訂單。
- Dashboard 的數據是種子報表，不是由展示訂單計算的真實業績，也不代表原專案的商業成效。
- 案例頁的「負責範圍」依開發者提供的經歷整理；展示版的功能清單與它分開描述。沒有宣稱未驗證的成效百分比。
- 本機儲存只用於個人展示，不支援多人同步；請勿輸入真實個資。

## 網站發布

Sites 的目標網址為 https://chenchen-resume-2027.bitifystory.chatgpt.site ，本次設定為公開展示。正式網址與當次部署狀態以 Sites 發布結果為準。Sites 設定保存於 `.openai/hosting.json`，程式仍維持原本的 Vite 靜態建置，不需要搬到其他框架。

### GitHub Pages（備用方案）

已加入可手動觸發的工作流程，尚未建立遠端儲存庫或發布網站。`base: './'` 搭配 hash 路由，可支援儲存庫子路徑。

建立獨立儲存庫後，在 GitHub 的 Pages 設定選擇 GitHub Actions，再手動執行 `Publish demo to GitHub Pages`。工作流程會先檢查及建置，再發布 `dist`。所有編譯後的前端程式仍可被使用者下載；關閉 source map 並不等於保密。

## 素材

`public/images/commerce-admin.png`、`pos-admin.png` 為本次對話先前產生的概念封面；`everyday.png` 是獨立產生的虛構商品攝影。案例頁明確標註概念圖，未將其作為真實產品截圖。圖片提示與來源見 `docs/assets.md`。
