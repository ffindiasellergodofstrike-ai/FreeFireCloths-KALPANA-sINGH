# Storefront migration

## Source and preservation boundary

- Website A: `ffindiasellergodofstrike-ai/FreeFireCloths-KALPANA-sINGH` at `169db5d0efd491efdc99feb3930fb424a90aef0e`.
- Website B: `ffindiasellergodofstrike-ai/Booyah-Wear` at `52fe20af977a2a77f23d7210efba9ea8a84affd5`.
- The connected GitLab repository contained only a template README. A's complete tracked source was imported in baseline commit `350e0f7cca32c339bb0436b3b2581269315b9c22`; redesign changes follow separately.
- `website-a-baseline.json` records source SHA-256 hashes. `catalog-provenance.json` records the original catalog digest and source revisions.

## UI mapping

| Website B reference | Website A implementation |
| --- | --- |
| Burgundy/ivory, serif headings, editorial photography | `storefront.css`, rebuilt `Home.tsx` |
| Layered hero, six category tiles, price edits | Existing `/`, `/collections/:category` routes |
| Product grids, price filters, sorting, incremental browsing | `Collection.tsx`, shared `ProductCard.tsx` |
| Search cards and product detail styling | Existing `/search`, `/product/:id` routes |
| Gallery, colors, sizes, product descriptions | Existing detail page extended only for imported availability |
| Photo reviews | Local review content with explicit imported attribution |
| Header, responsive navigation, footer | A's existing components, logo, account/cart actions and business information |

All original routes remain present. Men, women and kids remain browsable. The added collection routes are tops, denim, co-ords, lounge, intimates and accessories. Original price-range filters remain available alongside B's exact-price edits.

## Catalog mapping

All 76 original product records are unchanged. All 251 published B products are added, for 327 total. Products in B's private import/quarantine files were not published on B and are not part of this import.

`reference-catalog.json` is B's published product data. `reference-products.ts` adapts it into A's `Product` type and appends it to the existing `PRODUCTS` array. There is no second catalog provider or database. Names, descriptions/specifications, prices, sale prices, sizes, colors, images, SKU metadata and collections are retained.

Stable IDs are `-sourceId`; all existing A product IDs remain positive and unchanged. This avoids both original product collisions and A's positive custom-product allocator. Imported records are also excluded by A's existing `id >= 200` custom-product persistence rule. `sourceId` links local review files to their source product. No database migration is required.

B's available/unavailable SKU flags map to A's existing variant `stock` field (`0` for unavailable; omitted for available, since no exact quantity is supplied). Every imported variant price equals its product price. Imported size/color choices are disabled when unavailable. These catalog checks leave original A product selection unchanged.

B's catalog review counters were stale (some zero despite published photo reviews); `reference-review-summary.json` reflects the actual 1,198 imported reviews. They are explicitly described as imported, not verified Free Fire Store purchases. All local product and review photographs are preserved byte for byte. B contains physical apparel/accessories; no downloadable product files, demos or product FAQs are declared in its published product schema.

## Existing purchase flow

A's `CartContext`, `ProductContext`, `AuthContext`, checkout pages, PayGlocal API handlers, Express server, Firebase configuration/rules, payment success/failure pages, order pages, deployment configuration, environment declarations and dependencies remain byte identical.

Add to bag uses A's existing `addToCart(product, size, quantity, color, image)`. Imported Buy now first uses that same cart operation, then navigates to A's existing `/checkout`; items already in the bag remain included. This preserves imported color, quantity and image in A's existing cart-based order format. Original A Buy now behavior remains unchanged. No B checkout, gateway, credentials, authentication, backend or environment configuration was imported.

Footer/business/contact information, policy pages and branding text remain authoritative from A. CSS changes their presentation without replacing the legal content. All other original files, including dormant administrative/delivery pages, remain present.

## Validation

```sh
npm ci
npm run lint
./node_modules/.bin/tsx --test tests/*.test.ts
npm run build
npm run dev
```

The catalog suite checks original product identity, protected file hashes, all imported mappings/availability, and every referenced local image/review. The payment contract test uses synthetic RSA keys and intercepted fetch responses to exercise A's unchanged encryption/initiation, status response, signed success/failure callbacks and missing-token handling. It makes no real payment or database requests and is not a gateway certification or security audit.

Live settlement, real account registration/login, persistent Firebase order creation and fulfillment require Website A's configured provider environment. Preserve the existing deployment secrets privately. There is no new digital-download subsystem; A's existing delivery/order handling remains responsible for fulfillment.
