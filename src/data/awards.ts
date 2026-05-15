export type Award = {
  _id?: string;
  title: string;
  year: string;
  organization: string;
  description: string;
  certificate?: string;
  order: number;
};

// 本機 fallback 資料（業主 Sanity 後台一發布就會自動覆蓋）
export const awards: Award[] = [
  {
    title: '宜蘭年度銷售突破獎（範例）',
    year: '2024',
    organization: '在地房地產協會',
    description: '年度銷售額突破業界平均水準，獲得協會肯定。',
    order: 1,
  },
  {
    title: '優質代銷品牌肯定（範例）',
    year: '2023',
    organization: '宜蘭縣不動產仲介公會',
    description: '誠信經營、客戶滿意度位居在地代銷前段班。',
    order: 2,
  },
  {
    title: '在地深耕貢獻獎（範例）',
    year: '2022',
    organization: '五結鄉公所',
    description: '長期參與地方活動、回饋鄉里。',
    order: 3,
  },
];
