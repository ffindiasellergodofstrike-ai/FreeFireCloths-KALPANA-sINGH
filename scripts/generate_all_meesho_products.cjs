const fs = require('fs');
const path = require('path');

const meeshoItems = [
  {
    id: "meesho_8mbzow",
    title: "Women's Lucknowi Black Design Chikankari Yellow Kurti",
    price: 349,
    oldPrice: 899,
    category: "Women's Ethnic",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Yellow & Black', 'Off White', 'Mustard'],
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Authentic Lucknowi hand-crafted Chikankari thread embroidery on soft pure cotton.",
    description: "Elevate your wardrobe with this traditional Lucknowi Chikankari Yellow Kurti featuring delicate black thread floral motifs. Designed with 3/4 sleeves, straight fit hemline, and breathable cotton slub weave.",
    rating: 4.6,
    reviewCount: 428,
    reviews: [
      { id: "r1", author: "Pooja Sharma", rating: 5, date: "14 Jul 2026", comment: "Fabric is soft and comfortable. Threadwork is intricate and beautiful!", verified: true },
      { id: "r2", author: "Ananya Roy", rating: 4, date: "28 Jun 2026", comment: "True to size. Looks stunning with white leggings.", verified: true },
      { id: "r3", author: "Sneha V.", rating: 5, date: "02 May 2026", comment: "Value for money product!", verified: true }
    ]
  },
  {
    id: "meesho_5rgxr3",
    title: "Girls Net Embroidery Long Lehenga Party Wear Set with Headband (Maroon)",
    price: 599,
    oldPrice: 1499,
    category: "Kids Fashion",
    sizes: ['2-3 Y', '4-5 Y', '6-7 Y', '8-9 Y', '10-11 Y'],
    colors: ['Maroon & Silver', 'Royal Blue', 'Deep Rose'],
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Heavy festive net lehenga skirt with silver sequins embroidery and matching net headband.",
    description: "Make your little girl sparkle in this traditional maroon flared lehenga set featuring silver sequins embroidery, tiered skirt flare, skin-friendly soft lining, and a matching headband.",
    rating: 4.7,
    reviewCount: 312,
    reviews: [
      { id: "r4", author: "Sangeeta Gupta", rating: 5, date: "20 Jul 2026", comment: "My daughter looked like a princess on her birthday!", verified: true },
      { id: "r5", author: "Kiran R.", rating: 5, date: "05 Jun 2026", comment: "Stitching quality and net softness are top class.", verified: true }
    ]
  },
  {
    id: "meesho_79voca",
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
    shortDescription: "Absorbent 200 GSM terry top with 100% liquid-proof TPU backing layer.",
    description: "Shield your mattress from spills, bedwetting, stains, and dust mites. Ultra-soft terry cotton surface absorbs moisture while the breathable TPU layer blocks liquid penetration completely.",
    rating: 4.8,
    reviewCount: 890,
    reviews: [
      { id: "r6", author: "Rakesh Verma", rating: 5, date: "22 Jul 2026", comment: "Best mattress cover! Fully waterproof and zero rustling noise.", verified: true },
      { id: "r7", author: "Divya N.", rating: 5, date: "11 Apr 2026", comment: "Saves mattress from baby liquid spills. Highly recommended!", verified: true }
    ]
  },
  {
    id: "meesho_5vhjf4",
    title: "Kids Play Tent House - Rocket Space Theme (3-13 Years)",
    price: 499,
    oldPrice: 1299,
    category: "Toys & Kids",
    sizes: ['Standard (4ft x 3.5ft)'],
    colors: ['Cosmic Blue', 'Galaxy Navy'],
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Easy pop-up space adventure play tent with breathable mesh windows.",
    description: "Indoor & outdoor portable rocket ship play tent for kids. Made of sturdy non-toxic polyester fabric with flexible pop-up frame and zip-up curtain door.",
    rating: 4.5,
    reviewCount: 245,
    reviews: [
      { id: "r8", author: "Karan D.", rating: 5, date: "19 Jul 2026", comment: "My kids stay busy inside for hours. Quick to setup and fold back.", verified: true }
    ]
  },
  {
    id: "meesho_59pvrg",
    title: "Designer Vegan Leather Sling Bag with Small Pouch",
    price: 269,
    oldPrice: 699,
    category: "Bags & Accessories",
    colors: ['Black', 'Tan Brown', 'Pastel Pink', 'Olive Green'],
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Trendy crossbody sling bag with adjustable shoulder strap and round coin pouch.",
    description: "Compact yet spacious vegan leather shoulder bag with smooth zip closure, gold metal rivets, and an auxiliary round coin pouch for headphones or change.",
    rating: 4.6,
    reviewCount: 610,
    reviews: [
      { id: "r9", author: "Tanya M.", rating: 5, date: "05 Jul 2026", comment: "Super cute and stylish bag! Quality is amazing for the price.", verified: true }
    ]
  },
  {
    id: "meesho_87ntjx",
    title: "Kids Ethnic Sharara Set for Girls with Kurti & Dupatta",
    price: 449,
    oldPrice: 1199,
    category: "Kids Fashion",
    sizes: ['2-3 Y', '4-5 Y', '6-7 Y', '8-9 Y', '10-11 Y'],
    colors: ['Yellow & Pink', 'Mint Green', 'Peach'],
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Gota patti flared sharara pants with printed short kurti and chiffon dupatta.",
    description: "Vibrant ethnic festive wear for young girls. Crafted from breathable cotton blend fabric with shiny gota patti borders, flared tier sharara bottom, and lightweight matching dupatta.",
    rating: 4.6,
    reviewCount: 280,
    reviews: [
      { id: "r10", author: "Bhavna S.", rating: 5, date: "12 Jul 2026", comment: "Bright colors and perfect festive fit for my daughter.", verified: true }
    ]
  },
  {
    id: "meesho_5q1p4p",
    title: "Kids Play Tent House for Girls - Purple Princess Castle Theme",
    price: 529,
    oldPrice: 1399,
    category: "Toys & Kids",
    sizes: ['Standard Playhouse'],
    colors: ['Princess Purple', 'Rose Pink'],
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Enchanted castle playhouse tent with star fairy lights holder and mesh curtains.",
    description: "Turn any room into a magical fairy castle! Features durable fiberglass poles, breathable side mesh windows, and lightweight foldable design.",
    rating: 4.7,
    reviewCount: 195,
    reviews: [
      { id: "r11", author: "Meera K.", rating: 5, date: "01 Jul 2026", comment: "Super sturdy tent and my niece loved the purple castle design!", verified: true }
    ]
  },
  {
    id: "meesho_3sml8x",
    title: "Cute Premium Waterproof Diaper Bag Backpack (Unicorn Light Green)",
    price: 689,
    oldPrice: 1799,
    category: "Baby Care & Bags",
    colors: ['Light Green', 'Pastel Pink', 'Sky Blue'],
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Multi-pocket insulated baby organizer backpack with waterproof oxford cloth.",
    description: "Designed for smart mothers on the go! Features 3 insulated milk bottle pockets, tissue dispenser side pocket, wet-dry separator section, and cushioned shoulder straps.",
    rating: 4.8,
    reviewCount: 520,
    reviews: [
      { id: "r12", author: "Nisha P.", rating: 5, date: "25 Jun 2026", comment: "Fits so many diapers, bottles, and extra clothes. Insulated pockets keep milk warm!", verified: true }
    ]
  },
  {
    id: "meesho_8tr9g1",
    title: "Women's Cotton Partywear Kurti with Pant Set (Pack of 3)",
    price: 899,
    oldPrice: 2499,
    category: "Women's Ethnic",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Assorted Pack of 3'],
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Value pack of 3 printed cotton straight kurtis with matching trousers.",
    description: "Get 3 complete pairs of designer straight kurtis with elasticated straight pants. Crafted from premium 100% soft cotton for all-day breathability and comfort.",
    rating: 4.5,
    reviewCount: 740,
    reviews: [
      { id: "r13", author: "Aarti B.", rating: 5, date: "18 May 2026", comment: "3 sets at this price is an unbeatable deal. Good stitching and fast colors.", verified: true }
    ]
  },
  {
    id: "meesho_11w0p7",
    title: "Salwa Pure Cotton Denim Kurti - Zigzag Pattern (Navy Blue)",
    price: 399,
    oldPrice: 999,
    category: "Women's Casual",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy Blue', 'Dark Denim'],
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Smart casual denim kurti with zigzag thread stitch work & 3/4th sleeves.",
    description: "Combines the durability of denim with the comfort of a tunic kurti. Features contrast zigzag stitching, mandarin collar neck, and side slits.",
    rating: 4.4,
    reviewCount: 310,
    reviews: [
      { id: "r14", author: "Swati M.", rating: 4, date: "10 Jul 2026", comment: "Nice denim fabric for office wear.", verified: true }
    ]
  },
  {
    id: "meesho_83a3ox",
    title: "Latest Trendy Branded Blue Handbag for Women & Girls",
    price: 379,
    oldPrice: 999,
    category: "Bags & Accessories",
    colors: ['Royal Blue', 'Tan Brown', 'Black'],
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Spacious dual-handle handbag with shoulder belt & textured finish.",
    description: "Elegant tote handbag with dual sturdy handles, detachable shoulder strap, multiple zip compartments, and water-resistant synthetic exterior.",
    rating: 4.6,
    reviewCount: 480,
    reviews: [
      { id: "r15", author: "Gauri T.", rating: 5, date: "03 Jun 2026", comment: "Fits my tablet, wallet, and water bottle easily!", verified: true }
    ]
  },
  {
    id: "meesho_276y1g",
    title: "Swag Wala Bro & Most Beautiful Bhabhi Printed Ceramic Mug Set of 2",
    price: 299,
    oldPrice: 699,
    category: "Home & Gifts",
    colors: ['White Printed'],
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Premium 350ml microwave-safe ceramic coffee mug combo set for Bhaiya Bhabhi.",
    description: "Ideal gift set for Rakshabandhan, anniversaries, and family celebrations! High gloss sublimated HD print on sturdy lead-free ceramic mugs.",
    rating: 4.7,
    reviewCount: 390,
    reviews: [
      { id: "r16", author: "Rahul Sharma", rating: 5, date: "15 Jul 2026", comment: "Print quality is sharp and mugs arrived safely packed in foam box.", verified: true }
    ]
  },
  {
    id: "meesho_89a031",
    title: "Wedding Collection Chanderi Silk Heavy Kurta Palazzo Set",
    price: 799,
    oldPrice: 2199,
    category: "Women's Ethnic",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Emerald Green', 'Royal Blue', 'Magenta'],
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Royal Chanderi silk embroidered kurta with golden lace palazzo and silk dupatta.",
    description: "Turn heads at wedding receptions and festive functions. Features glossy Chanderi silk fabric, rich zari embroidery on neck, paired with wide flare palazzo pants.",
    rating: 4.7,
    reviewCount: 512,
    reviews: [
      { id: "r17", author: "Neha J.", rating: 5, date: "29 May 2026", comment: "Silk sheen is gorgeous in person!", verified: true }
    ]
  },
  {
    id: "meesho_yg9b7",
    title: "Zainto Textured Leatherette 35L Flight Cabin Travel Duffle Bag (Brown)",
    price: 649,
    oldPrice: 1899,
    category: "Luggage & Travel",
    colors: ['Tan Brown', 'Dark Chocolate', 'Matte Black'],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Approved 7kg flight cabin luggage bag with padded shoulder strap & shoe section.",
    description: "Stylish 35-liter travel duffle bag crafted from premium textured leatherette. Water-resistant outer shell, heavy-duty metal brass zippers, and reinforced base studs.",
    rating: 4.8,
    reviewCount: 680,
    reviews: [
      { id: "r18", author: "Amit S.", rating: 5, date: "04 Jul 2026", comment: "Used as flight carry-on luggage. Very spacious and sleek brown leather look!", verified: true }
    ]
  },
  {
    id: "meesho_7fovp7",
    title: "3-in-1 Postpartum Belly Band Support & Slimming Belt (Beige)",
    price: 429,
    oldPrice: 1199,
    category: "Health & Shapewear",
    sizes: ['Free Size (Adjustable)'],
    colors: ['Beige'],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Post-pregnancy abdominal waist & pelvis recovery wrap band.",
    description: "Provides medical-grade compression and core support after delivery. Includes belly belt, waist belt, and pelvis wrap with breathable elastic velcro tabs.",
    rating: 4.6,
    reviewCount: 410,
    reviews: [
      { id: "r19", author: "Priya N.", rating: 5, date: "16 Jun 2026", comment: "Helped immensely with back pain after my delivery.", verified: true }
    ]
  },
  {
    id: "meesho_79n3cy",
    title: "Women Plus Size Striped Cotton Blue Shirt",
    price: 359,
    oldPrice: 899,
    category: "Women's Western",
    sizes: ['XL', 'XXL', '3XL', '4XL', '5XL'],
    colors: ['Striped Blue', 'Striped White'],
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Breathable vertical striped relaxed fit button-down formal shirt.",
    description: "Flattering plus-size cotton shirt designed with vertical pinstripes, soft collar, roll-up sleeve tabs, and curved hemline for office and casual wear.",
    rating: 4.5,
    reviewCount: 230,
    reviews: [
      { id: "r20", author: "Monica R.", rating: 5, date: "22 Jun 2026", comment: "Comfortable fit around shoulders and hips.", verified: true }
    ]
  },
  {
    id: "meesho_6r1uuq",
    title: "Multi-utility Duffle Gym & Travel Bag",
    price: 299,
    oldPrice: 799,
    category: "Luggage & Travel",
    colors: ['Navy Blue', 'Black', 'Charcoal Grey'],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Lightweight waterproof nylon gym barrel bag with wet pocket.",
    description: "Versatile gym and weekend bag with dedicated shoe compartment, waterproof wet pouch for towels, and tough cross-body strap.",
    rating: 4.4,
    reviewCount: 310,
    reviews: [
      { id: "r21", author: "Varun K.", rating: 4, date: "09 Jul 2026", comment: "Good quality zippers and lightweight nylon fabric.", verified: true }
    ]
  },
  {
    id: "meesho_sf68r",
    title: "Arion Rechargeable Wooden LED Book Night Lamp (Walnut Wood)",
    price: 499,
    oldPrice: 1299,
    category: "Home Decor & Lighting",
    colors: ['Walnut Wood'],
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Magnetic 360-degree folding wooden book lamp with 3 color LED illumination.",
    description: "Unique gift item that opens like a magical glowing book! Built with real laser-cut walnut wood, Dupont Tyvek waterproof paper pages, and USB rechargeable battery.",
    rating: 4.8,
    reviewCount: 540,
    reviews: [
      { id: "r22", author: "Aniket S.", rating: 5, date: "17 Jul 2026", comment: "Looks incredible on my bedside table! Warm ambient light.", verified: true }
    ]
  },
  {
    id: "meesho_8wvfex",
    title: "Green Stunning Bridal Hair Piece to Necklace Set",
    price: 329,
    oldPrice: 899,
    category: "Jewellery & Accessories",
    colors: ['Emerald Green'],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Multipurpose Kundan hair accessory and choker necklace with pearls.",
    description: "Dual-purpose ethnic jewellery piece adorned with green glass beads, Kundan stones, and faux pearls. Can be worn as a choker necklace or hair damini/matha patti.",
    rating: 4.6,
    reviewCount: 290,
    reviews: [
      { id: "r23", author: "Roshni C.", rating: 5, date: "30 May 2026", comment: "Beautiful finish and sparkling Kundan stones.", verified: true }
    ]
  },
  {
    id: "meesho_8i9zy0",
    title: "Women Printed Viscose Rayon Maternity Anarkali Kurti with Invisible Zipper",
    price: 699,
    oldPrice: 1799,
    category: "Maternity & Ethnic",
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Printed Maroon', 'Floral Navy'],
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Flared feeding maternity kurti with two hidden vertical zippers.",
    description: "Designed for expecting and nursing mothers! Crafted from buttery soft viscose rayon with dual concealed side zippers for discreet feeding.",
    rating: 4.8,
    reviewCount: 410,
    reviews: [
      { id: "r24", author: "Shalini G.", rating: 5, date: "14 Jun 2026", comment: "Zippers are completely hidden and fabric is super soft.", verified: true }
    ]
  },
  {
    id: "meesho_4k7i4e",
    title: "Sparkling Striped Beads String Door Curtain (4x7 Feet)",
    price: 249,
    oldPrice: 599,
    category: "Home & Decor",
    colors: ['Multicolor String'],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Decorative PVC string bead curtain for pooja room and living room divider.",
    description: "Add a touch of elegance to doorway entrances and Mandirs with sparkling bead string curtains. Ready with rod pocket header.",
    rating: 4.3,
    reviewCount: 180,
    reviews: [
      { id: "r25", author: "Sunita P.", rating: 4, date: "08 Jul 2026", comment: "Gives a nice shimmering effect in lighting.", verified: true }
    ]
  },
  {
    id: "meesho_7tpgb0",
    title: "Indrani Ghosh Designer Denim Kurti",
    price: 379,
    oldPrice: 899,
    category: "Women's Casual",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Medium Blue Denim'],
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Modern indigo denim kurti tunic with roll-up sleeves and wooden buttons.",
    description: "Classic washed denim tunic with mandarin neck collar, wooden front buttons, and durable double-stitch hems.",
    rating: 4.5,
    reviewCount: 220,
    reviews: [
      { id: "r26", author: "Nalini K.", rating: 5, date: "21 May 2026", comment: "Great denim wash and comfortable fit.", verified: true }
    ]
  },
  {
    id: "meesho_6xq8g0",
    title: "Cluci Stylish Printed Waterproof Backpack 30L",
    price: 499,
    oldPrice: 1299,
    category: "Bags & Backpacks",
    colors: ['Multicolor Print', 'Black Floral'],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "High-capacity college and travel backpack with laptop sleeve.",
    description: "Heavy-duty 30L multi-pocket backpack built with scratch-proof waterproof fabric, padded 15.6 inch laptop sleeve, and ergonomic air-mesh shoulder straps.",
    rating: 4.7,
    reviewCount: 620,
    reviews: [
      { id: "r27", author: "Tanmay B.", rating: 5, date: "11 Jul 2026", comment: "Spacious enough for college books and laptop!", verified: true }
    ]
  },
  {
    id: "meesho_6i5x1o",
    title: "Girls Velvet Sequins Partywear Frock Dress with Matching Handbag",
    price: 549,
    oldPrice: 1399,
    category: "Kids Fashion",
    sizes: ['3-4 Y', '5-6 Y', '7-8 Y', '9-10 Y'],
    colors: ['Iridescent Black', 'Velvet Maroon'],
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Luxe winter velvet sequins dress with belt and mini handbag.",
    description: "Glamorous partywear frock for girls made from plush stretch velvet with iridescent sequin lettering, waist tie belt, and matching purse.",
    rating: 4.8,
    reviewCount: 340,
    reviews: [
      { id: "r28", author: "Juhi M.", rating: 5, date: "02 Jul 2026", comment: "Super cute outfit! The sequin shimmer is high quality.", verified: true }
    ]
  },
  {
    id: "meesho_8a0g11",
    title: "Trendy Women Floral Printed Maxi Dress",
    price: 449,
    oldPrice: 1199,
    category: "Women's Western",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Floral Pink', 'Floral Sage'],
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Flowy georgette floral print maxi dress with elasticated waist.",
    description: "Breezy bohemian maxi dress featuring botanical floral prints, gentle tiered flare, flared sleeves, and breathable lining inside.",
    rating: 4.6,
    reviewCount: 490,
    reviews: [
      { id: "r29", author: "Simran K.", rating: 5, date: "18 Jun 2026", comment: "Perfect dress for vacation and weekend brunches!", verified: true }
    ]
  },
  {
    id: "meesho_1ua2fl",
    title: "Krishna Dress Costume Set for Kids & Toddlers with Flute & Jewellery",
    price: 349,
    oldPrice: 899,
    category: "Kids & Festive",
    sizes: ['0-6 Months', '6-12 Months', '1-2 Years', '2-3 Years', '3-4 Years'],
    colors: ['Yellow & White Silk'],
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Complete Janmashtami Kanha Ji silk costume set with crown, flute & jewelry.",
    description: "Complete festive Krishna dress kit including yellow dhoti kurta, mukut (crown), peacock feather, bansuri (flute), pearl necklace, and armlets.",
    rating: 4.9,
    reviewCount: 920,
    reviews: [
      { id: "r30", author: "Archana S.", rating: 5, date: "24 Jul 2026", comment: "All accessories included. Soft silk material doesn't irritate baby skin.", verified: true }
    ]
  },
  {
    id: "meesho_77jl0n",
    title: "Elite Fancy Gold-Plated Bridal Jewellery Set",
    price: 399,
    oldPrice: 1299,
    category: "Jewellery & Accessories",
    colors: ['Gold Plated'],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "22K gold look traditional necklace set with matching dangling earrings.",
    description: "Exquisite temple design jewellery set crafted with micro gold plating, detailed filigree engraving, and adjustable dori necklace strap.",
    rating: 4.6,
    reviewCount: 380,
    reviews: [
      { id: "r31", author: "Kirti P.", rating: 5, date: "15 Jul 2026", comment: "Looks like real gold! Wore it to a wedding and everyone praised it.", verified: true }
    ]
  },
  {
    id: "meesho_7vr2xd",
    title: "Mustard Yellow Sleeveless Padded Saree Blouse",
    price: 299,
    oldPrice: 799,
    category: "Women's Ethnic",
    sizes: ['32', '34', '36', '38', '40'],
    colors: ['Mustard Yellow', 'Red', 'Black'],
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Readymade phantom silk padded saree blouse with back hook closure.",
    description: "Ready-to-wear padded blouse with deep round neck, boat neck back, internal seam margins for easy alteration, and comfortable inner cotton lining.",
    rating: 4.5,
    reviewCount: 260,
    reviews: [
      { id: "r32", author: "Radhika N.", rating: 5, date: "06 Jul 2026", comment: "Padding support is firm and fitting is perfect.", verified: true }
    ]
  },
  {
    id: "meesho_7w44kx",
    title: "Stylish Off-White Braided Flat Sandals for Women",
    price: 329,
    oldPrice: 799,
    category: "Footwear",
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: ['Off White', 'Nude Tan', 'Black'],
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Cushioned braided strap daily wear flat slides.",
    description: "Chic off-white slides featuring soft braided leatherette straps, anti-slip rubber sole, and extra cushioned footbed for effortless daily walkability.",
    rating: 4.7,
    reviewCount: 510,
    reviews: [
      { id: "r33", author: "Isha W.", rating: 5, date: "12 Jul 2026", comment: "Super comfortable sole! No shoe bites at all.", verified: true }
    ]
  },
  {
    id: "meesho_7rifvf",
    title: "Quilted Waterproof Mattress Protector King Size (220 GSM)",
    price: 599,
    oldPrice: 1499,
    category: "Home & Living",
    sizes: ['King Size', 'Queen Size', 'Double Bed'],
    colors: ['White Quilted', 'Grey Quilted'],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Thick plush quilted cotton mattress topper with 100% waterproof backing.",
    description: "Luxury hotel-grade quilted mattress pad with polyfill cushioning and silent TPU waterproofing layer underneath.",
    rating: 4.8,
    reviewCount: 640,
    reviews: [
      { id: "r34", author: "Deepak H.", rating: 5, date: "20 May 2026", comment: "Adds extra plush softness to my firm mattress while keeping it clean.", verified: true }
    ]
  },
  {
    id: "meesho_77dct6",
    title: "Comfy Feminine Printed Summer Dress for Women",
    price: 389,
    oldPrice: 999,
    category: "Women's Western",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sage Floral', 'Coral Pink'],
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Lightweight rayon A-line knee-length casual day dress.",
    description: "Effortless casual dress crafted from soft rayon fabric with V-neckline, smocked waist back, and flared hem.",
    rating: 4.5,
    reviewCount: 320,
    reviews: [
      { id: "r35", author: "Trupti L.", rating: 5, date: "27 Jun 2026", comment: "Breezy and light for summer heat.", verified: true }
    ]
  },
  {
    id: "meesho_7j8cda",
    title: "Modern Casual Comfort Flat Shoes for Women",
    price: 279,
    oldPrice: 699,
    category: "Footwear",
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: ['Beige', 'Black', 'Tan'],
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Flexible slip-on belly flats with memory foam cushioned insoles.",
    description: "Versatile daily slip-on ballerina flats with toe cap stitch detail and flexible anti-skid rubber sole.",
    rating: 4.6,
    reviewCount: 430,
    reviews: [
      { id: "r36", author: "Poonam R.", rating: 5, date: "01 Jul 2026", comment: "Very soft insole, can wear all day at work.", verified: true }
    ]
  },
  {
    id: "meesho_7k6iau",
    title: "Stylish Women A-Line Casual Western Dress",
    price: 419,
    oldPrice: 1099,
    category: "Women's Western",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy Blue', 'Wine Red'],
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Structured fit-and-flare A-line dress with belt.",
    description: "Classy fit and flare western dress with button collar neck, waist belt buckle, and elbow sleeves.",
    rating: 4.6,
    reviewCount: 290,
    reviews: [
      { id: "r37", author: "Nandini P.", rating: 5, date: "19 Jul 2026", comment: "Great fit and stitching finish.", verified: true }
    ]
  },
  {
    id: "meesho_8w6zp2",
    title: "Hand Tie-Dye Rayon Casual Relaxed Fit Shirt for Women",
    price: 349,
    oldPrice: 899,
    category: "Women's Western",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Tie-Dye Blue', 'Tie-Dye Pink'],
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Handcrafted tie-dye ombre rayon oversized casual shirt.",
    description: "Trendy oversized resort shirt featuring artisanal tie-dye spiral design, chest pocket, and drop shoulder fit.",
    rating: 4.7,
    reviewCount: 380,
    reviews: [
      { id: "r38", author: "Esha B.", rating: 5, date: "10 Jun 2026", comment: "Looks so cool paired with white denim shorts!", verified: true }
    ]
  },
  {
    id: "meesho_7dkzqm",
    title: "Handmade White Marble Laddu Gopal Bal Gopal Idol",
    price: 299,
    oldPrice: 699,
    category: "Home Decor & Religious",
    colors: ['Pure White Marble'],
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Finely carved pure white marble Laddu Gopal Ji idol for pooja mandir.",
    description: "Handcrafted stone marble idol of Lord Krishna Bal Gopal Ji with smooth polished finish and detailed facial features.",
    rating: 4.9,
    reviewCount: 780,
    reviews: [
      { id: "r39", author: "Kamla Devi", rating: 5, date: "16 Jul 2026", comment: "Divine idol! Very high quality marble finish.", verified: true }
    ]
  },
  {
    id: "meesho_70l1vj",
    title: "SKL Cross LED Decorative Wall Light 006",
    price: 399,
    oldPrice: 999,
    category: "Home Decor & Lighting",
    colors: ['Warm White LED'],
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Modern cross beam dual-way LED wall sconce light fixture.",
    description: "Energy-efficient aluminum wall light casting elegant cross beam lighting patterns up and down.",
    rating: 4.6,
    reviewCount: 210,
    reviews: [
      { id: "r40", author: "Siddharth N.", rating: 5, date: "02 Jun 2026", comment: "Transformed our hallway walls completely!", verified: true }
    ]
  },
  {
    id: "meesho_7tref2",
    title: "Forvela Camo Design Ortho Doctor Slipper Chappal",
    price: 289,
    oldPrice: 699,
    category: "Footwear",
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: ['Camo Green', 'Camo Grey'],
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Orthopedic diabetic cushioned house slippers with arch support.",
    description: "Doctor recommended acupressure slippers with extra soft EVA footbed to relieve heel pain and foot fatigue.",
    rating: 4.7,
    reviewCount: 530,
    reviews: [
      { id: "r41", author: "Usha R.", rating: 5, date: "28 May 2026", comment: "Gave great relief for my plantar fasciitis pain.", verified: true }
    ]
  },
  {
    id: "meesho_7cl9x8",
    title: "Woman Lavender Tiered Flared Maxi Dress",
    price: 499,
    oldPrice: 1299,
    category: "Women's Western",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pastel Lavender'],
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Elegant lavender tiered maxi dress with balloon sleeves.",
    description: "Dreamy lavender maxi dress designed with ruffled tiered flare, elastic smocked cuffs, and comfortable lining.",
    rating: 4.8,
    reviewCount: 420,
    reviews: [
      { id: "r42", author: "Anusha S.", rating: 5, date: "15 Jul 2026", comment: "Lavender color is so dreamy!", verified: true }
    ]
  },
  {
    id: "meesho_2uyrzz",
    title: "Flicarts Honeymoon Heavy Double Padded Push-Up Lingerie Set",
    price: 349,
    oldPrice: 899,
    category: "Lingerie & Innerwear",
    sizes: ['32B', '34B', '36B', '38B'],
    colors: ['Maroon Red', 'Midnight Black', 'Nude'],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Seamless lace push-up bra and matching lace panty set.",
    description: "Heavy double padded underwire push-up bra paired with soft lace hipster panty for superior cleavage support and seamless outline.",
    rating: 4.6,
    reviewCount: 360,
    reviews: [
      { id: "r43", author: "Megha V.", rating: 5, date: "04 Jul 2026", comment: "Great fit and good push-up support.", verified: true }
    ]
  },
  {
    id: "meesho_7qxnb6",
    title: "High Waist Wide Leg Denim Jeans for Women",
    price: 529,
    oldPrice: 1399,
    category: "Women's Western",
    sizes: ['26', '28', '30', '32', '34'],
    colors: ['Light Wash Blue', 'Dark Indigo'],
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Relaxed fit wide leg high-rise stretch denim jeans.",
    description: "Retro nineties wide-leg boyfriend jeans with flattering high waistband, deep front pockets, and premium durable denim fabric.",
    rating: 4.7,
    reviewCount: 680,
    reviews: [
      { id: "r44", author: "Kriti M.", rating: 5, date: "21 Jul 2026", comment: "Perfect wide leg silhouette! High waist gives a great waist fit.", verified: true }
    ]
  },
  {
    id: "meesho_82fqhr",
    title: "Terry Cotton Waterproof Mattress Fitted Cover 200 GSM (Multi-Size)",
    price: 449,
    oldPrice: 1099,
    category: "Home & Living",
    sizes: ['Single', 'Double', 'Queen', 'King'],
    colors: ['Grey', 'Navy', 'White'],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Deep pocket elastic fitted waterproof mattress protector sheet.",
    description: "Breathable liquid-proof mattress cover sheet with elastic skirting that fits up to 10 inch thick mattresses.",
    rating: 4.8,
    reviewCount: 710,
    reviews: [
      { id: "r45", author: "Alok S.", rating: 5, date: "18 Jun 2026", comment: "Fits securely without sliding off corners.", verified: true }
    ]
  },
  {
    id: "meesho_62wnn3",
    title: "Georgette Long Sleeve Round Neck Embroidered Kurti Dress",
    price: 649,
    oldPrice: 1699,
    category: "Women's Ethnic",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Wine Red', 'Royal Blue', 'Emerald Green'],
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Heavy embroidered full length Anarkali dress with inner lining.",
    description: "Floor length festive Georgette gown flared kurti with gold thread needlework embroidery and matching inner santoon lining.",
    rating: 4.7,
    reviewCount: 430,
    reviews: [
      { id: "r46", author: "Pallavi D.", rating: 5, date: "09 Jul 2026", comment: "Looked magnificent at my cousin's sangeet!", verified: true }
    ]
  },
  {
    id: "meesho_84rc6n",
    title: "Peony Rose Artificial Decorative Mala Toran Bandhanwal",
    price: 219,
    oldPrice: 599,
    category: "Home Decor & Festive",
    colors: ['Pink & White Roses'],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Handcrafted flower doorway garland for main entrance and pooja decor.",
    description: "Realistic silk fabric peony rose artificial garland toran to decorate house entrance doors, god idols, and photo frames.",
    rating: 4.6,
    reviewCount: 310,
    reviews: [
      { id: "r47", author: "Bhakti T.", rating: 5, date: "22 Jun 2026", comment: "Looks so fresh and festive at the entrance door!", verified: true }
    ]
  },
  {
    id: "meesho_71laj2",
    title: "Customized Name Engraved Leather Wallet for Men",
    price: 299,
    oldPrice: 799,
    category: "Men's Accessories",
    colors: ['Tan Brown', 'Classic Black'],
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Personalized laser engraved name bi-fold leather wallet.",
    description: "Premium synthetic leather wallet featuring customized laser engraved name, metallic initial charm, 6 card slots, and dual currency slots.",
    rating: 4.8,
    reviewCount: 810,
    reviews: [
      { id: "r48", author: "Gaurav S.", rating: 5, date: "13 Jul 2026", comment: "Gifted to my husband on anniversary – he loved the custom name engraving!", verified: true }
    ]
  },
  {
    id: "meesho_6r1ozm",
    title: "Front Zipper High Impact Shockproof Sports Bra",
    price: 329,
    oldPrice: 799,
    category: "Activewear & Lingerie",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey', 'Mauve'],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Front zip closure workout sports bra with criss-cross straps.",
    description: "Maximum bounce control high-impact sports bra featuring a secure front zipper, removable foam pads, and breathable moisture-wicking fabric.",
    rating: 4.7,
    reviewCount: 490,
    reviews: [
      { id: "r49", author: "Tanya H.", rating: 5, date: "19 May 2026", comment: "No bounce during treadmill running. Very easy to take off with front zip!", verified: true }
    ]
  },
  {
    id: "meesho_4k3v52",
    title: "South Indian Temple Jewellery Double Layer Haram Necklace Set",
    price: 499,
    oldPrice: 1499,
    category: "Jewellery & Accessories",
    colors: ['Matte Gold Finish'],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Traditional Lakshmi motif double layer matte gold haram necklace with jhumkis.",
    description: "Authentic South Indian bridal temple jewellery set featuring Goddess Lakshmi coin pendant, ruby red stone accents, and matching jhumka earrings.",
    rating: 4.8,
    reviewCount: 560,
    reviews: [
      { id: "r50", author: "Sowmya R.", rating: 5, date: "11 Jul 2026", comment: "Matte gold finish is regal! Perfect for silk sarees.", verified: true }
    ]
  },
  {
    id: "meesho_7dwjzm",
    title: "Foldable Ottoman Laundry Storage Stool Box with Lid (Grey)",
    price: 389,
    oldPrice: 999,
    category: "Home Storage & Furniture",
    colors: ['Charcoal Grey', 'Beige Linen'],
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Multipurpose sitting stool + toy & clothes storage organizer box.",
    description: "Heavy-duty foldable storage ottoman supporting up to 100kg sitting weight. Upholstered with linen fabric cushion top.",
    rating: 4.6,
    reviewCount: 420,
    reviews: [
      { id: "r51", author: "Mahesh C.", rating: 5, date: "26 Jun 2026", comment: "Great for hiding kids toys in the living room and comfortable footrest too.", verified: true }
    ]
  },
  {
    id: "meesho_7uxrf2",
    title: "Premium Matte Finish AD Stone Bridal Necklace Set with Earrings",
    price: 449,
    oldPrice: 1399,
    category: "Jewellery & Accessories",
    colors: ['Silver AD', 'Rose Gold AD'],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "High shine cubic zirconia American Diamond choker necklace.",
    description: "Sparkling AD stone wedding choker set plated in premium white rhodium polish with hanging crystal drop earrings.",
    rating: 4.7,
    reviewCount: 390,
    reviews: [
      { id: "r52", author: "Richa A.", rating: 5, date: "08 Jul 2026", comment: "Shines beautifully under party lights!", verified: true }
    ]
  },
  {
    id: "meesho_7aiq3x",
    title: "19 Gram Gold Covering Traditional Jewellery Necklace Set",
    price: 399,
    oldPrice: 1199,
    category: "Jewellery & Accessories",
    colors: ['Gold Plated'],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Micro gold plated lightweight wedding neckpiece.",
    description: "Guaranteed gold covering necklace with textured leaf links and matching stud earrings.",
    rating: 4.5,
    reviewCount: 280,
    reviews: [
      { id: "r53", author: "Lakshmi M.", rating: 5, date: "17 Jun 2026", comment: "Good quality daily wear gold covering set.", verified: true }
    ]
  },
  {
    id: "meesho_891u9b",
    title: "Stylish Women Long Denim Shirt Dress",
    price: 549,
    oldPrice: 1399,
    category: "Women's Western",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Classic Denim Blue'],
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Button-front midi denim dress with waist tie belt.",
    description: "Casual indigo washed denim shirt dress with spread collar, flap pockets, roll-up sleeve cuffs, and removable fabric belt.",
    rating: 4.7,
    reviewCount: 350,
    reviews: [
      { id: "r54", author: "Kritika S.", rating: 5, date: "23 Jul 2026", comment: "Fabric is soft and comfortable. Perfect smart casual look!", verified: true }
    ]
  },
  {
    id: "meesho_6s0lhw",
    title: "Triva 500W Remix Pro Mixer Grinder with 3 Stainless Steel Jars",
    price: 1199,
    oldPrice: 2799,
    category: "Kitchen Appliances",
    colors: ['Blue & White', 'Red & Black'],
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "500 Watt heavy duty copper motor mixer with 1.25L wet, 0.8L dry, and 0.4L chutney jars.",
    description: "Durable 500W mixer grinder engineered with sharp stainless steel blades, 3-speed control knob with pulse, and overload protector switch.",
    rating: 4.6,
    reviewCount: 610,
    reviews: [
      { id: "r55", author: "Suresh P.", rating: 5, date: "14 Jul 2026", comment: "Grinds spices and chutneys quickly! Powerful motor.", verified: true }
    ]
  },
  {
    id: "meesho_90jmat",
    title: "Green Traditional Kota Doriya Embroidered Flared Skirt",
    price: 429,
    oldPrice: 1099,
    category: "Women's Ethnic",
    sizes: ['Free Size (28-38 inch waist)'],
    colors: ['Parrot Green', 'Royal Blue'],
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Handloom Kota Doriya flared long skirt with mirror work border.",
    description: "Lightweight sheer Kota Doriya cotton skirt with elastic drawstring waist, tassels, and cotton inner lining.",
    rating: 4.5,
    reviewCount: 210,
    reviews: [
      { id: "r56", author: "Vineeta B.", rating: 5, date: "05 Jun 2026", comment: "High volume flare and rich color.", verified: true }
    ]
  },
  {
    id: "meesho_80opmi",
    title: "Wedding Festive Kurta Palazzo & Dupatta Set (Green)",
    price: 749,
    oldPrice: 1999,
    category: "Women's Ethnic",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Bottle Green', 'Deep Red'],
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Rayon embroidery straight kurta with golden border palazzo and chiffon dupatta.",
    description: "Ready to wear partywear suit set adorned with gold thread embroidery work and scalloped lace dupatta.",
    rating: 4.7,
    reviewCount: 480,
    reviews: [
      { id: "r57", author: "Komal R.", rating: 5, date: "12 Jul 2026", comment: "Stitching and embroidery quality are superb for this price.", verified: true }
    ]
  },
  {
    id: "meesho_80gwbp",
    title: "Women Rayon Slub Maternity Kurta Pant & Dupatta Set",
    price: 629,
    oldPrice: 1599,
    category: "Maternity & Ethnic",
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Dusty Pink', 'Sky Blue'],
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Breathable rayon slub feeding kurta suit set with hidden zippers.",
    description: "Comfortable pre and post-pregnancy suit set featuring discreet nursing zips and adjustable waistband pants.",
    rating: 4.8,
    reviewCount: 390,
    reviews: [
      { id: "r58", author: "Nandita S.", rating: 5, date: "01 Jul 2026", comment: "Very practical feeding suit. Soft fabric!", verified: true }
    ]
  },
  {
    id: "meesho_91cjxu",
    title: "Trendy Short Cotton Kurti for Women & Girls",
    price: 249,
    oldPrice: 699,
    category: "Women's Casual",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Indigo Printed', 'Floral White'],
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Casual waist-length printed tunic kurti for jeans.",
    description: "Pure cotton daily wear short kurti tunic featuring block prints, Chinese collar, and roll-up sleeves.",
    rating: 4.5,
    reviewCount: 520,
    reviews: [
      { id: "r59", author: "Pragati G.", rating: 5, date: "20 Jul 2026", comment: "Perfect short top to pair with college jeans.", verified: true }
    ]
  },
  {
    id: "meesho_7y1uhl",
    title: "Customized Name Wallet + Crystal Pen + Keychain Men's Gift Combo Set",
    price: 399,
    oldPrice: 999,
    category: "Men's Accessories & Gifts",
    colors: ['Tan Brown Gift Box', 'Black Gift Box'],
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Luxury customized 3-in-1 men's accessory gift hamper box.",
    description: "Complete customized gift box containing a personalized name engraved leather wallet, crystal ball pen, and leather keychain.",
    rating: 4.8,
    reviewCount: 730,
    reviews: [
      { id: "r60", author: "Shweta K.", rating: 5, date: "15 Jul 2026", comment: "Amazing birthday gift for my brother! The packaging box looks premium.", verified: true }
    ]
  },
  {
    id: "meesho_8eu6g6",
    title: "Elegant Beige Sling Crossbody Bag for Women",
    price: 319,
    oldPrice: 799,
    category: "Bags & Accessories",
    colors: ['Beige', 'Cream', 'Dusty Rose'],
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Structured nude beige shoulder bag with magnetic flap.",
    description: "Minimalist beige crossbody bag crafted with textured synthetic leather, gold twist lock clasp, and chain strap.",
    rating: 4.6,
    reviewCount: 310,
    reviews: [
      { id: "r61", author: "Varsha M.", rating: 5, date: "09 Jul 2026", comment: "Classy nude color that matches all outfits.", verified: true }
    ]
  },
  {
    id: "meesho_8tkuev",
    title: "DIY Resin Casting Starter Kit with Moulds & Tray",
    price: 449,
    oldPrice: 1199,
    category: "Arts & Crafts",
    colors: ['Complete Craft Kit'],
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Odorless non-toxic epoxy resin kit with silicone coaster moulds & glitter pigments.",
    description: "Beginner-friendly DIY resin art kit including 2:1 resin liquid, reusable silicone tray moulds, mixing cups, stirring sticks, and color pigments.",
    rating: 4.7,
    reviewCount: 290,
    reviews: [
      { id: "r62", author: "Aakanksha D.", rating: 5, date: "18 Jun 2026", comment: "Easy instructions and crystal clear hard resin finish!", verified: true }
    ]
  },
  {
    id: "meesho_6rcjtl",
    title: "Soft Bedside Floor Runner Rug (55 x 140 cm)",
    price: 299,
    oldPrice: 799,
    category: "Home Decor & Rugs",
    colors: ['Grey Geo', 'Maroon Velvet'],
    image: "https://images.unsplash.com/photo-1582582621959-48d273528920?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1582582621959-48d273528920?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Ultra-soft micro-polyester bedside runner carpet with anti-slip rubber backing.",
    description: "Absorbent and cozy bedroom floor runner carpet with non-skid latex backing and machine washable construction.",
    rating: 4.6,
    reviewCount: 420,
    reviews: [
      { id: "r63", author: "Harish T.", rating: 5, date: "02 Jul 2026", comment: "Doesn't slip on marble flooring. Soft feel under feet.", verified: true }
    ]
  },
  {
    id: "meesho_655wzv",
    title: "Toddler Pony Rocker Ride-On Toy for Kids (1-5 Years)",
    price: 699,
    oldPrice: 1799,
    category: "Toys & Kids",
    colors: ['Pastel Pink Pony', 'Sky Blue Pony'],
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "2-in-1 rocking horse and wheel rider toy with safety seat harness.",
    description: "Sturdy non-toxic plastic rocking pony toy for toddlers. Converts easily from rocking mode to 4-wheel riding mode.",
    rating: 4.8,
    reviewCount: 380,
    reviews: [
      { id: "r64", author: "Nilesh V.", rating: 5, date: "20 Jul 2026", comment: "Safe rounded edges and solid plastic build quality.", verified: true }
    ]
  },
  {
    id: "meesho_787zst",
    title: "Jugnu Handicraft Printed Fabric Box Sling Bag",
    price: 289,
    oldPrice: 699,
    category: "Bags & Accessories",
    colors: ['Ethno Print'],
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Sustainable jacquard fabric box crossbody bag.",
    description: "Handcrafted eco-friendly canvas sling bag featuring traditional Indian block printed motifs, zip pocket, and vegan leather strap.",
    rating: 4.5,
    reviewCount: 260,
    reviews: [
      { id: "r65", author: "Sonali R.", rating: 5, date: "11 Jun 2026", comment: "Beautiful handicraft fabric finish!", verified: true }
    ]
  },
  {
    id: "meesho_8wcsnw",
    title: "Fab Fusion Boys Mandarin Collar Cotton Polo T-Shirt",
    price: 269,
    oldPrice: 699,
    category: "Kids Fashion",
    sizes: ['2-3 Y', '4-5 Y', '6-7 Y', '8-9 Y', '10-11 Y', '12-13 Y'],
    colors: ['Navy Blue', 'Maroon', 'Mustard Yellow'],
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "100% combed cotton short sleeve polo shirt with mandarin neck.",
    description: "Smart casual polo shirt for boys made from breathable pique cotton with contrast button placket.",
    rating: 4.6,
    reviewCount: 340,
    reviews: [
      { id: "r66", author: "Manoj K.", rating: 5, date: "16 Jul 2026", comment: "Great fabric quality. No color fading after washing.", verified: true }
    ]
  },
  {
    id: "meesho_6w3a2n",
    title: "Wire Egg Basket Storage with Ceramic Farm Chicken Lid",
    price: 479,
    oldPrice: 1199,
    category: "Kitchen & Storage",
    colors: ['White & Black Metal'],
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=800&auto=format&fit=crop"
    ],
    shortDescription: "Vintage farmhouse black wire mesh egg holder with handpainted ceramic hen cover.",
    description: "Charming kitchen countertop storage basket for up to 25 eggs or garlic & onions. Rust-proof wire mesh container topped with decorative ceramic chicken lid.",
    rating: 4.8,
    reviewCount: 410,
    reviews: [
      { id: "r67", author: "Anjali D.", rating: 5, date: "22 Jul 2026", comment: "So cute on my kitchen island countertop!", verified: true }
    ]
  }
];

const tsContent = `// Automatically generated Meesho catalog dataset
import { Product } from './products';

export const meeshoProducts: Product[] = ${JSON.stringify(meeshoItems, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/meeshoData.ts'), tsContent);
console.log("Successfully generated all Meesho products in src/data/meeshoData.ts!");
