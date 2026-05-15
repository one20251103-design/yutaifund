export type TeamMember = {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  specialties: string[];
  order: number;
};

// 本機 fallback 資料（業主 Sanity 後台一發布就會自動覆蓋）
export const team: TeamMember[] = [
  {
    name: '林總監',
    role: '營運總監',
    bio: '深耕宜蘭房地產十餘年，主導多檔在地代銷案，擅長建商品牌策略與物件開發。',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&auto=format&fit=crop',
    specialties: ['代銷企劃', '建商合作', '銷售策略'],
    order: 1,
  },
  {
    name: '張經理',
    role: '業務經理',
    bio: '專精新成屋代銷與貸款規劃，協助超過百組家庭完成首購夢想。',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop',
    specialties: ['新成屋代銷', '貸款規劃', '首購諮詢'],
    order: 2,
  },
  {
    name: '陳專員',
    role: '中古屋專員',
    bio: '熟稔宜蘭中古屋市場行情，擅長物件深度盤點與誠信媒合。',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop',
    specialties: ['中古屋買賣', '物件盤點', '估價分析'],
    order: 3,
  },
];
