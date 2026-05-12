# 鈺泰發網站 — 禮拜二（2026-05-12）接續工作

**最後更新**：2026-05-11（週一傍晚）
**專案路徑**：`D:\Users\Administrator\Downloads\Hank-agent\yutaifund_web_v1`
**測試帳號**：一方圓 Gmail `one20251103@gmail.com`（最終交付前 transfer 給鈺泰發）

---

## 🎉 今天（週一 05-11）做完的事

### 1. 部署上線 ✅
- **正式網址**：https://yutaifund.pages.dev
- Cloudflare Pages 連 GitHub repo，push 自動 deploy
- 全部 20 個路由都 200 OK 驗過（首頁 + 5 個 list 頁 + 11 個 detail 頁 + about / contact / services / privacy / terms）

### 2. CMS（Sanity）✅
- Studio 雲端：https://yutaifund.sanity.studio/
- Project ID：`ck8ic8jh`、Dataset：`production`
- 11 筆 demo 內容已 seed（2 news + 3 insights + 6 portfolio）

### 3. LINE OA（測試用，一方圓 Gmail 管理）✅
- OA 短網址：https://lin.ee/yNHl4Wq
- Channel ID：`2010045833`
- 已抓 Hank 個人 User ID：`U6ce01e50e5b7729f16865866711d52be`
- Rich Menu PNG 已產出（2500×1686 大型版）：`docs/rich-menu.png`
- Make.com 手動設定教學：`docs/make-scenario-setup.md`

### 4. GitHub ✅
- Repo：https://github.com/one20251103-design/yutaifund
- Owner：`one20251103-design`（一方圓 GitHub org）
- 上次 commit：`bd9fb88`（Hank 編輯 line-oa-content.md 後本機還有未推的修改，明天可以順便推）

### 5. 文件全套 ✅
- `MIGRATION-CHECKLIST.md`：客戶簽下後的搬遷 SOP（7 步驟）
- `DEPLOY-CLOUDFLARE.md`：CF Pages 部署教學
- `docs/line-oa-content.md`：OA 文案全集
- `docs/make-scenario-setup.md`：Make.com 手動設定
- `docs/rich-menu.png` + `docs/rich-menu-mock.html` + `docs/rich-menu-export.html`：OA 主視覺
- `docs/make-scenario-formspree-to-line.json`：舊 Blueprint（broken，留作 Flex JSON 參考）

---

## ✅ 2026-05-12 早上 Claude 預先處理掉的事

| 項目 | 結果 |
|------|------|
| 部署活著驗證 | `curl https://yutaifund.pages.dev` → 200 OK |
| Git 同步狀態 | working tree clean，最新 commit `db980e7` 已推上 origin/main，HANDOFF 提到的未推改動其實已經推完 |
| Text Parser regex 升級 | 從抓 4 欄位 → 抓 6 欄位（加入 inquiry_type / location），改用 optional named group 容錯客戶未選的情況 |
| Flex JSON 升級 | 卡片多兩行「類型 / 地點」，業務一眼看出客戶想看什麼 |
| 鈺泰發電話 / 地址全專案校正 | Hank 確認後（2026-05-12）：電話 `03-9558400` → `03-9577000`、地址 `'宜蘭縣'` → `'268 宜蘭縣五結鄉協和村自強東路 71 號'`。涉及檔案：`site.ts`、`StructuredData.astro`（Schema 補 postalCode / addressLocality / streetAddress）、`contact.astro`（Google Maps iframe 重新定位到實際地址 zoom 16）、`line-oa-content.md`（8 處電話 + 2 處地址）。原 `03-9558400` 是當初 copy 一方圓設計電話的 placeholder |
| 🔴 **表單 Big5 編碼 bug 修正** | Hank 從一方圓 Gmail 抓真實 Formspree 信件貼回（2026-05-12），發現中文 value 被編成 Big5 URL-encoded（`%A4%FD%A4p%A9%FA` = Big5 王小明，不是 UTF-8 `%E7%8E%8B...`）。**結果**：即使 Make.com regex 抓對，下游 LINE 收到也是亂碼 `%A4%FD%A4p%A9%FA`。**修法**：`contact.astro` 表單加 `accept-charset="UTF-8"` + hidden `_charset_=utf-8` 雙保險強制 UTF-8 提交。**Hank 部署後務必再測一次表單**，到 Make.com History 看 Gmail 模組 output 應該變成正常中文 `王小明` |
| Text Parser regex 加 stop anchor | 看到實際信件後發現 Formspree 用 `label 自己一行 + value 下一行` 格式（不是 `name: value` 同一行），原 regex 剛好還能抓但 message 結尾會吃進 `Submitted 05:22 PM - 11 May 2026` 時間戳。加 `\n\s*Submitted\s` 為停止條件解決 |
| Gmail Watch 過濾教學補上 | 原文件叫「Read all email」是錯的會暴噴 ops（Hank 已踩雷）。`make-scenario-setup.md` Step 2 已改為 Sender email 強制 `noreply@formspree.io` + Criteria `Only unread mails`，降低 downstream 浪費 |
| Free plan polling 估算修正 | 原文件寫 15 分鐘是錯的（Hank 指正 2026-05-12）。Gmail Watch 每次 polling = 1 op，與是否抓到信無關。15 min × 30 天 = 2,880 ops 直接 3 倍爆 1,000 額度。Step 5 與 ops 估算表全面改成 **120 分鐘**（360 polls/月，留 640 ops 給流量，可消化每月 ~64 筆表單）。要再快只能升 Core $9/月或改 Formspree Plus webhook |

