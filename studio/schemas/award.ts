import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'award',
  title: '獲獎榮耀',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '獎項名稱',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: '獲獎年份',
      type: 'string',
      description: '例：2024',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organization',
      title: '頒獎單位',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '獎項說明',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'certificate',
      title: '獎牌 / 證書照片',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: '顯示順序',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: '年份倒序',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: '自訂順序',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'organization', year: 'year', media: 'certificate' },
    prepare({ title, subtitle, year, media }) {
      return { title: `${year} · ${title}`, subtitle, media };
    },
  },
});
