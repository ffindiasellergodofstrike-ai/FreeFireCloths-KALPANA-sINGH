import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { PRODUCTS, SOURCE_PRODUCTS } from '../src/data/products';
import retired from '../src/data/retired-products.json';
import baseline from './fixtures/account-brand-baseline.json';
import { isRetiredProduct } from '../src/data/retired-products';
import { homepageProducts } from '../src/data/catalog-navigation';

test('all audited flagged products leave the sale catalog while historical records remain', () => {
  assert.equal(PRODUCTS.length,307);
  assert.equal(SOURCE_PRODUCTS.length,336);
  assert.equal(retired.length,29);
  assert.ok(PRODUCTS.every(p=>!isRetiredProduct(p.id)));
  assert.ok(retired.every(id=>SOURCE_PRODUCTS.some(p=>p.id===id)));
  assert.equal(homepageProducts(PRODUCTS).length,12);
  assert.ok(homepageProducts(PRODUCTS).every(p=>!isRetiredProduct(p.id)));
});
test('login/register handlers and policy terms are unchanged apart from approved store naming',()=>{
  for(const [file,expected] of Object.entries(baseline)) {
    let source=readFileSync(file,'utf8');
    if(file.endsWith('Login.tsx') || file.endsWith('Register.tsx')) source=source.slice(source.indexOf('export default'),source.indexOf('\n  return ('));
    assert.equal(createHash('sha256').update(source).digest('hex'),expected,file);
  }
});
