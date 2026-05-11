# 鈺泰發網站 — 交付搬遷 SOP

> **用途**：當鈺泰發簽下並確認 demo 後，把目前一方圓測試帳號全部換成鈺泰發的帳號。
> **預估時間**：90 分鐘（含驗證）
> **執行人**：Hank（含協同客戶端動作）

---

## 搬遷前提（鈺泰發要先準備）

請鈺泰發提供：

| 項目 | 用途 | 形式 |
|------|------|------|
| 1. 一個鈺泰發用的 Google 帳號 | Sanity / Make.com / Cloudflare / GitHub 統一登入 | Email + 自己的密碼 |
| 2. LINE 公司 OA（如未建） | 客戶加好友、發訊息、Rich Menu | 已建好的 OA 或委由我們建 |
| 3. 鈺泰發指定的「LINE 通知接收人」 | Make.com 推播表單通知對象 | 那個人的 LINE 已加 OA 為好友 |
| 4. 域名（yutaifund.tw 或客戶想用的） | 正式上線網址 | 已購買或委由我們代購 |

---

## 第 1 步：Sanity（CMS）— 約 15 分鐘

**目前狀態**：professional 帳號為 `one20251103@gmail.com`，project `ck8ic8jh` (yutaifund-test)
**搬遷目標**：所有權轉到鈺泰發 Gmail

### 操作

1. 登入 https://www.sanity.io/manage → 選 `yutaifund-test` project
2. **Members → Invite member** → 輸入鈺泰發 Gmail → 角色選 **Administrator**
3. 鈺泰發那邊收到邀請信，點 Accept
4. 確認鈺泰發帳號變成 admin 之後：
   - **Settings → Project → Transfer ownership** → 選鈺泰發帳號
5. 鈺泰發接受 transfer 後：把 `one20251103@gmail.com` 從 Members 移除
6. （可選）把 project name 從 `yutaifund-test` 改成 `yutaifund`（避免「test」字眼）

### 不用改的東西

- `PUBLIC_SANITY_PROJECT_ID=ck8ic8jh` → **保持不變**，只是擁有者換人
- Studio URL `https://yutaifund.sanity.studio/` → **保持不變**

---

## 第 2 步：Formspree（表單）— 約 10 分鐘

**目前狀態**：表單收件信箱為一方圓 Gmail，Form ID `mojrnyel`
**搬遷目標**：用鈺泰發 Gmail 建新 form，換掉 Form ID

### 操作

1. 鈺泰發 Gmail 註冊 https://formspree.io
2. **+ New Form** → name 填「鈺泰發官網聯絡表單」
3. 收件信箱填鈺泰發指定 Email（業務窗口）
4. 拿到新 Form ID（類似 `xyabc123`）
5. 編輯 `.env`：
   ```diff
   - PUBLIC_FORMSPREE_FORM_ID=mojrnyel
   + PUBLIC_FORMSPREE_FORM_ID=新的_form_id
   ```
6. 跑 `npm run build` → push GitHub → CF Pages 自動重 deploy
7. 上線後測試填一次表單，確認鈺泰發 Email 收到

---

## 第 3 步：LINE OA — 約 20 分鐘

**目前狀態**：`lineAddFriendUrl: 'https://lin.ee/rpAl9J4'`（一方圓 OA）
**搬遷目標**：換成鈺泰發 OA 的 lin.ee 短網址

### 操作

1. 鈺泰發 OA 後台（manager.line.biz）→ **設定 → 加入好友指南**
2. 複製鈺泰發 OA 的 `lin.ee/xxxxx` 短網址
3. 編輯 `src/lib/site.ts`：
   ```diff
   - lineAddFriendUrl: 'https://lin.ee/rpAl9J4',  // 一方圓 OA 測試用
   + lineAddFriendUrl: 'https://lin.ee/xxxxx',    // 鈺泰發 OA 正式
   ```
