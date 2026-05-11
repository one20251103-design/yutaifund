# 鈺泰發行銷官網（yutaifund_web）

**技術棧**：Astro 5 + React 19 + Tailwind CSS 4 + Framer Motion + Sanity CMS
**部署**：Cloudflare Pages（純靜態，永久免費，商用 OK）
**月費**：全 0 元（所有服務免費版）
**狀態**：v1 雛形完成（2026-05-06）

---

## 第一次啟動

```bash
cd yutaifund_web
npm install
npm run dev
```

開 http://localhost:4321 即可預覽（環境變數未設定時，Sanity 顯示佔位資料，網站功能完整）。

## 環境變數設定

```bash
cp .env.example .env
# 編輯 .env 填入以下資訊（用客戶 Gmail 申請）：
# - PUBLIC_SANITY_PROJECT_ID（從 Sanity 後台取得）
# - PUBLIC_FORMSPREE_FORM_ID（從 Formspree 後台取得）
# - PUBLIC_LINE_OA_ID（@yutaifund 或實際 LINE OA ID）
# - PUBLIC_GTM_ID（從 GTM 後台取得，可選）
```

---

## 專案結構

```
yutaifund_web/
├─ src/
│  ├─ components/
│  │  ├─ Header.astro          # 導覽列（sticky + 毛玻璃）
│  │  ├─ Logo.astro            # SVG 標誌（金色 Y）
│  │  ├─ MobileMenu.tsx        # 手機漢堡選單（全螢幕）
│  │  ├─ Footer.astro          # 頁尾（三欄極簡）
│  │  ├─ SpotlightCursor.tsx   # 桌面游標（含 Hover Reveal）
│  │  ├─ SpeedDial.tsx         # 手機 Speed Dial（LINE 主 + 3 副）
│  │  ├─ CookieConsent.tsx     # Cookie 同意 banner（Consent Mode v2）
│  │  ├─ LineShareButton.tsx   # LINE 分享
│  │  ├─ StructuredData.astro  # Schema.org JSON-LD
│  │  ├─ ProjectCard.astro     # 建案卡片
│  │  ├─ ArticleCard.astro     # 文章卡片
│  │  └─ PortfolioTabs.tsx     # 案例分類 Tabs（預留）
│  ├─ data/
│  │  ├─ projects.ts           # 6 個示範建案（Concept Study）
│  │  ├─ insights.ts           # 3 篇示範買房指南
│  │  └─ news.ts               # 2 則示範消息
│  ├─ layouts/
│  │  └─ BaseLayout.astro      # 共用 head + GTM + ClientRouter + Schema
│  ├─ lib/
│  │  ├─ site.ts               # 網站常數
│  │  └─ sanity.ts             # Sanity client + GROQ queries
│  ├─ pages/
│  │  ├─ index.astro           # 首頁
│  │  ├─ about.astro           # 關於我們
│  │  ├─ services.astro        # 專業服務（含 6 步流程）
│  │  ├─ portfolio.astro       # 案例列表
│  │  ├─ portfolio/[slug].astro # 案例詳細
│  │  ├─ insights/index.astro  # 買房指南列表
│  │  ├─ insights/[slug].astro # 文章詳細
│  │  ├─ news/index.astro      # 最新消息列表
│  │  ├─ news/[slug].astro     # 消息詳細
│  │  ├─ contact.astro         # 聯絡（Formspree + Map + LINE）
│  │  ├─ privacy.astro         # 隱私權政策
│  │  └─ terms.astro           # 使用條款
│  └─ styles/global.css        # Tailwind 4 + 品牌色系統
├─ studio/                     # Sanity CMS 子專案
│  ├─ schemas/                 # news / portfolio / insight
│  ├─ sanity.config.ts
│  └─ package.json
├─ public/
│  ├─ favicon.svg              # 金色 Y 標誌
│  ├─ _headers                 # CF Pages 安全標頭
│  └─ robots.txt
├─ astro.config.mjs
├─ package.json
└─ .env.example
```

---

