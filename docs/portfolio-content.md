# 作品集內容維護

首頁順序固定為 Case Study、Project、Side Project；各區筆數不固定，版型不依專案名稱判斷。

## 三份獨立資料

| 來源                       | 內容                                  | 新增方式                           |
| -------------------------- | ------------------------------------- | ---------------------------------- |
| `src/data/projects.js`     | 專案名稱、介紹、圖片、Demo 與負責範圍 | 加入一筆專案                       |
| `src/data/caseStudies.js`  | 議題、Before／After、證據圖片與細節   | 加入案例，以 `projectId` 關聯專案  |
| `src/data/sideProjects.js` | 個人作品                              | 待內容準備好再加入，不先放虛構作品 |

三類資料皆使用穩定 `id`、`status: 'draft' | 'published'` 與數字 `order`。數字小的先顯示；未填 order 時視為 0，同值維持資料順序。草稿不出現在公開清單；所屬專案為草稿時，案例也不會公開。

專案另需唯一且穩定的 `slug`，維持既有路徑。案例的 `projectId` 指向專案 `id`，不用重複填寫專案名稱；重新命名專案時，首頁標籤同步更新。原有案例 `id` 不改，既有 query 連結仍可使用。

`src/data/portfolio.js` 組合公開清單與查詢方法；`src/utils/portfolio.js` 驗證唯一 ID、專案關聯及草稿狀態。資料錯誤在建置與測試時應修正，不以靜默忽略掩蓋。

## 新增資料

- 案例：沿用現有案例欄位，包含 `title`、`projectId`、`before`、`after`、`images`、`details`、`try`、`demo`。一個專案可有任意數量案例，不必修改 Vue 頁面。
- Project：依現有欄位加入 metadata；圖片與名稱進入 `demo`，專案案例連結進入說明頁。沒有案例時顯示整理中。
- Side Project：準備 `id`、`title`、`summary`、`image`、`imageAlt`、`demo`、`status`、`order`。可沿用專案展示元件；沒有關聯案例就不填 `slug`。使用外部網址時需一併核對公開網址檢查規則。

主題僅有淺色，不讀取系統深色偏好或舊版 `resume-theme` 儲存值，也不提供切換按鈕。內容新增後執行 `npm run check`，確認關聯、素材與繁中編碼。
