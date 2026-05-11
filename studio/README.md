# 鈺泰發行銷 Sanity CMS Studio

這是鈺泰發行銷官網的後台 CMS，讓團隊自行更新最新消息、案例與買房指南。

## 第一次設定

```bash
cd studio
npm install
npx sanity init --env
```

按照提示：
1. 登入 Sanity（用 Google 帳號）
2. 建立新 project（取名 `yutaifund`）
3. 選 dataset：`production`

完成後會在 `studio/` 產生 `.env`，把其中的 `SANITY_STUDIO_PROJECT_ID` 與 `SANITY_STUDIO_DATASET` 同步到上層的 `yutaifund_web/.env`：

```env
PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
PUBLIC_SANITY_DATASET=production
```

## 啟動 Studio

```bash
cd studio
npm run dev
```

開 http://localhost:3333 開始編輯內容。

## 部署 Studio 到 Sanity 雲端

```bash
npm run deploy
```

部署後會得到 `https://yutaifund.sanity.studio/`，這是業主團隊登入編輯的網址。

## 三個內容類型

| Schema | 用途 | 對應網站路徑 |
|--------|------|--------------|
| **news** | 最新消息 | `/news` & `/news/[slug]` |
| **portfolio** | 作品案例 | `/portfolio` & `/portfolio/[slug]` |
| **insight** | 買房指南 | `/insights` & `/insights/[slug]` |

## Webhook 自動 rebuild

Studio Publish 後自動觸發網站 rebuild：

1. Cloudflare Pages → Settings → Builds & deployments → Deploy hooks
2. 建立 hook，複製 URL
3. Sanity Manage → API → Webhooks → Create
4. URL 貼上、觸發條件設 `_type in ["news", "portfolio", "insight"]`
5. Trigger on: Create / Update / Delete

完成後業主在 Studio 按 Publish，2-3 分鐘後網站自動更新。
