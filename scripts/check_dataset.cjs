const fs = require('fs');
const path = require('path');

// Read files
const meeshoFile = fs.readFileSync(path.join(__dirname, '../src/data/meeshoData.ts'), 'utf8');

// Parse meeshoProducts array from meeshoData.ts using simple regex or eval
const jsonMatch = meeshoFile.match(/export const meeshoProducts: Product\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error('Could not parse meeshoProducts');
  process.exit(1);
}

const meeshoProducts = JSON.parse(jsonMatch[1]);
console.log(`Total Meesho Products: ${meeshoProducts.length}`);

const categoryCounts = {};
let missingReviews = 0;
let totalReviewsCount = 0;
let missingImages = 0;

meeshoProducts.forEach(p => {
  categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  if (!p.reviews || p.reviews.length === 0) {
    missingReviews++;
  } else {
    totalReviewsCount += p.reviews.length;
  }
  if (!p.image) missingImages++;
});

console.log('\nCategory Counts in Meesho Products:');
console.table(categoryCounts);

console.log(`\nProducts missing reviews: ${missingReviews} / ${meeshoProducts.length}`);
console.log(`Total reviews across Meesho products: ${totalReviewsCount}`);
console.log(`Products missing main image: ${missingImages}`);
