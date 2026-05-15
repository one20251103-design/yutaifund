import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'team',
  title: '專業團隊',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '姓名',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: '職稱',
      type: 'string',
      description: '例：營運總監、業務經理、中古屋專員',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: '個人介紹',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'photo',
      title: '個人照片',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'specialties',
      title: '專長領域',
      type: 'array',
      of: [{ type: 'string' }],
      description: '例：代銷企劃、貸款規劃、中古屋買賣',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'order',
      title: '顯示順序',
      type: 'number',
      description: '數字小排前面（例：1 = 第一位）',
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
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
});
