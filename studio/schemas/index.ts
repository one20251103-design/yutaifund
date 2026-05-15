import news from './news';
import portfolio from './portfolio';
import insight from './insight';
import siteSettings from './siteSettings';
import team from './team';
import award from './award';
import groupCompany from './groupCompany';
import csrActivity from './csrActivity';

export const schemaTypes = [
  // 全域設定
  siteSettings,
  // 集合型內容
  portfolio,
  news,
  insight,
  team,
  award,
  groupCompany,
  csrActivity,
];
