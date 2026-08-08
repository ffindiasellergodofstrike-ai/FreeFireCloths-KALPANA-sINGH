import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/products.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace category strings globally
content = content.replace(/"category":\s*"Women Clothing"/g, '"category": "Women\'s Fashion"');
content = content.replace(/"category":\s*"Men Clothing"/g, '"category": "Men\'s Fashion"');
// Also check for single quotes just in case
content = content.replace(/'category':\s*'Women Clothing'/g, '"category": "Women\'s Fashion"');
content = content.replace(/'category':\s*'Men Clothing'/g, '"category": "Men\'s Fashion"');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Categories merged successfully.');
