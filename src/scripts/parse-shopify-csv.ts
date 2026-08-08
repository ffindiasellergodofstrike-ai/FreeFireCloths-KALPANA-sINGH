import * as fs from 'fs';
import * as path from 'path';

// Define the paths
const csvPath = path.join(process.cwd(), 'src', 'data', 'products_import.csv');
const tsPath = path.join(process.cwd(), 'src', 'data', 'products.ts');

interface CsvProduct {
  id: number;
  handle: string;
  cat: 'women';
  name: string;
  price: number;
  orig: number;
  sizes: string[];
  rating: number;
  reviews: number;
  desc: string;
  badge: 'SALE' | 'NEW' | '';
  images: string[];
  variants: {
    size: string;
    color: string;
    sku: string;
    price: number;
    orig: number;
    stock: number;
  }[];
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let currentField = '';
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }
  result.push(currentField);
  return result;
}

function cleanHTML(html: string): string {
  if (!html) return '';
  return html
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/<strong>/g, '')
    .replace(/<\/strong>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .join('\n');
}

// Generate stable deterministic reviews and ratings based on handle string hash
function getDeterministicRating(handle: string): { rating: number, reviews: number } {
  let hash = 0;
  for (let i = 0; i < handle.length; i++) {
    hash = handle.charCodeAt(i) + ((hash << 5) - hash);
  }
  const rating = 4.0 + (Math.abs(hash % 10) / 10); // 4.0 to 4.9
  const reviews = 45 + (Math.abs(hash % 200)); // 45 to 245
  return { rating: Math.round(rating * 10) / 10, reviews };
}

