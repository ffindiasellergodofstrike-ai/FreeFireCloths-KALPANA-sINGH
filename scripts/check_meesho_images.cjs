const fs = require('fs');
const path = require('path');

const meeshoPath = path.join(__dirname, '../src/data/meeshoData.ts');
const content = fs.readFileSync(meeshoPath, 'utf8');

const match = content.match(/export const meeshoProducts: Product\[\] = (\[[\s\S]*\]);/);
if (!match) {
  console.error('Could not match meeshoProducts');
  process.exit(1);
}

const meeshoProducts = JSON.parse(match[1]);
console.log(`Total Meesho products: ${meeshoProducts.length}`);

const imageDomains = {};
const sampleImages = [];

meeshoProducts.forEach((p, idx) => {
  if (idx < 5) {
    sampleImages.push({ id: p.id, title: p.title, image: p.image });
  }
  try {
    const url = new URL(p.image);
    imageDomains[url.hostname] = (imageDomains[url.hostname] || 0) + 1;
  } catch (e) {
    imageDomains['invalid_url'] = (imageDomains['invalid_url'] || 0) + 1;
  }
});

console.log('\nImage Domains distribution:');
console.table(imageDomains);

console.log('\nSample Products & Images:');
console.log(JSON.stringify(sampleImages, null, 2));
