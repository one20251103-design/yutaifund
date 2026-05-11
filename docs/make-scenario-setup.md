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
   | Criteria | `Read all email`（第一次測試用，跑通後改 `Only unread mails`） |
   | Sender email | （留空，讓所有寄件人都觸發） |
   | Subject | （留空） |
   | Max number of results | `5` |
   | Mark message as | `Read`（處理完標已讀，避免重複觸發） |
6. 點 **OK**

> 💡 **進階**：如果 Formspree 寄信主旨固定包含「New submission」，可以在 **Subject** 欄填 `New submission from` 過濾，減少抓無關信件浪費 ops。

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
   name:\s*(?<name>[^\n]+)[\s\S]*?phone:\s*(?<phone>[^\n]+)[\s\S]*?email:\s*(?<email>[^\n]+)[\s\S]*?message:\s*(?<message>[\s\S]+?)(?:\n--|$)
   ```

4. 點 **OK**

> ⚠️ 這個 regex 假設 Formspree 信件內文格式長這樣：
> ```
> name: 王小明
> phone: 0912345678
> email: customer@gmail.com
> message: 想看礁溪的物件
> ```
> 如果你的 Formspree 表單欄位不一樣，跑一次測試後到 Make.com History 看實際信件內容，再調整 regex named groups。

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
   - Minutes: `15`（Free plan 最低 15 分鐘）
   - 點 OK

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

| 動作 | ops 消耗 |
|------|---------|
| Gmail 模組每 15 分鐘輪詢一次 | 每次 1 op（**有信才算**，無信不算）|
| 每筆新表單觸發完整流程（Gmail + Parser + LINE） | 3 ops |
| 假設每天 5 筆表單 | 15 ops/day = 450 ops/月 |
| **結論** | Free plan 對鈺泰發初期客流量足夠 |

如果日均超過 30 筆表單，要升級 Make.com Core $9/月（10,000 ops）。
