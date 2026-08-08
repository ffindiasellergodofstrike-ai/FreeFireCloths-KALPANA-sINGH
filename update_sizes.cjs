import * as fs from 'fs';

let content = fs.readFileSync('src/data/products.ts', 'utf-8');

// The file exports `products` array and `getProductsByCategory`.
// We will replace the types and re-write the products array.

// Modify Product interface to include `sizes`
content = content.replace('isNew?: boolean;', 'isNew?: boolean;\\n  sizes?: string[];');

fs.writeFileSync('src/data/products.ts', content);
console.log('Done');
