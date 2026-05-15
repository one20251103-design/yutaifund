import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'yutaifund',
  title: '鈺泰發行銷 CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'placeholder',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('root')
          .title('內容管理')
          .items([
            // 全域設定 — Singleton（永遠在頂部）
            S.listItem()
              .id('siteSettings')
              .title('🏢 公司資訊（全域共用）')
              .child(
                S.editor()
                  .id('siteSettings')
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),

            S.divider(),

            // 集合型內容
            S.listItem()
              .id('portfolio')
              .title('🏗 建案代銷')
              .schemaType('portfolio')
              .child(S.documentTypeList('portfolio').title('建案代銷')),

            S.listItem()
              .id('news')
              .title('📰 最新消息')
              .schemaType('news')
              .child(S.documentTypeList('news').title('最新消息')),

            S.listItem()
              .id('insight')
              .title('💡 房市文章')
              .schemaType('insight')
              .child(S.documentTypeList('insight').title('房市文章')),

            S.divider(),

            S.listItem()
              .id('team')
              .title('👥 專業團隊')
              .schemaType('team')
              .child(S.documentTypeList('team').title('專業團隊').defaultOrdering([{ field: 'order', direction: 'asc' }])),

            S.listItem()
              .id('award')
              .title('🏆 獲獎榮耀')
              .schemaType('award')
              .child(S.documentTypeList('award').title('獲獎榮耀').defaultOrdering([{ field: 'year', direction: 'desc' }])),

            S.listItem()
              .id('groupCompany')
              .title('🤝 相關企業')
              .schemaType('groupCompany')
              .child(S.documentTypeList('groupCompany').title('相關企業').defaultOrdering([{ field: 'order', direction: 'asc' }])),

            S.listItem()
              .id('csrActivity')
              .title('❤️ 社會公益')
              .schemaType('csrActivity')
              .child(S.documentTypeList('csrActivity').title('社會公益').defaultOrdering([{ field: 'date', direction: 'desc' }])),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
