import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';

// 預設 placeholder 避免 build 時 createClient throw error
// 實際使用前請填寫 .env 的 PUBLIC_SANITY_PROJECT_ID
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'placeholder';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2025-01-01';

export const isSanityConfigured = projectId !== 'placeholder';

export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder: ImageUrlBuilder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => builder.image(source);

// 統一的查詢介面（所有頁面從這裡取資料）
export const queries = {
  // 最新消息列表
  newsList: `*[_type == "news"] | order(publishedAt desc)[0...12]{
    _id, title, slug, publishedAt, excerpt, "coverImage": coverImage.asset->url
  }`,
  // 最新消息單篇
  newsBySlug: `*[_type == "news" && slug.current == $slug][0]{
    _id, title, slug, publishedAt, body, "coverImage": coverImage.asset->url
  }`,
  // 案例列表（含分類 tab）
  portfolioList: `*[_type == "portfolio"] | order(featured desc, publishedAt desc){
    _id, title, slug, category, location, status, featured, "coverImage": coverImage.asset->url
  }`,
  // 案例單筆
  portfolioBySlug: `*[_type == "portfolio" && slug.current == $slug][0]{
    _id, title, slug, category, location, status, body,
    "coverImage": coverImage.asset->url,
    "gallery": gallery[].asset->url
  }`,
  // 買房指南列表
  insightsList: `*[_type == "insight"] | order(publishedAt desc){
    _id, title, slug, publishedAt, excerpt, category, "coverImage": coverImage.asset->url
  }`,
  // 買房指南單篇
  insightBySlug: `*[_type == "insight" && slug.current == $slug][0]{
    _id, title, slug, publishedAt, body, category, "coverImage": coverImage.asset->url
  }`,
  // 公司資訊（Singleton，永遠 documentId == "siteSettings"）
  siteSettings: `*[_type == "siteSettings"][0]{
    _id, companyName, brandName, englishName, slogan, description,
    phone, email, address, businessHours,
    lineAddFriendUrl, facebook, instagram, jgbSmartUrl
  }`,
  // 團隊成員（依 order asc 排序）
  teamList: `*[_type == "team"] | order(order asc){
    _id, name, role, bio, specialties, order, "photo": photo.asset->url
  }`,
  // 獲獎榮耀（依 year desc 排序）
  awardsList: `*[_type == "award"] | order(year desc, order asc){
    _id, title, year, organization, description, order, "certificate": certificate.asset->url
  }`,
  // 相關企業（依 order asc 排序）
  groupCompaniesList: `*[_type == "groupCompany"] | order(order asc){
    _id, name, role, description, services, website, order, "logo": logo.asset->url
  }`,
  // 社會公益（依 date desc 排序）
  csrActivitiesList: `*[_type == "csrActivity"] | order(date desc){
    _id, title, category, year, description, partnerOrg, date, "photo": photo.asset->url
  }`,
};