## 設計系統

### 品牌色（CSS 變數）
- `--color-gold-400` `#C8A765`：主色（logo 金）
- `--color-cream-100` `#FBF9F4`：背景奶油白
- `--color-ink-900` `#1A1A1A`：深碳灰文字

### 字體
- 中文：Noto Sans TC（300 / 400 / 500 / 700）
- 英文 / display：Cormorant Garamond
- 從 Google Fonts CDN 載入

### 互動
- **桌面**：SpotlightCursor 金色光暈 + Hover Reveal（在 portfolio cards 上 hover 顯示「查看建案」）
- **手機**：Speed Dial（LINE 主按鈕呼吸燈 + 「+」展開電話 / FB / 表單）
- **頁面切換**：Astro `<ClientRouter />` View Transitions（CSS-based 絲滑過場）

---

## 圖片來源

目前所有示範圖片皆使用 [Unsplash](https://unsplash.com) 免費商用授權。客戶實際案場照片由業主提供後替換（或上傳到 Sanity Studio）。

---

## SEO

- ✅ Schema.org：RealEstateAgent + WebSite + BreadcrumbList + Article + RealEstateListing
- ✅ Open Graph + Twitter Card metadata
- ✅ canonical URL
- ✅ sitemap-index.xml（自動產生）
- ✅ robots.txt
- ✅ Cookie Consent Mode v2（GDPR 友好）

---

## 部署到 Cloudflare Pages

### 1. 推上 GitHub
建立 repo（用客戶 Gmail），push 全部程式碼。

### 2. 連結 Cloudflare Pages
1. Cloudflare Dashboard → Workers & Pages → Create
2. 連結 GitHub repo
3. **Build command**：`npm run build`
4. **Build output**：`dist`
5. **Root directory**：`yutaifund_web`（如果 repo 根目錄不是專案）
6. Environment variables：填入 `.env` 的所有 `PUBLIC_*` 變數

部署完成後拿到 `https://yutaifund.pages.dev`，再串自己的 domain。

### 3. Sanity Studio 部署

```bash
cd studio
npm install
npx sanity init  # 第一次跑用客戶 Gmail 登入建立 project
npm run deploy   # 部署到 https://yutaifund.sanity.studio/
```

### 4. Webhook 自動更新

1. CF Pages → Settings → Builds & deployments → Deploy hooks → Create
2. Sanity Manage → API → Webhooks → 新增 → 貼上 hook URL
3. Trigger 條件：`_type in ["news", "portfolio", "insight"]`

完成後業主在 Sanity Studio 按 Publish，2-3 分鐘網站自動更新。

---

## 鈺泰發專屬交付清單（11 個帳號全用業主 Gmail）

1. Gmail 帳號（總控）
2. Domain registrar（Cloudflare / Gandi / GoDaddy）
3. Cloudflare 帳號（DNS + Pages）
4. GitHub 帳號（程式碼 repo）
5. Sanity 帳號（CMS 後台）
6. Formspree 帳號（表單服務）
7. Make.com 帳號（LINE webhook 自動化）
8. LINE OA 後台
9. Google Analytics + GTM
10. Google Search Console
11. Google Business Profile

每個帳號都應建在客戶 Gmail 名下，交付後 Hank 從每個服務的 collaborator 移除自己。

---

## 待業主補充

- [ ] 客戶 Gmail 帳號 + 各服務 ID 填入 .env
- [ ] 真實案場照片上傳到 Sanity Studio
- [ ] LINE OA 圖文選單設計（規格 2500×843）
- [ ] Google Business Profile 建立
- [ ] OG 預覽圖（用實際建案照片）

---

## 後續優化（可選）

- 圖片轉為 Sanity 託管（自動 webp 壓縮）
- 表單收件改 LINE Notify webhook 即時通知
- LIFF 整合（LINE 內嵌 mini app）
- Looker Studio 數據儀表板

---

*本網站為一方圓設計交付鈺泰發行銷有限公司之免費人情案，2026-05-06 完成 v1 雛形。*
