# Public deployment and crawling

## What this update changes

- The existing `src/pages/GarenaCheckout.tsx` is retained byte-for-byte. Its five route registrations are preserved in `archive/legacy-checkout-routes.tsx`, outside the active application's import graph. The public storefront no longer serves those legacy checkout URLs. Their checkout/payment source has not been deleted or rewritten. Existing legacy payment callback redirects still point to those now-unpublished pages; use this release only when that old flow is no longer in use. The current clothing `/checkout` and PayGlocal API handlers remain intact.
- 291 unique images previously served from the three requested origin hosts now have byte-identical copies on the existing Cloudinary account. `docs/catalog-origin-media.json` preserves all original URLs, replacement URLs, byte sizes and SHA-256 hashes. It is an audit/source file, not imported by the browser. Photos, product IDs, prices, variants and availability are unchanged. Existing image exclusions were mapped as well.
- Old saved orders and user-created browser products may retain their historical URLs; this update does not rewrite customer records. The origin sites and older public code/caches can still reveal those previous URLs. Hosting does not change what is depicted in a photo.
- `src/config/site.json` is the canonical deployment/metadata configuration. The current apex domain redirects to `https://www.ffstreetwear.shop`, so the canonical URLs and sitemap use that www origin. If changing domains, also update the sitemap declaration in `public/robots.txt`.
- `robots.txt` is a real text file. Build-generated `sitemap.xml` lists active products, collections, public store/policy pages and articles. Retired products and account/payment pages are omitted.
- Build-generated HTML provides individual page titles, canonical URLs, descriptions and share metadata before JavaScript runs. It does not render the full product body server-side. `PageMetadata` updates that same metadata during client navigation.
- Account/checkout/payment/search pages have `noindex, follow` metadata. Robots are allowed to fetch these pages to discover that directive; API crawling is disallowed. These directives do not restrict unauthorized access or guarantee indexing/removal.
- Unknown non-product paths return a real404 in production. A custom-product fallback stays available for the existing browser catalog. Development Vite still uses its ordinary SPA fallback and is not a privacy boundary.
- Express server output/maps now live under `build/`, outside the public `dist/` folder. Public source maps remain disabled.

## Deploy the application, not the source directory

Use this source ZIP as project input. Do not upload the entire ZIP/checkout/archive/docs as a public static directory. The ZIP deliberately retains original code and provenance, and recipients of that source can read it. A public Git repository is also public independently of the storefront.

```sh
npm ci
npm run lint
npm test
npm run build
npm run check:public-build
NODE_ENV=production npm start
```

Vercel's configured public output is `dist/`; filesystem HTML uses `cleanUrls`. Existing `/api/*` handlers stay server-side. Node/Express production uses `build/server.cjs` and only serves static files from `dist/`. Always rebuild; do not deploy an earlier `dist/` or point static hosting at `build/`. No legacy enable flag is exposed in the browser. Restoring archived routes is an explicit source change that also restores that component's external redirects.

After deployment check `/robots.txt` (text), `/sitemap.xml` (XML), a product's view-source metadata, `/checkout` (noindex), and an unknown path (404). Search-engine recrawling and third-party caches are outside this source update. No production deployment or search-console submission was made by this task.

The public-build check scans every generated JS/JSON/HTML/CSS/text/XML asset for the requested legacy checkout/domain strings and rejects accidentally published server/source-map files. It does not hide the active catalog, Firebase web config, normal API endpoint names, Free Fire Store branding, or legally relevant contact/policy text. Those remain public as appropriate to the existing app. Existing legal/contact strings still contain the old business email/domain pending an authorized working replacement; they were not concealed. All visitors and crawlers receive the same files; no bot-specific cloaking is used.
