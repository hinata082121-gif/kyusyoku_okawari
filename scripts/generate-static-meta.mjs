import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const fallbackSiteUrl = 'https://kyusyoku-okawari.vercel.app';
const routes = ['/', '/game', '/how-to-play', '/privacy', '/terms', '/contact', '/strategy', '/menus', '/series'];

function readEnvFile(path) {
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=');
        return [line.slice(0, index), line.slice(index + 1).replace(/^["']|["']$/g, '')];
      }),
  );
}

const env = {
  ...readEnvFile(resolve('.env')),
  ...readEnvFile(resolve('.env.local')),
  ...readEnvFile(resolve('.env.production')),
  ...process.env,
};

const siteUrl = (env.VITE_SITE_URL || fallbackSiteUrl).replace(/\/$/, '');
const now = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => `  <url>
    <loc>${siteUrl}${route === '/' ? '/' : route}</loc>
    <lastmod>${now}</lastmod>
  </url>`)
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(resolve('public/sitemap.xml'), sitemap);
writeFileSync(resolve('public/robots.txt'), robots);
