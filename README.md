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
