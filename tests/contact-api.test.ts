import test from 'node:test';
import assert from 'node:assert/strict';
import contactHandler from '../api/contact';
import {
  checkContactRateLimit,
  ContactValidationError,
  formatContactEmail,
  resetContactRateLimits,
  submitContactInquiry,
  validateContactInput,
} from '../server/contact';

function mockResponse() {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body: unknown = null;
  return {
    setHeader(name: string, value: string) {
      headers[name.toLowerCase()] = value;
    },
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: unknown) {
      body = payload;
      return this;
    },
    get statusCode() {
      return statusCode;
    },
    get headers() {
      return headers;
    },
    get body() {
      return body;
    },
  };
}

test('validateContactInput accepts valid payload and rejects malformed, honeypot, or link-spam input', () => {
  const valid = validateContactInput({
    name: 'Aarav Sharma',
    email: 'AARAV@EXAMPLE.COM ',
    phone: '+91 9876543210',
    subject: 'Order Inquiry',
    message: 'I would like to check the status of my apparel order placed yesterday.',
  });
  assert.equal(valid.email, 'aarav@example.com');
  assert.equal(valid.name, 'Aarav Sharma');

  assert.throws(
    () =>
      validateContactInput({
        name: 'Bot',
        email: 'bot@example.com',
        subject: 'Order Inquiry',
        message: 'Testing honeypot field rejection here.',
        website: 'https://spam.example',
      }),
    ContactValidationError,
  );

  assert.throws(
    () =>
      validateContactInput({
        name: 'Aarav',
        email: 'bad-email',
        subject: 'Order Inquiry',
        message: 'Message length is valid enough.',
      }),
    ContactValidationError,
  );

  assert.throws(
    () =>
      validateContactInput({
        name: 'Aarav',
        email: 'aarav@example.com',
        subject: 'Order Inquiry',
        message: 'Check https://a.com https://b.com https://c.com https://d.com',
      }),
    ContactValidationError,
  );
});

test('formatContactEmail escapes HTML special characters and sets replyTo', () => {
  const email = formatContactEmail({
    name: 'Aarav <Test>',
    email: 'aarav@example.com',
    phone: '+91 7393845435',
    subject: 'Product Question',
    message: '<script>alert(1)</script> Need sizing help.',
  });
  assert.equal(email.replyTo, 'aarav@example.com');
  assert.ok(!email.html.includes('<script>'));
  assert.ok(email.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(email.text.includes('Product Question'));
});

test('contact rate limiter enforces per-email and per-IP caps', () => {
  resetContactRateLimits();
  const base = 1_700_000_000_000;
  assert.equal(checkContactRateLimit('203.0.113.10', 'buyer@example.com', base).allowed, true);
  assert.equal(checkContactRateLimit('203.0.113.10', 'buyer@example.com', base + 1000).allowed, true);
  assert.equal(checkContactRateLimit('203.0.113.10', 'buyer@example.com', base + 2000).allowed, true);
  const blockedByEmail = checkContactRateLimit('203.0.113.11', 'buyer@example.com', base + 3000);
  assert.equal(blockedByEmail.allowed, false);
  assert.ok(blockedByEmail.retryAfterSeconds > 0);
  resetContactRateLimits();
});

test('contact API handler reports 405, 400, 429, 503 when unconfigured, and 200 when delivered', async () => {
  resetContactRateLimits();
  const prevKey = process.env.RESEND_API_KEY;
  const prevFrom = process.env.RESEND_FROM_EMAIL;
  const prevTo = process.env.CONTACT_TO_EMAIL;
  const prevFetch = globalThis.fetch;

  try {
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;

    const getRes = mockResponse();
    await contactHandler({ method: 'GET', headers: {} }, getRes);
    assert.equal(getRes.statusCode, 405);
    assert.equal(getRes.headers['cache-control'], 'no-store');

    const badRes = mockResponse();
    await contactHandler({ method: 'POST', headers: {}, body: { name: 'A', email: 'bad', message: 'hi' } }, badRes);
    assert.equal(badRes.statusCode, 400);

    const unconfiguredRes = mockResponse();
    await contactHandler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '198.51.100.1' },
        body: {
          name: 'Priya Verma',
          email: 'priya@example.com',
          phone: '+91 9876543210',
          subject: 'Shipping & Delivery',
          message: 'Please confirm estimated dispatch time for pincode 228171.',
        },
      },
      unconfiguredRes,
    );
    assert.equal(unconfiguredRes.statusCode, 503);

    process.env.RESEND_API_KEY = 're_test_dummy';
    process.env.RESEND_FROM_EMAIL = 'support@ffstreetwear.shop';
    process.env.CONTACT_TO_EMAIL = 'support@ffstreetwear.shop';

    let capturedRequest: { url: string; body: Record<string, unknown> } | null = null;
    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      capturedRequest = {
        url: String(url),
        body: JSON.parse(String(init?.body || '{}')),
      };
      return new Response(JSON.stringify({ id: 'email_123' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;

    const okRes = mockResponse();
    await contactHandler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '198.51.100.2' },
        body: {
          name: 'Priya Verma',
          email: 'priya2@example.com',
          phone: '+91 9876543210',
          subject: 'Shipping & Delivery',
          message: 'Please confirm estimated dispatch time for pincode 228171.',
        },
      },
      okRes,
    );
    assert.equal(okRes.statusCode, 200);
    assert.deepEqual((okRes.body as { sent: boolean }).sent, true);
    assert.ok(capturedRequest);
    assert.equal((capturedRequest as { url: string }).url, 'https://api.resend.com/emails');
    assert.equal((capturedRequest as { body: Record<string, unknown> }).body.reply_to, 'priya2@example.com');
    assert.deepEqual((capturedRequest as { body: Record<string, unknown> }).body.to, ['support@ffstreetwear.shop']);

    for (let i = 0; i < 2; i++) {
      const r = mockResponse();
      await contactHandler(
        {
          method: 'POST',
          headers: { 'x-forwarded-for': '198.51.100.2' },
          body: {
            name: 'Priya Verma',
            email: 'priya2@example.com',
            subject: 'Shipping & Delivery',
            message: 'Please confirm estimated dispatch time for pincode 228171.',
          },
        },
        r,
      );
      assert.equal(r.statusCode, 200);
    }
    const limitedRes = mockResponse();
    await contactHandler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '198.51.100.2' },
        body: {
          name: 'Priya Verma',
          email: 'priya2@example.com',
          subject: 'Shipping & Delivery',
          message: 'Please confirm estimated dispatch time for pincode 228171.',
        },
      },
      limitedRes,
    );
    assert.equal(limitedRes.statusCode, 429);
    assert.ok(Number(limitedRes.headers['retry-after']) >= 1);

    // Custom submitContactInquiry helper smoke check
    let deliveredTo = '';
    await submitContactInquiry(
      {
        name: 'Karan',
        email: 'karan@example.com',
        phone: '',
        subject: 'Other',
        message: 'Checking custom delivery hook with sufficient characters.',
      },
      async (to) => {
        deliveredTo = to;
      },
    );
    assert.equal(deliveredTo, 'support@ffstreetwear.shop');
  } finally {
    resetContactRateLimits();
    if (prevKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = prevKey;
    if (prevFrom === undefined) delete process.env.RESEND_FROM_EMAIL;
    else process.env.RESEND_FROM_EMAIL = prevFrom;
    if (prevTo === undefined) delete process.env.CONTACT_TO_EMAIL;
    else process.env.CONTACT_TO_EMAIL = prevTo;
    globalThis.fetch = prevFetch;
  }
});
