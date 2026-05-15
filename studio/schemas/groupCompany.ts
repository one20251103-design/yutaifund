import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'groupCompany',
  title: '相關企業',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '公司名稱',
      type: 'string',
      description: '例：鈺泰建設、瑾展營造',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: '業務定位',
      type: 'string',
      description: '例：建築開發、工程營造',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '公司介紹',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'services',
      title: '主要業務',
      type: 'array',
      of: [{ type: 'string' }],
      description: '例：土地開發、建案規劃、都市更新、危老重建',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'logo',
      title: '公司 Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'website',
      title: '官網連結（若有）',
      type: 'url',
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
      title: '顯示順序',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'logo' },
  },
});
