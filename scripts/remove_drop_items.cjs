const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.ts');
let fileContent = fs.readFileSync(productsPath, 'utf8');

const match = fileContent.match(/const baseProducts: Product\[\] = (\[[\s\S]*?\]);\r?\n\r?\nexport const products/);
if (!match) {
  console.error('Could not parse baseProducts');
  process.exit(1);
}

const baseProducts = JSON.parse(match[1]);

// Remove drop_ff_* items
const filteredBaseProducts = baseProducts.filter(p => !p.id.startsWith('drop_ff_'));

// Clear all isNew flags in baseProducts
filteredBaseProducts.forEach(p => { p.isNew = false; });

console.log(`Original baseProducts count: ${baseProducts.length}`);
console.log(`Filtered baseProducts count: ${filteredBaseProducts.length}`);

// Write back updated baseProducts
const updatedJSON = JSON.stringify(filteredBaseProducts, null, 2);
const newFileContent = fileContent.replace(
  /const baseProducts: Product\[\] = \[[\s\S]*?\];\r?\n\r?\nexport const products/,
  `const baseProducts: Product[] = ${updatedJSON};\n\nexport const products`
);

fs.writeFileSync(productsPath, newFileContent, 'utf8');
console.log('Successfully removed drop_ff_* items from products.ts!');
