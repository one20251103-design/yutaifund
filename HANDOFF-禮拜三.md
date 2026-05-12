# 鈺泰發網站 — 禮拜三（2026-05-13）會議日 + 後續決策

**最後更新**：2026-05-12（週二傍晚）
**專案路徑**：`D:\Users\Administrator\Downloads\Hank-agent\yutaifund_web_v1`
**狀態**：技術 demo 全部就位，明早會議簡報資料齊備

---

## 🎯 今天會議結束就能知道接下來怎麼走

明天會議在跟誰開、聊什麼，handoff 給未來自己／Claude 的速覽——技術全部做完了，**剩下都是商務決策**。

---

## 📊 目前 Demo 狀態（會議現場可開的）

| 項目 | URL / 路徑 | 狀態 |
|------|----------|------|
| **正式網站** | https://yutaifund.pages.dev | ✅ 200 OK，所有 20 個路由活著 |
| **Sanity Studio**（編輯後台） | https://yutaifund.sanity.studio/ | ✅ 11 筆 demo 內容已 seed |
| **LINE OA**（測試版） | https://lin.ee/yNHl4Wq | ✅ 歡迎訊息 4 卡 + 關鍵字 10 條 + Rich Menu 已上 |
| **Make.com 自動化** | scenario 已啟用、每 2 小時 polling | ✅ 三模組全綠勾，Hank 個人 LINE 真實收到 Flex 卡片 |
| **Sanity → CF Webhook** | Sanity 端 webhook + CF deploy hook 設定完成 | ✅ Publish 文章後 2-3 分鐘 CF 自動重 build |
| **GitHub Repo** | https://github.com/one20251103-design/yutaifund | ✅ 最新 commit `c383c0e` 已推 |
| **會議用漏斗 Demo** | `docs/funnel-demo.html`（雙擊在瀏覽器開）| ✅ Google vs Meta 並排對照 + ROI 表 |

---

## ✅ 2026-05-12 全日完成清單

| 時段 | 內容 |
|------|------|
| 上午 | Big5 → UTF-8 表單編碼 bug 修正、鈺泰發電話地址全專案校正、Make.com regex 升級 6 欄位、git push 權限規則設好 |
| 中午 | Make.com scenario 砍重建跑通（Gmail→Text Parser→LINE），end-to-end Hank 真實收到 LINE 卡片 |
| 下午 | OA 設定完成（歡迎訊息+10 關鍵字+Rich Menu 6 格）、Sanity Webhook→CF 自動 rebuild 設好、Rich Menu B 格改「建案精選」對齊網站 NAV |
| 傍晚 | 概念釐清（程式碼/內容分離架構、WP/Astro/Next.js 光譜、LINE Developers vs OA Manager、UTM 廣告追蹤、購物車/會員 Astro 上限）+ 製作 `funnel-demo.html` 給明天會議 |

---

## 🌅 2026-05-13 上午會議準備（會議前 30 分鐘做完）

### 開會前清單

- [ ] 瀏覽器開好 5 個 tab 待 demo：
  1. https://yutaifund.pages.dev（首頁）
  2. https://yutaifund.pages.dev/portfolio（建案精選 = 你今天剛改的名稱）
  3. https://yutaifund.sanity.studio/（編輯後台）
  4. `file:///D:/Users/Administrator/Downloads/Hank-agent/yutaifund_web_v1/docs/funnel-demo.html`（漏斗 demo）
  5. https://manager.line.biz/account/@yourOA/（OA 後台）
- [ ] LINE App 開好 OA chat 視窗（demo 加好友 + Rich Menu 體驗用）
- [ ] 自己手機準備好填表單（demo 「填表單 → LINE 收到通知」即時效果）
- [ ] `curl -sI https://yutaifund.pages.dev` 跑一次驗證部署活著

### 會議 demo 黃金順序（每段 3-5 分鐘）

1. **網站走訪**（首頁 → portfolio → news → contact）
2. **Sanity Studio 編輯體驗**（隨手改一篇 news 標題 → Publish）
3. **LINE OA 加好友**（請業主拿手機掃 lin.ee/yNHl4Wq）→ 看歡迎訊息 4 卡 → 試關鍵字「礁溪」「諮詢」→ 試 Rich Menu 6 格
4. **填表單真實 demo**（你或業主用手機填一筆 → 2 分鐘內你 LINE 收到 Flex 卡片，現場給業主看）
5. **打開 `funnel-demo.html`** → 講廣告投放數據可視化的能力 → 釣未來月費服務

