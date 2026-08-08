const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.ts');
let fileContent = fs.readFileSync(productsPath, 'utf8');

// Match baseProducts array
const match = fileContent.match(/const baseProducts: Product\[\] = (\[[\s\S]*?\]);\r?\n\r?\nexport const products/);
if (!match) {
  console.error('Could not parse baseProducts from products.ts');
  process.exit(1);
}

const baseProducts = JSON.parse(match[1]);

// Brand new "Latest Drop" items with high-resolution e-commerce images and full detail
const LATEST_DROPS_ITEMS = [
  {
    "id": "drop_ff_01",
    "title": "Free Fire Streetwear Heavyweight Oversized Graphic Hoodie",
    "price": 899,
    "oldPrice": 2499,
    "category": "Men's Fashion",
    "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop"
    ],
    "shortDescription": "400 GSM 100% Organic Super-Combed Cotton Fleece Hoodie with High-Density Cyberpunk Print.",
    "description": "Designed for maximum street style and comfort. Features a double-layered hood, ribbed cuffs, kangaroo pocket, drop shoulder silhouette, and ultra-durable high-density screen printing that won't fade.",
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["Midnight Black", "Charcoal Gray", "Cyber Amber"],
    "isNew": true,
    "rating": 4.9,
    "reviewCount": 384,
    "reviews": [
      {
        "id": "drop_rev_1",
        "author": "Aman Verma",
        "rating": 5,
        "date": "Yesterday",
        "comment": "The fleece material is crazy thick and premium! Fitting is perfectly oversized.",
        "verified": true
      },
      {
        "id": "drop_rev_2",
        "author": "Kunal Singh",
        "rating": 5,
        "date": "2 days ago",
        "comment": "Best hoodie I've bought online. Print quality is top notch!",
        "verified": true
      }
    ]
  },
  {
    "id": "drop_ff_02",
    "title": "Noise ColorFit Ultra 3 Smartwatch with AMOLED Display & Bluetooth Calling",
    "price": 1999,
    "oldPrice": 4999,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop"
    ],
    "shortDescription": "1.96\" HD AMOLED Display, Metallic Alloy Dial, 100+ Sports Modes & 7-Day Battery.",
    "description": "Experience crystal clear visual display with 600 nits brightness, TruSync Bluetooth calling technology, 24/7 heart rate monitoring, SpO2 sensor, and IP68 waterproof rating.",
    "sizes": ["Standard"],
    "colors": ["Jet Black", "Silver Metallic", "Rose Gold"],
    "isNew": true,
    "rating": 4.8,
    "reviewCount": 512,
    "reviews": [
      {
        "id": "drop_rev_3",
        "author": "Rishi Kapoor",
        "rating": 5,
        "date": "3 days ago",
        "comment": "AMOLED display is super sharp outdoors! Calling feature works crystal clear.",
        "verified": true
      }
    ]
  },
  {
    "id": "drop_ff_03",
    "title": "OnePlus Nord Wireless Earbuds Pro with Active Noise Cancellation (ANC)",
    "price": 1499,
    "oldPrice": 3999,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop"
    ],
    "shortDescription": "12.4mm Dynamic Titanium Drivers, 30dB Active Noise Cancellation & 38H Total Playtime.",
    "description": "Immerse yourself in deep bass with Ultra Bass Technology 2.0, dual-mic AI call noise reduction, 10-minute ultra-fast charging, and IP55 water and sweat resistance.",
    "sizes": ["Standard"],
    "colors": ["Matte Black", "Pearl White", "Slate Blue"],
    "isNew": true,
    "rating": 4.9,
    "reviewCount": 620,
    "reviews": [
      {
        "id": "drop_rev_4",
        "author": "Siddharth N.",
        "rating": 5,
        "date": "1 day ago",
        "comment": "Bass is unreal! Noise cancellation cuts out traffic noise completely.",
        "verified": true
      }
    ]
  },
  {
    "id": "drop_ff_04",
    "title": "Royal Silk Zari Heavy Embroidered Anarkali Suit with Organza Dupatta",
    "price": 1299,
    "oldPrice": 3999,
    "category": "Women's Ethnic",
    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
    ],
    "shortDescription": "Heavy flared Anarkali gown in art silk fabric with golden zari thread embroidery work.",
    "description": "Stun at weddings and festive occasions with this heavy royal Anarkali gown. Features a 4-meter flare, soft micro-cotton inner lining, detailed handwork neckline, and a contrasting cutwork organza dupatta.",
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["Emerald Green", "Royal Ruby", "Mustard Gold"],
    "isNew": true,
    "rating": 4.8,
    "reviewCount": 289,
    "reviews": [
      {
        "id": "drop_rev_5",
        "author": "Pooja Hegde",
        "rating": 5,
        "date": "4 days ago",
        "comment": "Fabric flare is huge and golden zari work looks ultra-expensive!",
        "verified": true
      }
    ]
  },
  {
    "id": "drop_ff_05",
    "title": "Puma Retro Heritage Genuine Leather Casual Sneakers",
    "price": 1299,
    "oldPrice": 3499,
    "category": "Footwear",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop"
    ],
    "shortDescription": "Premium leather sneaker with SoftFoam+ cushioned footbed and high-grip rubber outsole.",
    "description": "Step out in classic vintage court style. Engineered with breathable perforated toe box, durable leather upper, impact-absorbing midsole, and anti-slip rubber tread.",
    "sizes": ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    "colors": ["White & Red", "Black & White", "All White"],
    "isNew": true,
    "rating": 4.9,
    "reviewCount": 440,
    "reviews": [
      {
        "id": "drop_rev_6",
        "author": "Varun Sharma",
        "rating": 5,
        "date": "3 days ago",
        "comment": "Super soft footbed cushion and looks fire with jeans or cargo pants!",
        "verified": true
      }
    ]
  },
  {
    "id": "drop_ff_06",
    "title": "Designer Genuine Leather Crossbody Sling Bag for Men & Women",
    "price": 499,
    "oldPrice": 1499,
    "category": "Bags & Accessories",
    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    "images": [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop"
    ],
    "shortDescription": "Handcrafted PU Leather Sling Bag with Multi-Zipper Compartments and USB Charger Port.",
    "description": "Keep your phone, tablet, wallet, keys, and power bank organized securely. Water-resistant outer shell, adjustable shoulder strap, and anti-theft hidden back pocket.",
    "sizes": ["Standard"],
    "colors": ["Tan Brown", "Vintage Black", "Chocolate Brown"],
    "isNew": true,
    "rating": 4.7,
    "reviewCount": 310,
    "reviews": [
      {
        "id": "drop_rev_7",
        "author": "Deepak Patel",
        "rating": 5,
        "date": "Yesterday",
        "comment": "Zippers are smooth and leather finish feels premium. Great travel bag!",
        "verified": true
      }
    ]
  }
];

