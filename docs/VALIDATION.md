# Validation results

Verified in the task sandbox with Node 24.14.1, npm 11.11.0 and shared Chromium.

| Requested check | Result |
| --- | --- |
| Existing A products | All 76 original records match the source digest; original product 301 displayed, selected and added to cart in browser. |
| Imported B products | All 251 published records mapped into the same catalog; 327 unique numeric IDs overall. |
| Product pages | Original and imported pages render; imported colors/sizes/images/reviews verified. Unavailable Black/M option on imported 1408962 is disabled; Black/L is selectable. |
| Cart | Original and imported products coexist; subtotal ₹1,022 checked; quantity increment and removal persist through A's local-storage cart. |
| Checkout | Existing `/checkout` renders original authentication gate and PayGlocal/COD options. Imported Buy now carries Brown/M quantity 2 and chosen image through the existing cart checkout. No new payment flow. |
| Payment gateway | API files and SDK dependency unchanged. Synthetic encrypted initiation contract passes; live settlement not tested. |
| Payment verification | Signed callback success/failure and status-query contracts pass with synthetic RSA keys and intercepted fetch responses. No provider certification implied. |
| Order creation | Order/checkout/database source unchanged; live Firebase writes not performed. |
| Downloads/delivery | Existing order/delivery source retained. Published B products are physical apparel/accessories; no new digital-download implementation was added. Fulfillment not exercised. |
| Login/signup | Original forms render; handlers, account context, Firebase code and rules unchanged. Real account creation/authentication not exercised. |
| Policies | Terms/privacy/refund/shipping sources match A byte for byte; all four routes render. |
| Branding | Header still FREE FIRE STORE; original footer, business/contact information and policy owner Kalpana Singh retained. |
| Responsive layouts | Shared Chromium checked at 1440×1000, 768×1024, 390×844 and 320×740. Mobile menu, two-column catalog and no main-content overflow at 320px verified. Physical iOS/Android devices were not used. |
| No B gateway/credentials | Only B's published catalog, product images and public product review files imported. Original A dependencies/configuration/credentials declarations remain unchanged. |
| Existing functionality preservation | Hash tests protect every baseline source file except the explicit presentation/catalog allowlist. All original routes and dormant functionality remain in the checkout. |

## Automated checks

- `npm run lint`: pass.
- `./node_modules/.bin/tsx --test tests/*.test.ts`: six tests passed for the initial redesign. The hosting follow-up runs the six updated catalog checks and one legacy-image resolver check; the unchanged payment contract pass is reused.
- `npm run build`: pass; Vite reports large bundle sizes and an outdated browser support dataset inherited from the original toolchain.
- `git diff --check`: pass.
- Before hosting migration, all 3,918 imported asset/review files and the published reference catalog compared byte for byte with B. After migration, all 3,667 hosted images were downloaded and SHA-256 verified; catalog/review metadata matches after reversing only the image URL substitutions.
- Browser: exact-price filter, co-ord category count (108), load more (24 → 48), price sorting, search, variants, mixed cart and checkout handoff pass.

The first catalog validation found stale review counters in B's catalog. Counts/ratings now derive from B's 1,198 published review records; only image URLs subsequently changed for external hosting; the migration manifest preserves hashes of the original catalog/review records.

## Unchanged source limitations

The preservation checks establish that A's behavior was retained, not that its existing security implementation is correct. Inspection found these pre-existing behaviors, left unchanged under the requested scope:

- The payment callback can decode a token payload after signature verification fails; the payment success page trusts a `gid` query parameter when processing a pending order.
- The direct-product checkout path calculates the subtotal from one product price and omits color/image fields. Imported Buy now therefore uses A's existing cart checkout; original products retain their original flow.
- Existing authentication stores/compares passwords in Firestore, and the checked-in Firestore rules allow broad user/order access.
- `npm ci` reported 26 dependency advisories (3 low, 10 moderate, 11 high, 2 critical). Dependencies were not changed in this UI/catalog migration.

Live gateway settlement, real account authentication, persistent order creation and fulfillment remain unverified. Emulate v0.0.1's catalog was inspected: it does not provide PayGlocal or Firestore, and A does not expose endpoint overrides for them. Synthetic API contract checks are explicitly local fixtures, not substitutes for live acceptance testing.

## Cloudinary migration follow-up

- All 3,667 uploads completed; each public HTTPS image download matches the source SHA-256. Representative unversioned product/review URLs used for older saved carts also returned identical bytes.
- Fresh `npm run lint`, seven catalog/media tests, `npm run build`, and `git diff --check` pass. The original payment contract test and its API/dependency inputs are unchanged; its prior pass is reused.
- Fresh browser verification is blocked: the shared browser service repeatedly returns `browser_runtime_window_manager_not_ready`. The application starts and responds over HTTP; this does not establish a new visual or interactive browser pass. Earlier responsive/cart checks apply to the redesign before external hosting.
- Live payment/order/account acceptance remains unexecuted as described above.
