export type SiteSettings = {
  _id?: string;
  companyName: string;
  brandName: string;
  englishName: string;
  slogan: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  lineAddFriendUrl: string;
  facebook?: string;
  instagram?: string;
  jgbSmartUrl?: string;
};

// 本機 fallback（業主 Sanity 後台填資料前的預設值）
// 此資料與 src/lib/site.ts 的 SITE 常數保持同步
export const defaultSiteSettings: SiteSettings = {
  companyName: '鈺泰發行銷有限公司',
  brandName: '鈺泰發行銷',
  englishName: 'YU TAI FUND',
  slogan: '鈺泰用心　購屋安心　建商放心',
  description:
    '宜蘭專業房地產代銷與顧問。新成屋、中古屋一站式服務，讓您買得安心、住得放心。',
  phone: '03-9577000',
  email: 'info@yutaifund.tw',
  address: '268 宜蘭縣五結鄉協和村自強東路 71 號',
  businessHours: '週一至週五 09:00–18:00；週六、日採預約制',
  lineAddFriendUrl: 'https://lin.ee/yNHl4Wq',
  facebook: 'https://www.facebook.com/yutaifund',
  jgbSmartUrl: 'https://www.jgbsmart.com/',
};
