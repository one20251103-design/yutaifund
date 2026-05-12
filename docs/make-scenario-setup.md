# Make.com Scenario 手動設定教學

> **目的**：客戶填鈺泰發官網表單 → 你個人 LINE 收到通知卡片
> **架構**：Formspree → Gmail → Make.com → LINE Push
> **預估時間**：15-20 分鐘
> **前置**：一方圓 Gmail 已註冊 Make.com、鈺泰發 OA Channel Access Token 已準備好

> 💡 上一版 Blueprint JSON (`make-scenario-formspree-to-line.json`) 因 Make.com 模組 ID 改版而 import 失敗，**廢棄不用**。改照這份手動設定。

---

## 架構說明

```
客戶填鈺泰發 /contact 表單
  ↓
Formspree 寄通知信到 one20251103@gmail.com
  ↓
Make.com Gmail 模組（每 15 分鐘輪詢一次）
  ↓
Text Parser 用 regex 抽姓名 / 電話 / Email / 留言
  ↓
LINE Send Message 推 Flex Message 卡片到 Hank 個人 LINE
```

⚠️ **延遲約 1-15 分鐘**（Gmail 模組輪詢頻率）。這對「業務收新客戶通知」完全可接受。

---

## Step 1：建立新 Scenario（1 分鐘）

1. 登入 https://make.com（一方圓 Gmail）
2. 左側選單 **Scenarios** → 右上角 **+ Create a new scenario**
3. 進到空白編輯器，正中央會看到一個大圓圈「+」

---

## Step 2：加 Gmail 觸發器（5 分鐘）

1. 點正中央那個 **+ 圓圈** → 跳出 app 搜尋框
2. 搜尋 `Gmail` → 點選**藍紅紅 Gmail 圖示**（不要選錯 Google Apps Script 之類）
3. 在 actions 列表選 **Watch emails**
4. 點 **Create a connection**：
   - Connection name: `一方圓 Gmail`
   - 點 Save → 跳出 Google OAuth 視窗 → 用一方圓 Gmail 授權（勾全部權限）
5. 設定 Watch emails 參數：
   | 欄位 | 值 |
   |------|---|
   | Folder | `INBOX` |
   | Criteria | `Only unread mails` |
   | Sender email | `noreply@formspree.io` ← **務必填，否則所有信件都觸發暴噴 ops** |
   | Subject | （留空，或填 `New form submission` 雙重保險） |
   | Max number of results | `5` |
   | Mark message as | `Read`（處理完標已讀，避免重複觸發） |
6. 點 **OK**

> ⚠️ **務必設 Sender email 過濾**：沒設 Sender 的話，Gmail Watch 會把信箱裡所有未讀信當 trigger 跑（垃圾信、廣告信、Google 通知信全部觸發 Text Parser → 每封都耗 ops）。設了 `noreply@formspree.io` 後 Gmail Watch 只會關心 Formspree 信，浪費的 downstream ops 降到 0。
>
> ⚠️ **但 polling 本身還是消耗 ops**：Gmail Watch 模組每次 polling 觸發 = 1 op（不論有沒有抓到信）。Free plan 1,000 ops/月限制下，**polling 間隔請設 120 分鐘以上**（詳情見文件末尾「ops 用量估算」）。
>
> 💡 **進階潔癖**：在 Gmail webmail 設 filter「from:noreply@formspree.io → 加標籤 `Formspree`」，然後 Make.com Watch emails 改抓 `Label: Formspree` 而不是 `INBOX`，視覺上更乾淨（但不影響 ops 數）。

---

## Step 3：加 Text Parser（5 分鐘）

