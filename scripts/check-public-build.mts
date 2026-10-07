import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../src/data/products';
import { escapeMarkup, indexablePaths, pageMetadata, privatePages } from '../src/lib/page-metadata';
import site from '../src/config/site.json';

let count = 0;
async function scan(dir: string) {
  for (const file of await readdir(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) { await scan(filePath); continue; }
    assert.ok(!/\.(?:map|cjs|tsx|ts)$/.test(file.name), `Private/source file in public output: ${filePath}`);
    if (/\.(?:js|json|html|css|txt|xml)$/.test(file.name)) {
      const content = await readFile(filePath, 'utf8');
      assert.doesNotMatch(content, /ownd\.in|img201\.savana\.com|cdn\.shopify\.com/i, filePath);
      assert.doesNotMatch(content, /"395\.50"\s*,\s*"490"\s*,\s*"499"\s*,\s*"550"\s*,\s*"750"\s*,\s*"1000"\s*,\s*"1100"\s*,\s*"1400"\s*,\s*"5500"\s*,\s*"7500"/i, filePath);
      if (file.name.endsWith('.html')) {
        assert.doesNotMatch(content, /codashop\.online|\/(?:garena-checkout|garenacheckout|GarenaCheckout|Garenacheckout|garenaCheckout)(?:[?#/" ]|$)/i, filePath);
      }
      count++;
    }
  }
}
await scan('dist');
assert.ok((await readFile('dist/product-fallback.html', 'utf8')).includes('name="robots" content="noindex, follow"'));
for (const pathname of [...indexablePaths(PRODUCTS), ...Object.keys(privatePages)]) {
  const file = pathname === '/' ? 'dist/index.html' : path.join('dist', pathname + '.html');
  const html = await readFile(file, 'utf8');
  const page = pageMetadata(pathname, PRODUCTS);
  assert.ok(html.includes(`<title>${escapeMarkup(page.title)}</title>`), file);
  assert.ok(html.includes(`rel="canonical" href="${escapeMarkup(page.canonical)}"`), file);
  assert.ok(html.includes(`name="robots" content="${page.robots}"`), file);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const route of ['/garena-checkout', '/garenacheckout', '/GarenaCheckout', '/Garenacheckout', '/garenaCheckout']) {
  assert.ok(!sitemap.includes(`${site.origin}${route}`), `Garena route in sitemap: ${route}`);
}
console.log(`Public build passed: ${count} text assets scanned; no package allow-list, route URLs in HTML, legacy image origins or server/source files; generated metadata and sitemap checked.`);
