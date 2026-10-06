# Free Fire Store

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

The homepage now features an editorial kurti collection with hosted photography and films. The imported source catalog contains nine kurtis, 36 size variants and two published reviews. After the latest brand audit, 29 flagged products are retired and the active sale catalog contains 307 products. See [homepage/catalog update](docs/STUDIO_UPDATE.md) for mapping and validation details.

## Current account, branding and email update

Login, signup, checkout and order details share the storefront design. Display branding is Free Fire Store; original legal business/contact records remain. Saved COD orders and verified online PayGlocal purchases can send a Resend confirmation once the server credentials and verified sender are configured. Emails include customer/product details, with no invoice attachment or merchant owner/address. The separate legacy checkout is unchanged.

See [setup, current catalog, verification and limits](docs/ORDER-EMAIL-SETUP.md). Use **freefire-store-final-cod-source.zip** for this update.