---

## ✅ 2026-05-12 下午整條 pipeline 跑通了

**端到端驗證通過**（Hank 親自填表單 → 個人 LINE 真的收到 Flex 卡片）：

```
Form (UTF-8) → Formspree → Gmail (Formspree-官網表單 label) → Make.com 3 模組 → 個人 LINE
     ✓             ✓                  ✓                          ✓              ✓
```

### Step 0–3 完成紀錄

| Step | 內容 | 結果 |
|------|------|------|
| Step 0 | Big5 → UTF-8 驗證 | `accept-charset="UTF-8"` + `_charset_=utf-8` 雙保險生效，LINE 卡片中文正確顯示 |
| Step 1 | Make.com Scenario 砍重建 | 三模組 Gmail (1) → Text Parser (2) → LINE (3) 全綠勾 |
| Step 2 | Formspree spam | 沒成為阻礙 |
| Step 3 | 端到端測試 | LINE 收到完整 6 欄位 Flex 卡片 |

### Make.com 最終生效設定

- **Gmail Watch**: Folder = `All mail`, Label = `Formspree - 官網表單`, Criteria = `Only unread messages`, Mark as read = `Yes`
- **Choose where to start**: `Choose manually`（從第一封 Formspree 信當起點）
- **Text Parser**: 6 欄位 regex（含 Submitted stop anchor），全 optional 群組
- **LINE**: Make an API Call → POST `/v2/bot/message/push`，Header 手動加 `Content-Type: application/json`（新版 UI 沒有 Body type 欄位了）
- **Scheduling**: 每 2 小時 polling（Free plan 1000 ops/月安全範圍）

### Debug 過程踩雷紀錄（給未來自己 / Claude）

1. **Gmail filter skip inbox**：Hank 的 Formspree 信用 filter 自動歸到 `Formspree - 官網表單` 標籤、skip inbox。Make.com Gmail Watch 預設抓 `System folders: Inbox` → 0 筆。改 Folder = `All mail` + Label filter 解決
2. **Choose where to start 設成 From now on 沒用**：因為要抓的測試信早於設定時間。改 `Choose manually` 直接指定那封信當起點
3. **LINE 415 Content-Type null**：實際根因是 **Body JSON 語法錯**（漏一個 `"` 在 `{{2.phone}}` 後），Make.com parse 不出來連 header 都不送，LINE 誤判成 Content-Type 問題
4. **新版 Make.com LINE 模組沒有 Body type 欄位**：要手動在 Headers 區加 `Content-Type: application/json`

---

## 🚧 還沒收尾的事（明天優先處理）

### Step 0：先重測表單確認 Big5 → UTF-8 真的修了（**最關鍵**）

**為什麼**：2026-05-12 Hank 把實際 Formspree 信件貼出來，發現 value 是 Big5 URL-encoded（`%A4%FD%A4p%A9%FA` = Big5 王小明）。已在 `contact.astro` 表單加 `accept-charset="UTF-8"` + `_charset_=utf-8` 強制 UTF-8。**但這是上游瀏覽器行為，需要實測驗證**。

