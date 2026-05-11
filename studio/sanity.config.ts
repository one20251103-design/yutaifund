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
            S.listItem()
              .id('news')
              .title('最新消息')
              .schemaType('news')
              .child(S.documentTypeList('news').title('最新消息')),
            S.listItem()
              .id('portfolio')
              .title('作品案例')
              .schemaType('portfolio')
              .child(S.documentTypeList('portfolio').title('作品案例')),
            S.listItem()
              .id('insight')
              .title('買房指南')
              .schemaType('insight')
              .child(S.documentTypeList('insight').title('買房指南')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