4. 同時把鈺泰發 OA 的：
   - Channel Access Token
   - Channel Secret
   - Channel ID
   準備好（給 Step 5 Make.com 用）

### Rich Menu 同步搬遷

1. 把 `docs/rich-menu-mock.html` 截圖好的 PNG 上傳到鈺泰發 OA → Rich Menu
2. 6 格 action 重新設定一次（複製一方圓 OA 的 6 個 URL，貼到鈺泰發 OA 對應格）
3. 加好友歡迎訊息：複製 `docs/line-oa-content.md` 的歡迎訊息到鈺泰發 OA
4. 關鍵字自動回應：同樣複製過去

---

## 第 4 步：Make.com（自動化）— 約 20 分鐘

**目前狀態**：scenario 跑在一方圓 Gmail 註冊的 Make.com organization
**搬遷目標**：在鈺泰發 Gmail 註冊新 organization，重建同樣的 scenario

### 操作

1. 鈺泰發 Gmail 註冊 Make.com → 建 organization「鈺泰發行銷」
2. 進新 organization → **+ Create scenario**
3. 從一方圓帳號這邊：
   - 進到原 scenario → 右下 **... → Export Blueprint** → 下載 JSON
4. 切到鈺泰發帳號的新 organization → 新 scenario → **... → Import Blueprint** → 上傳 JSON
5. 重設 Gmail / LINE 連線：
   - Gmail 模組：登入鈺泰發 Gmail（收 Formspree 通知信的那個）
   - LINE 模組：填入鈺泰發 OA 的 Channel Access Token
   - 接收人 User ID：換成鈺泰發指定通知人的 User ID
6. **啟用 scenario**（左下角開關）
7. 把一方圓那邊的 scenario **停用**（不要刪，留作備份 1 個月後再砍）

---

## 第 5 步：Cloudflare Pages + GitHub — 約 25 分鐘

**目前狀態**：repo 在 Hank GitHub 帳號 / CF Pages 在一方圓 Gmail 帳號
**搬遷目標**：repo 在鈺泰發 GitHub Org（或仍由我們託管，看合約）/ CF Pages 在鈺泰發帳號

### 路徑 A：完全移交給客戶（適合鈺泰發內部有 IT）

1. **GitHub Repo Transfer**：
   - 一方圓 GitHub → repo Settings → Transfer ownership → 鈺泰發指定的 GitHub 帳號 / Org
   - 鈺泰發那邊 Accept

2. **Cloudflare Pages**：
   - 鈺泰發 Gmail 註冊 Cloudflare
   - 連接他們的 GitHub → 選 `yutaifund-web` repo
   - Build command: `npm run build`
   - Output: `dist`
   - Root directory: `yutaifund_web_v1`
   - 環境變數（從一方圓 CF 後台複製貼過去）：
     - `PUBLIC_SANITY_PROJECT_ID=ck8ic8jh`
     - `PUBLIC_SANITY_DATASET=production`
     - `PUBLIC_SANITY_API_VERSION=2025-01-01`
     - `PUBLIC_FORMSPREE_FORM_ID=新的_form_id`（已在第 2 步換）
     - `PUBLIC_GTM_ID=新的_GTM_ID`（如鈺泰發要自己的 GA）
   - 第一次部署成功後，把一方圓 CF Pages 的同個 project 刪除

3. **Sanity Webhook**：
   - Sanity Studio → Settings → API → Webhooks → 編輯既有 webhook
   - URL 改成鈺泰發 CF Pages 的 Deploy Hook（在 CF Pages → Settings → Builds & Deployments → Deploy Hooks 取得）

### 路徑 B：我們繼續託管（適合客戶不想管 IT）

- 維持 repo / CF / Make.com 在一方圓帳號
- 但 Sanity / Formspree / LINE OA 的「擁有權」一定要轉給鈺泰發（這些是內容跟客戶資料）
- 寫進維運合約：每月 $XX 月費包含主機 / 部署 / Bug 修

---

## 第 6 步：域名 — 約 10 分鐘