**最終 regex（在 `docs/make-scenario-setup.md`，已與實際信件格式校正）**：
```
name:\s*(?<name>[^\r\n]+)[\s\S]*?phone:\s*(?<phone>[^\r\n]+)(?:[\s\S]*?email:\s*(?<email>[^\r\n]*))?(?:[\s\S]*?inquiry_type:\s*(?<inquiry_type>[^\r\n]*))?(?:[\s\S]*?location:\s*(?<location>[^\r\n]*))?(?:[\s\S]*?message:\s*(?<message>[\s\S]*?))?(?:\n\s*Submitted\s|\n\s*--|\n\s*Sent from|$)
```

**Formspree 信件實際格式**（已確認）：label 自己一行、value 下一行、欄位間 2-3 行空白、客戶沒選的 select 欄位 Formspree 直接省略整行（不留空 label）。

**明天先做**（Step 1 之前的前置驗證）：
1. 確認 Cloudflare Pages 有重新 deploy（push 後 1-2 分鐘）
2. 開 https://yutaifund.pages.dev/contact 用瀏覽器（建議 Chrome）填一筆 → 送出
3. 開 Chrome DevTools → Network tab → 看 POST 到 `formspree.io/f/mojrnyel` 那筆 → Payload 看 **Form Data** 區的 `name` 值
   - ✅ **正確 UTF-8**：`name: 王小明`（直接顯示中文）或 `name: %E7%8E%8B%E5%B0%8F%E6%98%8E`
   - ❌ **還是 Big5**：`name: %A4%FD%A4p%A9%FA`
4. 如果還是 Big5 → 告訴 Claude，需要更深入查（可能是 Astro build / Cloudflare 路徑 / 瀏覽器設定問題）
5. 如果改 UTF-8 了 → 進入 Step 1 建 Make.com scenario

---

### Step 1：把 Make.com Scenario 弄通

**狀態**：scenario 建到一半卡 filter 警告。建議**砍掉重建**（10 分鐘）比繼續鬥乾淨。

**做法**：
1. Make.com → 該 scenario → ⋯ → Delete
2. 從零開新 scenario，照 `docs/make-scenario-setup.md` 一步步建：
   - Module 1: Gmail Watch emails
   - Module 2: Text Parser Match pattern
   - Module 3: LINE → **Make an API Call**（用 raw HTTP，不要選舊的 Send Message，那個 LINE 改版被改掉）
3. LINE module 設定：
   - URL：`/v2/bot/message/push`
   - Method：POST
   - Body：照 `docs/make-scenario-setup.md` 第 6 點貼整段 Flex JSON
   - **記得把 JSON 裡的 `{{2.name}}` `{{2.phone}}` 等改成 Make.com 變數氣泡**（不能直接打字串）
4. 儲存 → 啟動 Scheduling

**LINE User ID 已寫好**：`U6ce01e50e5b7729f16865866711d52be`（直接複製）

### Step 2：解 Formspree spam 問題

**現象**：表單送出後，Formspree 後台收得到，但**通知信沒寄到一方圓 Gmail**。原因是 Formspree 自帶反垃圾過濾把測試訊息丟進 spam folder。

**做法**：
1. https://formspree.io/forms 登入 → `mojrnyel` form
2. 上方分頁 **Spam**
3. 看到測試訊息 → 勾選 → **Mark as not spam**
4. Formspree 會補寄通知信到一方圓 Gmail

**之後測試一定要用真實看起來的 email**（不要用 `test@example.com`，會被自動 spam）

### Step 3：端到端驗證（**Step 1+2 都通了再做**）

1. 開 https://yutaifund.pages.dev/contact
2. 填表單（用你個人 Gmail 當 email）→ 送出
3. 等 1-15 分鐘
4. 檢查鏈：
   - Formspree dashboard → Submissions 主 inbox 有看到嗎？（不是 spam）
   - 一方圓 Gmail 收件匣有通知信？
   - Make.com History 有跑成功？
   - 你個人 LINE 收到 Flex Message 卡片？

**全部 ✅ 才算 demo 階段第一條鏈通**。

### Step 4：上 OA 設定（30 分鐘）

照 `docs/line-oa-content.md` 複製貼上到 OA Manager：
- 加好友歡迎訊息 4 卡序列
- 關鍵字自動回應 10 條規則
- Rich Menu 6 格 action（其中 5 個 URL 改成 `yutaifund.pages.dev/xxx`，因為域名還沒綁）

