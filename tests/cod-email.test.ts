import test from 'node:test';
import assert from 'node:assert/strict';
import { codOrderMessage, confirmCodEmail } from '../server/cod-email';
import { createCodEmailStore, createFirebaseCredential, parseFirebaseServiceAccount } from '../server/cod-email-store';
import { orderMessage } from '../server/order-message';
import handler from '../api/cod-confirmation';

// Transaction fixture: changes commit only after a successful callback, and concurrent calls serialize.
export class MemoryDatabase {
  records = new Map<string, any>();
  tail = Promise.resolve();
  collection(name: string) { return { doc: (id: string) => ({ path: `${name}/${id}`, update: async (value: any) => { this.records.set(`${name}/${id}`, { ...this.records.get(`${name}/${id}`), ...value }); } }) }; }
  runTransaction(fn: any) {
    const run = this.tail.then(async () => {
      const staged = new Map(this.records);
      const result = await fn({
        get: async ({ path }: any) => ({ exists: staged.has(path), data: () => structuredClone(staged.get(path)) }),
        create: ({ path }: any, value: any) => { assert.ok(!staged.has(path)); staged.set(path, structuredClone(value)); },
        update: ({ path }: any, value: any) => staged.set(path, { ...staged.get(path), ...value }),
        set: ({ path }: any, value: any) => staged.set(path, structuredClone(value)),
      });
      this.records = staged;
      return result;
    });
    this.tail = run.catch(() => {});
    return run;
  }
}
const now = Date.now();
export const codFixture = () => ({ paymentMethod: 'Cash on Delivery (COD)', status: 'Order Placed (COD)', createdAt: new Date(now).toISOString(), orderNumber: 123456, userEmail: 'cod-test@example.invalid', total: 550,
  shippingAddress: { email: 'cod-test@example.invalid', firstName: 'Demo <script>', lastName: 'Customer', address: '12 Sample Street', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', phone: '0000000000' }, items: [{ id: 301, name: 'Untrusted product name', size: 'S', qty: 1, price: 550 }] });

test('Vercel COD email requires valid Firebase service-account credentials without metadata lookup fallback', () => {
  const projectId = 'existing-project';
  const serviceAccount = parseFirebaseServiceAccount(JSON.stringify({
    project_id: projectId,
    client_email: 'firebase-admin@example.invalid',
    private_key: 'private-key\\nline',
  }), projectId);
  assert.equal(serviceAccount.projectId, projectId);
  assert.equal(serviceAccount.privateKey, 'private-key\nline');
  assert.throws(() => parseFirebaseServiceAccount('{}', projectId), /missing project_id, client_email, or private_key/);
  assert.throws(() => parseFirebaseServiceAccount(JSON.stringify({
    project_id: 'wrong-project', client_email: 'firebase-admin@example.invalid', private_key: 'key',
  }), projectId), /Firebase project mismatch/);
  assert.throws(() => createFirebaseCredential(undefined, true), /FIREBASE_SERVICE_ACCOUNT_JSON is required for COD email on Vercel/);
});

test('COD email uses saved canonical products, accurate unpaid copy and customer-only details', () => {
  const message = codOrderMessage(codFixture(), now);
  const body = orderMessage(message);
  assert.equal(message.items[0].name, 'Women Multi Coloured Floral Regular Fit Crop Top');
  assert.match(body.html, /&lt;script&gt;/);
  assert.match(body.text, /Amount due on delivery: INR 550.00/);
  assert.match(body.text, /12 Sample Street/);
  assert.doesNotMatch(JSON.stringify(body), /Kalpana|SULTANPUR|PRANNATHPUR|invoice|Total paid|Online payment confirmed|Untrusted product name/i);
  for (const patch of [{ total: 1 }, { items: [{ ...codFixture().items[0], id: 324 }] }, { items: [{ ...codFixture().items[0], qty: 0 }] }, { paymentMethod: 'Pay Online' }, { createdAt: 'invalid' }, { userEmail: 'someone-else@example.invalid' }]) assert.throws(() => codOrderMessage({ ...codFixture(), ...patch }, now));
  assert.throws(() => codOrderMessage(codFixture(), now + 24 * 3600000));
});

test('COD ledger persists immutable retries, avoids duplicate sends and limits recipient abuse', async () => {
  const db = new MemoryDatabase(); const store = createCodEmailStore(db as any);
  const id = 'abcdefghijklmnopqrst'; db.records.set(`orders/${id}`, codFixture());
  const first = await store.reserve(id, now);
  await assert.rejects(store.reserve(id, now), /already being sent/);
  await store.release(id);
  db.records.set(`orders/${id}`, { ...codFixture(), userEmail: 'changed@example.invalid' });
  assert.deepEqual((await store.reserve(id, now)).order, first.order);
  await store.release(id);
  let sends = 0;
  await assert.rejects(confirmCodEmail(store, id, now, async () => { throw Error('provider timeout'); }), /provider timeout/);
  await confirmCodEmail(store, id, now, async (message, key) => { sends++; assert.equal(key, `cod-confirmation/${id}`); assert.equal(message.email, 'cod-test@example.invalid'); });
  await confirmCodEmail(store, id, now, async () => { sends++; });
  assert.equal(sends, 1);
  for (let n = 0; n < 4; n++) { const next = `other${n}`; db.records.set(`orders/${next}`, codFixture()); await store.reserve(next, now); }
  db.records.set('orders/limit', codFixture()); await assert.rejects(store.reserve('limit', now), /limit reached/);
  await assert.rejects(store.reserve('missing', now), /Order not found/);
  await store.release('other0'); await assert.rejects(store.reserve('other0', now + 24 * 3600000), /retry period/);
});

test('COD endpoint rejects malformed requests and handles missing email setup without creating orders', async () => {
  const env = process.env.RESEND_API_KEY; delete process.env.RESEND_API_KEY;
  const response = () => ({ code: 200, body: null as any, setHeader() {}, status(code: number) { this.code = code; return this; }, json(body: any) { this.body = body; return this; } });
  try {
    const bad = response(); await handler({ method: 'POST', body: { orderId: '../orders/abc', email: 'arbitrary@example.invalid' } }, bad); assert.equal(bad.code, 400);
    const disabled = response(); await handler({ method: 'POST', body: { orderId: 'abcdefghijklmnopqrst' } }, disabled); assert.equal(disabled.code, 503);
    const method = response(); await handler({ method: 'GET' }, method); assert.equal(method.code, 405);
  } finally { if (env !== undefined) process.env.RESEND_API_KEY = env; }
});

test('COD endpoint returns a controlled error on Vercel when Firebase credentials are missing', async () => {
  const previous = {
    vercel: process.env.VERCEL,
    firebase: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    resendKey: process.env.RESEND_API_KEY,
    resendFrom: process.env.RESEND_FROM_EMAIL,
  };
  process.env.VERCEL = '1';
  delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  process.env.RESEND_API_KEY = 'test-key';
  process.env.RESEND_FROM_EMAIL = 'store@example.invalid';
  const response = { code: 200, body: null as any, setHeader() {}, status(code: number) { this.code = code; return this; }, json(body: any) { this.body = body; return this; } };
  const originalError = console.error;
  console.error = () => {};
  try {
    await handler({ method: 'POST', body: { orderId: 'abcdefghijklmnopqrst' } }, response);
    assert.equal(response.code, 503);
    assert.deepEqual(response.body, { error: 'Order email is temporarily unavailable. Your order remains saved.' });
  } finally {
    console.error = originalError;
    for (const [key, value] of Object.entries({
      VERCEL: previous.vercel,
      FIREBASE_SERVICE_ACCOUNT_JSON: previous.firebase,
      RESEND_API_KEY: previous.resendKey,
      RESEND_FROM_EMAIL: previous.resendFrom,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
