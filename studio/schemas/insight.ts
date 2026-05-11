import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'insight',
  title: '買房指南',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '文章標題',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: '網址 slug（自動產生）',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '分類',
      type: 'string',
      options: {
        list: [
          { title: '購屋指南', value: '購屋指南' },
          { title: '市場觀察', value: '市場觀察' },
          { title: '合約解讀', value: '合約解讀' },
          { title: '在地知識', value: '在地知識' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: '發佈日期',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: '預估閱讀時間（分鐘）',
      type: 'number',
      initialValue: 5,
    }),
    defineField({
      name: 'excerpt',
      title: '摘要（顯示於列表）',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'coverImage',
      title: '封面圖',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: '文章內容',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: '替代文字' }],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: '發佈日期（新到舊）',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      category: 'category',
      date: 'publishedAt',
    },
    prepare({ title, media, category, date }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString('zh-TW')
        : '';
      return {
        title,
        media,
        subtitle: `${category || ''} · ${formattedDate}`,
      };
    },
  },
});