1. 點 Gmail 模組右邊的 **+** 半圓圈 → 跳出 app 搜尋框
2. 搜尋 `Text Parser`（在 **Tools** 分類下）→ 點選 **Match pattern**
3. 設定參數：

   | 欄位 | 值 |
   |------|---|
   | Pattern | （見下方 regex） |
   | Global match | 關 |
   | Case insensitive | 開 |
   | Multiline | 開 |
   | Match all matches | 關 |
   | Text | 點欄位 → 從上方氣泡式變數選單選 **Gmail → Text content** |

   **Pattern**（複製整段，貼到 Pattern 欄）：
   ```
   name:\s*(?<name>[^\r\n]+)[\s\S]*?phone:\s*(?<phone>[^\r\n]+)(?:[\s\S]*?email:\s*(?<email>[^\r\n]*))?(?:[\s\S]*?inquiry_type:\s*(?<inquiry_type>[^\r\n]*))?(?:[\s\S]*?location:\s*(?<location>[^\r\n]*))?(?:[\s\S]*?message:\s*(?<message>[\s\S]*?))?(?:\n\s*Submitted\s|\n\s*--|\n\s*Sent from|$)
   ```

   **設計邏輯**：
   - 表單只有 `name` + `phone` 是 required，其餘 4 個（email / inquiry_type / location / message）都選填。regex 對齊這點，只把 name + phone 設為必抓，其他都用 `(?:...)?` 包成 optional 群組
   - Formspree 通知信用「label 自己一行、value 在下一行」格式（不是 `name: 王小明` 同一行），`\s*` 會吃 label 後面的 `\n` 銜接到 value 行，已驗證過實際信件可抓到
   - 停止 anchor 用 `\n\s*Submitted\s` 抓 Formspree 信件結尾「Submitted MM/DD 時間」那行，避免 message 把時間戳也吃進去
   - 如果客戶沒選 select 欄位，Formspree **直接不顯示**該欄位整行（不是顯示空值），optional 群組會 skip 過去

4. 點 **OK**

> ⚠️ **Formspree 通知信實際格式**（2026-05-11 抓真信件驗證）：
> ```
> Hey there,
>
> Someone just submitted your form on yutaifund.tw/contact. Here's what they had to say:
>
>
> name:
> 王小明
>
>
> phone:
> 0912345678
>
>
> email:
> customer@gmail.com
>
>
> inquiry_type:
> 新成屋
>
>
> message:
> 想看礁溪溫泉宅的物件
>
>
>
> Submitted 05:22 PM - 11 May 2026
> ---
> ```
>
> 注意 **3 個關鍵特徵**：
> 1. **label 跟 value 不在同一行**（label 後面是換行，value 在下一行單獨佔一行）
> 2. **每個欄位中間有 2-3 行空行**
> 3. **客戶沒選的 select 欄位 Formspree 直接省略整行**（不是顯示 `location:` 空值，是連 label 都沒有）—— 所以 regex 用 `(?:...)?` optional 群組
>
> regex 的 `\s*` 會吃掉 label 後面的換行銜接到 value，已驗證可成功抓取。

---

## Step 4：加 LINE Send Message 模組（5 分鐘）

1. 點 Text Parser 右邊 **+** 半圓圈
2. 搜尋 `LINE` → 點選 **LINE**（紫綠色官方圖示）
3. actions 列表選 **Send a Reply / Push Message** 或 **Push Message**（依 Make.com 當前 UI 命名）
4. 點 **Create a connection**：
   - Connection name: `鈺泰發 OA`
   - **Channel Access Token**: 貼鈺泰發 OA Channel Access Token（**從你密碼管理器複製**，那串 `pj522CN...` 的長字串）
   - 點 Save
5. 設定 Send Message 參數：
   | 欄位 | 值 |
   |------|---|
   | To User ID | `U6ce01e50e5b7729f16865866711d52be` |
   | Message type | `Flex` |
   | Alt text | `🏠 鈺泰發官網新表單 - 來自 {{name}}`（{{name}} 從上方變數選單選 Text Parser → name） |
   | Flex content (JSON) | （見下方完整 JSON） |

6. **Flex content JSON**（整段複製貼到 Flex content 欄）：

