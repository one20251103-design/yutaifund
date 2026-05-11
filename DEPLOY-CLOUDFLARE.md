# Cloudflare Pages 部署 SOP

> **適用版本**：Astro 5 + Sanity v4，純靜態 SSG
> **預估時間**：首次設定 25 分鐘 / 之後每次 push 自動

---

## 部署架構

```
GitHub (yutaifund-web)
    ↓ push to main
Cloudflare Pages（連接 GitHub）
    ↓ 自動觸發 build
[CF Build worker]
  1. clone repo
  2. cd yutaifund_web_v1 && npm install
  3. npm run build  ← Astro 抓 Sanity 11 筆內容 + 生成 20 頁靜態
  4. 把 dist/ 部署到 CF 全球 edge network
    ↓
https://yutaifund-web.pages.dev（或綁定的 yutaifund.tw）
```

**內容更新流程**（業主在 Sanity 改文章後）：
```
業主在 Sanity Studio Publish
    ↓
Sanity webhook 打到 CF Pages Deploy Hook
    ↓
CF Pages 觸發 rebuild（同上流程）
    ↓
2-3 分鐘後網站更新
```

---

## 一次性設定步驟（首次部署）

### Step 1：把專案推上 GitHub（5 分鐘）

> **前提**：你已經在 GitHub 開好空 repo（建議命名 `yutaifund-web`，**Private**）

在專案根目錄執行：

```bash
cd /d/Users/Administrator/Downloads/Hank-agent/yutaifund_web_v1
git init
git add .
git commit -m "Initial commit: yutaifund 鈺泰發網站 demo（含 Sanity v4 + Formspree + LINE 串接）"
git branch -M main
git remote add origin https://github.com/<你的帳號>/yutaifund-web.git
git push -u origin main
```

**檢查點**：
- 去 GitHub 看 repo，應該有所有檔案
- **不能**看到 `.env`（被 .gitignore 擋下）
- 應該看到 `.env.example`

### Step 2：在 Cloudflare 開新 Pages 專案（10 分鐘）

1. 登入 https://dash.cloudflare.com → 左側選 **Workers & Pages**
2. 上方分頁切到 **Pages** → 點 **Create application**
3. 選 **Connect to Git**
4. 授權 Cloudflare 存取你的 GitHub（首次會要 OAuth）
5. 選 `yutaifund-web` repo → **Begin setup**

#### Build 設定

| 欄位 | 填什麼 |
|------|--------|
| Project name | `yutaifund-web`（會變成 `yutaifund-web.pages.dev`） |
| Production branch | `main` |
| Framework preset | **None**（不要選 Astro preset，避免它自作主張） |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory (advanced) | **留空白**（repo 根就是專案根，不要填 `yutaifund_web_v1`，那是本機路徑） |

> **為什麼 Root directory 要留空？**
> 因為當初 git init 是在 `yutaifund_web_v1/` 資料夾直接執行，所以這個資料夾本身就是 repo 根。GitHub 上看到的是 `src/` `docs/` `studio/` 等直接在 root，沒有 `yutaifund_web_v1/` 這層。
>
> 如果填 `yutaifund_web_v1`，Cloudflare 會找不到資料夾而 build 失敗（錯誤：`Cannot find cwd: /opt/buildhome/repo/yutaifund_web_v1`）。

#### 環境變數（**必填**）

點 **Environment variables (advanced)** → **Add variable**：

| Variable name | Value | Type |
|---------------|-------|------|
| `PUBLIC_SANITY_PROJECT_ID` | `ck8ic8jh` | Plain text |
| `PUBLIC_SANITY_DATASET` | `production` | Plain text |
| `PUBLIC_SANITY_API_VERSION` | `2025-01-01` | Plain text |
| `PUBLIC_FORMSPREE_FORM_ID` | `mojrnyel` | Plain text |
| `PUBLIC_GTM_ID` | `GTM-XXXXXXX`（如有）| Plain text |
| `NODE_VERSION` | `20` | Plain text |

> **NODE_VERSION 一定要設**！CF Pages 預設 Node 18，但 Astro 5 + Sanity v4 要 Node 20+，沒設會 build fail。

點 **Save and Deploy** → 第一次 build 大約 2-3 分鐘。

### Step 3：第一次部署驗證（5 分鐘）

Build 完成後 CF 會給你網址 `https://yutaifund-web.pages.dev`，點開檢查：

- [ ] 首頁正常顯示
- [ ] `/news` → 看到 2 篇文章
- [ ] `/news/yutaifund-website-launch` → 點進去看到完整文章
- [ ] `/portfolio` → 看到 6 個案例
- [ ] `/insights` → 看到 3 篇指南
- [ ] LINE 按鈕點下去跳到一方圓 OA 加好友頁
- [ ] `/contact` 表單能填寫

### Step 4：設定 Sanity Webhook（5 分鐘）— 讓業主編輯後自動更新

#### 4-A：在 CF Pages 拿 Deploy Hook URL

1. CF Pages → 你的 project → **Settings**
2. 左側 **Builds & deployments** → 找到 **Deploy hooks**
3. 點 **Add deploy hook**
   - Hook name: `sanity-publish-trigger`
   - Branch: `main`
