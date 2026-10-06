# Hosted images and future editing

## Initial media migration

- Cloudinary cloud: `smi5oqr3`.
- 1,980 product images and 1,687 review images are hosted externally (3,667 total).
- Every hosted original was downloaded and compared with its source SHA-256 before removing the source binaries: 305,264,008 bytes moved out of the current tree.
- Product IDs, descriptions, prices, stock flags, reviews and other metadata are unchanged. Original A image URLs were unchanged in that initial migration; see the later origin-host migration below.
- `src/data/reference-catalog.json` contains product and variant HTTPS image URLs. `public/reviews/*.json` contains review text and hosted photo URLs.
- `docs/hosted-media.json` records the original paths, hosted URLs, byte sizes and SHA-256 hashes, plus original JSON hashes for the migration audit. It is not imported into the browser bundle.
- Public IDs start with `freefire_store_migration/`. Keep these assets and public IDs intact so catalog pages and previously saved carts/orders can still display their photos.
- Existing cart/order images saved as `/products/<hash>.webp` are resolved by a presentation-only image error handler in `src/lib/hosted-images.ts`. Stored carts/orders, checkout, database, authentication and payment code are untouched.

The storefront reads public delivery URLs only. It contains no Cloudinary upload credentials or upload preset. Runtime image display does not require a Cloudinary API key or a new environment variable.

## Adding or changing images later

1. Upload the image to your Cloudinary Media Library.
2. Copy the public HTTPS delivery URL (not the dashboard asset page URL).
3. Update the relevant `images`, `variantImages`, and variant `image` fields in the existing product record. Keep its ID and purchase-related fields stable. For review photos, update the matching review JSON.
4. Check the product gallery, selected color, cart, and mobile layout. Keep old assets available for existing orders that reference them.

For intentional future catalog/price changes, revise the corresponding catalog assertions and migration baseline deliberately. The current preservation tests compare against the migration snapshot; do not disable the unrelated original-product/core protection checks to add new content.

## Working with Google AI Studio

Use the supplied lightweight source ZIP, or download the latest task branch's source archive from GitLab. Extract it and use the source workflow supported by your Google AI Studio project. Import support and limits depend on that project's current interface; this migration does not configure a Google AI Studio or GitHub connection.

The source archive excludes `.git`, `node_modules`, build outputs and hosted product/review image binaries. Install dependencies with `npm ci`; run with `npm run dev`. Preserve the existing private deployment configuration separately.

Do not use a ZIP from an old commit or copy the existing `.git` directory into a new source project: historical Git commits still contain the old photographs. Removing current files does not erase Git history. A fresh repository created from the lightweight source has no old image history.

When asking AI Studio to edit the site, keep the existing Free Fire Store identity, policy content, PayGlocal integration, checkout, auth, orders, Firebase configuration and environment declarations authoritative. Use hosted URLs for new photos and retain the existing product schema and purchase flow.

The migration upload preset can be disabled in Cloudinary after this migration if you no longer need unsigned uploads; public delivery links continue to work independently of that preset.

## Latest studio collection

The nine-product addition hosts another43 product photographs,2 film posters and2 films with MP4/WebM alternatives (49 active files). Total imported product/review photos:3,710, excluding posters. New media public IDs start with `freefire_store_studio/`; keep these assets available. New product image URLs are in `src/data/kurti-catalog.json`; homepage film URLs are in `src/data/studio-media.json`. See [studio update](STUDIO_UPDATE.md).

## Origin-host migration

291 additional distinct URLs from the original catalog and footer now use byte-identical Cloudinary copies under `freefire_store_catalog/`. Every public delivery was downloaded and SHA-256 verified. Original URLs and verification records are retained in `docs/catalog-origin-media.json`, outside the public bundle. This update changes image hosting only; historical orders retain their stored URLs. See [deployment and crawler guidance](PUBLIC-BUILD.md).
