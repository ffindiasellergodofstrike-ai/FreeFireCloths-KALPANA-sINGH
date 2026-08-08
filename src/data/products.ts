export interface ProductVariant {
  size?: string;
  color?: string;
  sku?: string;
  price?: number;
  orig?: number;
  stock?: number;
  image?: string;
}

export interface Product {
  id: number;
  cat: 'men' | 'women' | 'kids' | 'electronics' | 'accessories';
  name: string;
  price: number;
  orig: number; // 0 if none
  sizes: string[];
  colors?: string[];
  rating: number;
  reviews: number;
  desc: string;
  badge: 'SALE' | 'NEW' | 'FEATURED' | '';
  featured?: boolean;
  images?: string[];
  variantImages?: Record<string, string[]>; // Map color -> images array
  handle?: string;
  variants?: ProductVariant[];
}

export interface BlogPost {
  id: number;
  cat: string;
  title: string;
  excerpt: string;
  date: string;
  emoji: string;
}

export const PRODUCTS: Product[] = [
  // --- FEATURED & CSV IMPORTED PRODUCTS ---
  {
    id: 301,
    handle: "women-multi-coloured-floral-regular-fit-crop-top-1245231",
    cat: "women",
    name: "Women Multi Coloured Floral Regular Fit Crop Top",
    price: 550,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Multi-coloured"],
    rating: 4.8,
    reviews: 124,
    badge: "NEW",
    featured: true,
    desc: "Color: Multi-coloured\nAvailable Sizes: S, M, L, XL, XXL\nStylish Women Multi Coloured Floral Regular Fit Crop Top. A must-have for every wardrobe — perfect for parties, evenings out, and special occasions.\n✓ 7 days easy return & exchange\n✓ Free shipping available\n✓ Delivery in 3-10 days\n✓ Cash on delivery available",
    images: [
      "https://www.ownd.in/cdn/shop/files/1245231-31736617.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/1245231-31736618.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/1245231-31736619.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/1245231-31736620.jpg?width=1440"
    ],
    variantImages: {
      "Multi-coloured": [
        "https://www.ownd.in/cdn/shop/files/1245231-31736617.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1245231-31736618.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1245231-31736619.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1245231-31736620.jpg?width=1440"
      ]
    }
  },
  {
    id: 302,
    handle: "blue-stripes-relaxed-fit-shirt-for-women-1242753",
    cat: "women",
    name: "Blue Stripes Relaxed Fit Shirt For Women",
    price: 750,
    orig: 699,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blue"],
    rating: 4.7,
    reviews: 89,
    badge: "SALE",
    featured: true,
    desc: "Color: Blue\nAvailable Sizes: XS, S, M, L, XL\nStylish Blue Stripes Relaxed Fit Shirt For Women. A must-have for every wardrobe — perfect for parties, evenings out, and special occasions.",
    images: [
      "https://www.ownd.in/cdn/shop/files/1242753-31625426.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/1242753-31625427.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/1242753-31625428.jpg?width=1440"
    ],
    variantImages: {
      "Blue": [
        "https://www.ownd.in/cdn/shop/files/1242753-31625426.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1242753-31625427.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1242753-31625428.jpg?width=1440"
      ]
    }
  },
  {
    id: 303,
    handle: "white-and-black-wide-leg-fit-casual-trouser-with-2-pocket-for-women-1242713",
    cat: "women",
    name: "White and Black Wide Leg Fit Casual Trouser With 2 Pocket For Women",
    price: 1100,
    orig: 699,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White"],
    rating: 4.6,
    reviews: 64,
    badge: "SALE",
    featured: false,
    desc: "Color: White\nAvailable Sizes: S, M, L, XL, XXL\nStylish White and Black Wide Leg Fit Casual Trouser With 2 Pocket For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/1242713-31625272.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/1242713-31625273.jpg?width=1440"
    ],
    variantImages: {
      "White": [
        "https://www.ownd.in/cdn/shop/files/1242713-31625272.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1242713-31625273.jpg?width=1440"
      ]
    }
  },
  {
    id: 304,
    handle: "1242736-men-pink-stripes-regular-fit-shirt",
    cat: "men",
    name: "Stripes Regular Fit Shirt For Men",
    price: 1400,
    orig: 799,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue", "Green"],
    rating: 4.9,
    reviews: 142,
    badge: "SALE",
    featured: true,
    desc: "Available Colors: Pink, Blue, Green\nAvailable Sizes: S, M, L, XL, XXL\nStylish Stripes Regular Fit Shirt For Men. Premium cotton blend fabric with elegant vertical stripes.",
    images: [
      "https://www.ownd.in/cdn/shop/files/1242736-31625489.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/1242737-31625496.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/1242738-31625503.jpg?width=1440"
    ],
    variantImages: {
      "Pink": [
        "https://www.ownd.in/cdn/shop/files/1242736-31625489.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1242736-31625490.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1242736-31625491.jpg?width=1440"
      ],
      "Blue": [
        "https://www.ownd.in/cdn/shop/files/1242737-31625496.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1242737-31625497.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1242737-31625498.jpg?width=1440"
      ],
      "Green": [
        "https://www.ownd.in/cdn/shop/files/1242738-31625503.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1242738-31625504.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/1242738-31625505.jpg?width=1440"
      ]
    }
  },
  {
    id: 305,
    handle: "brown-slim-fit-utility-pocket-trouser-for-men-1241823",
    cat: "men",
    name: "Slim Fit Utility Pocket Trouser For Men",
    price: 5500,
    orig: 899,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Brown", "Navy", "Off White"],
    rating: 4.8,
    reviews: 98,
    badge: "SALE",
    featured: true,
    desc: "Available Colors: Brown, Navy, Off White\nAvailable Sizes: 30, 32, 34, 36, 38\nStylish Slim Fit Utility Pocket Trouser For Men.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429684377_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429735338_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429684476_1.jpg?width=1440"
    ],
    variantImages: {
      "Brown": [
        "https://www.ownd.in/cdn/shop/files/8909429684377_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429684377_2.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429684377_3.jpg?width=1440"
      ],
      "Navy": [
        "https://www.ownd.in/cdn/shop/files/8909429735338_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429735338_2.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429735338_3.jpg?width=1440"
      ],
      "Off White": [
        "https://www.ownd.in/cdn/shop/files/8909429684476_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429684476_2.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429684476_3.jpg?width=1440"
      ]
    }
  },
  {
    id: 306,
    handle: "olive-slim-fit-utility-pocket-trouser-for-men-1241822",
    cat: "men",
    name: "Olive Slim Fit Utility Pocket Trouser For Men",
    price: 7500,
    orig: 899,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Olive"],
    rating: 4.5,
    reviews: 52,
    badge: "SALE",
    featured: false,
    desc: "Color: Olive\nAvailable Sizes: 30, 32, 34, 36, 38\nStylish Olive Slim Fit Utility Pocket Trouser For Men.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429684520_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429684520_2.jpg?width=1440"
    ],
    variantImages: {
      "Olive": [
        "https://www.ownd.in/cdn/shop/files/8909429684520_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429684520_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 307,
    handle: "beige-graphic-print-crew-neck-t-shirt-for-men-1241813",
    cat: "men",
    name: "Beige Graphic Print Crew Neck T-Shirt For Men",
    price: 395.5,
    orig: 399,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige"],
    rating: 4.7,
    reviews: 77,
    badge: "SALE",
    featured: false,
    desc: "Color: Beige\nAvailable Sizes: S, M, L, XL, XXL\nStylish Beige Graphic Print Crew Neck T-Shirt For Men.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429684827_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429684827_2.jpg?width=1440"
    ],
    variantImages: {
      "Beige": [
        "https://www.ownd.in/cdn/shop/files/8909429684827_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429684827_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 308,
    handle: "beige-race-print-t-shirt-shorts-set-for-boys-1241802",
    cat: "kids",
    name: "Race Print T-Shirt & Shorts Set For Boys",
    price: 490,
    orig: 499,
    sizes: ["1-2Y", "2-3Y", "3-4Y", "5-6Y", "7-8Y"],
    colors: ["Beige", "Off White", "Red"],
    rating: 4.9,
    reviews: 110,
    badge: "SALE",
    featured: true,
    desc: "Available Colors: Beige, Off White, Red\nAvailable Sizes: 1-2Y, 2-3Y, 3-4Y, 5-6Y, 7-8Y\nStylish Race Print T-Shirt & Shorts Co-ord Set For Boys.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429178234_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429178289_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429178180_1.jpg?width=1440"
    ],
    variantImages: {
      "Beige": [
        "https://www.ownd.in/cdn/shop/files/8909429178234_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429178234_2.jpg?width=1440"
      ],
      "Off White": [
        "https://www.ownd.in/cdn/shop/files/8909429178289_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429178289_2.jpg?width=1440"
      ],
      "Red": [
        "https://www.ownd.in/cdn/shop/files/8909429178180_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429178180_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 309,
    handle: "light-blue-mid-embroidered-rise-fit-skirt-for-women-1241801",
    cat: "women",
    name: "Light Blue Mid Embroidered Rise Fit Skirt For Women",
    price: 499,
    orig: 699,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Light Blue"],
    rating: 4.6,
    reviews: 43,
    badge: "SALE",
    featured: false,
    desc: "Color: Light Blue\nAvailable Sizes: XS, S, M, L, XL\nStylish Light Blue Mid Embroidered Rise Fit Skirt For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429621204_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429621204_2.jpg?width=1440"
    ],
    variantImages: {
      "Light Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429621204_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429621204_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 310,
    handle: "green-floral-print-straight-kurta-for-women-1241786",
    cat: "women",
    name: "Floral Print Straight Kurta For Women",
    price: 1000,
    orig: 399,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Green", "Brown"],
    rating: 4.8,
    reviews: 156,
    badge: "SALE",
    featured: true,
    desc: "Available Colors: Green, Brown\nAvailable Sizes: XS, S, M, L, XL, XXL\nStylish Floral Print Straight Kurta For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429623284_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429623222_1.jpg?width=1440"
    ],
    variantImages: {
      "Green": [
        "https://www.ownd.in/cdn/shop/files/8909429623284_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429623284_2.jpg?width=1440"
      ],
      "Brown": [
        "https://www.ownd.in/cdn/shop/files/8909429623222_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429623222_3.jpg?width=1440"
      ]
    }
  },
  {
    id: 311,
    handle: "black-high-rise-skinny-fit-shapewear-for-women-1241566",
    cat: "women",
    name: "Black High Rise Skinny Fit Shapewear For Women",
    price: 550,
    orig: 0,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    rating: 4.5,
    reviews: 68,
    badge: "NEW",
    featured: false,
    desc: "Color: Black\nAvailable Sizes: XS, S, M, L, XL, XXL\nStylish Black High Rise Skinny Fit Shapewear For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429568851_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429568851_2.jpg?width=1440"
    ],
    variantImages: {
      "Black": [
        "https://www.ownd.in/cdn/shop/files/8909429568851_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429568851_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 312,
    handle: "black-nylon-blend-regular-fit-bra-for-women-1241565",
    cat: "women",
    name: "Nylon Blend Regular Fit Bra For Women",
    price: 750,
    orig: 0,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Taupe", "Beige"],
    rating: 4.7,
    reviews: 92,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: Black, Taupe, Beige\nAvailable Sizes: XS, S, M, L, XL, XXL\nStylish Nylon Blend Regular Fit Bra For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429131970_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429132021_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429131925_1.jpg?width=1440"
    ],
    variantImages: {
      "Black": [
        "https://www.ownd.in/cdn/shop/files/8909429131970_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429131970_2.jpg?width=1440"
      ],
      "Taupe": [
        "https://www.ownd.in/cdn/shop/files/8909429132021_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429132021_2.jpg?width=1440"
      ],
      "Beige": [
        "https://www.ownd.in/cdn/shop/files/8909429131925_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429131925_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 313,
    handle: "black-regular-fit-casual-trouser-with-1-pocket-for-women-1241455",
    cat: "women",
    name: "Regular Fit Casual Trouser With 1 Pocket For Women",
    price: 1100,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Beige", "White"],
    rating: 4.6,
    reviews: 73,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: Black, Beige, White\nAvailable Sizes: S, M, L, XL, XXL\nStylish Regular Fit Casual Trouser With 1 Pocket For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429162264_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429162318_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429162363_1.jpg?width=1440"
    ],
    variantImages: {
      "Black": [
        "https://www.ownd.in/cdn/shop/files/8909429162264_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162264_2.jpg?width=1440"
      ],
      "Beige": [
        "https://www.ownd.in/cdn/shop/files/8909429162318_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162318_2.jpg?width=1440"
      ],
      "White": [
        "https://www.ownd.in/cdn/shop/files/8909429162363_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162363_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 314,
    handle: "black-skinny-fit-jeans-with-5-pocket-for-women-1241494",
    cat: "women",
    name: "Skinny Fit Jeans With 5 Pocket For Women",
    price: 1400,
    orig: 0,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Black", "Light Blue", "Navy"],
    rating: 4.8,
    reviews: 135,
    badge: "NEW",
    featured: true,
    desc: "Available Colors: Black, Light Blue, Navy\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Skinny Fit Jeans With 5 Pocket For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429233988_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429233858_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429233926_1.jpg?width=1440"
    ],
    variantImages: {
      "Black": [
        "https://www.ownd.in/cdn/shop/files/8909429233988_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429233988_2.jpg?width=1440"
      ],
      "Light Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429233858_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429233858_2.jpg?width=1440"
      ],
      "Navy": [
        "https://www.ownd.in/cdn/shop/files/8909429233926_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429233926_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 315,
    handle: "mens-slim-solid-navy-formal-trousers-1241488",
    cat: "men",
    name: "Mens Slim Solid Navy Formal Trousers",
    price: 5500,
    orig: 0,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Navy", "Black", "Charcoal"],
    rating: 4.9,
    reviews: 168,
    badge: "FEATURED",
    featured: true,
    desc: "Available Colors: Navy, Black, Charcoal\nAvailable Sizes: 30, 32, 34, 36, 38\nStylish Mens Slim Solid Formal Trousers.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429738087_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429560473_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429738032_1.jpg?width=1440"
    ],
    variantImages: {
      "Navy": [
        "https://www.ownd.in/cdn/shop/files/8909429738087_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429738087_2.jpg?width=1440"
      ],
      "Black": [
        "https://www.ownd.in/cdn/shop/files/8909429560473_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429560473_2.jpg?width=1440"
      ],
      "Charcoal": [
        "https://www.ownd.in/cdn/shop/files/8909429738032_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429738032_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 316,
    handle: "pink-cotton-blend-regular-fit-shirt-for-men-1241486",
    cat: "men",
    name: "Cotton Blend Regular Fit Shirt For Men",
    price: 7500,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue"],
    rating: 4.7,
    reviews: 94,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: Pink, Blue\nAvailable Sizes: S, M, L, XL, XXL\nStylish Cotton Blend Regular Fit Shirt For Men.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429109092_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429109047_1.jpg?width=1440"
    ],
    variantImages: {
      "Pink": [
        "https://www.ownd.in/cdn/shop/files/8909429109092_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429109092_2.jpg?width=1440"
      ],
      "Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429109047_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429109047_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 317,
    handle: "light-blue-wide-leg-fit-jeans-with-4-pocket-for-women-1241505",
    cat: "women",
    name: "Wide Leg Fit Jeans With 4 Pocket For Women",
    price: 395.5,
    orig: 999,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Light Blue", "Charcoal"],
    rating: 4.8,
    reviews: 81,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Light Blue, Charcoal\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Wide Leg Fit Jeans With 4 Pocket For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429465372_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429623550_1.jpg?width=1440"
    ],
    variantImages: {
      "Light Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429465372_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429465372_2.jpg?width=1440"
      ],
      "Charcoal": [
        "https://www.ownd.in/cdn/shop/files/8909429623550_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429623550_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 318,
    handle: "light-blue-wide-leg-fit-jeans-with-5-pocket-for-women-1241503",
    cat: "women",
    name: "Wide Leg Fit Jeans With 5 Pocket For Women",
    price: 490,
    orig: 899,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Light Blue", "Black", "Blue"],
    rating: 4.7,
    reviews: 99,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Light Blue, Black, Blue\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Wide Leg Fit Jeans With 5 Pocket For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429143676_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429143607_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429143720_1.jpg?width=1440"
    ],
    variantImages: {
      "Light Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429143676_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429143676_2.jpg?width=1440"
      ],
      "Black": [
        "https://www.ownd.in/cdn/shop/files/8909429143607_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429143607_2.jpg?width=1440"
      ],
      "Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429143720_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429143720_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 319,
    handle: "navy-wide-leg-fit-jeans-with-6-pocket-for-women-1241498",
    cat: "women",
    name: "Wide Leg Fit Jeans With 6 Pocket For Women",
    price: 499,
    orig: 999,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Navy", "Light Blue", "Blue"],
    rating: 4.8,
    reviews: 112,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Navy, Light Blue, Blue\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Wide Leg Fit Jeans With 6 Pocket For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429144642_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429144680_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429144741_1.jpg?width=1440"
    ],
    variantImages: {
      "Navy": [
        "https://www.ownd.in/cdn/shop/files/8909429144642_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429144642_2.jpg?width=1440"
      ],
      "Light Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429144680_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429144680_2.jpg?width=1440"
      ],
      "Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429144741_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429144741_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 320,
    handle: "yellow-puff-sleeves-regular-fit-dress-for-women-1241535",
    cat: "women",
    name: "Yellow Puff Sleeves Regular Fit Dress For Women",
    price: 1000,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Yellow"],
    rating: 4.9,
    reviews: 145,
    badge: "NEW",
    featured: true,
    desc: "Color: Yellow\nAvailable Sizes: S, M, L, XL, XXL\nStylish Yellow Puff Sleeves Regular Fit Dress For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429534405_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429534405_2.jpg?width=1440"
    ],
    variantImages: {
      "Yellow": [
        "https://www.ownd.in/cdn/shop/files/8909429534405_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429534405_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 321,
    handle: "pink-drop-shoulder-sleeves-regular-fit-sweatshirt-for-women-1241527",
    cat: "women",
    name: "Drop Shoulder Sleeves Regular Fit Sweatshirt For Women",
    price: 550,
    orig: 799,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Brown"],
    rating: 4.7,
    reviews: 86,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Pink, Brown\nAvailable Sizes: S, M, L, XL, XXL\nStylish Drop Shoulder Sleeves Regular Fit Sweatshirt For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429540154_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429540208_1.jpg?width=1440"
    ],
    variantImages: {
      "Pink": [
        "https://www.ownd.in/cdn/shop/files/8909429540154_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429540154_2.jpg?width=1440"
      ],
      "Brown": [
        "https://www.ownd.in/cdn/shop/files/8909429540208_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429540208_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 322,
    handle: "black-solid-tube-bra-for-women-1240577",
    cat: "women",
    name: "Solid Tube Bra For Women",
    price: 750,
    orig: 399,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Purple"],
    rating: 4.6,
    reviews: 79,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Black, White, Purple\nAvailable Sizes: XS, S, M, L, XL, XXL\nStylish Solid Tube Bra For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429525885_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429547832_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429547788_1.jpg?width=1440"
    ],
    variantImages: {
      "Black": [
        "https://www.ownd.in/cdn/shop/files/8909429525885_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429525885_2.jpg?width=1440"
      ],
      "White": [
        "https://www.ownd.in/cdn/shop/files/8909429547832_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429547832_2.jpg?width=1440"
      ],
      "Purple": [
        "https://www.ownd.in/cdn/shop/files/8909429547788_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429547788_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 323,
    handle: "light-blue-solid-flared-jeans-for-women-1240571",
    cat: "women",
    name: "Light Blue Solid Flared Jeans For Women",
    price: 1100,
    orig: 0,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Light Blue"],
    rating: 4.8,
    reviews: 104,
    badge: "NEW",
    featured: false,
    desc: "Color: Light Blue\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Light Blue Solid Flared Jeans For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429234091_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429234091_2.jpg?width=1440"
    ],
    variantImages: {
      "Light Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429234091_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429234091_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 324,
    handle: "navy-striped-regular-fit-t-shirt-for-infant-boys-1240565",
    cat: "kids",
    name: "Striped Regular Fit T-Shirt For Infant Boys",
    price: 1400,
    orig: 299,
    sizes: ["6-9 M", "9-12 M", "12-18 M", "18-24 M"],
    colors: ["Navy", "Light Blue", "Yellow"],
    rating: 4.9,
    reviews: 88,
    badge: "SALE",
    featured: true,
    desc: "Available Colors: Navy, Light Blue, Yellow\nAvailable Sizes: 6-9 M, 9-12 M, 12-18 M, 18-24 M\nStylish Striped Regular Fit T-Shirt For Infant Boys.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429178722_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429178883_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429178807_1.jpg?width=1440"
    ],
    variantImages: {
      "Navy": [
        "https://www.ownd.in/cdn/shop/files/8909429178722_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429178722_2.jpg?width=1440"
      ],
      "Light Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429178883_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429178883_2.jpg?width=1440"
      ],
      "Yellow": [
        "https://www.ownd.in/cdn/shop/files/8909429178807_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429178807_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 325,
    handle: "white-solid-rayon-pant-for-women-1240563",
    cat: "women",
    name: "Solid Rayon Pant For Women",
    price: 5500,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black"],
    rating: 4.6,
    reviews: 58,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: White, Black\nAvailable Sizes: S, M, L, XL, XXL\nStylish Solid Rayon Pant For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429162219_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429162165_1.jpg?width=1440"
    ],
    variantImages: {
      "White": [
        "https://www.ownd.in/cdn/shop/files/8909429162219_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162219_2.jpg?width=1440"
      ],
      "Black": [
        "https://www.ownd.in/cdn/shop/files/8909429162165_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162165_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 326,
    handle: "white-cotton-blend-solid-pant-for-women-1240561",
    cat: "women",
    name: "Cotton Blend Solid Pant For Women",
    price: 7500,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Beige"],
    rating: 4.7,
    reviews: 63,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: White, Beige\nAvailable Sizes: S, M, L, XL, XXL\nStylish Cotton Blend Solid Pant For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429162462_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429162417_1.jpg?width=1440"
    ],
    variantImages: {
      "White": [
        "https://www.ownd.in/cdn/shop/files/8909429162462_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162462_2.jpg?width=1440"
      ],
      "Beige": [
        "https://www.ownd.in/cdn/shop/files/8909429162417_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162417_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 327,
    handle: "white-solid-lace-design-pant-for-women-1240560",
    cat: "women",
    name: "Solid Lace Design Pant For Women",
    price: 395.5,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Beige", "Black"],
    rating: 4.8,
    reviews: 87,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: White, Beige, Black\nAvailable Sizes: S, M, L, XL, XXL\nStylish Solid Lace Design Pant For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429162615_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429162561_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429162516_1.jpg?width=1440"
    ],
    variantImages: {
      "White": [
        "https://www.ownd.in/cdn/shop/files/8909429162615_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162615_2.jpg?width=1440"
      ],
      "Beige": [
        "https://www.ownd.in/cdn/shop/files/8909429162561_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162561_2.jpg?width=1440"
      ],
      "Black": [
        "https://www.ownd.in/cdn/shop/files/8909429162516_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429162516_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 328,
    handle: "mint-floral-printed-regular-fit-kurta-for-women-1240196",
    cat: "women",
    name: "Mint Floral Printed Regular Fit Kurta For Women",
    price: 490,
    orig: 0,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Green", "Pink"],
    rating: 4.7,
    reviews: 95,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: Green, Pink\nAvailable Sizes: XS, S, M, L, XL, XXL\nStylish Mint Floral Printed Regular Fit Kurta For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429623406_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429623345_1.jpg?width=1440"
    ],
    variantImages: {
      "Green": [
        "https://www.ownd.in/cdn/shop/files/8909429623406_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429623406_2.jpg?width=1440"
      ],
      "Pink": [
        "https://www.ownd.in/cdn/shop/files/8909429623345_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429623345_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 329,
    handle: "charcoal-solid-regular-fit-jeans-for-women-1240195",
    cat: "women",
    name: "Solid Regular Fit Jeans For Women",
    price: 499,
    orig: 899,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Charcoal", "Light Blue", "Blue"],
    rating: 4.8,
    reviews: 108,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Charcoal, Light Blue, Blue\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Solid Regular Fit Jeans For Women.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429143782_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429143843_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429143904_1.jpg?width=1440"
    ],
    variantImages: {
      "Charcoal": [
        "https://www.ownd.in/cdn/shop/files/8909429143782_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429143782_2.jpg?width=1440"
      ],
      "Light Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429143843_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429143843_2.jpg?width=1440"
      ],
      "Blue": [
        "https://www.ownd.in/cdn/shop/files/8909429143904_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429143904_2.jpg?width=1440"
      ]
    }
  },
  {
    id: 330,
    handle: "grey-solid-regular-fit-pack-of-2-trunks-for-men-1240194",
    cat: "men",
    name: "Grey Solid Regular Fit Pack of 2 Trunks For Men",
    price: 1000,
    orig: 0,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Grey"],
    rating: 4.6,
    reviews: 51,
    badge: "NEW",
    featured: false,
    desc: "Color: Grey\nAvailable Sizes: XS, S, M, L, XL, XXL\nStylish Grey Solid Regular Fit Pack of 2 Trunks For Men.",
    images: [
      "https://www.ownd.in/cdn/shop/files/8909429504460_1.jpg?width=1440",
      "https://www.ownd.in/cdn/shop/files/8909429504460_2.jpg?width=1440"
    ],
    variantImages: {
      "Grey": [
        "https://www.ownd.in/cdn/shop/files/8909429504460_1.jpg?width=1440",
        "https://www.ownd.in/cdn/shop/files/8909429504460_2.jpg?width=1440"
      ]
    }
  },

  // --- NEWLY IMPORTED CSV PRODUCTS (Electronics, Accessories, Clothing) ---
  {
    id: 401,
    handle: "portable-handheld-ring-led-light-new-rabbit-cage-lighting-photography-lamp-for-mobile-live-broadcast-selfie-light-decoration",
    cat: "electronics",
    name: "Portable Handheld Ring LED Light Photography Lamp",
    price: 550,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.9,
    reviews: 42,
    badge: "",
    featured: false,
    desc: "Portable Handheld Ring LED Light New Rabbit Cage Lighting Photography Lamp for Mobile Live Broadcast Selfie Light Decoration.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_d20d0fd0-cd09-414a-817e-9ec7baa116c5.jpg?v=1785493813",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_01872dc3-b86f-4f9a-989a-e4acde9458ab.jpg?v=1785493813",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_c15cafca-d9fa-41b0-8e1c-5b912c7fba6b.jpg?v=1785493813",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_7322a4be-1c1d-481f-82c9-d3b53ae21efb.jpg?v=1785493813",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_d30b71e2-70c1-4085-aa69-ac0088c83b91.jpg?v=1785493813",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_a1187573-ef9b-4aa1-8fc4-46dfc57f40f3.jpg?v=1785493813"
    ]
  },
  {
    id: 402,
    handle: "10-26cm-dimmable-led-ring-light-kit-with-tripod-120-beads-usb-selfie-live-streaming-lamp-for-photography-video-makeup",
    cat: "electronics",
    name: "10\" 26cm Dimmable LED Ring Light Kit with Tripod",
    price: 750,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.8,
    reviews: 65,
    badge: "",
    featured: false,
    desc: "10\" 26cm Dimmable LED Ring Light Kit with Tripod – 120 Beads USB Selfie & Live Streaming Lamp for Photography, Video & Makeup.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_41ed6410-9878-48f6-847b-80f21da00c50.jpg?v=1785493811",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_546fa0f5-67cb-4dc4-84e7-c195e524834e.jpg?v=1785493811",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_42bb96b9-f226-4e01-85c1-013f5872d090.jpg?v=1785493811",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_c0be6465-9538-4ac7-9415-0cab699dadd8.jpg?v=1785493811",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_2b133aaa-b80d-4988-ad9e-31f98893c2b2.jpg?v=1785493811",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_c09dc2ce-e7ec-467c-8643-ab28f32ca7e0.jpg?v=1785493811"
    ]
  },
  {
    id: 403,
    handle: "bt21-chimmy-cooky-koya-shooky-tata-creative-anime-peripheral-cartoon-keychain-personality-cute-backpack-decorative-doll-pendant",
    cat: "accessories",
    name: "BT21 Anime Cartoon Keychain Doll Pendant",
    price: 1100,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.9,
    reviews: 112,
    badge: "",
    featured: false,
    desc: "BT21 Chimmy Cooky Koya Shooky Tata Creative Anime Peripheral Cartoon Keychain Personality Cute Backpack Decorative Doll Pendant.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_2f107e83-13b6-415b-82c8-f91bdd744111.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_4e545798-6a02-4512-b57d-e7be85a06c69.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_54bab436-ef22-4e6b-9aad-f2c7db34efb9.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_ec0adc1c-ab77-4a5c-b1c1-cda0c6e14a2e.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_e1ba6ba6-acf8-4027-b649-218329a82c07.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_cafcf1dc-9fd7-420f-865b-ce5194ae7c28.jpg?v=1785493810"
    ]
  },
  {
    id: 404,
    handle: "cute-bear-phone-charms-pendant-kawaii-anime-keychain-accessories-for-keys-schoolbag-iphone17-pro-max-airpods-ins",
    cat: "accessories",
    name: "Cute Bear Phone Charms & Keychain Pendant",
    price: 1400,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.8,
    reviews: 78,
    badge: "",
    featured: false,
    desc: "Cute Bear Phone Charms Pendant Kawaii Anime Keychain Accessories for Keys Schoolbag iPhone AirPods.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_621f13f5-c960-4c8f-ba81-8235973043ba.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_dcf13ff5-2b01-48aa-bc20-b77642c97c88.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_7779ad4f-6ed1-4295-9ed1-ee347845c152.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_762797af-e515-4c63-b855-e1fa804dcd18.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_30557bdc-a943-4bbc-9a39-4133fc62f223.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_35677017-9ca5-44c3-a093-36a0251fcd1a.jpg?v=1785493810"
    ]
  },
  {
    id: 405,
    handle: "led-selfie-ring-lighting-photographic-selfie-ring-lamp-usb-remote-fill-light-for-youtube-tiktok-video-live-phone-holder-tripod",
    cat: "electronics",
    name: "LED Selfie Ring Lamp with Phone Holder & Tripod",
    price: 5500,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.7,
    reviews: 94,
    badge: "",
    featured: false,
    desc: "LED Selfie Ring Lighting Photographic Ring Lamp USB Remote Fill Light for YouTube TikTok Video Live Stream with Phone Holder & Tripod.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_d4a0c051-eb81-43eb-9534-8b6f49110d0a.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_50d02ad8-a74b-498b-b0cb-7f090bb9b28f.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_9aa227b4-56e3-49e0-8a44-295a26b0ae8a.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_2d9677a1-c71a-41ce-8fea-3ef3b929d289.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image_bcb6e9f5-9350-43f1-b4fe-d65656799a2d.jpg?v=1785493810",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/image.jpg?v=1785493810"
    ]
  },
  {
    id: 406,
    handle: "solid-plazzos-for-women-and-girls-dailywear-bk-xxl",
    cat: "women",
    name: "Solid Plazzos For Women And Girls",
    price: 7500,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.6,
    reviews: 58,
    badge: "",
    featured: false,
    desc: "Solid Plazzos For Women And Girls dailywear. High quality soft breathable fabric.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/34-plazzo-bhagyashray-original-imahywqyrk6x9uj3.jpg?v=1785491617",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/34-plazzo-bhagyashray-original-imahywqyf9mqgbth.jpg?v=1785491617",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/34-plazzo-bhagyashray-original-imahywqyugkwsqjr.jpg?v=1785491617",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/34-plazzo-bhagyashray-original-imahywqyyakytdxa.jpg?v=1785491616"
    ]
  },
  {
    id: 407,
    handle: "motion-sensor-light-for-home-with-usb-charging-wireless-self-adhesive-led-night-light",
    cat: "electronics",
    name: "Motion Sensor Wireless USB Charging LED Night Light",
    price: 395.5,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.8,
    reviews: 132,
    badge: "",
    featured: false,
    desc: "Motion Sensor Light For Home With USB Charging Wireless Self Adhesive LED Night Light.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/4977964556.jpg?v=1785491442",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/6791234760.jpg?v=1785491442",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/8461840206.jpg?v=1785491443",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/6097004242.jpg?v=1785491443",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/4584550103.jpg?v=1785491443"
    ]
  },
  {
    id: 408,
    handle: "star-lamp-usb-car-star-ceiling-light",
    cat: "accessories",
    name: "Star Lamp USB Car Star Ceiling Light",
    price: 490,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.7,
    reviews: 89,
    badge: "",
    featured: false,
    desc: "Star Lamp USB Car Star Ceiling Light for interior atmosphere and starry night illumination.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/7612355446.jpg?v=1785491421"
    ]
  },
  {
    id: 409,
    handle: "buddha-electric-pro-hair-clippers-trimmer-hair-cutting-grooming-kit",
    cat: "electronics",
    name: "Buddha Electric Pro Hair Clippers Trimmer Grooming Kit",
    price: 499,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.9,
    reviews: 176,
    badge: "",
    featured: false,
    desc: "Buddha Electric Pro Hair Clippers Trimmer Hair Cutting Grooming Kit. T-blade cordless precision trimmer.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/Trimmer_20_2__16076.jpg?v=1785491336",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/E40079635_20im_17839.jpg?v=1785491335",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/Trimmer_20_2__16076_0ca3db3b-01fd-4609-a8a7-24c213fb0462.jpg?v=1785491336"
    ]
  },
  {
    id: 410,
    handle: "matte-black-dial-with-arabic-numerals",
    cat: "accessories",
    name: "Matte Black Dial Minimalist Analog Watch",
    price: 1000,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.6,
    reviews: 64,
    badge: "",
    featured: false,
    desc: "Matte Black Dial With Arabic Numerals Minimalist Analog Watch.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/Matte_20Black_20Minimalist_20Dial_20Watch_20_2__23563.jpg?v=1785491272",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/Matte_20Black_20Minimalist_20Dial_20Watch_20_1__23562.jpg?v=1785491272"
    ]
  },
  {
    id: 411,
    handle: "women-s-yoga-pant-d71psu8090fc73a0mh40",
    cat: "women",
    name: "Women's High Waist Yoga Pant",
    price: 550,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Pista"],
    rating: 4.8,
    reviews: 93,
    badge: "",
    featured: false,
    desc: "Step into comfort and style with WUGO’s premium gym wear designed specifically for women and girls. Ultra-soft, breathable, and stretchable fabric.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-f56dd0a5-2559-4af0-aba9-e8ebb324b38a.webp?v=1785246033",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-d334c422-dfa2-4de6-a597-278741f0af9d.webp?v=1785246033",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-6dace0cf-a347-4ae5-b658-c9e0312d012d.webp?v=1785246033"
    ]
  },
  {
    id: 412,
    handle: "mens-corduroy-casual-pants-fashion-loose-fit-wide-leg-pants-straight-sweatpants-elastic-waist-drawstring-d7nfuoa7ul6s73a0e3cg",
    cat: "men",
    name: "Mens Corduroy Loose Fit Wide Leg Pants",
    price: 750,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Multicolor"],
    rating: 4.7,
    reviews: 81,
    badge: "",
    featured: false,
    desc: "Mens Corduroy Casual Pants Fashion Loose Fit Wide Leg Pants Straight Sweatpants Elastic Waist Drawstring.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-0912404f-b30f-4c5f-ae09-6fef2ff8b0c6.webp?v=1785241163",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-31af4a22-538a-427b-a150-9113c3884c5c.webp?v=1785241165",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-502998ae-0614-47d5-9813-48ed8d562a38.webp?v=1785241163",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-70f5018f-fc70-4f48-b74f-061cededad1b.webp?v=1785241164"
    ]
  },
  {
    id: 413,
    handle: "women-full-coverage-bra-cv4jni8qfbo88b95l260",
    cat: "women",
    name: "Women Full Coverage Cotton Bra",
    price: 1100,
    orig: 0,
    sizes: ["32", "34", "36", "40"],
    colors: ["White"],
    rating: 4.6,
    reviews: 55,
    badge: "",
    featured: false,
    desc: "Full coverage, unique pattern with elastic straps, superior elastics, and skin-friendly stitches to ensure maximum support.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/1741243020965-15.jpg?v=1785240861",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/1741243138085-d.jpg?v=1785240861"
    ]
  },
  {
    id: 414,
    handle: "women-s-kurti-with-pant-and-dupatta-cv3em74gt7474086kua0",
    cat: "women",
    name: "Women's Kurti with Pant And Dupatta Set",
    price: 1400,
    orig: 1400,
    sizes: ["XXL"],
    colors: ["Green"],
    rating: 4.9,
    reviews: 145,
    badge: "SALE",
    featured: false,
    desc: "Women's Kurti with Pant And Dupatta 3-piece designer suit set.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/1741087923031-9.jpg?v=1785240852",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/1741087923151-26.jpg?v=1785240851",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/1741087923169-28.jpg?v=1785240852",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/1741087923181-30.jpg?v=1785240851"
    ]
  },
  {
    id: 415,
    handle: "cotton-blend-straight-fit-trouser-for-women-olive-l-cv7sngq59o3h4p4k7ho0",
    cat: "women",
    name: "Cotton Blend Straight Fit Trouser for Women",
    price: 5500,
    orig: 750,
    sizes: ["L"],
    colors: ["Olive"],
    rating: 4.7,
    reviews: 67,
    badge: "SALE",
    featured: false,
    desc: "Cotton Blend Straight Fit Trouser for Women in Olive.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-afcf5b41-98b7-4f13-9b8e-f912f961b701.webp?v=1785240840"
    ]
  },
  {
    id: 416,
    handle: "stylish-women-dress-d4bc0lfl9odtq4216p60",
    cat: "women",
    name: "Stylish Women Maroon Gown Dress",
    price: 7500,
    orig: 550,
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    colors: ["Maroon"],
    rating: 4.8,
    reviews: 110,
    badge: "SALE",
    featured: false,
    desc: "Stylish Women Maroon Gown Dress for evening parties and special occasions.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-06690685-0770-47d9-b55b-a75ef1a83bb0.jpg?v=1785240802",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-24830c93-77c1-4d09-9510-2fc5b49aa846.jpg?v=1785240803",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-7a38e725-9bf6-42d2-aa2d-33cc3758012c.jpg?v=1785240802",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-0c06d9ae-c692-489f-9997-eb816802fcac.jpg?v=1785240803"
    ]
  },
  {
    id: 417,
    handle: "kurti-for-women-d4dfontdu40q4qqikba0",
    cat: "women",
    name: "Designer Printed Kurti for Women",
    price: 395.5,
    orig: 999,
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"],
    rating: 4.6,
    reviews: 84,
    badge: "SALE",
    featured: false,
    desc: "Designer Printed Kurti for Women in breathable everyday cotton blend.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-75469baf-2098-4cb9-908d-882018c539ce.jpg?v=1785240791",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-1f9d140d-5656-4917-baeb-683a9650aa02.jpg?v=1785240792",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-6d031a8d-281a-442b-948e-d35052c6454c.jpg?v=1785240791",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-2a5f7b9e-093c-48ae-9ae4-7d8de8c7faf4.jpg?v=1785240791"
    ]
  },
  {
    id: 418,
    handle: "women-s-cotton-oversized-fit-shirt-d4g62j2ekjhhhtfhs2lg",
    cat: "women",
    name: "Women's Cotton Oversized Fit Shirt",
    price: 490,
    orig: 999,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    rating: 4.7,
    reviews: 73,
    badge: "SALE",
    featured: false,
    desc: "Women's Cotton Oversized Fit Shirt in classic black.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-41d9d1da-a733-454f-9544-7be28f2ad5c3.jpg?v=1785240781"
    ]
  },
  {
    id: 419,
    handle: "women-maxi-black-full-length-dress-d628tj1su5hc73eqei8g",
    cat: "women",
    name: "Women Maxi Black Full Length Dress",
    price: 499,
    orig: 0,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 91,
    badge: "",
    featured: false,
    desc: "Women Maxi Black Full Length Dress.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-986bf9ca-c12d-4d40-8e5d-bf808a9393eb.webp?v=1785240768",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-563eeafb-7b9f-4efb-8804-c5f03fc2ecd1.webp?v=1785240767"
    ]
  },
  {
    id: 420,
    handle: "trending-saree-for-women-d6bf6bs7noos73bdjpf0",
    cat: "women",
    name: "Trending Black Saree for Women",
    price: 1000,
    orig: 600,
    sizes: ["ONE SIZE"],
    colors: ["Black"],
    rating: 4.9,
    reviews: 124,
    badge: "SALE",
    featured: false,
    desc: "Trending Saree for Women. Saree Length: 5.5 m, Blouse Length: 0.8 m.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/1740999060960-b.png?v=1785240759"
    ]
  },
  {
    id: 421,
    handle: "women-s-seamless-underwear-for-women-multicolor-pack-of-4-d7h2f4fh7ues73cut6fg",
    cat: "women",
    name: "Women's Seamless Underwear (Pack of 4)",
    price: 550,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Multicolor"],
    rating: 4.7,
    reviews: 62,
    badge: "",
    featured: false,
    desc: "Women's Seamless Underwear for Women (Multicolor) (Pack of 4).",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-0a062429-da5a-496e-8664-86b4ec6d9251.webp?v=1785240747",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-f724e5c8-8cd0-4756-b66f-0797448a5ea0.webp?v=1785240747",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-46a4a093-f508-42b1-a17f-ebd5ea0be994.webp?v=1785240749",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-89d72ad8-4012-4950-b4f0-092a822c96c1.webp?v=1785240747"
    ]
  },
  {
    id: 422,
    handle: "men-s-t-shirt-solid-polo-neck-polly-cotton-pack-of-4-d98d0u0gktrc73bct3gg",
    cat: "men",
    name: "Men's Solid Polo Neck T-shirt (Pack of 4)",
    price: 750,
    orig: 0,
    sizes: ["M", "L", "XL", "XXL"],
    rating: 4.6,
    reviews: 58,
    badge: "",
    featured: false,
    desc: "Men's T-shirt Solid Polo Neck Polly Cotton (Pack of 4). Fabric - Polly Cotton, Pattern- Solid, Neck Type - Polo Neck.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-be4271eb-b2ce-4f7c-a593-f5552e962c84.webp?v=1785240699",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-f43841dc-2105-429b-b843-9010d3234659.webp?v=1785240699"
    ]
  },
  {
    id: 423,
    handle: "winter-cap-for-man-women-beanie-cap-muffler-windproof-winter-woolen-cap-with-ear-protection-head-neck-warmer-woolen-topaa-soft-comfortable-pcs-1-d9a9iadf5nec73akjjkg",
    cat: "accessories",
    name: "Winter Beanie Cap & Muffler Set for Men & Women",
    price: 1100,
    orig: 0,
    sizes: ["ONE SIZE"],
    rating: 4.8,
    reviews: 79,
    badge: "",
    featured: false,
    desc: "Winter Cap for Man & Women, Beanie Cap & Muffler, Windproof Winter Woolen Cap with Ear Protection, Head & Neck Warmer, Soft & Comfortable.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-7e3eb2be-a644-418d-9276-2159a1ff8567.webp?v=1785240693"
    ]
  },
  {
    id: 424,
    handle: "men-s-ice-silk-briefs-boxers-pack-of-2-d9bs6o4d9mtc739dvngg",
    cat: "men",
    name: "Men's Ice Silk Briefs Boxers (Pack of 2)",
    price: 1400,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Multicolor"],
    rating: 4.7,
    reviews: 68,
    badge: "",
    featured: false,
    desc: "Men's Ice Silk Briefs Boxers (Pack of 2). Fabric: Ice Silk, Fit: Regular, Ideal For: Men.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-f0410f32-6b9f-4005-b002-6370f44110e4.webp?v=1785240685",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-d16c831f-1242-4a2c-a452-5a0eba9d4e61.webp?v=1785240685",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-c9a6ef75-17f9-4959-a989-d3e6ea255da9.webp?v=1785240685",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-fbfd1277-871d-4e9e-b195-552d13ebfe63.webp?v=1785240685",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-d1de3903-65c8-45d1-97c9-4a7ea8659d39.webp?v=1785240685"
    ]
  },
  {
    id: 425,
    handle: "men-s-special-underwears-d9f27j0mv3jc738f9h00",
    cat: "men",
    name: "Men's Special Comfort Underwear",
    price: 5500,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.5,
    reviews: 44,
    badge: "",
    featured: false,
    desc: "Men's Special Comfort Underwear.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-be767367-4d13-4408-a5b3-dc97a8a28be9.webp?v=1785240679",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-36cabb53-daa5-4102-8f4e-8156396f11d3.webp?v=1785240679",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-d6632ce6-feaa-46a8-9464-964095cea81c.webp?v=1785240679",
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-fb252e32-e8f3-4aa5-91af-f2ac3cb252e4.webp?v=1785240679"
    ]
  },
  {
    id: 426,
    handle: "men-s-solid-round-neck-polycotto-multicolor-t-shirt-pack-of-4-d9fnfo8mv3jc738f9i80",
    cat: "men",
    name: "Men's Solid Round Neck T-Shirt (Pack of 4)",
    price: 7500,
    orig: 0,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Assorted"],
    rating: 4.7,
    reviews: 69,
    badge: "",
    featured: false,
    desc: "Men's Solid Round Neck Polycotton Multicolor T-Shirt - (Pack of 4).",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-5670df2d-2de8-45d7-9b8e-190f4642721e.webp?v=1785240671"
    ]
  },
  {
    id: 427,
    handle: "men-s-track-pant-pack-of-3-d9gb67ducm3s73agnngg",
    cat: "men",
    name: "Men's Track Pant (Pack of 3)",
    price: 395.5,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Assorted"],
    rating: 4.8,
    reviews: 87,
    badge: "",
    featured: false,
    desc: "Men's Track Pant (Pack of 3) for workout, training, and everyday lounge.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-d895b1ba-3a46-4618-abe5-c0d1a87ef5e6.webp?v=1785240661"
    ]
  },
  {
    id: 428,
    handle: "men-s-hemp-lightweight-pants-d9gq8i27ivfc73e4c3h0",
    cat: "men",
    name: "Men's Hemp Lightweight Pants",
    price: 490,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.6,
    reviews: 52,
    badge: "",
    featured: false,
    desc: "Men's Hemp Lightweight Pants for relaxed, breathable everyday wear.",
    images: [
      "https://cdn.shopify.com/s/files/1/0816/4612/5286/files/cmimgopt-c1fb2f55-47be-4634-b90f-e34d9316ec07.webp?v=1785240651"
    ]
  },

  // Existing Staples
  { id: 1, cat: 'men', name: 'Classic Oxford Shirt', price: 499, orig: 1499, sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.5, reviews: 89, desc: 'Premium cotton Oxford shirt with a relaxed fit. Perfect for office and casual wear.', badge: 'SALE', images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop'] },
  { id: 2, cat: 'men', name: 'Slim Fit Chinos', price: 1000, orig: 1899, sizes: ['28', '30', '32', '34', '36'], rating: 4.3, reviews: 64, desc: 'Stretch chinos with a modern slim fit. Wrinkle-resistant fabric, all-day comfort.', badge: 'SALE', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'] },
  { id: 21, cat: 'electronics', name: 'Wireless Earbuds Pro', price: 550, orig: 2499, sizes: ['ONE SIZE'], rating: 4.6, reviews: 567, desc: 'True wireless earbuds with 30-hour battery, active noise cancellation, IPX5 water resistance.', badge: 'SALE', images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop'] },
  { id: 22, cat: 'electronics', name: 'Smart Watch Series 5', price: 750, orig: 4999, sizes: ['ONE SIZE'], rating: 4.5, reviews: 389, desc: 'Fitness smartwatch with heart rate monitor, SpO2, GPS, 7-day battery life.', badge: 'SALE', images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop'] },
  { id: 27, cat: 'electronics', name: 'Mechanical Keyboard', price: 1100, orig: 4499, sizes: ['ONE SIZE'], rating: 4.8, reviews: 234, desc: 'Compact 75% mechanical keyboard with RGB backlight, tactile switches.', badge: 'SALE', images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop'] }
];

export const BLOG_POSTS: BlogPost[] = [
  { id: 1, cat: 'STYLE GUIDE', title: '10 Essential Wardrobe Staples for Summer 2026', excerpt: 'Build a versatile, timeless wardrobe with these must-have pieces that transition effortlessly.', date: 'JUNE 15, 2026', emoji: '☀️' },
  { id: 2, cat: 'DENIM', title: 'The Ultimate Denim Fit Guide: Wide Leg vs Skinny', excerpt: 'Everything you need to know about finding the perfect pair of jeans for your body type.', date: 'JUNE 10, 2026', emoji: '👖' },
  { id: 3, cat: 'TECH', title: 'Top Wearable Tech Trends You Need to Know', excerpt: 'How smartwatches and wireless audio are reshaping daily convenience and fitness tracking.', date: 'MAY 28, 2026', emoji: '⌚' }
];
