import catalog from "./kurti-catalog.json";
import type { Product } from "./products.js";

// A reserved negative namespace keeps saved carts and existing product IDs intact.
// These records join the same PRODUCTS array and use the existing purchase flow.
export const KURTI_PRODUCTS: Product[] = catalog.map((item) => ({
  ...item,
  cat: "women",
  badge: "NEW",
}));

export const KURTI_STYLES = ["All", "Backless", "Halter Neck", "Floral", "One Shoulder"];
