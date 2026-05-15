import { defineField, defineType } from 'sanity';

/**
 * 全域公司資訊（Singleton）
 * 業主可改：電話、地址、Email、營業時間、社群連結
 * 這份資料會自動同步到網站所有頁面（header、footer、contact 等）
 */
export default defineType({
  name: 'siteSettings',
  title: '公司資訊（全域共用）',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: '公司全名',
      type: 'string',
      description: '例：鈺泰發行銷有限公司',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brandName',
      title: '品牌簡稱',
      type: 'string',
      description: '例：鈺泰發行銷',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'englishName',
      title: '英文名稱',
      type: 'string',
      description: '例：YU TAI FUND',
    }),
    defineField({
      name: 'slogan',
      title: '品牌標語',
      type: 'string',
      description: '例：鈺泰用心　購屋安心　建商放心',
    }),
    defineField({
      name: 'description',
      title: '公司簡介（SEO 用）',
      type: 'text',
      rows: 3,
      description: '會顯示在 Google 搜尋結果與社群分享',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'phone',
      title: '服務專線',
      type: 'string',
      description: '例：03-9577000',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'address',
      title: '公司地址',
      type: 'string',
    }),
    defineField({
      name: 'businessHours',
      title: '營業時間',
      type: 'string',
      description: '例：週一至週五 09:00–18:00；週六、日採預約制',
    }),
    defineField({
      name: 'lineAddFriendUrl',
      title: 'LINE 加好友連結',
      type: 'url',
      description: '例：https://lin.ee/yNHl4Wq',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook 粉絲頁',
      type: 'url',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
    }),
    defineField({
      name: 'jgbSmartUrl',
      title: 'JGB 智能租屋連結',
      type: 'url',
      description: '若有訂閱 JGB Smart，請填您的 JGB 公開頁面網址',
    }),
  ],
  preview: {
    prepare() {
      return { title: '公司資訊', subtitle: '網站全域共用資料' };
    },
  },
});
