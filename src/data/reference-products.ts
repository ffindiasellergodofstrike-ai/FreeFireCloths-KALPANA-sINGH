import catalog from "./reference-catalog.json";
import reviewSummary from "./reference-review-summary.json";
import type { Product } from "./products";

// Negative IDs reserve a stable namespace without changing A's positive IDs,
// custom-product allocator, saved carts, order schema, or checkout contracts.
export const REFERENCE_PRODUCTS: Product[] = catalog.map((item) => ({
  ...item,
  ...reviewSummary[String(item.id) as keyof typeof reviewSummary],
  id: -item.id,
  sourceId: item.id,
  cat: item.cat as Product["cat"],
  badge: item.badge as Product["badge"],
  variants: item.variants.map(({ available, ...variant }) => ({
    ...variant,
    ...(available ? {} : { stock: 0 }),
  })),
}));

export const COLLECTIONS = [
  { id: "tops", label: "Tops", note: "A little statement. Every day." },
  { id: "denim", label: "Denim", note: "Find your everyday fit." },
  { id: "co-ords", label: "Co-ords", note: "Better, together." },
  { id: "lounge", label: "Loungewear", note: "Slow down in style." },
  { id: "intimates", label: "Intimates", note: "Comfort, close to you." },
  { id: "accessories", label: "Accessories", note: "The finishing touches." },
];
export const PRICE_EDITS = [550, 750, 1100, 1400];

// Availability belongs to the imported catalog presentation; original products
// retain their existing selection and purchase behavior.
export function isImportedOptionAvailable(
  product: Product,
  size: string,
  color: string,
) {
  return (
    !product.sourceId ||
    Boolean(
      product.variants?.some(
        (variant) =>
          variant.size === size &&
          variant.color === color &&
          variant.stock !== 0,
      ),
    )
  );
}
