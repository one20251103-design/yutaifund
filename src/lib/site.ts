export const SITE = {
  name: '鈺泰發行銷',
  fullName: '鈺泰發行銷有限公司',
  englishName: 'YU TAI FUND',
  slogan: '鈺泰用心　購屋安心　建商放心',
  description:
    '宜蘭專業房地產代銷與顧問。新成屋、中古屋一站式服務，讓您買得安心、住得放心。',
  url: 'https://yutaifund.tw',
  phone: '03-9558400',
  email: 'info@yutaifund.tw',
  address: '宜蘭縣',
  // 一方圓 OA 測試用短網址；客戶交付前換成鈺泰發 OA 的 lin.ee
  lineAddFriendUrl: 'https://lin.ee/rpAl9J4',
  facebook: 'https://www.facebook.com/yutaifund',
} as const;

export const NAV_ITEMS = [
  { label: '關於我們', href: '/about' },
  { label: '最新消息', href: '/news' },
  { label: '專業服務', href: '/services' },
  { label: '建案精選', href: '/portfolio' },
  { label: '買房指南', href: '/insights' },
  { label: '聯絡我們', href: '/contact' },
] as const;
