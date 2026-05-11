# V1 Sanity CMS 串接指南

## 目前狀態

V1 已完成「智能 fallback」串接：
- **沒設 Sanity env** → 自動用本機 `src/data/*.ts` 假資料（dev / build 都能跑）
- **設了 env 但 Sanity 沒資料** → 仍用本機假資料
- **Sanity 有資料** → 自動覆蓋本機假資料

## 串接前置作業（一次性）

### 1. 申請 Sanity 帳號（用業主 Gmail）

1. 開啟 https://www.sanity.io/
2. 用業主 Gmail 註冊（重要：這個帳號最後要交給業主）
3. Create new project
   - **Name**: 鈺泰發行銷
   - **Dataset**: production（預設值）
   - **Schema**: Custom（不選任何 template）
4. 複製 **Project ID**（格式類似 `abc1d2e3`）

### 2. 部署 Sanity Studio（後台介面）

```bash
cd yutaifund_web_v1/studio
npm install

# 第一次部署：CLI 會問 project ID
SANITY_STUDIO_PROJECT_ID=你的_project_id npm run dev
```

開瀏覽器到 http://localhost:3333 應該能看到 Studio 後台空白介面（最新消息 / 作品案例 / 買房指南 三個分類）。

接著部署到 Sanity 雲端讓業主能直接登入：

```bash
SANITY_STUDIO_PROJECT_ID=你的_project_id npm run deploy
```

CLI 會問你要的 studio hostname（建議：`yutaifund`），完成後業主可在
**https://yutaifund.sanity.studio/** 登入後台。

### 3. 把 Project ID 寫入網站

複製 `.env.example` 到 `.env`：

```bash
cd yutaifund_web_v1
cp .env.example .env
```

編輯 `.env`，填入：

```
PUBLIC_SANITY_PROJECT_ID=你剛拿到的_project_id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-01-01
```

重新跑 `npm run dev`，網站會自動從 Sanity fetch 內容。

如果 Studio 是空的，網站會繼續用本機假資料（業主端體驗：上線當天網站就有東西，等他開始 publish 才覆蓋）。

---

## 業主操作流程（給業主看的）

業主在 https://yutaifund.sanity.studio/ 登入後：

### 發佈一則最新消息

1. 左側「最新消息」→ 右上角「+ Create」
2. 填寫：
   - 標題（≤ 80 字）
   - 網址 slug（自動由標題產生，可手動改成英數）
   - 發佈日期（預設今天）
   - 摘要（≤ 200 字，顯示在列表）
   - 封面圖（拖曳圖檔上傳）
   - 內文（可加標題、清單、圖片、超連結）
3. 右上角 **Publish** ✓

按下 Publish 後 → 觸發 Cloudflare 重 build → 2-3 分鐘後網站自動更新。

### 發佈一筆建案

1. 左側「作品案例」→ 「+ Create」
2. 填寫：標題 / slug / 分類（新成屋 / 中古屋）/ 地段 / 狀態 / 封面圖 / 介紹 / 圖庫
3. 勾選「精選」可顯示在首頁「精選建案」區
4. Publish

### 發佈一篇買房指南

1. 左側「買房指南」→「+ Create」
2. 填寫：標題 / 分類（購屋指南 / 市場觀察 / 合約解讀 / 在地知識）/ 摘要 / 封面 / 內文
3. Publish

---

## 自動部署（Cloudflare Pages 端）

### 1. Cloudflare Pages → Build hooks

1. 登入 https://dash.cloudflare.com → Workers & Pages → 你的 yutaifund 專案
2. Settings → Builds & deployments → Deploy hooks
3. 「Add deploy hook」→ Name: `Sanity Publish` → Branch: `main`
4. 複製產生的 hook URL（格式類似 `https://api.cloudflare.com/client/v4/.../deploy_hook/xxx`）

### 2. Sanity Webhook（綁定 Publish 觸發）

1. 進 https://www.sanity.io/manage 你的 project
2. 左側「API」→ Webhooks → Create webhook
3. 填寫：
   - **Name**: Cloudflare Rebuild
   - **URL**: 貼上剛才複製的 deploy hook URL
   - **Trigger on**: Create / Update / Delete
   - **Filter**: `_type in ["news", "portfolio", "insight"]`
   - **HTTP method**: POST
4. Save

之後業主每次 Publish → Sanity 觸發 Cloudflare → 自動重 build → 2-3 分鐘上線。

---

## 環境變數對照

| 變數名 | 用途 | 哪裡填 |
|---|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | Sanity 專案 ID | `.env` 與 Cloudflare Pages 環境變數 |
| `PUBLIC_SANITY_DATASET` | 資料集名（通常 production） | 同上 |
| `PUBLIC_SANITY_API_VERSION` | API 版本（用日期） | 同上，預設 `2025-01-01` |
| `PUBLIC_FORMSPREE_FORM_ID` | 表單收件 ID | 同上 |
| `PUBLIC_LINE_OA_ID` | LINE OA ID | 同上，目前 `@yutaifund` |
| `PUBLIC_GTM_ID` | GTM 追蹤 ID | 同上，可選 |
| `PUBLIC_DESIGN_PANEL` | 是否顯示左下色票面板 | 同上，正式上線設 `false` |

Cloudflare Pages 環境變數位置：
- Settings → Environment variables → Production / Preview 都要設

---

## 故障排除

### 問題：本地跑 dev 顯示「本機假資料」即使設了 env

- 檢查 `.env` 是否在 `yutaifund_web_v1/` 根目錄（不是 `src/`）
- 確認沒有打錯字 `PUBLIC_SANITY_PROJECT_ID=...`（不要有空格 / 引號）
- 重啟 dev server（env 變更後要重啟）

### 問題：Sanity 有資料但網站還是顯示假資料

- 在 Sanity Studio 的 Vision 工具測試查詢：`*[_type == "news"]`
- 確認資料有 **Publish**（不是只 Save Draft）
- 確認 Cloudflare Pages 的 env 也設了 PUBLIC_SANITY_PROJECT_ID

### 問題：頁面 build 時報錯 `body is not iterable`

- 檢查 Sanity 那篇文章的 `body` 欄位是否填了內容
- 或暫時清掉那篇文章重做

---

## 內容工作流程建議

| 階段 | 業主動作 | 開發者動作 |
|---|---|---|
| 開站 day 0 | — | 啟用網站 + 假資料先行上線 |
| day 1-7 | 學 Sanity 後台 | 教 1 對 1 訓練（30 分鐘） |
| day 8+ | 開始 Publish 真實案場 | 監控 webhook 是否成功 |
| 月度 | 每月 2-4 篇文章 | 看 GA4 流量回饋優化 |

---

## 帳號交付清單（Hank 從每個服務移除自己時用）

完成串接後，這些帳號最終要全部交給業主，Hank 從 collaborators 移除：

- [ ] Sanity（管理員角色給業主 Gmail）
- [ ] Cloudflare（admin → admin role）
- [ ] GitHub（如有 push code repo）
- [ ] Formspree（owner 換成業主 Gmail）
- [ ] Google Analytics（admin role 給業主）
- [ ] Google Search Console（owner 換成業主）

---

*交付：一方圓設計｜2026-05-07*
