const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.join(__dirname, '../src/data/products.ts'), 'utf8');

const match = file.match(/const baseProducts: Product\[\] = (\[[\s\S]*?\]);\r?\n\r?\nexport const products/);
if (!match) {
  console.error('Could not match baseProducts');
  process.exit(1);
}

try {
  const baseProducts = JSON.parse(match[1]);
  console.log(`Total baseProducts: ${baseProducts.length}`);

  const categories = {};
  let missingReviews = 0;
  baseProducts.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
    if (!p.reviews || p.reviews.length === 0) missingReviews++;
  });

  console.log('\nBase Products Category Counts:');
  console.table(categories);
  console.log(`Base products missing reviews: ${missingReviews} / ${baseProducts.length}`);
} catch (err) {
  console.error('JSON parse error:', err.message);
}