try {
  const csvData = fs.readFileSync(csvPath, 'utf8');
  const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
  
  if (lines.length < 2) {
    console.error('CSV is empty or invalid.');
    process.exit(1);
  }

  // The first line is the header
  const headers = parseCSVLine(lines[0]);
  
  const productsMap = new Map<string, CsvProduct>();
  let currentId = 101; // Start IDs for CSV products at 101 to avoid conflicts

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('.... (truncated)') || line.includes('(truncated)')) {
      continue; // Skip truncated line helper
    }

    const row = parseCSVLine(line);
    if (row.length < 10) continue; // Invalid row

    const handle = row[0].trim();
    if (!handle) continue;

    const title = row[1] ? row[1].trim() : '';
    const bodyHtml = row[2] ? row[2].trim() : '';
    const option1Value = row[9] ? row[9].trim() : '';
    const option2Value = row[11] ? row[11].trim() : '';
    const sku = row[12] ? row[12].trim() : '';
    const qtyStr = row[15] ? row[15].trim() : '';
    const priceStr = row[18] ? row[18].trim() : '';
    const comparePriceStr = row[19] ? row[19].trim() : '';
    const imageSrc = row[23] ? row[23].trim() : '';

    let product = productsMap.get(handle);

    // If it has a title, it's the main product entry row
    if (title && !product) {
      const price = parseFloat(priceStr) || 0;
      const comparePrice = parseFloat(comparePriceStr) || 0;
      const { rating, reviews } = getDeterministicRating(handle);
      const isSale = comparePrice > price;
      
      product = {
        id: currentId++,
        handle,
        cat: 'women',
        name: title,
        price,
        orig: comparePrice,
        sizes: [],
        rating,
        reviews,
        desc: cleanHTML(bodyHtml),
        badge: isSale ? 'SALE' : 'NEW',
        images: [],
        variants: []
      };
      productsMap.set(handle, product);
    }

    if (product) {
      // Collect variant details if present
      if (option1Value) {
        if (!product.sizes.includes(option1Value)) {
          product.sizes.push(option1Value);
        }
        
        product.variants.push({
          size: option1Value,
          color: option2Value || 'Default',
          sku: sku,
          price: parseFloat(priceStr) || product.price,
          orig: parseFloat(comparePriceStr) || product.orig,
          stock: parseInt(qtyStr, 10) || 0
        });
      }

      // Collect image sources
      if (imageSrc && !product.images.includes(imageSrc)) {
        product.images.push(imageSrc);
      }
    }
  }

  const newProductsList = Array.from(productsMap.values()).filter(p => p.images.length > 0);
  console.log(`Successfully parsed ${newProductsList.length} products from CSV.`);

  // Now, let's read the current products.ts file to merge or replace.
  // We want to read original interface and PRODUCTS array, but since we want to overwrite
  // PRODUCTS with merged list, let's load current products.ts and rewrite it.
  const originalTs = fs.readFileSync(tsPath, 'utf8');
  
  // Create the new types with optional images and variants properties
  const updatedInterface = `export interface Product {
  id: number;
  cat: 'men' | 'women' | 'electronics';
  name: string;
  price: number;
  orig: number; // 0 if none
  sizes: string[];
  rating: number;
  reviews: number;
  desc: string;
  badge: 'SALE' | 'NEW' | '';
  images?: string[];
  variants?: {
    size: string;
    color: string;
    sku: string;
    price: number;
    orig: number;
    stock: number;
  }[];
}`;

  // Keep original BlogPost interface
  const blogPostInterface = `export interface BlogPost {
  id: number;
  cat: string;
  title: string;
  excerpt: string;
  date: string;
  emoji: string;
}`;

  // Define original items
  const originalProductsText = originalTs.match(/export const PRODUCTS: Product\[\] = \[[^]*?\];/);
  if (!originalProductsText) {
    throw new Error('Could not find PRODUCTS array in original file.');
  }

  // Parse out the original items, or since we know they are lines 25 to 58, we can parse them cleanly.
  // Let's generate a merged PRODUCTS array output text!
  // To keep it simple and preserve the exact original products:
  const originalProductsList = [
    {id:1,cat:'men',name:'Classic Oxford Shirt',price:899,orig:1499,sizes:['S','M','L','XL','XXL'],rating:4.5,reviews:89,desc:'Premium cotton Oxford shirt with a relaxed fit. Perfect for office and casual wear.',badge:'SALE'},
    {id:2,cat:'men',name:'Slim Fit Chinos',price:1199,orig:1899,sizes:['28','30','32','34','36'],rating:4.3,reviews:64,desc:'Stretch chinos with a modern slim fit. Wrinkle-resistant fabric, all-day comfort.',badge:'SALE'},
    {id:3,cat:'men',name:'Premium Hoodie',price:1499,orig:0,sizes:['S','M','L','XL'],rating:4.7,reviews:112,desc:'Ultra-soft fleece hoodie with a kangaroo pocket. Perfect for cool evenings.',badge:'NEW'},
    {id:4,cat:'men',name:'Graphic Tee Pack (3)',price:699,orig:999,sizes:['S','M','L','XL','XXL'],rating:4.2,reviews:201,desc:'Pack of 3 premium cotton graphic tees. Machine washable, durable prints.',badge:'SALE'},
    {id:5,cat:'men',name:'Denim Jacket',price:2299,orig:3499,sizes:['S','M','L','XL'],rating:4.8,reviews:78,desc:'Classic denim jacket with contrast stitching. Versatile layering piece.',badge:'SALE'},
    {id:6,cat:'men',name:'Cargo Shorts',price:799,orig:0,sizes:['28','30','32','34'],rating:4.1,reviews:45,desc:'Durable cargo shorts with 6 pockets. Quick-dry fabric, perfect for outdoors.',badge:'NEW'},
    {id:7,cat:'men',name:'Formal Trousers',price:1099,orig:1599,sizes:['28','30','32','34','36'],rating:4.4,reviews:93,desc:'Sharp formal trousers with a flat front. Ideal for office and events.',badge:'SALE'},
    {id:8,cat:'men',name:'Polo T-Shirt',price:649,orig:899,sizes:['S','M','L','XL','XXL'],rating:4.3,reviews:156,desc:'Classic polo shirt in premium pique cotton. Available in 8 colors.',badge:'SALE'},
    {id:9,cat:'men',name:'Running Track Pants',price:849,orig:0,sizes:['S','M','L','XL','XXL'],rating:4.6,reviews:67,desc:'Lightweight track pants with side pockets and elastic waistband.',badge:'NEW'},
    {id:10,cat:'men',name:'Leather Belt',price:399,orig:599,sizes:['FREE SIZE'],rating:4.5,reviews:234,desc:'Genuine leather belt with a classic buckle. One size fits all.',badge:'SALE'},
    {id:11,cat:'women',name:'Floral Kurti',price:749,orig:1199,sizes:['XS','S','M','L','XL'],rating:4.7,reviews:189,desc:'Beautiful floral print kurti in soft rayon fabric. Lightweight and breathable.',badge:'SALE'},
    {id:12,cat:'women',name:'Palazzo Set',price:999,orig:1599,sizes:['S','M','L','XL'],rating:4.5,reviews:142,desc:'Elegant palazzo set with matching dupatta. Perfect for festivals and casual wear.',badge:'SALE'},
    {id:13,cat:'women',name:'Casual Crop Top',price:499,orig:699,sizes:['XS','S','M','L'],rating:4.2,reviews:98,desc:'Trendy crop top in soft jersey fabric. Great for daily wear.',badge:'SALE'},
    {id:14,cat:'women',name:'High Waist Jeans',price:1499,orig:2199,sizes:['26','28','30','32'],rating:4.6,reviews:176,desc:'Premium stretch denim high waist jeans with a flattering cut.',badge:'SALE'},
    {id:15,cat:'women',name:'Embroidered Salwar',price:1299,orig:1999,sizes:['S','M','L','XL'],rating:4.8,reviews:213,desc:'Traditional embroidered salwar kameez set. Perfect for festive occasions.',badge:'NEW'},
    {id:16,cat:'women',name:'Summer Maxi Dress',price:1199,orig:1799,sizes:['XS','S','M','L','XL'],rating:4.4,reviews:87,desc:'Flowy maxi dress in chiffon fabric. Ideal for beach and outdoor events.',badge:'SALE'},
    {id:17,cat:'women',name:'Sports Leggings',price:699,orig:999,sizes:['XS','S','M','L'],rating:4.5,reviews:321,desc:'High-performance yoga leggings with tummy control and 4-way stretch.',badge:'SALE'},
    {id:18,cat:'women',name:'Ethnic Dupatta',price:299,orig:499,sizes:['FREE SIZE'],rating:4.3,reviews:144,desc:'Hand-block printed dupatta in pure cotton. Add elegance to any outfit.',badge:'SALE'},
    {id:19,cat:'women',name:'Off-Shoulder Top',price:599,orig:899,sizes:['XS','S','M','L'],rating:4.1,reviews:76,desc:'Stylish off-shoulder top with ruffle details. Great for parties.',badge:'NEW'},
    {id:20,cat:'women',name:'Handbag — Tote Style',price:899,orig:1499,sizes:['ONE SIZE'],rating:4.7,reviews:265,desc:'Spacious tote bag in vegan leather. Multiple compartments, magnetic closure.',badge:'SALE'},
    {id:21,cat:'electronics',name:'Wireless Earbuds Pro',price:1299,orig:2499,sizes:['ONE SIZE'],rating:4.6,reviews:567,desc:'True wireless earbuds with 30-hour battery, active noise cancellation, IPX5 water resistance.',badge:'SALE'},
    {id:22,cat:'electronics',name:'Smart Watch Series 5',price:2499,orig:4999,sizes:['ONE SIZE'],rating:4.5,reviews:389,desc:'Fitness smartwatch with heart rate monitor, SpO2, GPS, 7-day battery life.',badge:'SALE'},
    {id:23,cat:'electronics',name:'Portable Bluetooth Speaker',price:899,orig:1499,sizes:['ONE SIZE'],rating:4.4,reviews:234,desc:'360° sound, waterproof, 12-hour battery. Perfect for travel and outdoor use.',badge:'SALE'},
    {id:24,cat:'electronics',name:'USB-C Fast Charger 65W',price:499,orig:799,sizes:['ONE SIZE'],rating:4.7,reviews:812,desc:'65W GaN fast charger supports PD 3.0. Compatible with all USB-C devices.',badge:'NEW'},
    {id:25,cat:'electronics',name:'Gaming Headset RGB',price:1799,orig:2999,sizes:['ONE SIZE'],rating:4.3,reviews:178,desc:'7.1 surround sound gaming headset with RGB lighting and noise-cancelling mic.',badge:'SALE'},
    {id:26,cat:'electronics',name:'Phone Stand with MagSafe',price:599,orig:999,sizes:['ONE SIZE'],rating:4.5,reviews:156,desc:'Magnetic phone stand with MagSafe compatibility. Adjustable angle, desktop use.',badge:'NEW'},
    {id:27,cat:'electronics',name:'Mechanical Keyboard',price:2999,orig:4499,sizes:['ONE SIZE'],rating:4.8,reviews:234,desc:'Compact 75% mechanical keyboard with RGB backlight, tactile switches.',badge:'SALE'},
    {id:28,cat:'electronics',name:'Webcam 1080p HD',price:1499,orig:2299,sizes:['ONE SIZE'],rating:4.4,reviews:198,desc:'1080p Full HD webcam with built-in microphone. Plug & play, works on all OS.',badge:'SALE'},
    {id:29,cat:'electronics',name:'Power Bank 20000mAh',price:1199,orig:1999,sizes:['ONE SIZE'],rating:4.6,reviews:445,desc:'20000mAh power bank with fast charging, 2 USB-A + 1 USB-C output.',badge:'SALE'},
    {id:30,cat:'electronics',name:'LED Desk Lamp',price:799,orig:1299,sizes:['ONE SIZE'],rating:4.3,reviews:167,desc:'Smart LED desk lamp with adjustable color temperature, USB charging port.',badge:'NEW'}
  ];

  const blogPostsText = originalTs.match(/export const BLOG_POSTS: BlogPost\[\] = \[[^]*?\];/);
  if (!blogPostsText) {
    throw new Error('Could not find BLOG_POSTS array in original file.');
  }

  // Generate the formatted list of products
  const productsOutputText = `export const PRODUCTS: Product[] = [
  // Original Products
${originalProductsList.map(p => `  ${JSON.stringify(p)},`).join('\n')}

  // Shopify CSV Imported Dresses
${newProductsList.map(p => `  ${JSON.stringify(p, null, 2).replace(/\n/g, '\n  ')},`).join('\n')}
];`;

  // Combine everything back into products.ts
  const finalTsContent = `${updatedInterface}

${blogPostInterface}

${productsOutputText}

${blogPostsText[0]}`;

  fs.writeFileSync(tsPath, finalTsContent, 'utf8');
  console.log('Successfully updated src/data/products.ts with CSV dresses!');
  
} catch (error) {
  console.error('Error running parser script:', error);
  process.exit(1);
}
