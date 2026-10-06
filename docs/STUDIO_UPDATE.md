# Homepage and kurti collection update

## Presentation

The homepage uses a warm neutral palette, a full-width film hero, editorial image cards, style filters, a product grid, a second styling film, imported review quotes and links to the existing collections. Header identity, footer, business details and policies remain the store's originals. No reference-site logo, taglines, contact information, analytics, account system or checkout code is included.

All 43 product photographs were visually inspected. Two clean source films were selected; other reels with overlays/signage were not used. The hero's black letterboxing was cropped; the styling film was shortened to a ten-second excerpt. Audio and source metadata were removed. The homepage has pause/play controls, offscreen/tab-hidden pausing, and a poster-only default for reduced-motion or data-saver preferences. Cloudinary hosts all images, posters and MP4/WebM video alternatives; none of these binaries are stored in Git.

## Catalog mapping

- Existing 327 product objects are unchanged; nine additions bring the catalog to 336.
- New product IDs are `-300000001` through `-300000009`. `sourceId` is the corresponding positive number in this reserved namespace; existing review loading and purchase behavior apply without backend changes.
- `kurti-catalog.json` joins the existing `PRODUCTS` array. Names, descriptions, current/reference prices, all 43 gallery entries, 36 per-size stock entries, style categories and published measurement tables are retained.
- Sizes and their sold-out flags follow the captured source inventory. These are static catalog snapshots, not live synchronization with another shop. Update them as part of normal store catalog management.
- Source options list sizes only. One descriptive color label per product identifies the photographed item; no additional purchasable color variants were invented. Every size uses the same source selling price of ₹650, compatible with A's existing cart pricing.
- Original gallery ordering is retained, including the repeated photo in product 9.
- Measurements are shown in inches using an optional display-only `sizeChart` field. Style tags support the homepage filters. No database schema migration is needed.
- Only two published reviews were available, one each for source products 1 and 5. Both retain author, rating, text and date, and explicitly state that they are imported rather than verified purchases from this store. Other new products have zero reviews; none were fabricated.
- No product-specific FAQ, downloadable file, or demo was published in the selected product records. Source business/legal FAQs were not imported.

## Preserved purchase flow

The new products use A's existing product route, variant availability helper, add-to-cart operation and cart-based Buy Now handoff. Cart, checkout, authentication, orders, PayGlocal handlers, database configuration, environment variables and policy sources are unchanged. No live external payment or account write was made during verification.

## Verification

`tests/studio-catalog.test.ts` checks all 327 previous objects against a frozen digest, new IDs, full gallery/size/measurement mapping, prices and stock, published reviews, the verified Cloudinary inventory and reference-brand isolation. `docs/studio-catalog-audit.json` is a source-content/media audit snapshot, not a runtime catalog provider.

Fresh typecheck, relevant catalog/preservation tests and production build pass. Shared Chromium verifies desktop/tablet/mobile layout, style filtering, galleries, size chart and disabled sizes, new-plus-original cart totals and existing checkout handoff. Both films play using WebM in Chromium, which lacks H.264 in this sandbox; MP4 alternatives remain available for browsers that support them. Reduced-motion rendering makes no automatic video request.

Physical devices and live provider settlement/account/order creation were not exercised. The original payment contract's synthetic pass is reused because its source, fixtures, dependencies and configuration are unchanged.
