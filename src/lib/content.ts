/**
 * 統一資料層：Sanity → 本機 fallback
 *
 * 設計原則：
 * 1. 沒設 PUBLIC_SANITY_PROJECT_ID 直接用本機 src/data/* 假資料（dev 立刻可跑）
 * 2. 設了但 Sanity 還沒填內容（list 為空），仍用本機假資料（避免空白上線）
 * 3. Sanity fetch 失敗（網路錯誤）→ console.warn + fallback，不爆掉頁面
 * 4. 一旦 Sanity 有內容，自動覆蓋假資料（業主 Publish 後 webhook 觸發 Cloudflare 重 build）
 *
 * Body 內容兩種型態：
 *   - 本機假資料：string（markdown）
 *   - Sanity：array（Portable Text blocks）
 *   渲染端用 <RichBody /> 元件統一處理。
 */

import { sanityClient, isSanityConfigured, queries } from './sanity';
import { news as localNews, type News } from '~/data/news';
import { insights as localInsights, type Insight } from '~/data/insights';
import { projects as localProjects, type Project } from '~/data/projects';
import { team as localTeam, type TeamMember } from '~/data/team';
import { awards as localAwards, type Award } from '~/data/awards';
import { groupCompanies as localGroup, type GroupCompany } from '~/data/group';
import { csrActivities as localCsr, type CsrActivity } from '~/data/csr';
import { defaultSiteSettings, type SiteSettings } from '~/data/siteSettings';

// 統一回傳型態（兼容 Sanity + 本機）
export type NewsItem = {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage: string;
  body: string | any[];     // string = local markdown / array = Sanity portable text
};

export type InsightItem = {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  coverImage: string;
  readTime?: number;
  body: string | any[];
};

export type ProjectItem = {
  _id?: string;
  slug: string;
  title: string;
  category: 'new' | 'used';
  location: string;
  status?: string;
  coverImage: string;
  excerpt: string;
  body?: string | any[];
  gallery?: string[];
  isConcept?: boolean;
  featured?: boolean;
};

// ── 本機資料正規化（slug 從 object 變 string）────────────────
const normalizeLocalNews = (n: News): NewsItem => ({
  ...n,
  slug: n.slug,
});

const normalizeLocalInsight = (i: Insight): InsightItem => ({
  ...i,
  slug: i.slug,
});

const normalizeLocalProject = (p: Project): ProjectItem => ({
  ...p,
  slug: p.slug,
});

// ── Sanity 資料正規化（slug 從 {current} 變 string）──────────
const normalizeSanityDoc = <T extends { slug?: any }>(doc: T): T & { slug: string } => ({
  ...doc,
  slug: typeof doc.slug === 'object' && doc.slug?.current ? doc.slug.current : (doc.slug as string),
});

// ── 共用 fetcher：try Sanity → fallback local ───────────────
async function fetchOrFallback<S, L>(
  query: string | null,
  fallback: L,
  normalizer: (d: any) => any = (d) => d,
  params?: Record<string, any>,
): Promise<S | L> {
  if (!isSanityConfigured || !query) return fallback;
  try {
    const data = await sanityClient.fetch(query, params || {});
    if (data === null || data === undefined) return fallback;
    if (Array.isArray(data) && data.length === 0) return fallback;
    if (Array.isArray(data)) return data.map(normalizer) as S;
    return normalizer(data) as S;
  } catch (err) {
    console.warn('[sanity] fetch failed, using local fallback:', err);
    return fallback;
  }
}

// ── News ────────────────────────────────────────────────────
export async function getNewsList(): Promise<NewsItem[]> {
  return fetchOrFallback<NewsItem[], NewsItem[]>(
    queries.newsList,
    localNews.map(normalizeLocalNews),
    normalizeSanityDoc,
  );
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  if (!isSanityConfigured) {
    return localNews.map(normalizeLocalNews).find((n) => n.slug === slug) || null;
  }
  try {
    const data = await sanityClient.fetch(queries.newsBySlug, { slug });
    if (!data) {
      return localNews.map(normalizeLocalNews).find((n) => n.slug === slug) || null;
    }
    return normalizeSanityDoc(data);
  } catch (err) {
    console.warn('[sanity] news by slug failed, fallback', err);
    return localNews.map(normalizeLocalNews).find((n) => n.slug === slug) || null;
  }
}

