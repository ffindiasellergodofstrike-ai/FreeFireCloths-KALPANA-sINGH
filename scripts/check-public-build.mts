import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../src/data/products';
import { escapeMarkup, indexablePaths, pageMetadata, privatePages } from '../src/lib/page-metadata';

let count = 0;
async function scan(dir: string) {
  for (const file of await readdir(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) { await scan(filePath); continue; }
    assert.ok(!/\.(?:map|cjs|tsx|ts)$/.test(file.name), `Private/source file in public output: ${filePath}`);
    if (/\.(?:js|json|html|css|txt|xml)$/.test(file.name)) {
      assert.doesNotMatch(await readFile(filePath, 'utf8'), /codashop\.online|garena-?checkout|ownd\.in|img201\.savana\.com|cdn\.shopify\.com/i, filePath);
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
console.log(`Public build passed: ${count} text assets scanned; no archived checkout/origin strings or server/source files; all generated page metadata matches.`);
