export type CsrActivity = {
  _id?: string;
  title: string;
  category: string;
  year: string;
  description: string;
  partnerOrg?: string;
  photo?: string;
  date?: string;
};

// 本機 fallback 資料（業主 Sanity 後台一發布就會自動覆蓋）
export const csrActivities: CsrActivity[] = [
  {
    title: '在地社區關懷活動（範例）',
    category: '社區參與',
    year: '範例',
    description: '參與五結鄉節慶活動，回饋鄉里。實際內容待業主提供。',
  },
  {
    title: '弱勢家庭購屋諮詢（範例）',
    category: '專業回饋',
    year: '範例',
    description: '提供免費購屋諮詢，協助首購族與弱勢家庭。實際內容待業主提供。',
  },
  {
    title: '在地教育贊助（範例）',
    category: '教育支持',
    year: '範例',
    description: '贊助宜蘭在地學校或社區教育活動。實際內容待業主提供。',
  },
];
