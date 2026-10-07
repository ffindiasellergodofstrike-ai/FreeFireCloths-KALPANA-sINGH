import test from 'node:test';
import assert from 'node:assert/strict';
import { createWelcomeEmailStore, sendWelcomeEmail } from '../server/account-welcome.js';
import handler from '../api/account-welcome.js';

const email = 'welcome-test@example.invalid';
const now = Date.now();
function fixture() {
  const profiles = new Map<string, {
    email: string;
    name: string;
    password?: string;
    createdAt: string;
  }>([[email, {
    email,
    name: 'New <script>Customer</script>',
    password: 'must-not-be-emailed',
    createdAt: new Date(now).toISOString(),
  }]]);
  return { profiles, store: createWelcomeEmailStore(async address => profiles.get(address)) };
}

test('welcome email uses Resend with a stable idempotency key', async () => {
  const env = { ...process.env };
  const originalFetch = globalThis.fetch;
  const { store } = fixture();
  const requests: { url: string; body: any; key: string }[] = [];
  Object.assign(process.env, { RESEND_API_KEY: 're_synthetic_fixture', RESEND_FROM_EMAIL: 'orders@example.invalid' });
  delete process.env.RESEND_BASE_URL;
  globalThis.fetch = async (input, init) => {
    requests.push({
      url: String(input),
      body: JSON.parse(String(init?.body)),
      key: (init?.headers as Record<string, string>)['Idempotency-Key'],
    });
    return new Response('{}', { status: 200 });
  };
  try {
    await sendWelcomeEmail(store, email, now);
    await sendWelcomeEmail(store, email, now);
    assert.equal(requests.length, 2);
    assert.equal(requests[0].url, 'https://api.resend.com/emails');
    assert.deepEqual(requests[0].body.to, [email]);
    assert.match(requests[0].body.subject, /Welcome to Free Fire Store/);
    assert.match(requests[0].body.html, /New &lt;script&gt;Customer&lt;\/script&gt;/);
    assert.doesNotMatch(JSON.stringify(requests[0].body), /must-not-be-emailed|password/i);
    assert.match(requests[0].body.text, /happy you’re here/);
    assert.match(requests[0].key, /^welcome\/[a-f0-9]{64}$/);
    assert.equal(requests[1].key, requests[0].key);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) if (!(key in env)) delete process.env[key];
    Object.assign(process.env, env);
  }
});

test('welcome email failures release the retry lease and old accounts cannot start a new send', async () => {
  const { profiles, store } = fixture();
  const keys: string[] = [];
  const fail = async (_to: string, _name: string, key: string) => { keys.push(key); throw new Error('provider unavailable'); };
  await assert.rejects(sendWelcomeEmail(store, email, now, fail), /provider unavailable/);
  await sendWelcomeEmail(store, email, now, async (_to, _name, key) => { keys.push(key); });
  assert.equal(keys.length, 2);
  assert.equal(keys[0], keys[1]);
  const staleEmail = 'stale@example.invalid';
  profiles.set(staleEmail, {
    email: staleEmail,
    name: 'Old account',
    createdAt: new Date(now - 16 * 60000).toISOString(),
  });
  await assert.rejects(
    sendWelcomeEmail(store, staleEmail, now, async () => assert.fail('must not send for an old account')),
    /New account not found/,
  );
});

test('account welcome endpoint validates the request and reports missing Resend configuration', async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.RESEND_FROM_EMAIL;
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_FROM_EMAIL;
  const response = () => ({
    code: 200,
    body: null as any,
    setHeader() {},
    status(code: number) { this.code = code; return this; },
    json(body: any) { this.body = body; return this; },
  });
  try {
    const method = response();
    await handler({ method: 'GET' }, method);
    assert.equal(method.code, 405);
    const invalid = response();
    await handler({ method: 'POST', body: { email: 'not-an-email' } }, invalid);
    assert.equal(invalid.code, 400);
    const unconfigured = response();
    await handler({ method: 'POST', body: { email } }, unconfigured);
    assert.equal(unconfigured.code, 503);
    assert.deepEqual(unconfigured.body, { error: 'Welcome email is not configured' });
  } finally {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
    if (previousFrom === undefined) delete process.env.RESEND_FROM_EMAIL;
    else process.env.RESEND_FROM_EMAIL = previousFrom;
  }
});
