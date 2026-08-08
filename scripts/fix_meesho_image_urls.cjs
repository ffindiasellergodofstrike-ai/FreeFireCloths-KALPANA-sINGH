const fs = require('fs');
const path = require('path');
const https = require('https');

const meeshoPath = path.join(__dirname, '../src/data/meeshoData.ts');
const meeshoContent = fs.readFileSync(meeshoPath, 'utf8');

const meeshoMatch = meeshoContent.match(/export const meeshoProducts: Product\[\] = (\[[\s\S]*\]);/);
const meeshoProducts = JSON.parse(meeshoMatch[1]);

// High quality working Unsplash product images by category
const FALLBACK_CATEGORY_IMAGES = {
  "Women's Ethnic": [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
  ],
  "Women's Fashion": [
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
  ],
  "Kids & Baby": [
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop"
  ],
  "Bags & Accessories": [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop"
  ],
  "Jewellery & Accessories": [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
  ],
  "Footwear": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
  ],
  "Home & Living": [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
  ],
  "Men's Fashion": [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
  ],
  "Electronics": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop"
  ]
};

async function testAndFixUrl(url, category, index) {
  try {
    const res = await new Promise((resolve, reject) => {
      const req = https.request(url, { method: 'HEAD', timeout: 4000 }, (res) => resolve(res));
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      req.end();
    });
    if (res.statusCode >= 200 && res.statusCode < 400) {
      return url;
    }
  } catch (e) {
    // ignore
  }
  const pool = FALLBACK_CATEGORY_IMAGES[category] || FALLBACK_CATEGORY_IMAGES["Women's Fashion"];
  return pool[index % pool.length];
}

async function fixAll() {
  console.log('Testing and fixing image URLs in meeshoData.ts...');
  let fixedCount = 0;

  for (let i = 0; i < meeshoProducts.length; i++) {
    const p = meeshoProducts[i];
    const validImg = await testAndFixUrl(p.image, p.category, i);
    if (validImg !== p.image) {
      console.log(`Fixed product ${p.id} (${p.title}): ${p.image} -> ${validImg}`);
      p.image = validImg;
      fixedCount++;
    }
    
    // Ensure p.images array exists and has valid URLs
    const pool = FALLBACK_CATEGORY_IMAGES[p.category] || FALLBACK_CATEGORY_IMAGES["Women's Fashion"];
    p.images = [
      p.image,
      pool[(i + 1) % pool.length],
      pool[(i + 2) % pool.length]
    ];
  }

  console.log(`Total images fixed: ${fixedCount}`);

  const updatedCode = `// Automatically generated Meesho catalog dataset
import { Product } from './products';

export const meeshoProducts: Product[] = ${JSON.stringify(meeshoProducts, null, 2)};
`;

  fs.writeFileSync(meeshoPath, updatedCode, 'utf8');
  console.log('Updated meeshoData.ts successfully!');
}

fixAll();
