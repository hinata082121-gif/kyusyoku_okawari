const fallbackSiteUrl = 'https://kyushoku-okawari-sodatsusen.vercel.app';

function normalizeSiteUrl(url: string | undefined): string {
  const trimmed = url?.trim();
  if (!trimmed) return fallbackSiteUrl;
  return trimmed.replace(/\/$/, '');
}

export const siteConfig = {
  siteName: '給食おかわり争奪戦',
  seriesName: '平成学校ゲームズ',
  siteTitle: '給食おかわり争奪戦｜平成学校ゲームズ',
  siteDescription:
    '給食のおかわりをめぐる、平成学校あるある16bit風ミニゲーム。タイミングよく並んで、最後のプリンを勝ち取ろう。',
  keywords: '給食, おかわり, ブラウザゲーム, ミニゲーム, 平成, 学校あるある, 16bit, Phaser, スマホゲーム',
  siteUrl: normalizeSiteUrl(import.meta.env.VITE_SITE_URL),
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? '',
  googleSiteVerification: import.meta.env.VITE_GOOGLE_SITE_VERIFICATION?.trim() ?? '',
} as const;

export function buildAbsoluteUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.siteUrl}${normalizedPath}`;
}
