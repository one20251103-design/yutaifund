# 鈺泰發網站 — 接續工作交接文件

**最後更新**：2026-05-08（週五下午）
**專案路徑**：`D:\Users\Administrator\Downloads\Hank-agent\yutaifund_web_v1`
**測試帳號**：一方圓 Gmail（最終交付前要轉移到鈺泰發客戶 Gmail）

---

## ✅ 今天完成的事

### 1. Sanity 串接層（程式端 100% 完成）
- `.env` 寫好：`PUBLIC_SANITY_PROJECT_ID=ck8ic8jh` / `dataset=production` / `apiVersion=2025-01-01`
- `studio/.env` 已存在且正確（`SANITY_STUDIO_PROJECT_ID=ck8ic8jh`）
- Sanity Studio 從 v3 升級到 **v4.22**（Vite 7、styled-components 6.1.15）
- `studio/sanity.config.ts` 加上 `.id()`（v4 強制要求）
- 3 個 `[slug].astro` 改成「list 取 slug、單筆取 body」的兩階段查詢，避免 body 缺失

### 2. Formspree 串接
- `.env`：`PUBLIC_FORMSPREE_FORM_ID=mojrnyel`

### 3. LINE Level 1（加好友按鈕）
- `src/lib/site.ts` 把舊的 `lineOaId: '@yutaifund'` 改成 `lineAddFriendUrl: 'https://lin.ee/rpAl9J4'`（一方圓 OA 測試用）
- 6 處 `https://line.me/R/ti/p/${SITE.lineOaId}` 全部改用 `SITE.lineAddFriendUrl`

### 4. Demo 資料 seeding 腳本
- `scripts/seed.mjs` — 把本機 `src/data/*.ts` 的 2 篇消息 + 3 篇指南 + 6 個案例推進 Sanity
- 自動下載 Unsplash 封面圖、上傳到 Sanity assets
- markdown body 自動轉 portable text
- idempotent（用固定 `_id`，重跑只覆蓋不重複）

---

## 🔴 下次接著做的事（按順序）

### Step 1：執行 seed 腳本（5 分鐘）

**前置**：去 https://www.sanity.io/manage/personal/project/ck8ic8jh/api/tokens 申請 Editor token（如果上次沒做完）

**執行**：
```powershell
cd D:\Users\Administrator\Downloads\Hank-agent\yutaifund_web_v1
$env:SANITY_WRITE_TOKEN="貼 token"
node scripts/seed.mjs
```

**完成後**：去 sanity.io/manage 把 token 撤銷（垃圾桶 icon）

### Step 2：本機驗證三件套

啟兩個 terminal：
```powershell
# Terminal A：Sanity Studio
cd D:\Users\Administrator\Downloads\Hank-agent\yutaifund_web_v1\studio
npm run dev
# → http://localhost:3333（檢查 11 筆資料是否齊全）

# Terminal B：Astro 網站
cd D:\Users\Administrator\Downloads\Hank-agent\yutaifund_web_v1
npm run dev
# → http://localhost:4321
```

**測試清單**：
- [ ] 任一 LINE 按鈕（Hero / Footer / SpeedDial / 手機 menu）→ 跳到一方圓 OA 加好友頁
- [ ] /news 列表顯示 2 筆
- [ ] /news/yutaifund-website-launch 點進去能看完整文章（不是 404）
- [ ] /portfolio 顯示 6 筆
- [ ] /portfolio/sample-jiaoxi-spa 點進去能看完整介紹
- [ ] /insights 顯示 3 筆
- [ ] /contact 表單填送 → Formspree 後台收到信

### Step 3：部署 Sanity Studio 到雲端（5 分鐘）

```powershell
cd D:\Users\Administrator\Downloads\Hank-agent\yutaifund_web_v1\studio
npm run deploy
```
- Studio hostname 預設 `yutaifund`（在 `studio/sanity.cli.ts:8`）
- 如果 `yutaifund` 已被占用，會提示換名稱（建議 `yutaifund-test` 給測試用）
- 完成後拿到 `https://xxx.sanity.studio/`，給業主登入用

