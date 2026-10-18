# Chenchen｜作品集

以 Vue 3 建立的互動式作品集，整理我在電商前台、商城後台與 POS 後台的實作，以及持續迭代的 Side Project。內容分為 Case Study、Project 與 Side Project，讓閱讀者可以先看成果，再深入了解負責範圍與實作方式。

展示使用虛構品牌與資料重製，不包含公司原始碼、內部服務或真實會員與訂單資料。

## 技術

Vue 3 Composition API、JavaScript、Vite、Vue Router、Pinia、Element Plus、TanStack Vue Query、SCSS、ECharts、Swiper。

## 本機啟動

需求：Node.js 22 以上、npm。

```sh
npm ci
npm run dev
```

本機網址：<http://127.0.0.1:5277>

```sh
npm run check
npm run preview
```

`npm run check` 會執行 ESLint、資料規則測試、公開內容檢查與正式建置。

## 專案結構

```text
src/
  data/         Case Study、Project 與 Side Project 內容
  components/   共用展示版型與各項互動示範
  pages/        路由頁面
  router/       頁面路由
  store/        Pinia 狀態管理
  mock/         虛構資料與展示用操作規則
  api/          展示資料介面
  assets/       共用樣式、主題與字型
public/images/  作品展示圖片
```

作品內容與展示版型分開管理；新增案例或專案時，主要透過資料擴充，只有需要自訂操作展示的項目才加入專屬元件。

## 展示資料說明

網站中的操作為前端展示，資料儲存在目前瀏覽器，不會連接公司或作品的正式後端服務。請勿輸入真實個人資料、帳號或密碼；展示中的成效數字與訂單資料皆為虛構。

## GitHub Pages

推送至 `main` 會觸發 GitHub Actions，執行檢查、建置並發布 `dist`。首次發布前，請到 repository 的 **Settings → Pages → Build and deployment**，將 **Source** 設為 **GitHub Actions**。

若使用自訂網域，還需在同一個 Pages 設定頁填入網域；DNS 指向本身不會替 repository 啟用 Pages 網站。
