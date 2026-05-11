/**
 * Sanity 種子腳本 — 把本機 src/data/* 的所有 demo 資料推進 Sanity
 *
 * 使用方式：
 *   1. 去 https://www.sanity.io/manage/personal/project/ck8ic8jh/api/tokens
 *      點 "Add API token" → Name 填 "seed" → Permissions 選 "Editor" → 複製 token
 *   2. 在專案根目錄執行：
 *      $env:SANITY_WRITE_TOKEN="貼 token"; node scripts/seed.mjs       (PowerShell)
 *      SANITY_WRITE_TOKEN=貼 token node scripts/seed.mjs               (bash)
 *   3. 跑完後可去 sanity.io/manage 把那組 token 撤銷（一次性使用）
 *
 * 本腳本是 idempotent —— 用固定 _id，多跑幾次只會覆蓋同一筆，不會重複建立。
 */

import { createClient } from '@sanity/client';

const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (!TOKEN) {
  console.error('\n✖ 缺少環境變數 SANITY_WRITE_TOKEN\n');
  console.error('請先去 https://www.sanity.io/manage/personal/project/ck8ic8jh/api/tokens 申請 Editor token');
  console.error('PowerShell 用法：$env:SANITY_WRITE_TOKEN="xxxxx"; node scripts/seed.mjs\n');
  process.exit(1);
}

const client = createClient({
  projectId: 'ck8ic8jh',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: TOKEN,
  useCdn: false,
});

// ── markdown → portable text 轉換器（夠用版本）─────────────────
const rk = () => Math.random().toString(36).substring(2, 12);

function parseInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .filter((p) => p.length > 0)
    .map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return { _type: 'span', _key: rk(), text: part.slice(2, -2), marks: ['strong'] };
      }
      return { _type: 'span', _key: rk(), text: part, marks: [] };
    });
}

function md2pt(markdown) {
  const blocks = [];
  const paragraphs = markdown.split(/\n\n+/);
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    if (trimmed === '---') continue;

    if (trimmed.startsWith('## ')) {
      blocks.push({
        _type: 'block', _key: rk(), style: 'h2',
        children: parseInline(trimmed.substring(3)),
        markDefs: [],
      });
    } else if (/^[-*] /.test(trimmed.split('\n')[0])) {
      // bullet list
      for (const line of trimmed.split('\n')) {
        if (!/^[-*] /.test(line)) continue;
        blocks.push({
          _type: 'block', _key: rk(), style: 'normal',
          listItem: 'bullet', level: 1,
          children: parseInline(line.substring(2)),
          markDefs: [],
        });
      }
    } else {
      blocks.push({
        _type: 'block', _key: rk(), style: 'normal',
        children: parseInline(trimmed),
        markDefs: [],
      });
    }
  }
  return blocks;
}

