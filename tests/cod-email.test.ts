import test from 'node:test';
import assert from 'node:assert/strict';
import { codOrderMessage, confirmCodEmail } from '../server/cod-email';
import { createCodEmailStore } from '../server/cod-email-store';
import { orderMessage } from '../server/order-message';
import handler from '../api/cod-confirmation';

const now = Date.now();
export const codFixture = () => ({ paymentMethod: 'Cash on Delivery (COD)', status: 'Order Placed (COD)', createdAt: new Date(now).toISOString(), orderNumber: 123456, userEmail: 'cod-test@example.invalid', total: 550,
  shippingAddress: { email: 'cod-test@example.invalid', firstName: 'Demo <script>', lastName: 'Customer', address: '12 Sample Street', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', phone: '0000000000' }, items: [{ id: 301, name: 'Untrusted product name', size: 'S', qty: 1, price: 550 }] });

test('COD store reads the saved order without Firebase Admin credentials', async () => {
  const previousCredential = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  try {
    const store = createCodEmailStore(async id => id === 'abcdefghijklmnopqrst' ? codFixture() : undefined);
    const job = await store.reserve('abcdefghijklmnopqrst', now);
    assert.equal(job.order.email, 'cod-test@example.invalid');
    assert.equal(job.sent, false);
    await assert.rejects(store.reserve('missing', now), /Order not found/);
  } finally {
    if (previousCredential !== undefined) process.env.FIREBASE_SERVICE_ACCOUNT_JSON = previousCredential;
  }
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

test('COD email retries reuse the same Resend idempotency key and saved order data', async () => {
  const id = 'abcdefghijklmnopqrst';
  const store = createCodEmailStore(async () => codFixture());
  const keys: string[] = [];
  await assert.rejects(confirmCodEmail(store, id, now, async () => { throw Error('provider timeout'); }), /provider timeout/);
  await confirmCodEmail(store, id, now, async (message, key) => {
    keys.push(key);
    assert.equal(message.email, 'cod-test@example.invalid');
  });
  await confirmCodEmail(store, id, now, async (_message, key) => { keys.push(key); });
  assert.deepEqual(keys, [`cod-confirmation/${id}`, `cod-confirmation/${id}`]);
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
