// script
const fs = require('fs');
let content = fs.readFileSync('src/data/products.ts', 'utf-8');
content = content.replace('isNew?: boolean;', 'isNew?: boolean;\n  sizes?: string[];');

// User wants a 30% margin on ALL products (existing and new).
// Let's parse out the existing array. 
// Actually, it's easier: just redefine the array contents by a regex or function, but regex is tricky.
// Since the file is well formed, let's extract the array using ES modules in a hacky way, or just write a small TS script.
fs.writeFileSync('src/data/products.ts', content);
