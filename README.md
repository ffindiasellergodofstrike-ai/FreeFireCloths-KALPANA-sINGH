# Free Fire Store

**Start editing:** [Google AI Studio guide and file map](AI_STUDIO_GUIDE.md). Homepage choices and text are in `src/config/homepage.json`. Use `npm run catalog:find -- "name"` to locate a product.

Website A's React/Vite storefront with an editorial redesign and additive catalog imported from Website B. The original Free Fire Store branding, policies, Firebase/account/order functionality and PayGlocal checkout are retained.

## Run

Requires Node 20 or later (verified locally with Node 24).

```sh
npm ci
npm run dev
```

The application and original API run at `http://localhost:3000`.

```sh
npm run lint
./node_modules/.bin/tsx --test tests/*.test.ts
npm run build
NODE_ENV=production npm start
```

Keep Website A's deployment configuration and private environment values. No Website B credentials or gateway configuration are required.

See [migration mapping and preservation details](docs/MIGRATION.md) for product IDs, source revisions, UI mapping, verification commands, and live-provider validation limitations.

See [validation results and unchanged source limitations](docs/VALIDATION.md) before deployment.

## Images and lightweight source

The 3,667 imported photos are served from Cloudinary. The source now contains their HTTPS URLs instead of 305 MB of image files. See [image management and Google AI Studio workflow](docs/MEDIA_HOSTING.md). Use a current source ZIP for a lightweight copy; cloning the existing Git history still downloads the old image commits.

## Homepage and products

The homepage features six selected women’s pieces (Textured Cardigen, Asymmetric Top, Twist Top, Bandeau Bra, Contrast Co-ord Set and Pocket Co-ord Set) alongside six menswear products. Selection, copy and cover/lookbook images are configured in `src/config/homepage.json`; the hosted hero film remains. The full active catalog contains 307 products, with 29 flagged products retired. Earlier kurti imports remain in the catalog. See [the editing guide](AI_STUDIO_GUIDE.md) for current selections and [the earlier catalog import](docs/STUDIO_UPDATE.md) for historical mapping.

## Current account, branding and email update

Login, signup, checkout and order details share the storefront design. Display branding is Free Fire Store; original legal business/contact records remain. Saved COD orders and verified online PayGlocal purchases can send a Resend confirmation once the server credentials and verified sender are configured. Emails include customer/product details, with no invoice attachment or merchant owner/address. The legacy checkout source is preserved but its public routes are disabled.

See [setup, current catalog, verification and limits](docs/ORDER-EMAIL-SETUP.md). Use **freefire-store-public-cleanup.zip** for this update.

## Public build and crawler update

See [public deployment, retained source and crawler guidance](docs/PUBLIC-BUILD.md). `npm run build` generates page metadata and the active-catalog sitemap. Run `npm run check:public-build` before deployment. The Node server now starts from `build/server.cjs`, outside the public `dist/` folder.
