# Free Fire Store — COD and online confirmation emails

## Current delivery

For the current source, use `freefire-store-public-cleanup.zip` and see `AI_STUDIO_GUIDE.md`. The email-only implementation described here replaces the earlier PDF-email version.

- COD and verified online PayGlocal orders request a Resend confirmation.
- No invoice, PDF attachment, merchant owner name, merchant address or merchant contact details are included in either email.
- The email includes Free Fire Store, order number, canonical product names, sizes/colours, quantities, unit prices, total, customer name/email/phone and delivery address.
- COD says payment is due on delivery; online confirmation says payment confirmed. Email does not invent a delivery date.
- Checkout uses open form sections, wider fields and larger product thumbnails. Direct-buy quantity, selected colour and image are preserved. Invalid COD database writes no longer display a success screen.
- All 29 previously flagged products remain retired. The active catalog remains 307 products; the home selection contains 12. No product/review/image source data was added or changed in this revision.

## Production configuration required

Set these in the deployment's server environment, then redeploy/restart. Never put them in `VITE_*`, browser code, chat, Git or the ZIP.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Your Resend sending API key |
| `RESEND_FROM_EMAIL` | Plain address on a Resend-verified domain; no display name or angle brackets |
| `ORDER_EMAIL_SECRET` | Stable random secret of at least 32 characters for online receipts |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase Admin service account JSON for the existing project in `firebase-applet-config.json`; server only |

Generate the online signing secret locally using `node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))"` and save it in deployment secrets. A verified sender is required; a domain/address is not invented by the app.

For COD, Firebase Admin may alternatively use Application Default Credentials on an appropriately configured Google-hosted server. The server always selects the existing named Firestore database from `firebase-applet-config.json`. A supplied service-account project ID must match that existing project. Grant server access to read `orders` and transact on the private email ledger. The existing client rules already deny access to that ledger; do not make it public.

Leave `RESEND_BASE_URL` unset in production. Keep all existing PayGlocal keys/configuration unchanged. A confirmation can only work live once the real credentials and sender are configured. If email configuration is missing, an already saved order is retained and the UI shows email unavailability with a retry option.

## COD flow and retries

1. Checkout saves the order in the existing `orders` collection with its existing fields.
2. Only after that write succeeds, the confirmation component requests `/api/cod-confirmation` with the saved document ID. It sends no recipient, prices or message text to this endpoint.
3. The server reads that order, checks its COD status, age, address and totals, and maps all products to the current active catalog. Removed items, invalid quantities/sizes/colours/prices and mismatched totals cannot send email.
4. A Firestore transaction writes an immutable message snapshot into `_order_email_delivery`, a new **private email-delivery ledger**. It does not modify the order or authentication schema. The same transaction reserves a per-recipient limit of five new COD confirmations in a rolling 24-hour window.
5. Resend gets a stable per-order idempotency key. Concurrent sends use a 45-second lease; failed attempts retry the same content. Completed jobs return success without another send. Unsent jobs expire after 23 hours, within Resend's 24-hour deduplication window.
6. The success screen offers retry after a failed email request. Recent COD orders in My Orders also offer a confirmation button. A retry never creates another order.

COD creation still uses the original client authentication and Firestore rules, which allow public order writes. The ledger and validation prevent arbitrary email body/recipient overrides at the email endpoint and limit repeats; they do **not** upgrade the existing authentication or guarantee that public order records were created by an authenticated account. Browser-only Admin products not in the server catalog are ineligible for COD email until the catalog is synchronized. Their original order flow remains available.

There is no autonomous mail worker: automatic sending is triggered by the success screen; retry is available in My Orders. Closing the browser before that request completes may require a later retry. Cancelled or old orders cannot start a new confirmation. Sent records remain for durable deduplication; set an appropriate retention policy for private ledger/customer snapshots in deployment.

## Online flow

The existing PayGlocal initiation returns a signed receipt. On the existing success/order-save path, `/api/order-confirmation` verifies that receipt and independently fetches the gateway status before sending. Callback, signature/status endpoints and gateway configuration remain unchanged. Online emails have no attachment. If old/custom items cannot map to the canonical catalog, the confirmation shows the total and directs the customer to My Orders for saved product details. The separate legacy checkout source remains unchanged and does not send these clothing-order emails; its public routes are now disabled as described in PUBLIC-BUILD.md.

## Branding and legal information

The prior audit visually inspected 4,005 product/variant/review images, with enlarged candidates. All products associated with its 29 recorded flags remain blocked from sale and stale carts. Original source/history records remain for record integrity; this is not a guarantee about every tiny mark or physical inventory. New Admin products need their own photo review.

Store display branding remains Free Fire Store. Existing legal policies, owner details, registration and actual business contact email/domain remain on legal/contact pages; the old contact address/domain still contain the former name. Those cannot be replaced with an invented address. Payment-provider marks identify payment methods and are not merchandise branding. No payment-gateway approval is claimed by these code or image checks.

## Validation and local run

```sh
npm ci
npm run dev
npm run lint
./node_modules/.bin/tsx --test tests/*.test.ts
npm run build
NODE_ENV=production npm start
```

Use the repository root as the working directory. Tests cover attachment-free copy, online tamper/unpaid rejection, COD validation, persistent retry snapshots, duplicate prevention, recipient limit, expired jobs and unchanged gateway/account/catalog contracts. The COD database tests use a transactional in-memory fixture; they are not proof of live Firestore permissions.

In this task sandbox, CodeRabbit emulate v0.0.1 provides a local Resend inbox (no live emails):

```sh
node /home/vercel-sandbox/runtime/emulate/v0.0.1/dist/index.js start --service resend --port 4000
RESEND_BASE_URL=http://localhost:4000 ./node_modules/.bin/tsx scripts/verify-order-email.mts
```

The smoke test uses synthetic online status and COD storage, then actual local Resend send/read. Neither PayGlocal nor Firestore is in that emulator catalog. Live Firebase Admin access, live Resend sender/delivery, live payment, production account/order writes and actual shipment remain unverified. The ZIP includes setup/docs, source and catalog JSON; no credentials, dependencies, build artifacts, photos, invoice font or PDFs.
