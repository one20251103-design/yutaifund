import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'portfolio',
  title: '作品案例',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '案例名稱',
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
      title: '類別',
      type: 'string',
      options: {
        list: [
          { title: '新成屋建案', value: 'new' },
          { title: '中古屋', value: 'used' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: '地點',
      type: 'string',
      description: '例：宜蘭礁溪、宜蘭羅東、宜蘭市',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: '狀態',
      type: 'string',
      options: {
        list: [
          { title: '熱銷中', value: '熱銷中' },
          { title: '銷售中', value: '銷售中' },
          { title: '即將公開', value: '即將公開' },
          { title: '已完銷', value: '已完銷' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: '是否精選（首頁顯示）',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: '上架日期',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
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
      name: 'gallery',
      title: '案例相簿',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: '替代文字' }],
        },
      ],
    }),
    defineField({
      name: 'body',
      title: '案例詳細介紹',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  orderings: [
    {
      title: '精選優先',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      category: 'category',
      location: 'location',
    },
    prepare({ title, media, category, location }) {
      const cat = category === 'new' ? '新成屋' : '中古屋';
      return {
        title,
        media,
        subtitle: `${cat} · ${location || ''}`,
      };
    },
  },
});
