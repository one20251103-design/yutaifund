export const SITE = {
  name: '鈺泰發行銷',
  fullName: '鈺泰發行銷有限公司',
  englishName: 'YU TAI FUND',
  slogan: '鈺泰用心　購屋安心　建商放心',
  description:
    '宜蘭專業房地產代銷與顧問。新成屋、中古屋一站式服務，讓您買得安心、住得放心。',
  url: 'https://yutaifund.tw',
  phone: '03-9577000',
  email: 'info@yutaifund.tw',
  address: '268 宜蘭縣五結鄉協和村自強東路 71 號',
  // 鈺泰發測試用 OA（一方圓 Gmail 管理；交付時 transfer 給鈺泰發或重新發行 Token）
  lineAddFriendUrl: 'https://lin.ee/yNHl4Wq',
  facebook: 'https://www.facebook.com/yutaifund',
  jgbSmartUrl: 'https://www.jgbsmart.com/',
} as const;

// 子選單可用的 icon 名稱（在 Header.astro 內以 SVG 對應）
export type NavIcon =
  | 'book' // 品牌故事
  | 'medal' // 獲獎榮耀
  | 'users' // 專業團隊
  | 'building' // 相關企業
  | 'pin' // 在地深耕
  | 'heart' // 社會公益
  | 'rocket' // 即將公開
  | 'flame' // 熱銷
  | 'trophy' // 經典實績
  | 'key' // 租屋
  | 'spark' // JGB 智能
  | 'sparkles' // House AI
  | 'newspaper' // 最新消息
  | 'coin' // 貸款
  | 'palette' // 室內裝修
  | 'hammer' // 建築工法
  | 'line' // LINE
  | 'phone' // 電話
  | 'calendar'; // 預約

export type NavChild = {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
  icon?: NavIcon;
};

export type NavItem = {
  label: string;
  href: string;
  children?: readonly NavChild[];
};

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: '關於我們',
    href: '/about',
    children: [
      { label: '品牌故事', href: '/about/brand-story', description: '核心理念與企業願景', icon: 'book' },
      { label: '獲獎榮耀', href: '/about/awards', description: '銷售實績與業界肯定', icon: 'medal' },
      { label: '專業團隊', href: '/about/team', description: '成員介紹', icon: 'users' },
      { label: '相關企業', href: '/about/group', description: '鈺泰建設、瑾展營造', icon: 'building' },
      { label: '在地深耕實績', href: '/about/local-impact', description: '成交戶數與中古屋件數', icon: 'pin' },
      { label: '社會公益', href: '/about/csr', description: '在地回饋活動', icon: 'heart' },
    ],
  },
  {
    label: '建案代銷',
    href: '/portfolio',
    children: [
      { label: '即將公開建案', href: '/portfolio/upcoming', description: 'Coming Soon 預售情報', icon: 'rocket' },
      { label: '熱銷建案', href: '/portfolio/hot', description: '正在銷售中', icon: 'flame' },
      { label: '經典實績', href: '/portfolio/completed', description: '已結案精選 10 案', icon: 'trophy' },
    ],
  },
  {
    label: '仲介服務',
    href: '/agency',
    children: [
      { label: '租屋資訊', href: '/agency/rental', description: '宜蘭在地物件', icon: 'key' },
      { label: 'JGB 智能租屋', href: 'https://www.jgbsmart.com/', external: true, description: '智慧化租賃管理平台', icon: 'spark' },
      { label: 'House AI 搜尋', href: '/agency/ai-search', description: '智能物件媒合', icon: 'sparkles' },
    ],
  },
  {
    label: '房市與交易資訊',
    href: '/insights',
    children: [
      { label: '最新消息', href: '/news', description: '房市新聞與交易資訊', icon: 'newspaper' },
      { label: '貸款資訊', href: '/insights/mortgage', description: '房貸種類與試算', icon: 'coin' },
      { label: '室內裝修', href: '/insights/interior', description: '裝修知識與預算', icon: 'palette' },
      { label: '建築工法', href: '/insights/construction', description: '耐震標章解析', icon: 'hammer' },
    ],
  },
  {
    label: '聯絡我們',
    href: '/contact',
    children: [
      { label: 'LINE 官方帳號', href: 'https://lin.ee/yNHl4Wq', external: true, description: '即時諮詢', icon: 'line' },
      { label: '服務專線', href: 'tel:03-9577000', external: true, description: '03-9577000', icon: 'phone' },
      { label: '線上預約看屋', href: '/contact#form', description: '填寫表單預約', icon: 'calendar' },
    ],
  },
] as const;