// ── 圖片上傳（從 URL 抓下來上傳到 Sanity assets）──────────────
const imageCache = new Map();
async function uploadImageFromUrl(url) {
  if (imageCache.has(url)) return imageCache.get(url);
  console.log(`  ↓ ${url.substring(0, 80)}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  const filename = url.split('/').pop().split('?')[0] + '.jpg';
  const asset = await client.assets.upload('image', buf, { filename });
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  imageCache.set(url, ref);
  return ref;
}

// ── 資料區（從 src/data/*.ts 同步）────────────────────────────
const newsData = [
  {
    slug: 'yutaifund-website-launch',
    title: '鈺泰發官方網站正式上線',
    excerpt: '為提供更透明、更專業的購屋資訊，鈺泰發行銷正式啟動官方網站，整合服務介紹、案例展示與線上諮詢功能。',
    publishedAt: '2026-05-06',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop',
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
    excerpt: '進入 2026 年，宜蘭房市呈現「觀光與通勤並行」的雙引擎特色。我們整理礁溪與五結兩個重點區域的市場動態。',
    publishedAt: '2026-04-15',
    coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80&auto=format&fit=crop',
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

const insightsData = [
  {
    slug: 'first-time-buyer-3-decisions',
    title: '第一次買房必看：3 個比預算更重要的決策點',
    excerpt: '很多首購族把全部心力放在「能負擔多少錢」，卻忽略了影響未來 10 年生活品質的關鍵決策。我們整理了在宜蘭服務多年最常被忽略的 3 個面向。',
    category: '購屋指南',
    publishedAt: '2026-05-01',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80&auto=format&fit=crop',
    readTime: 6,
    body: `第一次買房，很多人最先問的是「我能買多少錢的房子？」這個問題重要，但不夠。

真正影響你未來 10 年居住品質的，往往是以下三個比預算更需要慎重思考的決策點。

## 一、生活半徑，比地段名氣更重要

很多人選地段會看「捷運、學區、商圈」這類大標籤。但真正影響日常的是「**你常去的 5 個地方**」與這個房子之間的步行距離與通勤時間。

舉例：在宜蘭，「靠近羅東夜市」聽起來很方便，但如果你的工作在頭城、孩子要去礁溪學校、長輩住在五結，這個房子的「生活半徑」其實是一場硬仗。

## 二、屋齡與「真實成本」的關係

新成屋每坪單價高，但 10 年內幾乎沒有額外整修費；中古屋總價低，但管線、外牆、防水的隱藏成本可能讓你 5 年內多花 50-100 萬。

我們建議客戶在比對中古屋與新成屋時，把「**未來 10 年總支出**」一起列出來，而不是只看頭期款。

## 三、社區管理與鄰居結構

社區管委會的運作品質、住戶的人口結構（青年家庭 / 退休族 / 投資客比例），會直接影響你住進去後的舒適度。

賞屋時，除了看房子本身，更應該：
- 詢問近三年管委會記錄
- 觀察社區的清潔與公設維護
- 與一兩位鄰居簡短交談（如果可能）

---

這三個決策點，預算永遠不是最關鍵的因素。我們在鈺泰發協助每位客戶時，第一次溝通總會先問這些問題，因為「買得起」跟「住得舒服」之間，還有一段值得認真釐清的距離。`,
  },
  {
    slug: 'new-vs-used-property-comparison',
    title: '新成屋 vs 中古屋：哪一個更適合你？',
    excerpt: '新成屋總價高但省心、中古屋有議價空間但隱藏成本多。我們從房屋總成本、生活機能、心理舒適度三個面向，幫你釐清自己的偏好。',
    category: '購屋指南',
    publishedAt: '2026-04-22',
    coverImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80&auto=format&fit=crop',
    readTime: 8,
    body: `「我應該買新成屋還是中古屋？」這是我們在第一次見面諮詢時最常被問的問題。

答案沒有絕對，因為這不只是「錢」的問題，而是你「想要怎樣的住宅體驗」的問題。

## 一、房屋總成本：別只看每坪單價

**新成屋**
- 每坪單價高（宜蘭新成屋平均落在 28-45 萬 / 坪）
- 但 10 年內幾乎不需大型維修
- 公設比通常較高（30-35%），實際使用坪數要扣除

**中古屋**
- 每坪單價低 20-40%
- 但管線、外牆、防水可能需要 50-150 萬整修
- 公設比較低（15-25%），實坪較高

## 二、生活機能：地段與社區成熟度

新成屋多在重劃區或新興地段，生活機能需要時間培養（3-5 年）。
中古屋通常在成熟生活圈，便利但缺乏新鮮感。

## 三、心理舒適度：你能接受別人住過的房子嗎？

這是很實際的問題。有些人對中古屋的「歷史感」毫不介意，甚至覺得有溫度；有些人則無法接受。沒有對錯，是個人偏好。

---

我們的建議：先誠實面對自己對「全新」與「成熟」的偏好，再回頭看預算。如果你對新成屋有強烈偏好但預算有限，鈺泰發可以協助你找到「合適區域 + 合理坪數」的折衷方案，而不是硬搬到不熟悉的地段。`,
  },
  {
    slug: 'yilan-area-selection-guide',
    title: '宜蘭購屋指南：地段選擇的 5 個觀察重點',
    excerpt: '宜蘭地理特色強烈，從礁溪、宜蘭市、羅東到五結，每個區域的居住特性差異極大。我們整理在地觀察的 5 個必看面向。',
    category: '在地知識',
    publishedAt: '2026-04-10',
    coverImage: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1200&q=80&auto=format&fit=crop',
    readTime: 10,
    body: `來宜蘭買房的客戶，常常用台北的眼光看宜蘭：「這裡有捷運嗎？」「離夜市多遠？」

但宜蘭的居住邏輯跟都會區不同。我們整理了在地服務多年觀察到的 5 個觀察重點。

## 1. 雨季與排水：宜蘭多雨是真的

宜蘭東北季風帶來的「濕」是體感問題，更是房屋健康問題。
- 一樓 / 地下室物件要特別注意排水
- 西曬問題在宜蘭比台北輕微
- 通風比採光更重要

## 2. 生活圈劃分：四大鎮各有性格

- **礁溪**：溫泉觀光、退休族 / 度假族
- **宜蘭市**：行政中心、學區成熟、首購族首選
- **羅東**：商圈完整、夜市文化、年輕家庭
- **五結 / 冬山**：交流道便利、小家庭重劃區

## 3. 通勤動線：火車站 vs 交流道

雪隧後宜蘭通勤台北的客群成長，選地段時：
- 通勤族 → 礁溪 / 五結交流道附近
- 在地工作 → 宜蘭市 / 羅東

## 4. 學區策略：不是越熱門越好

宜蘭學區壓力比都會區小，與其追熱門學區，不如選「步行距離可達」的學校。

## 5. 自住 vs 投資：別混淆需求

宜蘭觀光導向高，民宿型物件興盛，但自住客切記不要被「未來投資價值」混淆判斷——你住的是家，不是 ETF。

---

每個區域都有它的性格與適合的人。鈺泰發在地多年，能協助你找到「對的區域」，而不只是「能買的房子」。`,
  },
];

const portfolioData = [
  {
    slug: 'sample-jiaoxi-spa', title: '礁溪溫泉宅 概念研究', category: 'new', location: '宜蘭礁溪', status: '即將公開', featured: true,
    publishedAt: '2026-05-01',
    coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80&auto=format&fit=crop',
    excerpt: '溫泉地段、低密度建築、面山景視野，作為宜蘭新成屋代銷的理想典型範例。',
    body: '本案為設計提案研究（Concept Study），用於展示我們對溫泉宅地段、低密度建築、面山景物件的代銷規劃思路。',
  },
  {
    slug: 'sample-luodong-elite', title: '羅東精品宅 概念研究', category: 'new', location: '宜蘭羅東', status: '即將公開', featured: true,
    publishedAt: '2026-04-28',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80&auto=format&fit=crop',
    excerpt: '近羅東夜市與運動公園的精品中型社區，展示我們對市區生活機能型物件的代銷思路。',
    body: '本案為設計提案研究（Concept Study），展示我們對市區生活機能型物件的代銷思路。',
  },
  {
    slug: 'sample-yilan-tranquil', title: '宜蘭市靜巷宅 概念研究', category: 'used', location: '宜蘭市', status: '銷售中', featured: true,
    publishedAt: '2026-04-25',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80&auto=format&fit=crop',
    excerpt: '近舊城區靜巷、屋齡 8 年中古屋翻新案例，展示我們的物件深度盤點與媒合流程。',
    body: '本案為設計提案研究（Concept Study），展示我們對中古屋翻新案的深度盤點與媒合流程。',
  },
  {
    slug: 'sample-wujie-modern', title: '五結現代宅 概念研究', category: 'new', location: '宜蘭五結', status: '即將公開',
    publishedAt: '2026-04-20',
    coverImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80&auto=format&fit=crop',
    excerpt: '五結交流道周邊新興重劃區建案，呈現對交通便利型物件的代銷規劃。',
    body: '本案為設計提案研究（Concept Study），呈現我們對交通便利型物件的代銷規劃。',
  },
  {
    slug: 'sample-toucheng-coastal', title: '頭城海景宅 概念研究', category: 'used', location: '宜蘭頭城', status: '銷售中',
    publishedAt: '2026-04-18',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&auto=format&fit=crop',
    excerpt: '面海岸線景觀宅，展示我們處理度假型不動產轉售與整理流程的經驗。',
    body: '本案為設計提案研究（Concept Study），展示我們處理度假型不動產轉售與整理流程的經驗。',
  },
  {
    slug: 'sample-suau-village', title: '蘇澳村落宅 概念研究', category: 'used', location: '宜蘭蘇澳', status: '銷售中',
    publishedAt: '2026-04-15',
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=80&auto=format&fit=crop',
    excerpt: '老街周邊低總價中古屋，展示我們對首購族與小家庭客層的匹配邏輯。',
    body: '本案為設計提案研究（Concept Study），展示我們對首購族與小家庭客層的匹配邏輯。',
  },
];

// ── 主流程 ────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 開始把 demo 資料推進 Sanity...\n');

  // 最新消息
  for (const item of newsData) {
    console.log(`📰 news: ${item.title}`);
    const cover = await uploadImageFromUrl(item.coverImage);
    await client.createOrReplace({
      _id: `news-${item.slug}`,
      _type: 'news',
      title: item.title,
      slug: { _type: 'slug', current: item.slug },
      publishedAt: new Date(item.publishedAt).toISOString(),
      excerpt: item.excerpt,
      coverImage: cover,
      body: md2pt(item.body),
    });
    console.log('  ✓\n');
  }

  // 買房指南
  for (const item of insightsData) {
    console.log(`📖 insight: ${item.title}`);
    const cover = await uploadImageFromUrl(item.coverImage);
    await client.createOrReplace({
      _id: `insight-${item.slug}`,
      _type: 'insight',
      title: item.title,
      slug: { _type: 'slug', current: item.slug },
      category: item.category,
      publishedAt: new Date(item.publishedAt).toISOString(),
      readTime: item.readTime,
      excerpt: item.excerpt,
      coverImage: cover,
      body: md2pt(item.body),
    });
    console.log('  ✓\n');
  }

  // 案例
  for (const item of portfolioData) {
    console.log(`🏠 portfolio: ${item.title}`);
    const cover = await uploadImageFromUrl(item.coverImage);
    await client.createOrReplace({
      _id: `portfolio-${item.slug}`,
      _type: 'portfolio',
      title: item.title,
      slug: { _type: 'slug', current: item.slug },
      category: item.category,
      location: item.location,
      status: item.status,
      featured: item.featured || false,
      publishedAt: new Date(item.publishedAt).toISOString(),
      excerpt: item.excerpt,
      coverImage: cover,
      body: md2pt(item.body),
    });
    console.log('  ✓\n');
  }

  console.log('🎉 全部完成！可以去 http://localhost:3333 查看，或回到網站 http://localhost:4321 看效果。\n');
  console.log('⚠ 別忘了去 sanity.io/manage 把這次用的 token 撤銷（Personal access token 不該長期保留）\n');
}

main().catch((err) => {
  console.error('\n✖ 失敗：', err.message);
  process.exit(1);
});