### Step 4：LINE Level 2（表單送出 → LINE 通知，30 分鐘）

**前置條件（Hank 自己跑）**：
1. 註冊 https://www.make.com（用一方圓 Gmail）
2. 邀請我為協作者（給我邀請連結）
3. 告訴我 LINE Channel Access Token + Channel Secret 存哪了（**不要再貼到對話裡**，從你的密碼管理器讀就好）
4. 取得「要接收通知的 LINE User ID」（流程下次討論）

**我會做的**：建 Make.com 自動化「Formspree webhook → LINE Push Message → 推訊息給你」

### Step 5：LINE Level 3（圖文選單 + 自動回應，半天）

- 你把 Hank 的 LINE 加為一方圓 OA 管理員（manager.line.biz → 設定 → 權限管理）
- 你決定圖文選單 6 格分別連去哪
- 我做 2500×843 主視覺 + 設定關鍵字自動回應 + 加好友歡迎訊息

### Step 6：Cloudflare Pages 部署（最後一哩）

- 推 GitHub repo
- CF Pages 連 GitHub → build command `npm run build`、output `dist`、root `yutaifund_web_v1`
- 環境變數複製 `.env` 內所有 PUBLIC_ 開頭的
- 設 Sanity webhook：CF Deploy hook URL 貼到 sanity.io/manage → API → Webhooks，trigger 條件 `_type in ["news", "portfolio", "insight"]`

---

## ⚠️ 機密憑證去處（不要遺失！）

以下資訊**不在這個檔案裡**也**不在 git**裡，請你在密碼管理器（1Password / Bitwarden / Notion 私頁）保管：

- LINE Channel Access Token（mV+O... 開頭那串）
- LINE Channel Secret（b09e... 開頭那串）
- 之後申請的 Sanity Write Token（用完撤銷後就沒了）

**遺失了怎麼辦**：去 LINE Developers Console → Channel → 點 Reissue 重發，舊的失效。

---

## 📁 重要檔案地圖

```
yutaifund_web_v1/
├─ .env                      # Sanity + Formspree 變數（不進 git）
├─ .env.example              # 範本（進 git）
├─ scripts/seed.mjs          # Demo 資料 seeding 腳本
├─ src/
│  ├─ lib/
│  │  ├─ site.ts             # ★ lineAddFriendUrl 在這
│  │  ├─ sanity.ts           # Sanity client + GROQ queries
│  │  └─ content.ts          # Sanity → 本機 fallback 統一資料層
│  ├─ data/                  # 本機 demo 資料（fallback 用）
│  ├─ pages/
│  │  ├─ news/[slug].astro       # ★ 已改用 getNewsBySlug
│  │  ├─ portfolio/[slug].astro  # ★ 已改用 getPortfolioBySlug
│  │  └─ insights/[slug].astro   # ★ 已改用 getInsightBySlug
│  └─ components/            # 6 處 LINE 連結都已改用 SITE.lineAddFriendUrl
└─ studio/                   # Sanity v4 Studio
   ├─ .env                   # Studio 用的 PROJECT_ID
   ├─ sanity.config.ts       # ★ v4 需要 .id()
   ├─ sanity.cli.ts          # studioHost: 'yutaifund'
   └─ schemas/               # news / portfolio / insight 三個 schema
```

---

## 🎯 給下次的我（or 給 Claude）

當你重新打開這個專案時：
1. **先讀這個檔案**（HANDOFF.md）
2. **再讀 CLAUDE.md**（Hank 的全域偏好）
3. 確認 Step 1（seed 腳本）是否已執行 → 看 Sanity Studio 有沒有 11 筆資料
4. 從上面的 Step 順序往下接

**已知陷阱**：
- Sanity v4 的 `S.listItem()` 必須加 `.id()`，否則 Studio 會跑 `id is required for lists` 錯誤
- Astro dev mode 對 `getStaticPaths` 的快取很頑固，新增 Sanity 資料後 Studio 端能看到、但 Astro 端要 Ctrl+C 重啟 dev server
- Sanity v4 升級時如果中途取消會壞 node_modules，要刪掉 `studio/node_modules` + `package-lock.json` 重裝
