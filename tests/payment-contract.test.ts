import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { CompactSign } from "jose";
import initiate from "../api/payglocal/initiate.js";
import callback from "../api/payglocal/callback.js";
import status from "../api/payglocal/status.js";

function response() {
  return {
    code: 200,
    body: null as any,
    location: "",
    status(code: number) {
      this.code = code;
      return this;
    },
    json(body: any) {
      this.body = body;
      return this;
    },
    redirect(code: number, location: string) {
      this.code = code;
      this.location = location;
      return this;
    },
  };
}
test("unchanged PayGlocal initiation, status and signed callback contracts with local fixtures", async () => {
  const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const values = {
    PAYGLOCAL_PRIVATE_KEY: keys.privateKey
      .export({ type: "pkcs8", format: "pem" })
      .toString(),
    PAYGLOCAL_PUBLIC_KEY: keys.publicKey
      .export({ type: "spki", format: "pem" })
      .toString(),
    PAYGLOCAL_MERCHANT_ID: "local-test",
    PAYGLOCAL_PRIVATE_KEY_ID: "local-private",
    PAYGLOCAL_PUBLIC_KEY_ID: "local-public",
  };
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, values);
  const originalFetch = globalThis.fetch;
  const log = console.log;
  console.log = () => {};
  try {
    let requests = 0;
    globalThis.fetch = async (url, init) => {
      requests++;
      assert.equal(
        String(url),
        "https://api.payglocal.in/gl/v1/payments/initiate/paycollect",
      );
      assert.equal(init?.method, "POST");
      assert.equal(
        String(init?.body).split(".").length,
        5,
        "encrypted JWE payload",
      );
      assert.ok(
        (init?.headers as Record<string, string>)["x-gl-token-external"],
      );
      return new Response(
        JSON.stringify({
          gid: "fixture-gid",
          data: { redirectUrl: "https://fixture.invalid/pay" },
        }),
        { status: 200 },
      );
    };
    const res = response();
    await initiate(
      {
        method: "POST",
        headers: { host: "localhost:3000" },
        body: {
          amount: 472,
          customerData: {
            firstName: "Synthetic",
            lastName: "Customer",
            email: "synthetic@example.invalid",
            phone: "9000000000",
          },
          items: [
            { id: -1408962, name: "Gathered Halter Top", qty: 1, price: 472 },
          ],
        },
      },
      res,
    );
    assert.equal(res.code, 200);
    assert.equal(res.body.gid, "fixture-gid");
    assert.equal(requests, 1);
    assert.equal(res.body.redirectUrl, "https://fixture.invalid/pay");
    globalThis.fetch = async (url) => {
      assert.equal(
        String(url),
        "https://api.payglocal.in/gl/v1/payments/fixture-gid/status",
      );
      return new Response(JSON.stringify({ data: { status: "CAPTURED" } }), {
        status: 200,
      });
    };
    const paid = response();
    await status({ method: "GET", query: { gid: "fixture-gid" } }, paid);
    assert.equal(paid.body.isPaid, true);
    for (const paymentStatus of ["CAPTURED", "FAILED"]) {
      const token = await new CompactSign(
        new TextEncoder().encode(
          JSON.stringify({ gid: "fixture-gid", status: paymentStatus }),
        ),
      )
        .setProtectedHeader({ alg: "RS256" })
        .sign(keys.privateKey);
      const result = response();
      await callback(
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: { "x-gl-token": token },
          query: {},
        },
        result,
      );
      assert.equal(result.code, 302);
      assert.match(
        result.location,
        paymentStatus === "CAPTURED"
          ? /^\/payment\/success\?/
          : /^\/payment\/failure\?/,
      );
    }
    const missing = response();
    await callback(
      { method: "POST", headers: {}, body: {}, query: {} },
      missing,
    );
    assert.equal(missing.location, "/payment/failure?reason=no_token");
    const noGid = response();
    await status({ method: "GET", query: {} }, noGid);
    assert.equal(noGid.code, 400);
  } finally {
    globalThis.fetch = originalFetch;
    console.log = log;
    for (const [key, value] of Object.entries(previous))
      value === undefined
        ? delete process.env[key]
        : (process.env[key] = value);
  }
});