### 口袋金句（直接套用）

> 1. 「程式碼進 GitHub、內容進 Sanity，部署平台 build 時把兩者合體。客戶日後改文字不會卡在我這。」
> 2. 「我們會幫你裝整套廣告轉換追蹤，從廣告點擊到簽約每一站數字都看得到，每筆簽約成本算得出來。」
> 3. 「Looker Studio 儀表板讓老闆一個畫面看全部 channel，不用切 Google / Meta / GA 三邊。」
> 4. 「LINE OA 用 Make.com 串自動化，客戶填表單 → 業務 LINE 秒收卡片，不會漏單。」
> 5. 「這次幫你做的是地基。未來案場累積到一定量、客戶量起來，可以再加會員系統、物件搜尋、AI 助理那類進階功能，那階段就會討論升級服務的月費方案。」

---

## 🔀 會議結束的三個分支

### 分支 A：業主超滿意 → 簽下

走 `MIGRATION-CHECKLIST.md` 7 步驟搬遷（早上規劃好的）：
1. Sanity transfer ownership 給鈺泰發
2. Formspree 在鈺泰發 Gmail 重建 form + 換 ID
3. LINE OA 在鈺泰發 LINE Business ID 重建（或 transfer）
4. Make.com 在鈺泰發 organization 重建 + 換 LINE/Gmail connection
5. GitHub repo transfer or 維持 collaborator
6. CF Pages 重新 link or 維持
7. 域名 yutaifund.tw 綁定

搬完刪除 `MIGRATION-CHECKLIST.md` + 從本機刪除 `onedesign-line-oa/`（一方圓相關物料）。

### 分支 B：業主覺得不錯但要看效果 → 維持免費階段繼續養

可選擇性投入 6-7 小時做「短期工具」加值：
- ✅ Clarity 熱力圖（10 分鐘）
- ✅ 貸款試算機（3 小時）
- ✅ 投報率計算器（3 小時，可與貸款試算同頁）
- ✅ Calendly 預約看屋（1.5 小時）

合計約 7.5 小時 = 1 個工作天。做完網站從「靜態名片」升級成「業務工具」。

實作細節參考下方「**短期工具實作 step-by-step**」區塊。

### 分支 C：業主有特定疑問 / 加值需求

對照下方「**會議常見問題口袋答案**」區塊。

---

## 🛠 短期工具實作 step-by-step（如果走分支 B）

### 1. Microsoft Clarity 熱力圖（10 分鐘）

1. https://clarity.microsoft.com/ 用 Google / Microsoft 帳號註冊
2. + New Project → 填 name `Yutaifund`、website `https://yutaifund.pages.dev`、category `Real Estate`
3. 拿到 tracking code（一段 JS）
4. 進你的 GTM (GTM-MDVQWDH8)：
   - Tags → New → Custom HTML → 貼整段 Clarity script
   - Trigger: All Pages
   - Save → Submit
5. 等 24 小時 → Clarity 後台會看到資料

### 2. 貸款試算機 + 投報率計算器（6 小時，一頁兩功能）

新增頁面 `src/pages/tools.astro`，含：
- 房貸月付試算 component（React island）
- 投報率試算 component（React island）

技術重點：
- 用 React island（Astro 預設 partial hydration）
- 房貸公式：`月付 = P × r × (1+r)^n / ((1+r)^n - 1)` 其中 P=本金、r=月利率、n=月數
- 投報率公式：`年化報酬率 = (年租金 - 年持有成本) / 投資金額`
- UI 用既有 Tailwind utility classes 保持品牌色一致

完成後加 NAV 一個「實用工具」項目，路徑 `/tools`。

### 3. Calendly 預約看屋（1.5 小時）

1. https://calendly.com/ 註冊（用 one20251103@gmail.com）
2. New Event Type → 「預約看屋」、時長 60 分鐘、location `Phone call` 或 `Custom location`
3. Embed → Inline / Pop-up Widget → copy script
4. 開 `src/pages/contact.astro` → 在底部 service section 後加 `<div id="calendly-embed"></div>` + Calendly script
5. 串 Make.com webhook（可選）：Calendly Event Type → Booking 完成時 → 推 LINE 通知 Hank

