import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { PRODUCTS } from '../src/data/products';
import { escapeMarkup, indexablePaths, pageMetadata, privatePages, sitemapXml } from '../src/lib/page-metadata';
import { renderRoute } from '../build/ssr/entry-server.js';

const template = await readFile('dist/index.html', 'utf8');
export function renderMetadata(html: string, pathname: string, bodyHtml?: string) {
  const page = pageMetadata(pathname, PRODUCTS);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeMarkup(page.title)}</title>`);
  const values: Record<string, string> = {
    description: page.description, robots: page.robots,
    'og:title': page.title, 'og:description': page.description, 'og:image': page.image,
    'og:url': page.canonical, 'og:type': page.type,
    'twitter:title': page.title, 'twitter:description': page.description, 'twitter:image': page.image,
  };
  if (page.product) {
    values['product:price:amount'] = page.product.price;
    values['product:price:currency'] = page.product.currency;
    values['product:availability'] = page.product.availability;
  }
  for (const [key, value] of Object.entries(values)) {
    const isOg = key.startsWith('og:') || key.startsWith('product:');
    const pattern = new RegExp(`<meta (?:name|property)="${key}"[^>]*>`);
    const tag = `<meta ${isOg ? 'property' : 'name'}="${key}" content="${escapeMarkup(value)}" />`;
    html = pattern.test(html) ? html.replace(pattern, () => tag) : html.replace('</head>', `${tag}\n</head>`);
  }
  html = html.replace(/<link rel="canonical"[^>]*>/g, '');
  html = html.replace(/<script id="page-schema"[\s\S]*?<\/script>/g, '');
  const jsonLd = JSON.stringify(page.schema).replace(/</g, '\\u003c');
  html = html.replace(
    '</head>',
    `<link rel="canonical" href="${escapeMarkup(page.canonical)}" />\n<script id="page-schema" type="application/ld+json">${jsonLd}</script>\n</head>`,
  );
  if (bodyHtml !== undefined) {
    html = html.replace('<div id="root"></div>', () => `<div id="root">${bodyHtml}</div>`);
  }
  return html;
}
for (const pathname of [...indexablePaths(PRODUCTS), ...Object.keys(privatePages)]) {
  const file = pathname === '/' ? 'dist/index.html' : path.join('dist', pathname + '.html');
  await mkdir(path.dirname(file), { recursive: true });
  const bodyHtml = renderRoute(pathname);
  await writeFile(file, renderMetadata(template, pathname, bodyHtml));
}
await writeFile('dist/product-fallback.html', renderMetadata(template, '/product-unavailable', ''));
const sitemap = sitemapXml(PRODUCTS);
await writeFile('dist/sitemap.xml', sitemap);
await writeFile('public/sitemap.xml', sitemap);
console.log(`Prerendered HTML + JSON-LD + sitemap for ${indexablePaths(PRODUCTS).length} public pages; private pages are noindex.`);