4. 點 **Save** → 複製出現的 URL（類似 `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/abc123...`）

#### 4-B：到 Sanity 加 webhook

1. 開 https://www.sanity.io/manage/personal/project/ck8ic8jh
2. 上方 **API** → 左側 **Webhooks** → **Create webhook**
3. 設定：

| 欄位 | 填什麼 |
|------|--------|
| Name | `Trigger Cloudflare rebuild` |
| URL | （貼剛剛 CF 複製的 hook URL） |
| Dataset | `production` |
| Trigger on | ☑ Create ☑ Update ☑ Delete |
| Filter | `_type in ["news", "portfolio", "insight"]` |
| Projection | （留空） |
| HTTP method | `POST` |
| HTTP Headers | （留空） |
| API Version | `v2025-01-01` |
| Enable webhook | ☑ |

4. **Save**
5. 測試：去 Sanity Studio 隨便編輯一篇文章 Publish → 等 2-3 分鐘 → CF Pages 應該看到新的 deployment（Builds tab）

---

## 後續更新流程

### 改 Code（前端 / 設計）

```bash
# 修改檔案後
git add .
git commit -m "Update: 改了 hero 配色"
git push
# CF Pages 自動 rebuild + 部署
```

### 改內容（業主自己改）

業主到 https://yutaifund.sanity.studio/ → 改文章 → Publish → 自動觸發 rebuild

### 改環境變數

CF Pages → Settings → Environment variables → 改完之後 **要手動觸發一次 deploy**（不會自動）

---

## 綁定自訂域名（如已有 yutaifund.tw）

### 路徑 A：DNS 在 CF（推薦）

1. 把 yutaifund.tw 加進 CF（**Add a Site** → 改 nameserver）
2. CF Pages 該 project → **Custom domains** → **Set up a custom domain**
3. 輸入 `yutaifund.tw` 跟 `www.yutaifund.tw`（分別設）
4. CF 自動加 DNS record，30 秒內生效，免費 SSL 自動申請

### 路徑 B：DNS 留在原註冊商

1. CF Pages → Custom domains → 輸入域名
2. CF 會給你**外部 CNAME 設定指示**，去你的域名後台（如中華電信、Gandi）加：
   - `yutaifund.tw` → `yutaifund-web.pages.dev`（A record 不行，要用 ALIAS / ANAME）
   - `www.yutaifund.tw` → CNAME `yutaifund-web.pages.dev`
3. 生效時間視 TTL 而定，最久 24 小時

---

## 疑難雜症

### 「Build failed: Cannot find module @sanity/client」

→ Root directory 沒設成 `yutaifund_web_v1`，CF 跑 `npm install` 跑錯地方。

### 「Build success 但網站打開是 404」

→ Build output directory 沒填 `dist`，CF 拿不到產物。

### 「Sanity webhook 觸發但 CF 沒 rebuild」

→ 1) Deploy Hook URL 過期或被刪 / 2) Sanity webhook 沒打勾 Enable / 3) Sanity filter 寫錯（要用 `_type in [...]` 不是 `_type == ...`）

### 「Build 時間太長（>5 分鐘）」

正常情況 2-3 分鐘。超過 5 分鐘可能是：
- node_modules 太大 → 檢查是否誤裝了 dev dependencies
- 圖片 build 階段抓 Unsplash 失敗 → 把圖片放專案本地或 Sanity assets

### 「Build 數量爆掉」

CF Pages 免費版每月 **500 次 build**。Sanity 每改一篇文章觸發一次。500 次 / 月 = 平均每天 16 次。對小客戶夠用，大客戶要評估升級或加 debounce。

---

## 推薦的 Preview Deployment 設定

CF Pages 預設會幫每個非 main branch 的 push 建一個 preview 網址（類似 `https://abc123.yutaifund-web.pages.dev`）。

用途：
- 在 demo 期間，每次重大改動先 push 到 `dev` branch 看 preview，確認沒問題再 merge 到 main
- 客戶要看「下一版設計」也可以給 preview URL，不影響正式站

要關掉 preview（如果不要的話）：CF Pages → Settings → Branch deployments → Production branch only。

---

## 完成上線後的告知信範本（給鈺泰發）

```
您好，

鈺泰發行銷有限公司官網 demo 版已部署完成：

預覽網址：https://yutaifund-web.pages.dev
CMS 後台：https://yutaifund.sanity.studio/

請您：
1. 點 LINE 加好友按鈕，加我們測試用 OA 體驗自動回應流程
2. 試填一次「聯絡我們」表單，確認資料能正確收到
3. 登入 Sanity Studio 試著修改一篇文章，看後台是否好操作

確認 demo 整體 OK 後，我們會啟動正式搬遷流程：
- 把所有帳號（CMS / 表單 / LINE OA / 主機）轉到貴公司名下
- 綁定 yutaifund.tw 正式域名
- 完成驗收清單後上線

預計搬遷時間 1.5 小時，會挑非營業時段執行。

如有任何疑問請隨時告知。
```