### Step 5：Sanity Webhook → CF 自動 rebuild

讓客戶在 Sanity Publish 文章後，CF Pages 自動重建：

1. CF Pages → `yutaifund` project → Settings → Builds & deployments → **Deploy hooks**
2. Add deploy hook：name `sanity-publish-trigger`、branch `main` → 拿到 URL
3. Sanity Manage → API → Webhooks → Create webhook
4. Name `Trigger Cloudflare rebuild`、URL 貼 CF deploy hook、Trigger on Create/Update/Delete、Filter `_type in ["news","portfolio","insight"]`
5. 測試：去 Studio 改一篇文章 Publish → 2-3 分鐘看 CF Deployments 有新 build

詳細步驟在 `DEPLOY-CLOUDFLARE.md` § Step 4。

### Step 6（可選，明天可推可不推）

- **域名綁定**：鈺泰發如有買 `yutaifund.tw` → CF Pages → Custom domains 綁上去
- **更新 `src/lib/site.ts`**：`url` 從 `https://yutaifund.tw` 改成 `https://yutaifund.pages.dev`（影響 OG / Schema / sitemap）→ 等綁好域名再改回 yutaifund.tw

---

## 🐛 已知問題 / 踩雷紀錄

### Make.com Blueprint JSON Import 失敗
- 原因：Make.com 模組 ID 命名改版，舊 Blueprint 撈不回新 module
- 解法：放棄 Blueprint，改手動建 scenario（已寫教學）

### Formspree 反垃圾把測試訊息歸 spam
- 任何用 `@example.com` 之類的 email 會被自動 spam
- 解法：用真實 Email 測試 + Mark as not spam 補救

### CF Pages 部署設定 root directory
- 別填 `yutaifund_web_v1`（CF 找不到資料夾會 fail）
- **要留空**（git init 在 yutaifund_web_v1 跑，repo 根就是專案根）

### Sanity v4 升級踩雷
- `S.listItem()` 必須加 `.id()`，否則 Studio 報錯
- Astro `getStaticPaths` 對 Sanity 內容變動會頑固快取，dev 要 Ctrl+C 重啟
- v3→v4 升級中斷會壞 node_modules，要刪 `studio/node_modules` + `package-lock.json` 重裝

### LINE OA 圖文選單尺寸
- 大型版 = 2500×1686（每格 833×843，3×2）
- 緊湊版 = 2500×843
- **OA Manager 模板要選對**，不然圖片會被擠壓

---

## 📁 重要檔案地圖

```
yutaifund_web_v1/                    ← Git repo 根
├─ HANDOFF-禮拜二.md                  ← 你正在讀這份
├─ HANDOFF-禮拜一續.md                 ← 昨天的 handoff（已完成）
├─ MIGRATION-CHECKLIST.md             ← 客戶簽下後搬遷 SOP
├─ DEPLOY-CLOUDFLARE.md               ← CF Pages 部署教學
├─ SANITY_SETUP.md                    ← Sanity 初始設定
├─ README.md
├─ .env                               ← 環境變數（不進 git）
├─ .env.example                       ← 範本
├─ scripts/
│  └─ seed.mjs                        ← Sanity 種子腳本（已執行過）
├─ src/
│  ├─ lib/
│  │  ├─ site.ts                      ← ★ lineAddFriendUrl = lin.ee/yNHl4Wq
│  │  ├─ sanity.ts                    ← Sanity client + GROQ
│  │  └─ content.ts                   ← Sanity → 本機 fallback 統一資料層
│  ├─ data/                           ← 本機 demo 資料（fallback）
│  ├─ pages/
│  │  ├─ news/[slug].astro            ← 已用 getNewsBySlug
│  │  ├─ portfolio/[slug].astro       ← 已用 getPortfolioBySlug
│  │  ├─ insights/[slug].astro        ← 已用 getInsightBySlug
│  │  └─ contact.astro                ← Formspree form (mojrnyel)
│  └─ components/                     ← 6 處 LINE 連結都用 SITE.lineAddFriendUrl
├─ studio/                            ← Sanity v4 Studio
│  ├─ .env                            ← Studio PROJECT_ID
│  ├─ sanity.config.ts                ← v4 listItem 有 .id()
│  ├─ sanity.cli.ts                   ← studioHost: yutaifund, appId 已寫入
│  └─ schemas/                        ← news / portfolio / insight
└─ docs/
   ├─ rich-menu.png                   ← ★ 鈺泰發 OA 主視覺 PNG (2500×1686)
   ├─ rich-menu-mock.html             ← Rich Menu HTML 預覽版
   ├─ rich-menu-export.html           ← Rich Menu 純渲染版（Playwright 用）
   ├─ line-oa-content.md              ← ★ OA 全套文案（歡迎/關鍵字/Rich Menu）
   ├─ make-scenario-setup.md          ← ★ Make.com 手動設定教學
   └─ make-scenario-formspree-to-line.json  ← 舊 Blueprint（broken，留作參考）

D:/Users/Administrator/Downloads/Hank-agent/
├─ onedesign-line-oa/                 ← ★ 一方圓 OA 資產（不在 git repo）
│  ├─ rich-menu.png                   ← 一方圓 OA 圖文選單 PNG
│  ├─ rich-menu-mock.html
│  ├─ rich-menu-export.html
│  └─ onedesign-logo.png              ← 一方圓品牌 logo PNG
└─ yutaifund_web_v1/                  ← 鈺泰發專案（git repo）
```

