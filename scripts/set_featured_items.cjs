const fs = require('fs');
const path = require('path');

// 1. Process meeshoData.ts
const meeshoPath = path.join(__dirname, '../src/data/meeshoData.ts');
const meeshoContent = fs.readFileSync(meeshoPath, 'utf8');
const meeshoMatch = meeshoContent.match(/export const meeshoProducts: Product\[\] = (\[[\s\S]*\]);/);
if (!meeshoMatch) {
  console.error('Could not parse meeshoData.ts');
  process.exit(1);
}

const meeshoProducts = JSON.parse(meeshoMatch[1]);

// Pick 8 diverse Meesho items across various categories (Ethnic, Western, Kids, Footwear, Bags, Jewellery, Home)
const featuredIndices = [0, 4, 11, 18, 22, 28, 35, 42];

meeshoProducts.forEach((p, idx) => {
  if (featuredIndices.includes(idx)) {
    p.isNew = true;
  } else {
    p.isNew = false;
  }
});

const newMeeshoCode = `// Automatically generated Meesho catalog dataset
import { Product } from './products';

export const meeshoProducts: Product[] = ${JSON.stringify(meeshoProducts, null, 2)};
`;

fs.writeFileSync(meeshoPath, newMeeshoCode, 'utf8');
console.log('Marked 8 Meesho catalog products as isNew in meeshoData.ts!');
