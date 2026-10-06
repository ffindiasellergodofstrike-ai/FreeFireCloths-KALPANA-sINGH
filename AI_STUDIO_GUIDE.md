# Free Fire Store — Google AI Studio editing guide

## पहले यह समझें

यह existing React + TypeScript + Vite frontend और Node/Express backend है। इसे नया app बनाकर replace करने की जरूरत नहीं है। आपकी अगली design/content command के लिए नीचे दी file-map और settings इस्तेमाल करें। किसी बाहरी AI Studio project में import या sync इस ZIP से अपने आप नहीं होता।

Latest source ZIP: **freefire-store-public-cleanup.zip**. Photos/videos hosted URLs हैं; source में भारी media files नहीं हैं। Private environment values अलग configure करें।

## AI Studio में इस्तेमाल

Google की [official Build mode documentation](https://ai.google.dev/gemini-api/docs/aistudio-build-mode) के अनुसार existing GitHub repository को start screen के **More (+) → Import from GitHub** से import किया जा सकता है। Supported app stack में React frontend और Node.js server शामिल हैं।

यह source अभी GitLab task branch पर है। AI Studio का documented GitHub import इस्तेमाल करना हो तो इस ZIP का extracted source अपने चुने हुए GitHub repo में रखें, फिर उसे import करें। पुराने image-heavy `.git` history, `node_modules`, `dist` या secrets को साथ न डालें। इस task ने GitHub repository/AI Studio project नहीं बनाया या connect किया है। ZIP upload का विकल्प आपके interface पर निर्भर है; उसे उपलब्ध होने का दावा नहीं किया गया है।

Import करने के बाद AI Studio को सबसे पहले यह command दें:

> Read AI_STUDIO_GUIDE.md and GEMINI.md. Keep this existing React/Vite + Node/Express application. Implement my requested change in the mapped files. For homepage selections and copy, edit src/config/homepage.json. Do not regenerate the app or change payment, authentication, orders, policies or server secrets unless my current command explicitly requires it. Keep product IDs, variant mappings and the shared catalog compatible. Use existing hosted photos. Run npm run check:homepage, npm run lint and the affected tests; then build and inspect mobile/desktop views. Explain the changed files and any checks that could not run.

फिर अपनी command जोड़ें, उदाहरण:

> Homepage पर Textured Cardigen की जगह दूसरे active product को दिखाओ। पहले `npm run catalog:find -- "product name"` से सही ID/design पहचानो। बाकी checkout और email flow preserve करो।

## सबसे आसान edit points

| बदलाव | File |
| --- | --- |
| Canonical domain / default SEO metadata | `src/config/site.json` (also update `public/robots.txt` on a domain change) |
| Crawler HTML / sitemap generation | `scripts/build-crawler-pages.mts`, `src/lib/page-metadata.ts` |
| Homepage products और उनका क्रम | `src/config/homepage.json` → `featured.productIds` |
| Hero heading, subheading | उसी file का `hero` |
| Men/Women cover photo | उसी file का `departments[].productId` / `imageIndex` |
| Lookbook product, photo, text | उसी file का `lookbook` |
| Hero video/poster hosted URLs | `src/data/studio-media.json` → `hero` |
| Homepage layout/sections | `src/pages/Home.tsx` |
| Homepage colours/spacing/responsive styling | `src/studio-home.css` (`--studio-*` variables at top) |
| Global header/card/category appearance | `src/storefront.css`, `src/index.css` |
| Login, signup, checkout/order styling | `src/account.css` |
| Product card | `src/components/ProductCard.tsx` |
| Product page, gallery, variants | `src/pages/ProductDetail.tsx` |
| Department/category selection rules | `src/data/catalog-navigation.ts` |
| Collection/search pages | `src/pages/Collection.tsx`, `src/pages/Search.tsx` |
| Navigation/footer | `src/components/Navbar.tsx`, `src/components/Footer.tsx` |
| Routes | `src/App.tsx` |
| Account/cart/product state | `src/context/` |
| Order confirmation email copy (no invoice) | `server/order-message.ts` |
| Actual catalog record location/ID | Use `npm run catalog:find -- "name"` |

## Homepage की current selection

12 featured products: six existing menswear items and these six women products. The five previously featured men's items stay, with the existing men's T-shirt pack completing the 12-card grid.

| Women product | Store ID | Selected design |
| --- | --- | --- |
| Textured Cardigen | -1881672 | Beige / Fuschia / Blue variants |
| Asymmetric Top | -1642542 | Black-White |
| Twist Top | -1976522 | Apricot / Black / Burgundy variants |
| Bandeau Bra | -2375102 | Brown / Black / Nude / Chocolate variants |
| Contrast Co-ord Set | -2353972 | Khaki |
| Pocket Co-ord Set | -2306982 | Navy-Blue-White |

Names alone are not unique: Contrast/Pocket have multiple catalog entries. Use numeric **store IDs** in homepage config. Existing gallery colours, stock and sizes remain on their product pages. `imageIndex` is zero-based. Previous women pieces still exist in the full catalog; only homepage placement changes. The editorial hero film remains separately configurable. The old kurti lookbook is now the selected Contrast set. Homepage testimonials only show when their real source product is featured; product-page reviews remain available.

## Catalog editing rules

```sh
npm run catalog:find -- "Contrast Co-ord Set"
npm run catalog:find -- -1881672
npm run check:homepage
```

`catalog:find` is read-only. It shows active/retired state, store ID, source record ID, price/variants and the exact source file. Negative store IDs for imported items map to positive source record IDs in catalog JSON. Do not copy an item into a second catalog or generate new IDs for existing records.

- Product data uses the shared schema in `src/data/products.ts`. Both storefront and server email validation use it.
- Original items: `src/data/products.ts` / `src/data/imported_dresses.ts`.
- Imported clothing: `src/data/reference-catalog.json`; nine kurti source entries: `src/data/kurti-catalog.json`.
- Review data: `public/reviews/<positive-source-id>.json`. Never invent review counts or mark imported reviews as store-verified purchases.
- Retired IDs: `src/data/retired-products.json`. They must not be restored by homepage, cart or custom-product edits.
- If you intentionally change a product price, update related variant prices consistently. Existing preservation tests document previous snapshots; revise only the affected expectations for the explicitly requested product change, never disable the safety checks wholesale.
- Old CSV/enrichment scripts in `scripts/` are one-time migration tools and can overwrite source data. Do not run them for normal editing. Use the read-only `catalog.mts` helper.
- Hosted images stay on the existing accounts. Do not inline base64 photos, bundle media binaries or download all assets into the project. New images must be inspected for unwanted labels/brands before use.

## Run and validate

```sh
npm ci
npm run dev
```

Node20+ (verified Node24); app and APIs share port3000, bound to0.0.0.0. Existing Vite `DISABLE_HMR` handling is retained for the AI Studio environment.

```sh
npm run check:homepage
npm run lint
npm test
npm run build
NODE_ENV=production npm start
```

For a homepage-only change, the targeted tests are:

```sh
npx tsx --test tests/catalog-navigation.test.ts tests/store-update.test.ts tests/studio-catalog.test.ts
```

Use the installed project dependencies. Check 320px/390px mobile, tablet and desktop; open each selected product and verify gallery, available size/colour and existing cart handoff. Do not submit real orders/payments during visual checks.

## Protected functionality and secrets

Payment gateway remains PayGlocal. Preserve `api/payglocal/`, checkout processing, authentication, existing order fields/IDs, Firebase config/rules, legal policy content and working contact information unless the current user command explicitly authorizes a related change. UI-only edits belong in JSX/CSS/config, not payment handlers.

Resend/COD email activation still requires private server settings described in `docs/ORDER-EMAIL-SETUP.md`. An editor preview does not prove live provider readiness. Never move Resend, PayGlocal, Firebase Admin or signing secrets into frontend variables. The email template contains Free Fire Store + customer/product/order details, with no invoice attachment or merchant owner/address.

Google AI Studio may use this guide when explicitly asked to read it; automatic discovery of `GEMINI.md` is not assumed. Review the changed files and validation results before publishing.

## Public deployment boundary

Read `docs/PUBLIC-BUILD.md` before editing routing or deployment. Keep archived legacy checkout source out of the public import graph. Public output is `dist/`, server output is `build/`. Preserve `docs/catalog-origin-media.json` as source-only provenance. Do not restore old origin URLs from audit files. After building, run `npm run check:public-build`. Never publish this source ZIP itself as a static website.