---

## 🔑 機密 / 帳號清單（你密碼管理器存放）

**這些值不在 git、不在本機檔案**：
- LINE Channel Access Token（`pj522CN...` 開頭）
- LINE Channel Secret（`166fa3...` 開頭）
- Sanity Write Token（已撤銷，需要時再申請）
- 一方圓 Gmail 密碼

**這些值在 code / docs（非機密）**：
- LINE Channel ID `2010045833`
- LINE OA 短網址 `lin.ee/yNHl4Wq`
- Hank 個人 LINE User ID `U6ce01e50e5b7729f16865866711d52be`
- Sanity Project ID `ck8ic8jh`
- Formspree Form ID `mojrnyel`

---

## 🎯 給明天的我（or 給 Claude）

打開新對話時：
1. **先讀這份 `HANDOFF-禮拜二.md`**
2. **再讀 `CLAUDE.md`**（Hank 全域偏好）
3. 確認部署狀態：`curl -sI https://yutaifund.pages.dev`，應該 200 OK
4. 從上面「還沒收尾的事」Step 1 開始（Make.com Scenario）

**進度檢查清單**：
- [ ] Make.com scenario 重建完成 + Scheduling ON
- [ ] Formspree spam folder 清乾淨 + 設定 Notification email verified
- [ ] 端到端測試：填表單 → 收 Email → Make.com 抓 → LINE 卡片
- [ ] OA Manager：歡迎訊息 4 卡 + 10 條自動回應上
- [ ] LINE Rich Menu 6 格 action URL 改成 `pages.dev`
- [ ] Sanity webhook → CF 自動 rebuild 設好
- [ ] （可選）域名 yutaifund.tw 綁定

完整跑通後**鈺泰發 demo 可開放給業主看**：

> **客戶要看的 5 件事**：
> 1. 網站 https://yutaifund.pages.dev 各頁面
> 2. Sanity Studio 編輯體驗（https://yutaifund.sanity.studio 用一方圓帳號授權他暫時看）
> 3. LINE OA 加好友 → 歡迎訊息 → 圖文選單體驗
> 4. /contact 填表單 → 1-15 分鐘後 Hank LINE 收到通知（讓客戶現場看到 demo 效果）
> 5. 關鍵字自動回應（傳「諮詢」「電話」「礁溪」看自動回什麼）

---

## ⚠️ Demo 結束、客戶簽下後要做的事

照 `MIGRATION-CHECKLIST.md` 走完整 7 步驟：
1. Sanity transfer ownership 給鈺泰發
2. Formspree 在鈺泰發 Gmail 重建 form + 換 ID
3. LINE OA 在鈺泰發 LINE Business ID 重建（或 transfer）
4. Make.com 在鈺泰發 organization 重建 + 換 LINE/Gmail connection
5. GitHub repo transfer or 維持 collaborator
6. CF Pages 重新 link or 維持
7. 域名 yutaifund.tw 綁定

完成後刪除 `MIGRATION-CHECKLIST.md` + 從本機刪除 `onedesign-line-oa/`（一方圓相關物料）。
