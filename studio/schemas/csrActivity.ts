import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'csrActivity',
  title: '社會公益活動',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '活動名稱',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '類別',
      type: 'string',
      options: {
        list: [
          { title: '社區參與', value: '社區參與' },
          { title: '專業回饋', value: '專業回饋' },
          { title: '教育支持', value: '教育支持' },
          { title: '弱勢關懷', value: '弱勢關懷' },
          { title: '環境永續', value: '環境永續' },
          { title: '其他', value: '其他' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: '年份',
      type: 'string',
      description: '例：2025',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '活動說明',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: 'partnerOrg',
      title: '合作單位（若有）',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: '活動照片',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'date',
      title: '活動日期',
      type: 'date',
    }),
  ],
  orderings: [
    {
      title: '日期倒序',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', category: 'category', year: 'year', media: 'photo' },
    prepare({ title, category, year, media }) {
      return { title: `[${year}] ${title}`, subtitle: category, media };
    },
  },
});