// ── Insights ────────────────────────────────────────────────
export async function getInsightsList(): Promise<InsightItem[]> {
  return fetchOrFallback<InsightItem[], InsightItem[]>(
    queries.insightsList,
    localInsights.map(normalizeLocalInsight),
    normalizeSanityDoc,
  );
}

export async function getInsightBySlug(slug: string): Promise<InsightItem | null> {
  if (!isSanityConfigured) {
    return localInsights.map(normalizeLocalInsight).find((i) => i.slug === slug) || null;
  }
  try {
    const data = await sanityClient.fetch(queries.insightBySlug, { slug });
    if (!data) {
      return localInsights.map(normalizeLocalInsight).find((i) => i.slug === slug) || null;
    }
    return normalizeSanityDoc(data);
  } catch (err) {
    console.warn('[sanity] insight by slug failed, fallback', err);
    return localInsights.map(normalizeLocalInsight).find((i) => i.slug === slug) || null;
  }
}

// ── Portfolio ───────────────────────────────────────────────
export async function getPortfolioList(): Promise<ProjectItem[]> {
  return fetchOrFallback<ProjectItem[], ProjectItem[]>(
    queries.portfolioList,
    localProjects.map(normalizeLocalProject),
    normalizeSanityDoc,
  );
}

export async function getPortfolioBySlug(slug: string): Promise<ProjectItem | null> {
  if (!isSanityConfigured) {
    return localProjects.map(normalizeLocalProject).find((p) => p.slug === slug) || null;
  }
  try {
    const data = await sanityClient.fetch(queries.portfolioBySlug, { slug });
    if (!data) {
      return localProjects.map(normalizeLocalProject).find((p) => p.slug === slug) || null;
    }
    return normalizeSanityDoc(data);
  } catch (err) {
    console.warn('[sanity] portfolio by slug failed, fallback', err);
    return localProjects.map(normalizeLocalProject).find((p) => p.slug === slug) || null;
  }
}

// ── Site Settings ───────────────────────────────────────────
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return defaultSiteSettings;
  try {
    const data = await sanityClient.fetch<SiteSettings | null>(queries.siteSettings, {});
    if (!data) return defaultSiteSettings;
    return { ...defaultSiteSettings, ...data };
  } catch (err) {
    console.warn('[sanity] siteSettings fetch failed, fallback', err);
    return defaultSiteSettings;
  }
}

// ── Team ────────────────────────────────────────────────────
export async function getTeamList(): Promise<TeamMember[]> {
  return fetchOrFallback<TeamMember[], TeamMember[]>(
    queries.teamList,
    localTeam,
  );
}

// ── Awards ──────────────────────────────────────────────────
export async function getAwardsList(): Promise<Award[]> {
  return fetchOrFallback<Award[], Award[]>(
    queries.awardsList,
    localAwards,
  );
}

// ── Group Companies ─────────────────────────────────────────
export async function getGroupCompaniesList(): Promise<GroupCompany[]> {
  return fetchOrFallback<GroupCompany[], GroupCompany[]>(
    queries.groupCompaniesList,
    localGroup,
  );
}

// ── CSR Activities ──────────────────────────────────────────
export async function getCsrActivitiesList(): Promise<CsrActivity[]> {
  return fetchOrFallback<CsrActivity[], CsrActivity[]>(
    queries.csrActivitiesList,
    localCsr,
  );
}

// 給 getStaticPaths 用：取所有 slug
export async function getAllNewsSlugs(): Promise<string[]> {
  const list = await getNewsList();
  return list.map((n) => n.slug);
}

export async function getAllInsightsSlugs(): Promise<string[]> {
  const list = await getInsightsList();
  return list.map((i) => i.slug);
}

export async function getAllPortfolioSlugs(): Promise<string[]> {
  const list = await getPortfolioList();
  return list.map((p) => p.slug);
}
