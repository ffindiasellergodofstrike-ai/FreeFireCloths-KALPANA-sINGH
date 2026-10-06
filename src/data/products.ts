import { isRetiredProduct } from './retired-products.js';
import { REFERENCE_PRODUCTS } from './reference-products.js';
import { KURTI_PRODUCTS } from './kurti-products.js';
import { IMPORTED_DRESSES } from './imported_dresses.js';

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
  sourceId?: number;
  collection?: string;
  cat: 'men' | 'women' | 'kids';
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
  styleTags?: string[];
  sizeChart?: { size: string; bust: string; waist: string; hips: string }[];
}

export interface BlogPost {
  id: number;
  cat: string;
  title: string;
  excerpt: string;
  date: string;
  emoji: string;
}

export const SOURCE_PRODUCTS: Product[] = [
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/f96f049ce7a6df3750a85014fb8a5b8003a04dd2c758fc09ae2bade1416cb5d0.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/233dffe325991c0d627979761a64cd4ef1615c8513142752badffefe5221abb8.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/79d39833a47b0f3bae1e07a776f0653fd1f177dfd7fd22562620ad02c86313ed.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/8a6678043f1c095f04576f079764ac7e699dc992a514b5c662e6b8fd8b7310b9.jpg"
    ],
    variantImages: {
      "Multi-coloured": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/f96f049ce7a6df3750a85014fb8a5b8003a04dd2c758fc09ae2bade1416cb5d0.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/233dffe325991c0d627979761a64cd4ef1615c8513142752badffefe5221abb8.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/79d39833a47b0f3bae1e07a776f0653fd1f177dfd7fd22562620ad02c86313ed.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/8a6678043f1c095f04576f079764ac7e699dc992a514b5c662e6b8fd8b7310b9.jpg"
      ]
    }
  },
  {
    id: 302,
    handle: "blue-stripes-relaxed-fit-shirt-for-women-1242753",
    cat: "women",
    name: "Blue Stripes Relaxed Fit Shirt For Women",
    price: 999,
    orig: 1299,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blue"],
    rating: 4.7,
    reviews: 89,
    badge: "SALE",
    featured: true,
    desc: "Color: Blue\nAvailable Sizes: XS, S, M, L, XL\nStylish Blue Stripes Relaxed Fit Shirt For Women. A must-have for every wardrobe — perfect for parties, evenings out, and special occasions.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/99ce3f66bdb5146434cb7325b733431a886adfd0dd095fc403d7648dd63c6bed.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/df306643b2015d64da3008c2559b7987f4a23659f44a5fc5d760543fa4b550c6.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/cec9c3e11e699a21b0ee2b8fd239a77d77131cd47f68e09dfc9f925b506d3482.jpg"
    ],
    variantImages: {
      "Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/99ce3f66bdb5146434cb7325b733431a886adfd0dd095fc403d7648dd63c6bed.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298917/freefire_store_catalog/df306643b2015d64da3008c2559b7987f4a23659f44a5fc5d760543fa4b550c6.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/cec9c3e11e699a21b0ee2b8fd239a77d77131cd47f68e09dfc9f925b506d3482.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/cc94e4cf7fc79f4a8f1f45837a018ebeecdd08daa07fe91ea1ae284debd4b0d4.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/888e408230b7cb051f755709a7fe82def0106a2a9c4e0f200dffcd552f5cb14b.jpg"
    ],
    variantImages: {
      "White": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/cc94e4cf7fc79f4a8f1f45837a018ebeecdd08daa07fe91ea1ae284debd4b0d4.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/888e408230b7cb051f755709a7fe82def0106a2a9c4e0f200dffcd552f5cb14b.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/24b6beddae904e4c85ad8d212fb101c3646a8cfb5d3c81b840b68710db677cf9.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/b8ae4995694acbfef3cc7e09d8ef5b7c4e577bd3c96d31eb47d354f3f60b9f7f.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/5d3633639862195a559b6801112e249101b15a1feaf7c4d8105cbe5f72dc5879.jpg"
    ],
    variantImages: {
      "Pink": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/24b6beddae904e4c85ad8d212fb101c3646a8cfb5d3c81b840b68710db677cf9.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/69ada88d132a7501ab87989aba9ab409144a78ff25cad7d2fd63f86a8ee734a7.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/a6b5e28c32912d64ebe7478f047e0359b8dd5c293fe04e9dd7657e7cbd484562.jpg"
      ],
      "Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/b8ae4995694acbfef3cc7e09d8ef5b7c4e577bd3c96d31eb47d354f3f60b9f7f.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/c0602c2152472df67c4ba70512662edb3b2b239d87fa761bec1beb418bda4a9e.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/819d4ba7595b2a72a90a983b0ede93b3f2f1fdbc6c04fff70555b2ad5609d2e0.jpg"
      ],
      "Green": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298918/freefire_store_catalog/5d3633639862195a559b6801112e249101b15a1feaf7c4d8105cbe5f72dc5879.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/80f0c8e6f76ad7c4316db7f9a9450fea93ac81306f1d82d22e0246b6149d4481.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/e4e60dc7b63894cf4e962bd756d67c5c2f88af22016cd4ac9f419312d225bb05.jpg"
      ]
    }
  },
  {
    id: 305,
    handle: "brown-slim-fit-utility-pocket-trouser-for-men-1241823",
    cat: "men",
    name: "Slim Fit Utility Pocket Trouser For Men",
    price: 1699,
    orig: 899,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Brown", "Navy", "Off White"],
    rating: 4.8,
    reviews: 98,
    badge: "SALE",
    featured: true,
    desc: "Available Colors: Brown, Navy, Off White\nAvailable Sizes: 30, 32, 34, 36, 38\nStylish Slim Fit Utility Pocket Trouser For Men.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/4efa264d5e4bb3f02caa2bcd23d28479659c8dc8d55d571733f128c2313b39f7.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/229f1b02a398ce08ae8e10a2cdd8460cf3e61e4372fe430c96c8d5e7607dae80.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/525b7ef074d69bf18db7b5c62270259c10fcbe0fea3261a529c7a9368457af39.jpg"
    ],
    variantImages: {
      "Brown": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/4efa264d5e4bb3f02caa2bcd23d28479659c8dc8d55d571733f128c2313b39f7.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/65521ef4ec9839f864708fee5016d13a53ea9a4e9d1830204dd1670ca0cc7913.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/2e32f243953f00292456774bc8450b483dd93e91dfff194fc59f33ef7fc67897.jpg"
      ],
      "Navy": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298919/freefire_store_catalog/229f1b02a398ce08ae8e10a2cdd8460cf3e61e4372fe430c96c8d5e7607dae80.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/d56825a35ba5ebef8911c6ca4a06d826b25d18203fe9fa60a17181e8479739e1.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/a4e2ca44ccff4eba4999d752c4abb47c9b56451ec09a174fa9ab43f7aa437218.jpg"
      ],
      "Off White": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/525b7ef074d69bf18db7b5c62270259c10fcbe0fea3261a529c7a9368457af39.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/03913f4de834b7ec63defe7bba4a71faf22ff5a6a761f2998f0e75f615270888.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/84c92a8580ee9eccf61c92d10c39678c151a02f770cc7b373df8863c3d9b5a7d.jpg"
      ]
    }
  },
  {
    id: 306,
    handle: "olive-slim-fit-utility-pocket-trouser-for-men-1241822",
    cat: "men",
    name: "Olive Slim Fit Utility Pocket Trouser For Men",
    price: 1999,
    orig: 899,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Olive"],
    rating: 4.5,
    reviews: 52,
    badge: "SALE",
    featured: false,
    desc: "Color: Olive\nAvailable Sizes: 30, 32, 34, 36, 38\nStylish Olive Slim Fit Utility Pocket Trouser For Men.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/4a766bb38052ea5abb6e0bc109f17c77ca1694055ceb126c44e541414f0f115b.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/6b85fdac5ddc85f01b9d7095133bec562d341fa23e0512f308f9558048f81e01.jpg"
    ],
    variantImages: {
      "Olive": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/4a766bb38052ea5abb6e0bc109f17c77ca1694055ceb126c44e541414f0f115b.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/6b85fdac5ddc85f01b9d7095133bec562d341fa23e0512f308f9558048f81e01.jpg"
      ]
    }
  },

  {
    id: 308,
    handle: "beige-race-print-t-shirt-shorts-set-for-boys-1241802",
    cat: "kids",
    name: "Race Print T-Shirt & Shorts Set For Boys",
    price: 450,
    orig: 499,
    sizes: ["1-2Y", "2-3Y", "3-4Y", "5-6Y", "7-8Y"],
    colors: ["Beige", "Off White", "Red"],
    rating: 4.9,
    reviews: 110,
    badge: "SALE",
    featured: true,
    desc: "Available Colors: Beige, Off White, Red\nAvailable Sizes: 1-2Y, 2-3Y, 3-4Y, 5-6Y, 7-8Y\nStylish Race Print T-Shirt & Shorts Co-ord Set For Boys.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/160321f48b5a8e9664ec057b2940696000d98183dcf76dc95fbb108f117f4315.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/8e1c5f12675453c2ef8d64af291f34120de271b700262fe03a5f39aeb468e480.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298921/freefire_store_catalog/45584a31179ee45999e62a976e52f431cab9248cfd91dba61ab560e83d943746.jpg"
    ],
    variantImages: {
      "Beige": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/160321f48b5a8e9664ec057b2940696000d98183dcf76dc95fbb108f117f4315.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298921/freefire_store_catalog/168062e783c6532f6e1b78e5d77846f1a6592d077983bf9a227e9ae4d6ebc5e0.jpg"
      ],
      "Off White": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298920/freefire_store_catalog/8e1c5f12675453c2ef8d64af291f34120de271b700262fe03a5f39aeb468e480.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298921/freefire_store_catalog/483939985197cb7f56266682c76f80036eb10f933f88ea6ee561b3f00e35beb8.jpg"
      ],
      "Red": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298921/freefire_store_catalog/45584a31179ee45999e62a976e52f431cab9248cfd91dba61ab560e83d943746.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298921/freefire_store_catalog/139de86b53d8fd5d933cf014f649dac16bd4cde6399be212d5e3956a0708be90.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298921/freefire_store_catalog/624b056ae768d6d3a8ecd0eae35063cd61084a6347845b3fe83c96d75c5fc96d.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/f8602eea9489df879167837836c44e158ba8e42493c4832cca7c965907a11036.jpg"
    ],
    variantImages: {
      "Light Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298921/freefire_store_catalog/624b056ae768d6d3a8ecd0eae35063cd61084a6347845b3fe83c96d75c5fc96d.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/f8602eea9489df879167837836c44e158ba8e42493c4832cca7c965907a11036.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/8c3c586d9315741a54c8a3ee46a05da90c7fcf0e4a34eb85b7868477ad0e645e.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/918625fd4c1e4fc384a4dca1ab822d8f6ad0cf900e4d46c7fea267a35bcf2873.jpg"
    ],
    variantImages: {
      "Green": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/8c3c586d9315741a54c8a3ee46a05da90c7fcf0e4a34eb85b7868477ad0e645e.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/0d2f7d212d33cc28a7c97be7d92c796883fe584df4349ccb1c1937f3c4c3065f.jpg"
      ],
      "Brown": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/918625fd4c1e4fc384a4dca1ab822d8f6ad0cf900e4d46c7fea267a35bcf2873.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/aee57c1b469312dcb082c07315810c7f70e45235e0386b8f6bfb9751880f83b6.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/f3dfa5e5c77168d1218e441be68137530d8efc1a91bdca6e8a8ea80435df47f8.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/abdcb03d57f4c80e6a7112d21dad168d0745fbf17aa9897a9717dfbd736b98db.jpg"
    ],
    variantImages: {
      "Black": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/f3dfa5e5c77168d1218e441be68137530d8efc1a91bdca6e8a8ea80435df47f8.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298922/freefire_store_catalog/abdcb03d57f4c80e6a7112d21dad168d0745fbf17aa9897a9717dfbd736b98db.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/892b9dd03f2f27c852fb531fb68d780758a8a5d295f31ce86a5fc25b22ec18b6.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/582424da3658349753646bea14e9232ef8c380796ffa3fb3fa5d5f0f9f48cd66.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/2d796ba6caf0eb15217f38aaa613667763662b0da40b36e0dcabb6cd85c9988a.jpg"
    ],
    variantImages: {
      "Black": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/892b9dd03f2f27c852fb531fb68d780758a8a5d295f31ce86a5fc25b22ec18b6.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/2167d3677ceb0514a4c6d6c59389f2223b7ca70400b640e37f0257d1b5ac6572.jpg"
      ],
      "Taupe": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/582424da3658349753646bea14e9232ef8c380796ffa3fb3fa5d5f0f9f48cd66.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/8acf9b6b7951f929df7459399921dc4f277c1b4c58bdcb82ed9514df072726c4.png"
      ],
      "Beige": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/2d796ba6caf0eb15217f38aaa613667763662b0da40b36e0dcabb6cd85c9988a.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/305357683f02bc7771c415149f26f19da585720d6677fe3bc9c8aa0ee9753d92.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/5e607275e77a709be8fa2dc58bfd17520a67dea07af698aff49b85555bf2e350.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/86389ffc3b4a85a47989332d7fa6e9b4dea9538356ccf51a7d5f094632143f2d.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/6bde87ca60c3b8625e80575bdd3df8f00ac7bcba912297055b072e3cc67a83a4.jpg"
    ],
    variantImages: {
      "Black": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298923/freefire_store_catalog/5e607275e77a709be8fa2dc58bfd17520a67dea07af698aff49b85555bf2e350.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/98ad3e30642c3555f46253c3fdc16d9f7a97c6949e64c9d22481ce258e7c02a6.jpg"
      ],
      "Beige": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/86389ffc3b4a85a47989332d7fa6e9b4dea9538356ccf51a7d5f094632143f2d.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/4fe3d911882ee8acd626f8ac8e9b30eebc173cbd2a0a8e13af88add777920e83.jpg"
      ],
      "White": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/6bde87ca60c3b8625e80575bdd3df8f00ac7bcba912297055b072e3cc67a83a4.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/ea64ed1f0951f232cfdaaca49146cc1f8fa333150ae6e4aa10b359de93275b15.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/0d00f8d544008055a81955d6af08b172b3da3afb0088c4181b54272179742fc3.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/13162ebac7bdcb8af6e1851c4f3ee2b658bb25daf0a75dcfbb3069001f0749a5.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298925/freefire_store_catalog/7dc3f1e72afc3f6048d512099682a72bc246be7e5df49ced5cd5a767d4fd8ff4.jpg"
    ],
    variantImages: {
      "Black": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/0d00f8d544008055a81955d6af08b172b3da3afb0088c4181b54272179742fc3.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298925/freefire_store_catalog/19cbaffe689e0db7c437e29f1c630d5ca015ccab0c082afdf45e3bf30ac35d73.jpg"
      ],
      "Light Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298924/freefire_store_catalog/13162ebac7bdcb8af6e1851c4f3ee2b658bb25daf0a75dcfbb3069001f0749a5.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298925/freefire_store_catalog/172ed7ad9ece58788d0c9313241002673ec344f42835b5e41a5600627ee011d3.jpg"
      ],
      "Navy": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298925/freefire_store_catalog/7dc3f1e72afc3f6048d512099682a72bc246be7e5df49ced5cd5a767d4fd8ff4.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298925/freefire_store_catalog/d4d066d1a50e84168bc1230b623605cc5d5fdd4d012219b9d2782c2c531bfad7.jpg"
      ]
    }
  },
  {
    id: 315,
    handle: "mens-slim-solid-navy-formal-trousers-1241488",
    cat: "men",
    name: "Mens Slim Solid Navy Formal Trousers",
    price: 1699,
    orig: 0,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Navy", "Black", "Charcoal"],
    rating: 4.9,
    reviews: 168,
    badge: "FEATURED",
    featured: true,
    desc: "Available Colors: Navy, Black, Charcoal\nAvailable Sizes: 30, 32, 34, 36, 38\nStylish Mens Slim Solid Formal Trousers.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298925/freefire_store_catalog/47388ada6fffdc994a3460f72efa902baf64f451daa7d42a1968ae1a33d6b68f.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298925/freefire_store_catalog/318bc4e5f321f1f901cab63c0abc70c271a31daf19beaef3fce1a4b9bce87762.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/7a660493f5f42662dd369d56634819a73f9cacf93e42c002593cc5f8031afed8.png"
    ],
    variantImages: {
      "Navy": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298925/freefire_store_catalog/47388ada6fffdc994a3460f72efa902baf64f451daa7d42a1968ae1a33d6b68f.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/4aa2f4d1c349b301c13fd620b16cd0eb8ec5b6e601c5d9f74151a3d55010606f.jpg"
      ],
      "Black": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298925/freefire_store_catalog/318bc4e5f321f1f901cab63c0abc70c271a31daf19beaef3fce1a4b9bce87762.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/a1f2f213005f52517b41235d357c490c015adb1c6e6beb9f7fe5fa18692868bb.jpg"
      ],
      "Charcoal": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/7a660493f5f42662dd369d56634819a73f9cacf93e42c002593cc5f8031afed8.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/20f2362b0444aeee4f6c7f6a9de1bce51c6a5cdcd62fb69e3c20fe4d08530a94.jpg"
      ]
    }
  },
  {
    id: 316,
    handle: "pink-cotton-blend-regular-fit-shirt-for-men-1241486",
    cat: "men",
    name: "Cotton Blend Regular Fit Shirt For Men",
    price: 1999,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Pink", "Blue"],
    rating: 4.7,
    reviews: 94,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: Pink, Blue\nAvailable Sizes: S, M, L, XL, XXL\nStylish Cotton Blend Regular Fit Shirt For Men.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/3f13c76ecb87ea9fff92a6f88161aef3067bdd84f26725d6905bd292f8190e99.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/e451eb2c16acdea4bf8c3593ad4a6d3c2804e082e82dee5628045e24eedcea8f.jpg"
    ],
    variantImages: {
      "Pink": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/3f13c76ecb87ea9fff92a6f88161aef3067bdd84f26725d6905bd292f8190e99.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/5bd7c716ebf472c42dfb105404738b300c5efa34b1d7044daa76241a94097650.jpg"
      ],
      "Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/e451eb2c16acdea4bf8c3593ad4a6d3c2804e082e82dee5628045e24eedcea8f.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/10be1cb61a260987f188fc74fef0dc12cae95511eec898b8475fcab4d1b40c60.jpg"
      ]
    }
  },
  {
    id: 317,
    handle: "light-blue-wide-leg-fit-jeans-with-4-pocket-for-women-1241505",
    cat: "women",
    name: "Wide Leg Fit Jeans With 4 Pocket For Women",
    price: 1100,
    orig: 0,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Light Blue", "Charcoal"],
    rating: 4.8,
    reviews: 81,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Light Blue, Charcoal\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Wide Leg Fit Jeans With 4 Pocket For Women.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/eee4130e4d0e6baffb991293c11570d0c2139b5d1a355cfff2e0e54c0f86d913.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/5b734cdc6267b04c782bd30eedcf612d4dba43ee3a089282c9ff61280570f454.jpg"
    ],
    variantImages: {
      "Light Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298926/freefire_store_catalog/eee4130e4d0e6baffb991293c11570d0c2139b5d1a355cfff2e0e54c0f86d913.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/c7bd35ce9b9504f6f5aee9dbe0d92ff68452587f35caa875689cfae12fd6543d.jpg"
      ],
      "Charcoal": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/5b734cdc6267b04c782bd30eedcf612d4dba43ee3a089282c9ff61280570f454.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/cf67bcc74aa22cd4aac9a721162bea324fe0b85b10d0ad4d9fcf92a6dedffa4f.jpg"
      ]
    }
  },
  {
    id: 318,
    handle: "light-blue-wide-leg-fit-jeans-with-5-pocket-for-women-1241503",
    cat: "women",
    name: "Wide Leg Fit Jeans With 5 Pocket For Women",
    price: 1100,
    orig: 0,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Light Blue", "Black", "Blue"],
    rating: 4.7,
    reviews: 99,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Light Blue, Black, Blue\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Wide Leg Fit Jeans With 5 Pocket For Women.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/3032798de8bb7536749226126a4cb5e6e42c4a945867bfc2f2adf733de41566f.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/ea6d536d94a5bd0502607181c4f70a1ad8d711c550487f78606e5c0e2a6e7a74.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/f0d8ecba07327f6c6973c16f0e5daea72b30f096d2f437617cb9bf390af9acaa.jpg"
    ],
    variantImages: {
      "Light Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/3032798de8bb7536749226126a4cb5e6e42c4a945867bfc2f2adf733de41566f.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/5cec191b66e7405016c7c8b54dd7a84261ff8621c8cb793782c634234810a22b.jpg"
      ],
      "Black": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/ea6d536d94a5bd0502607181c4f70a1ad8d711c550487f78606e5c0e2a6e7a74.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/1ffb4c0299421ad45e20e8620ae53503d3c23fcf1eefe8e0e3a2860e44db73e1.jpg"
      ],
      "Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298927/freefire_store_catalog/f0d8ecba07327f6c6973c16f0e5daea72b30f096d2f437617cb9bf390af9acaa.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/6f77a3814da53e2758f0ed4243f9c4c4ff243d5acfe78023b6a2eb02a9085a65.jpg"
      ]
    }
  },
  {
    id: 319,
    handle: "navy-wide-leg-fit-jeans-with-6-pocket-for-women-1241498",
    cat: "women",
    name: "Wide Leg Fit Jeans With 6 Pocket For Women",
    price: 1400,
    orig: 0,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Navy", "Light Blue", "Blue"],
    rating: 4.8,
    reviews: 112,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Navy, Light Blue, Blue\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Wide Leg Fit Jeans With 6 Pocket For Women.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/f396ec7b8af3683e2b09826161f620427a2fa01975a2c70bb273a54194c13d3f.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/755315e6ffe2844aec3cad31db477363ad07cad1b20c5fd929d094b1681a52c2.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/16ce988a5f9bc058f09f3a96313edb94e3698107da121215fd0da45dd02a42ec.png"
    ],
    variantImages: {
      "Navy": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/f396ec7b8af3683e2b09826161f620427a2fa01975a2c70bb273a54194c13d3f.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/a9d8623554900e0e7408b3dbefd1bfa4e63ac4aaf835580bb488246dccbe85b2.jpg"
      ],
      "Light Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/755315e6ffe2844aec3cad31db477363ad07cad1b20c5fd929d094b1681a52c2.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/087e5acc274094a3d8640fb42619a680bc35313f2ae07e08fc91feb81e4fb36c.jpg"
      ],
      "Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298928/freefire_store_catalog/16ce988a5f9bc058f09f3a96313edb94e3698107da121215fd0da45dd02a42ec.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/20b39b395716c1803a72f7c14d23338a4d77427a7fd5d9af68dd66ff68c60333.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/00bda0ea1382497860602d017c7e6839ad323e9d9948d1f2de7549d5cd10a45d.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/9de97d9bf1eeb3121f539cb20d8d5998486aa726946f8a8d91c077569fdd5629.jpg"
    ],
    variantImages: {
      "Yellow": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/00bda0ea1382497860602d017c7e6839ad323e9d9948d1f2de7549d5cd10a45d.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/9de97d9bf1eeb3121f539cb20d8d5998486aa726946f8a8d91c077569fdd5629.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/845d100928ef09654fc2d8e3059e1f337b4542133d527d861033436dff17449a.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/1b675c4e77ea91b5037a77b53f2caabe81faaf1f273ac232cc5429ec097df949.jpg"
    ],
    variantImages: {
      "Pink": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/845d100928ef09654fc2d8e3059e1f337b4542133d527d861033436dff17449a.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/1f03c27552f1bfbc9e68e862c08adeceb89c9f7069347f594c814cb428f98276.png"
      ],
      "Brown": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/1b675c4e77ea91b5037a77b53f2caabe81faaf1f273ac232cc5429ec097df949.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/bb449cdcd299b20f84500cf2d5ee0a5463736d6f27602d3f2f7fa7cabbe19a2f.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298930/freefire_store_catalog/317ecaad97b59c4fc5af6433be4ee6c3e583c818a896774f84e4adb3455124e4.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/b6e961323ce036daf856eed07b4f3bf5fd4dc88aa684eab10c1728bbc8080078.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298930/freefire_store_catalog/2aaecf76f8ceeb83427a0097a2758a9b7e588871fff8394f20666448e5b24efe.png"
    ],
    variantImages: {
      "Black": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298930/freefire_store_catalog/317ecaad97b59c4fc5af6433be4ee6c3e583c818a896774f84e4adb3455124e4.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298930/freefire_store_catalog/dfa6990625f49e5c740d1391ef1cab3f4f850993b777bc2c5c76708b48f01863.jpg"
      ],
      "White": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298929/freefire_store_catalog/b6e961323ce036daf856eed07b4f3bf5fd4dc88aa684eab10c1728bbc8080078.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298930/freefire_store_catalog/e5f13644032e9f195315a7a3bf191aff5ac63f377d90050436d46690a4d34edf.png"
      ],
      "Purple": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298930/freefire_store_catalog/2aaecf76f8ceeb83427a0097a2758a9b7e588871fff8394f20666448e5b24efe.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298930/freefire_store_catalog/2228ab8cbd9a001e4b0c7f37178c9df6e926ae3feaba5ae2fde89c9863803fb9.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/c062295d3dca68a16abe258f2884b4a2ecb13265d9a6e6bd0817dfc59037bc04.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/d7a10d7eefd362dc1326d9ae52c406294d1cd60fb2f6a38df5d9c41fc65284d5.jpg"
    ],
    variantImages: {
      "Light Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/c062295d3dca68a16abe258f2884b4a2ecb13265d9a6e6bd0817dfc59037bc04.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/d7a10d7eefd362dc1326d9ae52c406294d1cd60fb2f6a38df5d9c41fc65284d5.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/009e06af901c7a3d51048e307da16017821e9a65bd1267bdce4095f3f4d6eff8.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/21c67bcc3a69e87cb08173318b860437c3a1c6a9689ca180e3c0e5c33e472167.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/89344d9dd82061c40f8b4b905f1adde185ff7f81d7f726c1bbad6df08ee70779.jpg"
    ],
    variantImages: {
      "Navy": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/009e06af901c7a3d51048e307da16017821e9a65bd1267bdce4095f3f4d6eff8.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/a6e0a759376e1cdecc304c45e375603441748e0e070cf2bbb07eb9e58a757e14.jpg"
      ],
      "Light Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/21c67bcc3a69e87cb08173318b860437c3a1c6a9689ca180e3c0e5c33e472167.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/c4b423d5def2f4f7fb084ba93a260b1759547a55d552359a35740bb3f713c2a0.jpg"
      ],
      "Yellow": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298931/freefire_store_catalog/89344d9dd82061c40f8b4b905f1adde185ff7f81d7f726c1bbad6df08ee70779.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/429a9e0e68afcfff8ef1e51adcb1ef0b39d7f6766226f5dc9764391a8948b18f.jpg"
      ]
    }
  },
  {
    id: 325,
    handle: "white-solid-rayon-pant-for-women-1240563",
    cat: "women",
    name: "Solid Rayon Pant For Women",
    price: 1699,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black"],
    rating: 4.6,
    reviews: 58,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: White, Black\nAvailable Sizes: S, M, L, XL, XXL\nStylish Solid Rayon Pant For Women.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/7f4dfeaf5adab1b76369ff96529810cf892b7315cdd5ca4caa400a29b2e28cdf.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/de82973c0de2757b40c3fb8a17a619a07ba5fbc0c677257c3bd535d1eeb79c7c.png"
    ],
    variantImages: {
      "White": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/7f4dfeaf5adab1b76369ff96529810cf892b7315cdd5ca4caa400a29b2e28cdf.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/f66ab4183399296834583725beff4f79547ff2fbeea8c261d895d682eccaed59.jpg"
      ],
      "Black": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/de82973c0de2757b40c3fb8a17a619a07ba5fbc0c677257c3bd535d1eeb79c7c.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/e448b7ea4279ad70740c185b27624f0fbbfe921ad79df136b7727a0d0e5a55f7.jpg"
      ]
    }
  },
  {
    id: 326,
    handle: "white-cotton-blend-solid-pant-for-women-1240561",
    cat: "women",
    name: "Cotton Blend Solid Pant For Women",
    price: 1999,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Beige"],
    rating: 4.7,
    reviews: 63,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: White, Beige\nAvailable Sizes: S, M, L, XL, XXL\nStylish Cotton Blend Solid Pant For Women.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/ff0a2f30c921c5ff7000c33e9e1e91347a9e72527724b58951058e775d433b2e.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/b3891c2685378c84a5b684068f03aecac7e103b632ac7ee9fc59206cc5c43928.png"
    ],
    variantImages: {
      "White": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/ff0a2f30c921c5ff7000c33e9e1e91347a9e72527724b58951058e775d433b2e.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298933/freefire_store_catalog/e369ccba2e0caf3915077de5522a620f36213b2a84cfac635c29988f56e6db9a.jpg"
      ],
      "Beige": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298932/freefire_store_catalog/b3891c2685378c84a5b684068f03aecac7e103b632ac7ee9fc59206cc5c43928.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298933/freefire_store_catalog/dc06cf973c4a7a0ab3ca766f5562e2af9f68e9106f942fea6af9533259f31c66.jpg"
      ]
    }
  },
  {
    id: 327,
    handle: "white-solid-lace-design-pant-for-women-1240560",
    cat: "women",
    name: "Solid Lace Design Pant For Women",
    price: 499,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Beige", "Black"],
    rating: 4.8,
    reviews: 87,
    badge: "NEW",
    featured: false,
    desc: "Available Colors: White, Beige, Black\nAvailable Sizes: S, M, L, XL, XXL\nStylish Solid Lace Design Pant For Women.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298933/freefire_store_catalog/2c83b3d228fcb05cbf3a7b139716f6c78300f6297d9178df30778f89f79e4cfc.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298933/freefire_store_catalog/072c3da683b8decbe6ea15d8944c8113062ce1a71db8c5d88f16fed8b06fec02.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298933/freefire_store_catalog/45e9aeac9c15dc1bdfbae4b04e2e11b4f6e7ede5ce36bd50f16993f505e2341b.jpg"
    ],
    variantImages: {
      "White": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298933/freefire_store_catalog/2c83b3d228fcb05cbf3a7b139716f6c78300f6297d9178df30778f89f79e4cfc.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298934/freefire_store_catalog/6724e7e1fe37232710d9e53da52e7e2cebf1cffc521b0df82388fcd1446e2c7c.jpg"
      ],
      "Beige": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298933/freefire_store_catalog/072c3da683b8decbe6ea15d8944c8113062ce1a71db8c5d88f16fed8b06fec02.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298934/freefire_store_catalog/b24ddc86e27469fb247ba4e40c8ec1888eee9d36d672bb5ca3a2b9c6384bb076.jpg"
      ],
      "Black": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298933/freefire_store_catalog/45e9aeac9c15dc1bdfbae4b04e2e11b4f6e7ede5ce36bd50f16993f505e2341b.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298934/freefire_store_catalog/bc9466e5aa585330ca00bb9487f83324b7dc083393fc527b2f488b79c2c76732.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298934/freefire_store_catalog/91a4257506445eed99fd87a989eb4a04a5054825af25298035168d99b3b925b4.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298934/freefire_store_catalog/fa9af7d83cdf116f7e74e03dfc9b02baf9bcd48138e6eaeb88475c452999f0ae.png"
    ],
    variantImages: {
      "Green": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298934/freefire_store_catalog/91a4257506445eed99fd87a989eb4a04a5054825af25298035168d99b3b925b4.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298934/freefire_store_catalog/6eecde61ae47e5a12e7fc82e3f9ed61095191ab300709f615282a6b4670ec99b.jpg"
      ],
      "Pink": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298934/freefire_store_catalog/fa9af7d83cdf116f7e74e03dfc9b02baf9bcd48138e6eaeb88475c452999f0ae.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298934/freefire_store_catalog/425f20bd945e81387eda3a3faf047e2f6dc7a6f57d98056629f3fd33a115e8c2.jpg"
      ]
    }
  },
  {
    id: 329,
    handle: "charcoal-solid-regular-fit-jeans-for-women-1240195",
    cat: "women",
    name: "Solid Regular Fit Jeans For Women",
    price: 1400,
    orig: 0,
    sizes: ["26", "28", "30", "32", "34", "36"],
    colors: ["Charcoal", "Light Blue", "Blue"],
    rating: 4.8,
    reviews: 108,
    badge: "SALE",
    featured: false,
    desc: "Available Colors: Charcoal, Light Blue, Blue\nAvailable Sizes: 26, 28, 30, 32, 34, 36\nStylish Solid Regular Fit Jeans For Women.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298935/freefire_store_catalog/b063c8578ef6482ec9bf2cb3990ea0cadacc8eeb2e15af0408257410cd5e042b.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298935/freefire_store_catalog/3ad56db1f4028ef597ea3f4f2f430e90422445cd6f2b593325f5b5c84d54b5b8.png",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298935/freefire_store_catalog/8f09b09d6a3d4359283c81359fe8e9c00673ff997b011316e29ae9a97c0b11ef.jpg"
    ],
    variantImages: {
      "Charcoal": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298935/freefire_store_catalog/b063c8578ef6482ec9bf2cb3990ea0cadacc8eeb2e15af0408257410cd5e042b.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298935/freefire_store_catalog/47ba6b6095c53663a70e12b3e36fbedaecc6c85cbafbd919cf6db11e01a4e939.jpg"
      ],
      "Light Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298935/freefire_store_catalog/3ad56db1f4028ef597ea3f4f2f430e90422445cd6f2b593325f5b5c84d54b5b8.png",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298935/freefire_store_catalog/20c39cde1a08ae8be628810a8fbd59f8814c02988de51357839f011a284c683d.jpg"
      ],
      "Blue": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298935/freefire_store_catalog/8f09b09d6a3d4359283c81359fe8e9c00673ff997b011316e29ae9a97c0b11ef.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298936/freefire_store_catalog/7b6eb87275f9c37d082c2be6ab0b71f4a844082131b7168784a53954250f935e.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298936/freefire_store_catalog/f9a31b2077fafaf66912f466fe4dd69e1be1ae85cd49b690de2807fcc73ac95a.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298936/freefire_store_catalog/9d2222c93e65b5adf3ea16946f22c282aa5250b49ff1bfdbd5d0dc19ee6b5fa8.jpg"
    ],
    variantImages: {
      "Grey": [
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298936/freefire_store_catalog/f9a31b2077fafaf66912f466fe4dd69e1be1ae85cd49b690de2807fcc73ac95a.jpg",
        "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298936/freefire_store_catalog/9d2222c93e65b5adf3ea16946f22c282aa5250b49ff1bfdbd5d0dc19ee6b5fa8.jpg"
      ]
    }
  },

  // --- NEWLY IMPORTED CSV PRODUCTS (Clothing & Everyday Wear) ---
  {
    id: 406,
    handle: "solid-plazzos-for-women-and-girls-dailywear-bk-xxl",
    cat: "women",
    name: "Solid Plazzos For Women And Girls",
    price: 1999,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.6,
    reviews: 58,
    badge: "",
    featured: false,
    desc: "Solid Plazzos For Women And Girls dailywear. High quality soft breathable fabric.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298936/freefire_store_catalog/1968f1f68f708080d62fa8d81d9c64463002f631ccd5ec9b73e7e4d82598167b.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298936/freefire_store_catalog/1420af35cff82906ff2ea0138a98cf38fb9db5ca5b4e479556e52996ab92ddb0.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298936/freefire_store_catalog/d22da033031adb0c80fc2ff4cdf547974d12df1df4fb72589e7b3a85f380d21e.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298937/freefire_store_catalog/89d09985542ba8146d3badd1202c182f79e3b651a4e7cfb7a1fb0ae499df40af.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298937/freefire_store_catalog/cf5e3d05329da5edfeee4291dae13438060e3ff52db2f93f52a6cda735334034.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298937/freefire_store_catalog/228b2c5bc7b00073f2402e2c5df98835aa6c09209e4046d32ffd09f4561a8d5e.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298937/freefire_store_catalog/fa2a457ece1c4e966e5352cdf902e6c602df1c3b6ac3c8e319813d994771440e.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298937/freefire_store_catalog/f005e512a89af058c796905fbaca8eb567f33a002dc9c2386b86b76cba006280.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298937/freefire_store_catalog/e73490eeea0543473d1173b3f849f4ef9daaa53ff7ae55e985f490a751dcf555.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298937/freefire_store_catalog/674730a929a020db21b7fa8ef718759c9afb86255e25a53bd2d798dbcefb7117.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298938/freefire_store_catalog/a2d4ab81027bcac2c16681800ea5d82b11ce4984c2348fe3f8a74facfcce629e.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298938/freefire_store_catalog/31bf171fd67423e77e6eabce386fcd7ec331232787fb526e983a96648cce2158.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298938/freefire_store_catalog/f73584d96271baea7cf0a6300f82557a24ddecb6a81fa91bd613c692c7949e1b.jpg"
    ]
  },
  {
    id: 415,
    handle: "cotton-blend-straight-fit-trouser-for-women-olive-l-cv7sngq59o3h4p4k7ho0",
    cat: "women",
    name: "Cotton Blend Straight Fit Trouser for Women",
    price: 1699,
    orig: 750,
    sizes: ["L"],
    colors: ["Olive"],
    rating: 4.7,
    reviews: 67,
    badge: "SALE",
    featured: false,
    desc: "Cotton Blend Straight Fit Trouser for Women in Olive.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298938/freefire_store_catalog/575396208e33353754c2a6317420563e2fcb99eac598c3ec212f31840734c5fd.jpg"
    ]
  },
  {
    id: 416,
    handle: "stylish-women-dress-d4bc0lfl9odtq4216p60",
    cat: "women",
    name: "Stylish Women Maroon Gown Dress",
    price: 1999,
    orig: 550,
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    colors: ["Maroon"],
    rating: 4.8,
    reviews: 110,
    badge: "SALE",
    featured: false,
    desc: "Stylish Women Maroon Gown Dress for evening parties and special occasions.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298938/freefire_store_catalog/64aac41ca778d676d0b2ca8f3b6a18254907482f44a76ae813cbaa7838ed520e.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298938/freefire_store_catalog/91a23aaafc76c8030a3e27929dc2e66d1cc13cd6c95212517f2006584766c8ed.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298938/freefire_store_catalog/f1f7f64caa1f3fca64ca4b9ba926f43ea6e4ff73083e7ed501749ecd85aae020.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298938/freefire_store_catalog/e1c6f84b8c284e1100d04f19bb3968709425622eb966740ed757b8e45304ff67.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298938/freefire_store_catalog/100425c4081ee6e0ed2a5d2e5cc45a68028b00991c11a3650bdaad72d77fd0f5.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298939/freefire_store_catalog/68c32d3c8c6d0e0604615e6e1b7f3c57d79bf1d74c84690849673ea3219d712c.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298939/freefire_store_catalog/bbb40cd00b46f6ca27ec0432892e8c721fd246db684806b7d3ea4b53610abde4.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298939/freefire_store_catalog/7f12730306ffb78e8c7762cc7fe58a610a7ee33f618ad45c0da5fceaa606925e.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298939/freefire_store_catalog/a3a6cc588e4d8d9405c9cd590db0e6ebff678019db87a9774e74a20eae243465.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298939/freefire_store_catalog/b2132b60d9a37647db29edfeb627a5b3d50b47ae3305371c7d2d92da519bff56.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298939/freefire_store_catalog/e7a09df6728253062a4499527943826740c9f64182f04d9f1ce24851fc22c6ee.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298940/freefire_store_catalog/bd802f36fcbc756ddb189b571c1376280485e8c0a440f8a98be313735323c11b.png"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298940/freefire_store_catalog/52a9be97ae5a1714abf1d622695e1f440bc7b098ddf76c97da6b9592ed64770e.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298940/freefire_store_catalog/512ace92e9e6cac05148a3c7ef39e873564a816556363db63baa6e0f530318fd.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298940/freefire_store_catalog/361eb101c1deef38654e6f3b0a582a9dba9f47d8325a11bf1b23f2b5d76efa2a.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298941/freefire_store_catalog/10379f61e1fc5034014be3658e83a42f22084750bfc954e787e773b72a660648.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298941/freefire_store_catalog/b70de1b1fcdc1928e7de8367603f23cfed13da889d718b00c4d2ed693b3cfb93.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298941/freefire_store_catalog/3069c614b70a50963337c4d9bed191c65148f60a8942610e458f9cf333b226ae.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298941/freefire_store_catalog/7e34ed979a25d0a69f122657957f2864987a4be4b6b1ef517c1adbccd4752a9f.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298941/freefire_store_catalog/e5171a8a286c47ce0296c2d9b5cfb1eeeb333ed47e9d09d3401bb6af9fbd5d67.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298941/freefire_store_catalog/fee7e07662339f20033711c0f7e7b6aeb717e3279c15842fe59a5371bff06d6f.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298941/freefire_store_catalog/32f2d9272779a9434ef4f1e482950952fc41bbb63f4a55227014da8e78930821.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298941/freefire_store_catalog/90388f6132b2f11669b2ff4be2204205f38e2751e0ad6b28c254d7e68d9f7cb7.jpg"
    ]
  },
  {
    id: 425,
    handle: "men-s-special-underwears-d9f27j0mv3jc738f9h00",
    cat: "men",
    name: "Men's Special Comfort Underwear",
    price: 1699,
    orig: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.5,
    reviews: 44,
    badge: "",
    featured: false,
    desc: "Men's Special Comfort Underwear.",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298941/freefire_store_catalog/50cdf671d4e15d4809ac1b79cd439f42e702bb277a8ab59e133d754152df4498.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298942/freefire_store_catalog/16514f1eee05497f781fc56b57f6bb5452adbd7fa7b3479a05ad721dbf7ec63f.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298942/freefire_store_catalog/74b65b691e5ed396e38ae07d54a38f6c08ecdb86c7688739de3e7c843c56e766.jpg",
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298942/freefire_store_catalog/6385417953f0cfac0a084228c5df6d24a0edce8d27ba5a76c85d3f896c7fcbbc.jpg"
    ]
  },
  {
    id: 426,
    handle: "men-s-solid-round-neck-polycotto-multicolor-t-shirt-pack-of-4-d9fnfo8mv3jc738f9i80",
    cat: "men",
    name: "Men's Solid Round Neck T-Shirt (Pack of 4)",
    price: 1999,
    orig: 0,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Assorted"],
    rating: 4.7,
    reviews: 69,
    badge: "",
    featured: false,
    desc: "Men's Solid Round Neck Polycotton Multicolor T-Shirt - (Pack of 4).",
    images: [
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298942/freefire_store_catalog/735e4ab7b92c60a1d01799b86c5082535ca05ec18869deb78163bcd0e491435a.jpg"
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
      "https://res.cloudinary.com/smi5oqr3/image/upload/v1791298942/freefire_store_catalog/24b91447629aa8b0668b4643e89c2f05f44afaced3502630444eb7a2b3a66a27.jpg"
    ]
  },
  // Existing Staples
  { id: 2, cat: 'men', name: 'Slim Fit Chinos', price: 1000, orig: 1899, sizes: ['28', '30', '32', '34', '36'], rating: 4.3, reviews: 64, desc: 'Stretch chinos with a modern slim fit. Wrinkle-resistant fabric, all-day comfort.', badge: 'SALE', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop'] },
  // CSV Imported Dresses
  ...IMPORTED_DRESSES,
  ...REFERENCE_PRODUCTS,
  ...KURTI_PRODUCTS
];

// Historical records stay available for order references; retired items are not for sale.
export const PRODUCTS = SOURCE_PRODUCTS.filter(p => !isRetiredProduct(p.id));

export const BLOG_POSTS: BlogPost[] = [
  { id: 1, cat: 'STYLE GUIDE', title: '10 Essential Wardrobe Staples for Summer 2026', excerpt: 'Build a versatile, timeless wardrobe with these must-have pieces that transition effortlessly.', date: 'JUNE 15, 2026', emoji: '☀️' },
  { id: 2, cat: 'DENIM', title: 'The Ultimate Denim Fit Guide: Wide Leg vs Skinny', excerpt: 'Everything you need to know about finding the perfect pair of jeans for your body type.', date: 'JUNE 10, 2026', emoji: '👖' },
  { id: 3, cat: 'FASHION', title: 'Top Fashion & Comfort Trends You Need to Know', excerpt: 'How breathable fabrics and modern silhouettes are reshaping daily fashion and everyday wear.', date: 'MAY 28, 2026', emoji: '✨' }
];