```json
{
  "type": "bubble",
  "size": "kilo",
  "header": {
    "type": "box",
    "layout": "vertical",
    "backgroundColor": "#1A1A1A",
    "paddingAll": "16px",
    "contents": [
      {
        "type": "text",
        "text": "🏠 新表單通知",
        "color": "#B89855",
        "weight": "bold",
        "size": "sm"
      },
      {
        "type": "text",
        "text": "鈺泰發行銷官網",
        "color": "#FAF7F0",
        "size": "xs",
        "margin": "sm"
      }
    ]
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "spacing": "md",
    "paddingAll": "16px",
    "contents": [
      {
        "type": "box",
        "layout": "baseline",
        "contents": [
          { "type": "text", "text": "姓名", "color": "#888888", "size": "sm", "flex": 2 },
          { "type": "text", "text": "{{name}}", "color": "#1A1A1A", "size": "sm", "flex": 5, "weight": "bold", "wrap": true }
        ]
      },
      {
        "type": "box",
        "layout": "baseline",
        "contents": [
          { "type": "text", "text": "電話", "color": "#888888", "size": "sm", "flex": 2 },
          { "type": "text", "text": "{{phone}}", "color": "#1A1A1A", "size": "sm", "flex": 5, "wrap": true }
        ]
      },
      {
        "type": "box",
        "layout": "baseline",
        "contents": [
          { "type": "text", "text": "Email", "color": "#888888", "size": "sm", "flex": 2 },
          { "type": "text", "text": "{{email}}", "color": "#1A1A1A", "size": "sm", "flex": 5, "wrap": true }
        ]
      },
      {
        "type": "box",
        "layout": "baseline",
        "contents": [
          { "type": "text", "text": "類型", "color": "#888888", "size": "sm", "flex": 2 },
          { "type": "text", "text": "{{inquiry_type}}", "color": "#1A1A1A", "size": "sm", "flex": 5, "wrap": true }
        ]
      },
      {
        "type": "box",
        "layout": "baseline",
        "contents": [
          { "type": "text", "text": "地點", "color": "#888888", "size": "sm", "flex": 2 },
          { "type": "text", "text": "{{location}}", "color": "#1A1A1A", "size": "sm", "flex": 5, "wrap": true }
        ]
      },
      { "type": "separator", "margin": "md" },
      { "type": "text", "text": "留言", "color": "#888888", "size": "sm", "margin": "md" },
      { "type": "text", "text": "{{message}}", "color": "#333333", "size": "sm", "wrap": true, "margin": "sm" }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "paddingAll": "12px",
    "contents": [
      {
        "type": "button",
        "style": "primary",
        "color": "#B89855",
        "height": "sm",
        "action": {
          "type": "uri",
          "label": "📞 直接撥打",
          "uri": "tel:{{phone}}"
        }
      }
    ]
  }
}
```

> ⚠️ **重要**：上面 `{{name}}` `{{phone}}` `{{email}}` `{{message}}` 是**示意寫法**。在 Make.com 實際填的時候，要從上方變數選單**插入 Text Parser 模組的 named group 變數**，不能直接打 `{{name}}` 字串進去。
>
> Make.com 會把 `{{2.name}}` 之類的內部變數參考換成實際值（2 是 Text Parser 在 scenario 裡的模組編號）。
>
> 操作方式：
> 1. 把上面 JSON 整段先貼進 Flex content 欄
> 2. 找到每個 `{{name}}` `{{phone}}` 等，**用滑鼠選取它（包含大括號）**
> 3. 從上方變數氣泡點對應的 Text Parser → name / phone / email / message
> 4. 它會自動換成 Make.com 的內部變數參考（`{{2.name}}` 之類）

7. 點 **OK**

---

## Step 5：儲存 + 啟用（1 分鐘）

1. 編輯器右下角 **Save**
2. 編輯器左下角 **Scheduling** 開關 → **ON**
3. 跳出排程設定：
   - Run scenario: **At regular intervals**
   - Minutes: `120`（Free plan **強烈建議 120**，理由見下方 ops 估算）
   - 點 OK

> ⚠️ **Free plan polling 頻率務必設 120 分鐘以上**：Make.com Free plan 是 **1000 ops / 月**。Gmail Watch 模組每次 polling 觸發 = 至少 1 op（不管有沒有新信）。
> - 15 分鐘 polling = 4 polls/hr × 24 hr × 30 天 = **2,880 polls/月**，已經 3 倍爆掉
> - 30 分鐘 polling = 1,440/月，還是爆
> - 60 分鐘 polling = 720/月，剛好邊緣
> - **120 分鐘 polling = 360/月，留 640 ops 給實際表單流量**（一筆完整流程 ≈ 10 ops，足夠 64 筆/月）
>
> 對房地產業務來說，2 小時延遲收到 LINE 通知完全可接受（客戶不會 2 小時內死等）。要更即時就升 Core $9/月 拿 10,000 ops。

