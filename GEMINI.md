# Free Fire Store project context

Read AI_STUDIO_GUIDE.md first when editing this repository.

- Existing app: React/TypeScript/Vite frontend + Node/Express APIs. Run `npm run dev` from the repository root. Do not replace it with a generated starter or a second checkout.
- Homepage content/selection: `src/config/homepage.json`. Product lookup: `npm run catalog:find -- "name"`. Config validation: `npm run check:homepage`.
- Keep Free Fire Store identity. Preserve actual legal/contact data unless the user supplies an authorized replacement. No new unrelated retailer/game-brand assets or labels.
- Respect the user's current command and active workflow. Defaults below do not block an explicitly authorized change.
- Keep product IDs/schema, hosted URLs, variants, retired-item exclusions and shared frontend/server catalog consistent. Do not fabricate reviews or prices. Do not run old migration scripts for routine edits.
- For presentation edits, preserve existing PayGlocal gateway/configuration, auth, Firebase/database rules, order/delivery flows and policies. Never import another store's payment logic or secrets.
- Order emails use Resend; COD says payment due on delivery, online says payment confirmed. No PDF/invoice attachment or merchant owner/address in email. See docs/ORDER-EMAIL-SETUP.md for deployment requirements and limitations.
- Keep secrets server-side and out of Git/source ZIPs. Production configuration is separate from the editor.
- Verify affected behavior using repository commands and mobile/desktop inspection. Report unconfigured provider checks honestly. Do not place real orders, send real email or deploy merely to check a visual change.
