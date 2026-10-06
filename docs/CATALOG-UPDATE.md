> Historical department update. For the current 307-product catalog, brand retirement and email setup, see [ORDER-EMAIL-SETUP.md](ORDER-EMAIL-SETUP.md).

# Department and homepage correction

## What's in this update

- All 336 products retained: Men 12, Women 322, Kids 2. Women contains the original 62 womenswear items plus both imported catalogs.
- Home has two primary department cards (Men/Women) and twelve featured pieces: ten original items plus two new kurtis.
- Department pages offer clothing-type filters, price range, sorting, a visible result count, Load more and Show all. Clearing filters stays in the selected department. Old exact-price query links continue to work; prices are not department/category names.
- Existing prices retained. The requested ₹1,450/₹1,100 prices need an explicit product mapping before changing them.
- Homepage videos, store identity, all product IDs, variants, source metadata and original purchase flows retained.

## Image findings requiring follow-up

All 4,005 unique product/variant/review images were decoded and scanned in 85 contact sheets; selected candidates enlarged. This scan cannot guarantee every small mark has been identified.

Presentation omits one SHEIN-watermarked product gallery photo and 31 review photos containing camera watermarks, retailer tags, visible brands or business signs. Original product/review data is unchanged. Review text, attribution, ratings and counts remain.

The catalog is **not yet free of third-party branding**. `catalog-media-audit.json` records URLs and specific findings, including OWND labels on product324, Savana by Urbanic on product501, and a horse/rider emblem on product-2328642. These need owner confirmation of actual merchandise, accurate replacement photos, or a listing decision. Removing a label from a photo would not establish that the actual item is unbranded.

Existing Garena references in policies, contact addresses and legacy checkout remain under the original instruction to preserve these files. Display-copy changes and replacement contact details need owner confirmation. Product516 also has an existing mismatch between Khaki shirt-dress metadata and black evening-dress photos; owner confirmation is required before changing product specifications.

## Verification

TypeScript, catalog preservation and department/media tests pass. Responsive browser checks cover department browsing, pagination, sorting, search, menu, mixed cart and original checkout handoff. Core payment/auth/order/backend/legal source is unchanged. Prior unchanged synthetic payment-contract results are reused. No live payment, account write, production order or physical delivery was performed.

## Source ZIP / Google AI Studio

Use the new `freefire-store-catalog-fixed-source.zip` for this revision. Previous `freefire-store-studio-source.zip` predates these department fixes. Images and films remain externally hosted; the ZIP contains source, catalog/review JSON and documentation, with no node_modules, .git, build output or media binaries. Keep existing deployment environment variables configured separately.