---

## Step 6：測試（5 分鐘）

### 方法 A：本機測試

```bash
cd D:/Users/Administrator/Downloads/Hank-agent/yutaifund_web_v1
npm run dev
```

瀏覽器開 http://localhost:4321/contact → 填一筆表單（用你自己的 Email + 隨便填姓名 / 電話）→ 送出。

### 方法 B：直接寄假信給自己

打開一方圓 Gmail（webmail）→ 寄一封信給自己，主旨「test」、內文：

```
name: 王小明
phone: 0912345678
email: test@gmail.com
message: 我想看礁溪的物件
```

### 看結果

1. **等 1-15 分鐘**（Make.com 輪詢間隔）
2. 你個人 LINE 應該收到一張 Flex Message：

```
┌──────────────────────┐
│ 🏠 新表單通知         │  ← 金色字 + 深色背景
│ 鈺泰發行銷官網        │
├──────────────────────┤
│ 姓名 王小明           │
│ 電話 0912345678       │
│ Email test@gmail.com  │
│ 類型 新成屋           │
│ 地點 礁溪             │
│ ─────────────────────│
│ 留言                  │
│ 我想看礁溪的物件      │
├──────────────────────┤
│ [📞 直接撥打]         │ ← 金色按鈕，點了直接撥
└──────────────────────┘
```

### 沒收到怎麼辦

1. **Make.com → 你的 scenario → 上方 History tab**
2. 看最近一筆執行紀錄，點開
3. 哪個模組出現紅色 ❌，就是它出問題：

| 紅燈在哪 | 大概原因 | 怎麼修 |
|---------|---------|--------|
| Gmail 模組 | 沒抓到信 / OAuth 過期 | 重連 Gmail / 改 criteria |
| Text Parser | regex 對不到內文 | 看 Gmail output 實際內文格式調 regex |
| LINE 模組 400 | Flex Message JSON 有錯 | 回模板複製貼上 |
| LINE 模組 401 | Channel Token 錯 | 從密碼管理器重貼 |
| LINE 模組 403 | User ID 錯 | 確認用 webhook.site 抓到的那串 |

---

## 之後可優化

- **改 Formspree Webhook 直連 Make.com**（需 Formspree Plus $10/月）：免 Gmail 中介，即時通知，0 延遲
- **加 Notion 模組**：每筆新表單也自動建一筆 CRM
- **加 Slack / Discord**：通知到團隊頻道（如未來有業務 team）

---

## ops 用量估算（Make.com Free 1,000 ops/month）

> **Hank 2026-05-12 實測修正**：Gmail Watch 模組**每次 polling 就消耗 1 op**（不是「有信才算」，文件原本寫錯了）。所以 polling 頻率對 Free plan 影響極大。

### 不同 polling 頻率的固定成本

| polling 頻率 | 每月固定 polls | 留給實際流量 | 評語 |
|-------------|--------------|------------|------|
| 15 分鐘 | 2,880 | **-1,880（爆）** | ❌ 不可用 |
| 30 分鐘 | 1,440 | **-440（爆）** | ❌ 不可用 |
| 60 分鐘 | 720 | 280 | ⚠️ 緊繃 |
| **120 分鐘** | **360** | **640** | ✅ **Hank 採用** |
| 180 分鐘 | 240 | 760 | ✅ 更保守 |

### 每筆表單流量成本

| 階段 | ops |
|------|-----|
| Gmail 抓到一封 Formspree 信 | 1 |
| Text Parser 抽欄位 | 1 |
| LINE Push 卡片 | 1 |
| 如果 Make.com bundle 多封信一起跑（Max results 5） | 最壞 × 3 = 15 ops/批 |
| **保守估計** | **~10 ops / 筆**（含 retry / partial fail 等緩衝） |

### 結論

- **120 分鐘 polling × ~10 ops 每筆**：Free plan 可消化 **每月 ~64 筆表單**
- 鈺泰發初期客流量足夠
- 超過 / 想即時化要升 **Core $9/月（10,000 ops）** 或改 **Formspree Plus（$10/月）直接 webhook 進 Make.com**（免 Gmail 中介，0 延遲，每筆只剩 1 op）
