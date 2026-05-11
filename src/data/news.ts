export interface News {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage: string;
  body: string;
}

export const news: News[] = [
  {
    slug: 'yutaifund-website-launch',
    title: '鈺泰發官方網站正式上線',
    excerpt:
      '為提供更透明、更專業的購屋資訊，鈺泰發行銷正式啟動官方網站，整合服務介紹、案例展示與線上諮詢功能。',
    publishedAt: '2026-05-06',
    coverImage:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop',
    body: `鈺泰發行銷有限公司今日正式啟動官方網站，落實品牌「鈺泰用心、購屋安心、建商放心」的服務承諾。

新網站整合三大功能：
- **服務介紹**：完整呈現新成屋代銷、中古屋買賣與購屋諮詢三大服務的流程與差異化
- **案例展示**：透過分類標籤（新成屋 / 中古屋）讓客戶快速瀏覽合適物件
- **線上諮詢**：表單聯繫與 LINE 即時溝通雙管齊下，回應更即時

未來網站將持續更新買房指南文章與在地市場觀察，協助客戶做出更明智的房地產決策。`,
  },
  {
    slug: 'yilan-2026-market-observation',
    title: '2026 年宜蘭房市觀察：礁溪 / 五結區域動態',
    excerpt:
      '進入 2026 年，宜蘭房市呈現「觀光與通勤並行」的雙引擎特色。我們整理礁溪與五結兩個重點區域的市場動態。',
    publishedAt: '2026-04-15',
    coverImage:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80&auto=format&fit=crop',
    body: `2026 年宜蘭房市呈現幾個有趣的趨勢，特別是在礁溪與五結兩個區域。

## 礁溪：從觀光地到第二居所

過去礁溪以民宿、商旅為主力，但 2025 年起「第二居所」需求快速成長。雙北退休族、自由工作者開始把礁溪當作半永久居住地。

特色：
- 溫泉宅成主流產品
- 低密度社區受青睞
- 中型坪數（25-35 坪）需求高

## 五結：交流道效應持續發酵

五結因國 5 交流道優勢，通勤台北的需求穩定。重劃區陸續推案，產品多以年輕家庭首購為主。

特色：
- 小坪數（20-28 坪）為主力
- 公共設施陸續到位
- 學區與商圈待成熟

---

鈺泰發持續關注區域動態，協助買家找到符合生活型態的地段。`,
  },
];