---

## ❓ 會議常見問題口袋答案

| 業主問 | 你答 |
|-------|------|
| 「能不能改用 WordPress？」 | 「可以但不建議。WP 是被駭最多的 CMS、要 VPS 主機每月 NT$ 300+、速度慢，而我們現在的 Astro 是業界 JAMstack 主流，SEO + 速度都最好。WP 比較適合需要海量 plugin 的電商或論壇。」 |
| 「能不能做廣告效益 dashboard？」 | 「可以，Looker Studio 一鍵連 Google Ads + GA4，FB 那邊也能整合，老闆一個畫面看完所有 channel。月費約 NT$ 1,980。」 |
| 「能不能追蹤廣告點進來真的有送表單？」 | 「100% 可以，每支廣告 URL 加 UTM 參數，GA4 自動分流，從廣告點擊到簽約每一站數字都有。」（打開 funnel-demo.html）|
| 「能不能做會員 / 物件搜尋？」 | 「可以，但這是 L3 等級，需要切到 Next.js + 後端資料庫，初期投入較高（4-6 週）。建議等物件量累積到 50+、客戶量大時再做。」 |
| 「能不能加 AI chatbot？」 | 「可以，接 Claude / OpenAI API，月費約 NT$ 5,000+（含 API 費 + 維護）。MVP 一週可做。」 |
| 「VR 看屋呢？」 | 「技術上 30 分鐘嵌入，但要先有實際完工案場讓我們拍。每個案場拍攝費 NT$ 3-5 萬。」 |

---

## ⚠️ 仍懸而未決 / 自己確認

- [ ] **Rich Menu PNG 上傳到 OA Manager 了嗎？**（你今天才重新匯出含「建案精選」字樣的新版 PNG，記得到 OA Manager → 圖文選單 → 換上 `docs/rich-menu.png`）
- [ ] **Quick Reply 路徑 A 文字版有套用嗎？**（在 OA Manager 自動回應規則 1 改成 4 個選項的引導文案，會議現場 demo 用）
- [ ] **Sanity webhook 真的測試過 Publish → Build 嗎？**（去 Studio 隨便改一篇文章 Publish → 等 2-3 分鐘看 CF Deployments 有沒有新 build）
- [ ] **個人 LINE 收到的卡片電話按鈕「直接撥打」會撥到 `tel:0912345678`**（如果業主用真實電話填會撥真，自己注意）

---

## 📁 重要檔案地圖（更新版）

```
yutaifund_web_v1/                          ← Git repo 根
├─ HANDOFF-禮拜三.md                       ← 你正在讀這份（明天起手檔）
├─ HANDOFF-禮拜二.md                       ← 昨天的記錄（已 archived，不用再讀）
├─ MIGRATION-CHECKLIST.md                  ← 客戶簽下後搬遷 SOP
├─ DEPLOY-CLOUDFLARE.md                    ← CF Pages 部署教學
├─ SANITY_SETUP.md                         ← Sanity 初始設定
├─ src/                                    ← 程式碼（架構 metaphor 的「食譜書」）
├─ studio/                                 ← Sanity v4 Studio
└─ docs/
   ├─ rich-menu.png                        ← ★ 鈺泰發 OA 主視覺（含建案精選）
   ├─ rich-menu-export.html                ← Rich Menu 純渲染版（Playwright/Chrome 截圖用）
   ├─ rich-menu-mock.html                  ← Rich Menu HTML 預覽版
   ├─ line-oa-content.md                   ← ★ OA 全套文案（建案精選對齊網站 NAV）
   ├─ make-scenario-setup.md               ← ★ Make.com 手動設定教學（已實證版）
   ├─ funnel-demo.html                     ← ★ 廣告投放轉換漏斗 demo（會議用）
   └─ make-scenario-formspree-to-line.json ← 舊 Blueprint，broken 留作參考
```

---

## 🎬 明天會議結束後

不論走哪個分支，**結束後告訴 Claude 結果**，會接著決定：
- 分支 A → 啟動 MIGRATION-CHECKLIST 搬遷
- 分支 B → 啟動短期工具實作（Clarity + 計算機 + Calendly）
- 分支 C → 針對業主疑問回應 / 加碼 demo

祝會議順利。