**目前狀態**：使用 CF Pages 預設 `yutaifund-web.pages.dev`
**搬遷目標**：綁鈺泰發正式域名（如 yutaifund.tw）

### 操作

1. 確認域名擁有者：是鈺泰發已購、還是我們代購？
2. CF Pages → 該 project → **Custom domains → Set up a custom domain**
3. 輸入 `yutaifund.tw`（含 www.yutaifund.tw 一起設）
4. CF 會給 DNS 設定（CNAME 或 A record）
5. **如果域名 nameserver 在 CF**：自動加 record，30 秒內生效
6. **如果在別家（hinet / 中華電信）**：把 nameserver 改成 CF 的 2 個 NS（生效需 24 小時）
7. SSL 證書 CF 自動申請（Let's Encrypt 免費）

---

## 第 7 步：移除一方圓的標記 — 約 5 分鐘

最後一步，確認整站完全去除「一方圓」痕跡：

```bash
# 在專案根目錄搜尋
grep -rni "一方圓\|onedesign\|lin.ee/rpAl9J4\|one20251103" --include="*.ts" --include="*.tsx" --include="*.astro" --include="*.json" --include="*.md" .
```

預期只剩 `MIGRATION-CHECKLIST.md`（這份檔案本身會被刪除，列在最後）跟 git history 裡的記錄（可接受，因為 commit author 仍可看到）。

---

## 搬遷後驗證清單

按順序做完一次：

- [ ] 開新分頁去 https://yutaifund.tw（或 pages.dev 預覽網址）
- [ ] 確認所有頁面打開都正常（首頁、最新消息、案例、買房指南、聯絡）
- [ ] 點任一 LINE 按鈕 → 跳到**鈺泰發 OA** 加好友頁（不是一方圓）
- [ ] 加好友後收到鈺泰發的歡迎訊息
- [ ] 看到鈺泰發的 Rich Menu，點任一格能正確跳網頁
- [ ] 傳「諮詢」「電話」「地址」等關鍵字 → 收到對應自動回應
- [ ] 在網站填一次聯絡表單 → 鈺泰發 Email 收到信
- [ ] 在網站填一次聯絡表單 → 鈺泰發指定通知人 LINE 收到 Make.com push
- [ ] 在 Sanity Studio 改一篇文章 Publish → 2-3 分鐘後網站上看到更新

全部 ✅ → 搬遷完成 → 刪除這份 `MIGRATION-CHECKLIST.md`

---

## 移交給鈺泰發的「鑰匙包」（請列印或加密 PDF）

| 項目 | 帳號 | 密碼存放 |
|------|------|----------|
| Sanity Studio | 鈺泰發 Gmail | 鈺泰發自管 |
| Make.com | 鈺泰發 Gmail | 鈺泰發自管 |
| Cloudflare | 鈺泰發 Gmail | 鈺泰發自管 |
| GitHub Repo | 鈺泰發指定帳號 / Org | 鈺泰發自管 |
| LINE Channel Token / Secret | LINE Developers Console（用建 OA 的 LINE 帳號登入） | 鈺泰發自管 |
| Formspree | 鈺泰發 Gmail | 鈺泰發自管 |
| GA4 / GTM | 鈺泰發 Gmail | 鈺泰發自管 |

> **告知鈺泰發**：我們**完全不持有任何鈺泰發帳號密碼**。任何帳號異常（忘記密碼、被盜）請走各服務的原廠救援流程。

---

## 給接案後維運的合約備註

如果鈺泰發跟一方圓簽月費維運合約：

- 我們**保留 GitHub repo 的 collaborator 權限**（不是 owner）→ 才能改 code
- 我們**保留 Cloudflare Pages 部署權限**（Member 角色）→ 才能 deploy
- 其他帳號（Sanity / Make.com / LINE）由鈺泰發自行內容更新，我們只在「需技術介入時」用臨時邀請進去

這條也要寫進維運合約。
