# Checkout parameter gate

The existing entry URL remains supported:

```text
/garenacheckout?pkg=550&diamonds=2180&uid=11111111&nick=anuj&level=45
```

The five case/hyphen aliases use the same server handler. All five fields must occur exactly once. Missing, duplicate, blank or malformed data returns HTTP 404 before checkout HTML or JavaScript is sent. Amount is positive with at most two decimals, at most 1,000,000; diamonds is a positive integer of at most nine digits; UID is a nonzero digit string of at most 20 digits; level is a positive integer of at most three digits; nickname is at most 60 characters with no control characters.

This implements the requested parameter-only rule. It is **not authentication or order verification**. Any person or bot possessing/constructing a complete valid query can read the checkout and its asset. All user agents receive the same rule, with no crawler fingerprinting. Stronger protection requires an authorized, expiring order/session link. Historical crawls, old deployed assets, caches and public source repositories cannot be made secret by this change.

## Public and gated output

- The storefront no longer imports/registers the separate checkout or generates its static HTML. Its route names, code/text and package mappings are absent from `dist`.
- `robots.txt` no longer advertises these routes. The sitemap retains 334 clothing/store/article URLs.
- The isolated `build/private-checkout/checkout.js` is outside `dist`, without a source map. Never serve `build`, archives or source as a public static folder.
- `/api/private-checkout?asset=checkout.js` requires the same five validated parameters before serving the asset. Arbitrary filenames and traversal are rejected.
- Page, asset and denial responses use private/no-store browser/CDN headers, noindex/nofollow/noarchive, no-referrer and nosniff. Nickname is safely serialized with a nonce-based script CSP.
- Parameters still appear in the address bar/history and potentially host access logs, inherent in this requested URL scheme. They are not credentials. No-referrer prevents the query being sent as the Referer to external images.

## Payment behavior

The browser includes the five fields in its payment request. The old `source=garena` POST alone is rejected. The server uses validated `pkg` rather than a separate body amount, checks customer contact details, and describes the purchase as `Free Fire Diamonds (count)` with the digital-goods category. It does not substitute a clothing item or alter email/phone. Keyword-based filtering of names/emails is removed; ordinary field validation remains.

The gate does not verify that an amount/diamond combination is an authorized package or that a UID belongs to a customer. Clothing checkout and existing callback/status routes are retained. No live payment or provider fulfilment was tested.

## Build and deployment

```sh
npm run lint
npm test
npm run build
npm run check:public-build
NODE_ENV=production npm start
```

Node gates checkout requests before static middleware and Vite. Development also blocks protected source/private-directory paths; production must use the production server, never an exposed Vite development server.

`npm run dev` builds the private checkout asset once before starting the server. Restart that command after editing the checkout component; its protected bundle does not use public Vite HMR.

Vercel rewrites the five entry paths to `api/private-checkout.ts`, which includes `build/private-checkout/**`. The complete build command must run before packaging functions. Static-only hosting without the API/server does not support this flow; copying the protected bundle into public output defeats the gate.

Deploy the new output with its server/functions, not an earlier `dist`. Remove old publicly deployed checkout bundles where hosting allows; old CDN/third-party copies are outside this change. This task did not deploy production.

## Checks

Tests cover missing/duplicate/malformed fields, page/asset denial, traversal, safe script serialization, bot/person parity, payment bypass rejection and accurate payment data through a decrypted mocked gateway payload.

The public-build check scans JS/HTML/JSON/CSS/text/XML for protected checkout leaks and public server/source files. Normal Free Fire Store branding and legal/contact records remain public; they are not checkout package data.

The full suite currently has two pre-existing hash baseline mismatches: unchanged `api/payglocal/callback.js` and unchanged registration handler. Their source is identical to HEAD; those unrelated files/baselines were not changed to make the tests pass.
