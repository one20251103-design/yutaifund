export type GroupCompany = {
  _id?: string;
  name: string;
  role: string;
  description: string;
  services: string[];
  logo?: string;
  website?: string;
  order: number;
};

// 本機 fallback 資料（業主 Sanity 後台一發布就會自動覆蓋）
export const groupCompanies: GroupCompany[] = [
  {
    name: '鈺泰建設',
    role: '建築開發',
    description: '集團體系下的建築開發單位，負責土地評估、規劃與興建。深耕宜蘭多年，致力於打造符合在地居住需求的優質住宅。',
    services: ['土地開發', '建案規劃', '都市更新', '危老重建'],
    order: 1,
  },
  {
    name: '瑾展營造',
    role: '工程營造',
    description: '專業營造團隊，主導施工品質與工程進度管控。與鈺泰建設深度配合，從基礎工程到精裝交屋全程負責。',
    services: ['結構工程', '裝修工程', '品質監造', '進度管理'],
    order: 2,
  },
];
