import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { PRODUCTS } from '../src/data/products';
import { escapeMarkup, indexablePaths, pageMetadata, privatePages, sitemapXml } from '../src/lib/page-metadata';

const template = await readFile('dist/index.html', 'utf8');
export function renderMetadata(html: string, pathname: string) {
  const page = pageMetadata(pathname, PRODUCTS);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeMarkup(page.title)}</title>`);
  const values: Record<string, string> = {
    description: page.description, robots: page.robots,
    'og:title': page.title, 'og:description': page.description, 'og:image': page.image,
    'og:url': page.canonical, 'og:type': page.type,
    'twitter:title': page.title, 'twitter:description': page.description, 'twitter:image': page.image,
  };
  for (const [key, value] of Object.entries(values)) {
    const pattern = new RegExp(`<meta (?:name|property)="${key}"[^>]*>`);
    const tag = `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escapeMarkup(value)}" />`;
    html = pattern.test(html) ? html.replace(pattern, () => tag) : html.replace('</head>', `${tag}\n</head>`);
  }
  html = html.replace(/<link rel="canonical"[^>]*>/g, '');
  return html.replace('</head>', `<link rel="canonical" href="${escapeMarkup(page.canonical)}" />\n</head>`);
}
for (const pathname of [...indexablePaths(PRODUCTS), ...Object.keys(privatePages)]) {
  const file = pathname === '/' ? 'dist/index.html' : path.join('dist', pathname + '.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, renderMetadata(template, pathname));
}
await writeFile('dist/product-fallback.html', renderMetadata(template, '/product-unavailable'));
await writeFile('dist/sitemap.xml', sitemapXml(PRODUCTS));
console.log(`Generated metadata HTML and sitemap for ${indexablePaths(PRODUCTS).length} public pages; private pages are noindex.`);