// Customer review pools for baseProducts
const REVIEW_AUTHORS = [
  "Vikramaditya S.", "Priyanka Roy", "Ramesh Chhabra", "Anjali Deshmukh",
  "Gaurav Joshi", "Tanya Sen", "Karthik Nair", "Bhavna Patel", "Nikhil Mehra",
  "Swati Saxena", "Manish Pandey", "Deepika K.", "Abhishek Sharma", "Simran Gill"
];

const GENERAL_COMMENTS = [
  "Ordered for the first time from Free Fire India Shop. Really good quality and fast shipping!",
  "Value for money! The product came nicely packed and works exactly as expected.",
  "Super happy with the quality. Delivery was completed in 3 days.",
  "Very sturdy and well finished. Definitely buying more items from this drop."
];

// Update baseProducts to ensure every product has rating, reviewCount, and reviews
const updatedBaseProducts = [...LATEST_DROPS_ITEMS, ...baseProducts].map((p, idx) => {
  const rating = p.rating || Number((4.3 + (idx % 6) * 0.1).toFixed(1));
  const reviewCount = p.reviewCount || (85 + (idx * 23) % 400);

  let reviews = p.reviews || [];
  if (!reviews || reviews.length === 0) {
    const r1 = {
      id: `base_rev_${p.id}_1`,
      author: REVIEW_AUTHORS[idx % REVIEW_AUTHORS.length],
      rating: 5,
      date: `${(idx % 5) + 2} days ago`,
      comment: GENERAL_COMMENTS[idx % GENERAL_COMMENTS.length],
      verified: true
    };
    const r2 = {
      id: `base_rev_${p.id}_2`,
      author: REVIEW_AUTHORS[(idx + 4) % REVIEW_AUTHORS.length],
      rating: 4,
      date: `${(idx % 7) + 6} days ago`,
      comment: "Great quality product for this price point. Would recommend!",
      verified: true
    };
    reviews = [r1, r2];
  }

  // Set isNew true on top products if not set
  const isNew = p.isNew !== undefined ? p.isNew : (idx < 12);

  return {
    ...p,
    rating,
    reviewCount,
    reviews,
    isNew
  };
});

// Reconstruct products.ts file content safely
const newBaseProductsJSON = JSON.stringify(updatedBaseProducts, null, 2);

const newFileContent = fileContent.replace(
  /const baseProducts: Product\[\] = \[[\s\S]*?\];\r?\n\r?\nexport const products/,
  `const baseProducts: Product[] = ${newBaseProductsJSON};\n\nexport const products`
);

fs.writeFileSync(productsPath, newFileContent, 'utf8');
console.log('Successfully updated products.ts baseProducts with reviews and new latest drops!');
