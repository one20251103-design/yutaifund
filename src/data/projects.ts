/**
 * 示範用建案資料
 *
 * 注意：依 CLAUDE.md 規範，本檔資料皆標示為「示範卡片」（Concept Study）。
 * 真實案場建立後，請改用 Sanity CMS 串接（移除 isConcept 標記）。
 */

export interface Project {
  slug: string;
  title: string;
  category: 'new' | 'used';
  location: string;
  status?: string;
  coverImage: string;
  excerpt: string;
  isConcept?: boolean;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'sample-jiaoxi-spa',
    title: '礁溪溫泉宅 概念研究',
    category: 'new',
    location: '宜蘭礁溪',
    status: '示範',
    coverImage:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80&auto=format&fit=crop',
    excerpt:
      '溫泉地段、低密度建築、面山景視野，作為宜蘭新成屋代銷的理想典型範例。',
    isConcept: true,
    featured: true,
  },
  {
    slug: 'sample-luodong-elite',
    title: '羅東精品宅 概念研究',
    category: 'new',
    location: '宜蘭羅東',
    status: '示範',
    coverImage:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&auto=format&fit=crop',
    excerpt:
      '近羅東夜市與運動公園的精品中型社區，展示我們對市區生活機能型物件的代銷思路。',
    isConcept: true,
    featured: true,
  },
  {
    slug: 'sample-yilan-tranquil',
    title: '宜蘭市靜巷宅 概念研究',
    category: 'used',
    location: '宜蘭市',
    status: '示範',
    coverImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop',
    excerpt:
      '近舊城區靜巷、屋齡 8 年中古屋翻新案例，展示我們的物件深度盤點與媒合流程。',
    isConcept: true,
    featured: true,
  },
  {
    slug: 'sample-wujie-modern',
    title: '五結現代宅 概念研究',
    category: 'new',
    location: '宜蘭五結',
    status: '示範',
    coverImage:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format&fit=crop',
    excerpt:
      '五結交流道周邊新興重劃區建案，呈現對交通便利型物件的代銷規劃。',
    isConcept: true,
  },
  {
    slug: 'sample-toucheng-coastal',
    title: '頭城海景宅 概念研究',
    category: 'used',
    location: '宜蘭頭城',
    status: '示範',
    coverImage:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop',
    excerpt:
      '面海岸線景觀宅，展示我們處理度假型不動產轉售與整理流程的經驗。',
    isConcept: true,
  },
  {
    slug: 'sample-suau-village',
    title: '蘇澳村落宅 概念研究',
    category: 'used',
    location: '宜蘭蘇澳',
    status: '示範',
    coverImage:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&auto=format&fit=crop',
    excerpt:
      '老街周邊低總價中古屋，展示我們對首購族與小家庭客層的匹配邏輯。',
    isConcept: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const newProjects = projects.filter((p) => p.category === 'new');
export const usedProjects = projects.filter((p) => p.category === 'used');
