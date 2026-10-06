import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../src/data/products';
import { categoryOf, collectionProducts, homepageProducts, SHOP_CATEGORIES } from '../src/data/catalog-navigation';

test('department browsing includes the complete existing and imported catalog', () => {
  const women = collectionProducts(PRODUCTS, 'women');
  const men = collectionProducts(PRODUCTS, 'men');
  const kids = collectionProducts(PRODUCTS, 'kids');
  assert.equal(women.length, 294);
  assert.equal(men.length, 12);
  assert.equal(kids.length, 1);
  assert.equal(women.filter(p => !p.sourceId).length, 59);
  assert.equal(women.filter(p => p.collection === 'kurtis').length, 7);
  const ids = [...women, ...men, ...kids].map(p => p.id);
  assert.deepEqual(ids.sort((a,b) => a-b), PRODUCTS.map(p => p.id).sort((a,b) => a-b));
});
test('every product has one clothing category, including original dresses and shirts', () => {
  assert.equal(categoryOf(PRODUCTS.find(p => p.id === 502)!), 'dresses');
  assert.equal(categoryOf(PRODUCTS.find(p => p.id === 304)!), 'shirts');
  assert.equal(categoryOf(PRODUCTS.find(p => p.id === 310)!), 'kurtis');
  assert.equal(categoryOf(PRODUCTS.find(p => p.id === 422)!), 'tops');
  assert.equal(categoryOf(PRODUCTS.find(p => p.id === 425)!), 'intimates');
  const grouped = SHOP_CATEGORIES.flatMap(c => collectionProducts(PRODUCTS, c.id));
  assert.equal(grouped.length, PRODUCTS.length);
  assert.equal(new Set(grouped.map(p => p.id)).size, PRODUCTS.length);
});
test('homepage has the six requested women products and six existing men products', () => {
  const before = JSON.stringify(PRODUCTS);
  const home = homepageProducts(PRODUCTS);
  assert.equal(home.length, 12);
  assert.equal(new Set(home.map(p => p.id)).size, 12);
  assert.deepEqual(home.filter(p => p.cat === 'women').map(p => p.name), [
    'Textured Cardigen', 'Asymmetric Top', 'Twist Top', 'Bandeau Bra', 'Contrast Co-ord Set', 'Pocket Co-ord Set',
  ]);
  assert.equal(home.filter(p => p.cat === 'men').length, 6);
  assert.equal(home.filter(p => p.collection === 'kurtis').length, 0);
  assert.ok(home.some(p => p.cat === 'men'));
  assert.ok(home.some(p => p.cat === 'women'));
  assert.equal(JSON.stringify(PRODUCTS), before);
  const missingPick = homepageProducts(PRODUCTS.filter(p => p.id !== -1881672));
  assert.equal(missingPick.length, 11);
  assert.ok(!missingPick.some(p => p.id === 301), 'Do not silently restore a previous women pick');
});
