const fs = require('fs');
const path = require('path');

const meeshoRaw = [
  {
    id: "meesho_8mbzow",
    meeshoUrl: "https://www.meesho.com/womens-lucknowi-black-design-chikankari-yellow-kurti/p/8mbzow",
    title: "Women's Lucknowi Black Design Chikankari Yellow Kurti",
    price: 349,
    oldPrice: 899,
    category: "Women's Ethnic",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Yellow', 'Black', 'Off White'],
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Authentic Lucknowi hand-crafted Chikankari thread embroidery on pure breathable cotton.",
    description: "Elevate your festive and casual wardrobe with this elegant Lucknowi Chikankari Yellow Kurti. Featuring intricate black thread hand embroidery, 3/4th sleeves, and a soft breathable pure cotton fabric. Perfect for daily wear, festive gatherings, and office wear. Easy machine wash cold or gentle hand wash.",
    rating: 4.6,
    reviewCount: 428,
    reviews: [
      {
        id: "rev_1",
        author: "Pooja Sharma",
        rating: 5,
        date: "14 Jul 2026",
        comment: "Fabric quality is superb! The Chikankari threadwork is very neat and yellow shade looks bright and vibrant.",
        verified: true,
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop"]
      },
      {
        id: "rev_2",
        author: "Ananya Roy",
        rating: 4,
        date: "28 Jun 2026",
        comment: "Fit is perfect as per size chart. Received full compliments from colleagues!",
        verified: true
      },
      {
        id: "rev_3",
        author: "Ritu Verma",
        rating: 5,
        date: "10 Jun 2026",
        comment: "Super fast delivery and very comfortable for hot Indian summers.",
        verified: true
      }
    ]
  },
  {
    id: "meesho_5rgxr3",
    meeshoUrl: "https://www.meesho.com/girls-net-emboidery-long-lenth-lahega-party-wear-festive-maroon-with-silver-embroidery-layered-flared-skirt-sequins-embroidery-ethnicfestive-lehenga-tiered-skirt-long-sleeve-round-tiered-maxi-girls-festive-net-headband/p/5rgxr3",
    title: "Girls Net Embroidery Long Lehenga Partywear Set with Headband (Maroon)",
    price: 599,
    oldPrice: 1499,
    category: "Kids Fashion",
    sizes: ['2-3 Y', '4-5 Y', '6-7 Y', '8-9 Y', '10-11 Y'],
    colors: ['Maroon & Silver', 'Royal Blue', 'Pink'],
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Heavy festive net lehenga skirt with silver sequins embroidery and matching dupatta headband.",
    description: "Make your little girl look like a princess with this gorgeous maroon flared lehenga set. Detailed with intricate silver sequins, soft inner lining for skin protection, and a matching festive net headband. Ideal for weddings, festivals, and birthday celebrations.",
    rating: 4.7,
    reviewCount: 312,
    reviews: [
      {
        id: "rev_5rg_1",
        author: "Sneha Gupta",
        rating: 5,
        date: "20 Jul 2026",
        comment: "My daughter looked so beautiful on Diwali! Inner cotton lining is soft so no itchiness.",
        verified: true
      },
      {
        id: "rev_5rg_2",
        author: "Meenakshi K.",
        rating: 5,
        date: "02 Jul 2026",
        comment: "Awesome flare and sequins shimmer nicely in wedding photos.",
        verified: true
      }
    ]
  },
  {
    id: "meesho_79voca",
    meeshoUrl: "https://www.meesho.com/mattrress-protector-100-terry-cotton-bed-protector-waterproof-for-baby-elastic-fitted-waterproof-mattress-protector-king-size-queen-size-double-bed-size-full-size-breathable-bed-cover-mattress-cover-200-gsm-maroon/p/79voca",
    title: "100% Terry Cotton Waterproof Elastic Mattress Protector 200 GSM (Maroon)",
    price: 389,
    oldPrice: 999,
    category: "Home & Living",
    sizes: ['Single', 'Double', 'Queen', 'King'],
    colors: ['Maroon', 'Navy Blue', 'Grey', 'Beige'],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582582621959-48d273528920?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Ultra-absorbent 200 GSM terry cotton surface with TPU waterproof backing & 360-degree elastic fit.",
    description: "Protect your expensive mattress against spills, dust mites, and liquid stains. Made from top-grade 200 GSM breathable terry cotton with noise-free waterproof TPU membrane underneath. Fitted with elastic border skirt for snug fit up to 9 inch mattress thickness.",
    rating: 4.8,
    reviewCount: 890,
    reviews: [
      {
        id: "rev_79_1",
        author: "Karan Malhotra",
        rating: 5,
        date: "22 Jul 2026",
        comment: "Tested with spilled water and coffee – 100% waterproof! No leakage onto mattress.",
        verified: true
      },
      {
        id: "rev_79_2",
        author: "Deepika S.",
        rating: 5,
        date: "11 May 2026",
        comment: "Very soft terry surface, no rustling sound while sleeping.",
        verified: true
      }
    ]
  },
  {
    id: "meesho_5vhjf4",
    meeshoUrl: "https://www.meesho.com/kids-play-tent-house-for-3-13-year-old-kids-girls-and-boys-rocket-space/p/5vhjf4",
    title: "Kids Portable Play Tent House - Rocket Space Theme (3-13 Years)",
    price: 499,
    oldPrice: 1299,
    category: "Toys & Kids",
    sizes: ['Standard (4ft x 3.5ft)'],
    colors: ['Space Blue', 'Cosmic Navy'],
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Foldable astronaut space exploration playhouse tent with mesh windows & carry pouch.",
    description: "Spark your children's imagination with this rocket space theme play tent! Easy pop-up assembly, durable non-toxic polyester fabric, breathable mesh ventilation windows, and compact carry bag included. Fits 2-3 toddlers inside comfortably.",
    rating: 4.5,
    reviewCount: 245,
    reviews: [
      {
        id: "rev_5vh_1",
        author: "Vikram Das",
        rating: 5,
        date: "19 Jul 2026",
        comment: "My 4 year old son loves playing inside his rocket house all day!",
        verified: true
      }
    ]
  },
  {
    id: "meesho_59pvrg",
    meeshoUrl: "https://www.meesho.com/amazing-sling-bag-with-small-pouch/p/59pvrg",
    title: "Designer Leatherette Sling Bag with Detachable Coin Pouch",
    price: 269,
    oldPrice: 699,
    category: "Bags & Accessories",
    colors: ['Black', 'Tan Brown', 'Pastel Pink', 'Olive'],
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Chic crossbody shoulder sling bag with adjustable wide strap and matching round coin pouch.",
    description: "Sleek and versatile crossbody sling bag crafted from high quality vegan PU leather. Comes with a detachable mini pouch for earphones or change, gold-tone hardware zippers, and multiple organized internal pockets.",
    rating: 4.6,
    reviewCount: 610,
    reviews: [
      {
        id: "rev_59_1",
        author: "Kavya Menon",
        rating: 5,
        date: "05 Jul 2026",
        comment: "Looks so classy! The extra pouch is super handy for holding keychains and lip balm.",
        verified: true
      }
    ]
  }
];

console.log("Meesho dataset generator created base sample template.");
