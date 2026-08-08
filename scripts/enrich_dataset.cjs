const fs = require('fs');
const path = require('path');

// 1. Load meeshoData.ts
const meeshoPath = path.join(__dirname, '../src/data/meeshoData.ts');
const meeshoContent = fs.readFileSync(meeshoPath, 'utf8');

const meeshoMatch = meeshoContent.match(/export const meeshoProducts: Product\[\] = (\[[\s\S]*\]);/);
if (!meeshoMatch) {
  console.error('Failed to parse meeshoProducts');
  process.exit(1);
}

const meeshoProducts = JSON.parse(meeshoMatch[1]);

// Category normalization map for Meesho products to ensure no empty or redundant micro-categories
const CATEGORY_MAP = {
  "Women's Ethnic": "Women's Ethnic",
  "Maternity & Ethnic": "Women's Ethnic",
  "Women's Western": "Women's Fashion",
  "Women's Casual": "Women's Fashion",
  "Activewear & Lingerie": "Women's Fashion",
  "Lingerie & Innerwear": "Women's Fashion",
  "Health & Shapewear": "Women's Fashion",
  "Kids Fashion": "Kids & Baby",
  "Toys & Kids": "Kids & Baby",
  "Baby Care & Bags": "Kids & Baby",
  "Kids & Festive": "Kids & Baby",
  "Bags & Accessories": "Bags & Accessories",
  "Bags & Backpacks": "Bags & Accessories",
  "Luggage & Travel": "Bags & Accessories",
  "Jewellery & Accessories": "Jewellery & Accessories",
  "Footwear": "Footwear",
  "Home & Living": "Home & Living",
  "Home & Gifts": "Home & Living",
  "Home & Decor": "Home & Living",
  "Home Decor & Lighting": "Home & Living",
  "Home Decor & Religious": "Home & Living",
  "Home Decor & Festive": "Home & Living",
  "Home Decor & Rugs": "Home & Living",
  "Home Storage & Furniture": "Home & Living",
  "Kitchen Appliances": "Home & Living",
  "Kitchen & Storage": "Home & Living",
  "Arts & Crafts": "Home & Living",
  "Men's Accessories": "Men's Fashion",
  "Men's Accessories & Gifts": "Men's Fashion"
};

// Customer review pools for realistic Indian e-commerce reviews
const REVIEW_AUTHORS = [
  "Pooja Sharma", "Rahul Verma", "Ananya Roy", "Vikram Patel", "Sneha Kulkarni",
  "Amitabh Sen", "Ritu Singh", "Siddharth Rao", "Priya Das", "Karan Malhotra",
  "Neha Gupta", "Rohan Mehta", "Divya Nair", "Suresh Kumar", "Meera Joshi",
  "Arjun Deshmukh", "Kavita Reddy", "Deepak Saxena", "Shweta Banerjee", "Manish Agarwal"
];

const GENERAL_COMMENTS = [
  "Excellent product quality! Exceeded my expectations for this price range.",
  "Very fast delivery across India. Product matches the description and images perfectly.",
  "Super comfortable and great material. Highly recommended to everyone!",
  "Value for money! Packaging was neat and undamaged. Will order again soon.",
  "Top notch quality! Fabric/finish feels premium and looks stylish.",
  "Very happy with this purchase. Fits perfectly and looks elegant.",
  "Received within 3 days. Quality is genuine and worth every rupee."
];

const FASHION_COMMENTS = [
  "Fabric is soft, breathable, and very comfortable for daily wear.",
  "Stitching is clean and fitting is true to size chart. Looks amazing!",
  "Colors are vibrant just like in the photos. Got so many compliments!",
  "Great quality material, no color bleeding after wash. 10/10 purchase."
];

const ELECTRONICS_COMMENTS = [
  "Battery backup is amazing and build quality feels solid.",
  "Works flawlessly! Audio/performance is crystal clear and smooth.",
  "Unboxed and tested immediately. Super satisfied with performance."
];

function generateReviewsForProduct(product, index) {
  const numReviews = 3 + (index % 3);
  const reviews = [];
  const rating = Number((4.3 + (index % 6) * 0.1).toFixed(1));
  const reviewCount = 120 + (index * 17) % 450;

  for (let i = 0; i < numReviews; i++) {
    const author = REVIEW_AUTHORS[(index + i * 3) % REVIEW_AUTHORS.length];
    let commentList = GENERAL_COMMENTS;
    if (product.category.includes("Fashion") || product.category.includes("Ethnic")) {
      commentList = FASHION_COMMENTS;
    } else if (product.category === "Electronics") {
      commentList = ELECTRONICS_COMMENTS;
    }
    const comment = commentList[(index + i) % commentList.length];
    const daysAgo = (i + 1) * 3 + (index % 5);
    
    reviews.push({
      id: `rev_${product.id}_${i + 1}`,
      author: author,
      rating: 5 - (i % 2 === 0 ? 0 : 1),
      date: `${daysAgo} days ago`,
      comment: comment,
      verified: true
    });
  }

  return { rating, reviewCount, reviews };
}

// Process Meesho Products
const cleanedMeeshoProducts = meeshoProducts.map((p, idx) => {
  const normCategory = CATEGORY_MAP[p.category] || p.category;
  const reviewData = generateReviewsForProduct({ ...p, category: normCategory }, idx);
  
  return {
    ...p,
    category: normCategory,
    rating: p.rating || reviewData.rating,
    reviewCount: p.reviewCount || reviewData.reviewCount,
    reviews: (p.reviews && p.reviews.length >= 2) ? p.reviews : reviewData.reviews
  };
});

// Write updated meeshoData.ts
const newMeeshoCode = `// Automatically generated Meesho catalog dataset
import { Product } from './products';

export const meeshoProducts: Product[] = ${JSON.stringify(cleanedMeeshoProducts, null, 2)};
`;

fs.writeFileSync(meeshoPath, newMeeshoCode, 'utf8');
console.log('Successfully updated meeshoData.ts with normalized categories and reviews!');
