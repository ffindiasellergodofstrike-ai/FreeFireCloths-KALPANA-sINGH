import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { CompactSign, compactDecrypt } from 'jose';
import { servePrivateCheckout, isCheckoutPath } from '../server/private-checkout';
import { readCheckoutParameters } from '../src/lib/garena-checkout-access';
import { readCheckoutResultToken, readCheckoutReturnToken } from '../server/checkout-return';
import initiate from '../api/payglocal/initiate.js';
import callback from '../api/payglocal/callback.js';

const query = { pkg: '550', diamonds: '2180', uid: '11111111', nick: 'anuj', level: '45' };
function response() {
  return {
    code: 200, body: null as any, location: '', headers: {} as Record<string, string>,
    setHeader(name: string, value: string) { this.headers[name] = value; return this; },
    status(code: number) { this.code = code; return this; },
    end(body: any) { this.body = body; return this; },
    json(body: any) { this.body = body; return this; },
    redirect(code: number, location: string) { this.code = code; this.location = location; return this; },
  };
}

test('every bare/incomplete/duplicate link is denied before HTML or asset delivery', async () => {
  const invalid: Record<string, unknown>[] = [{}, { pkg:'550', uid:'11111111' }, { ...query, pkg:['550','490'] }];
  for (const field of Object.keys(query)) {
    const incomplete: Record<string, unknown> = { ...query };
    delete incomplete[field]; invalid.push(incomplete);
  }
  for (const input of invalid) {
    for (const asset of [false, true]) {
      const res = response();
      await servePrivateCheckout({method:'GET',query:asset ? {...input,asset:'checkout.js'} : input}, res);
      assert.equal(res.code,404);
      assert.equal(res.body,'Not found');
      assert.match(res.headers['Cache-Control'],/no-store/);
      assert.equal(res.headers['Referrer-Policy'],'no-referrer');
    }
  }
});

test('all aliases match and valid people/bot requests receive the same gated page', async () => {
  for (const route of ['/garena-checkout','/garenacheckout','/GarenaCheckout','/Garenacheckout','/garenaCheckout']) assert.equal(isCheckoutPath(route),true);
  assert.equal(isCheckoutPath('/product/550'),false);
  for (const agent of ['Mozilla/5.0','Googlebot','scanner']) {
    const res=response();
    await servePrivateCheckout({method:'GET',headers:{'user-agent':agent},query},res);
    assert.equal(res.code,200);
    assert.match(res.body,/window\.__CHECKOUT__/);
    assert.match(res.body,/2180/);
    assert.match(res.headers['Content-Security-Policy'],/script-src 'nonce-/);
    assert.match(res.headers['Cache-Control'],/no-store/);
    assert.equal(res.headers['Vercel-CDN-Cache-Control'],'no-store');
  }
});

test('malformed parameters, path traversal, POST page requests and script injection are handled safely', async () => {
  for (const bad of [{pkg:'0'},{pkg:'550e2'},{pkg:'550.123'},{uid:'abc'},{uid:'000'},{diamonds:'0'},{level:'-1'},{nick:'\n'}]) {
    assert.equal(readCheckoutParameters(new URLSearchParams({...query,...bad})),null);
  }
  for (const input of [{...query,asset:'../../server.cjs'},{...query,asset:['checkout.js','checkout.js']}]) {
    const res=response(); await servePrivateCheckout({method:'GET',query:input},res); assert.equal(res.code,404);
  }
  const post=response(); await servePrivateCheckout({method:'POST',query},post); assert.equal(post.code,404);
  const xss=response();
  await servePrivateCheckout({method:'GET',query:{...query,nick:'</script><script>alert(1)</script>'}},xss);
  assert.equal(xss.code,200);
  assert.ok(!xss.body.includes('</script><script>alert(1)'));
  assert.match(xss.body,/\\u003c\/script\\u003e/);
});

test('legacy payment bypass is rejected without making a gateway request', async () => {
  const original=globalThis.fetch;
  let calls=0; globalThis.fetch=async()=>{calls++; throw Error('Must not call gateway');};
  try {
    const res=response();
    await initiate({method:'POST',body:{source:'garena',amount:'550',customerData:{}}},res);
    assert.equal(res.code,404); assert.equal(calls,0);
    const badContact=response();
    await initiate({method:'POST',body:{source:'garena',checkout:query,customerData:{}}},badContact);
    assert.equal(badContact.code,400); assert.equal(calls,0);
  } finally {globalThis.fetch=original;}
});

test('digital payment payload uses the gated amount, truthful item and unchanged contact details', async () => {
  const keys=generateKeyPairSync('rsa',{modulusLength:2048});
  const env={PAYGLOCAL_PRIVATE_KEY:keys.privateKey.export({type:'pkcs8',format:'pem'}).toString(),PAYGLOCAL_PUBLIC_KEY:keys.publicKey.export({type:'spki',format:'pem'}).toString(),PAYGLOCAL_MERCHANT_ID:'local',PAYGLOCAL_PRIVATE_KEY_ID:'private',PAYGLOCAL_PUBLIC_KEY_ID:'public'};
  const previous=Object.fromEntries(Object.keys(env).map(key=>[key,process.env[key]]));
  const original=globalThis.fetch, originalLog=console.log;
  Object.assign(process.env,env); console.log=()=>{};
  try {
    let callbackUrl='';
    globalThis.fetch=async (_url,init)=>{
      const {plaintext}=await compactDecrypt(String(init?.body),keys.privateKey);
      const payload=JSON.parse(new TextDecoder().decode(plaintext));
      assert.equal(payload.paymentData.totalAmount,'550.00');
      assert.equal(payload.billingData.emailId,'anuj@example.invalid');
      assert.equal(payload.billingData.phoneNumber,'9000000000');
      assert.ok(payload.riskData.orderItems[0].itemName.length > 0);
      assert.doesNotMatch(payload.riskData.orderItems[0].itemName, /Free Fire|Diamonds/i);
      assert.equal(payload.riskData.orderItems[0].itemCategory,'APPAREL_AND_ACCESSORIES');
      callbackUrl=payload.merchantCallbackURL;
      assert.doesNotMatch(callbackUrl,/codashop\.online|pkg=|diamonds=/i);
      return new Response(JSON.stringify({gid:'fixture',data:{redirectUrl:'https://fixture.invalid/pay'}}),{status:200});
    };
    const res=response();
    await initiate({method:'POST',headers:{host:'localhost:3000'},body:{source:'garena',amount:'1',checkout:query,customerData:{firstName:'Anuj',email:'anuj@example.invalid',phone:'9000000000'}}},res);
    assert.equal(res.code,200); assert.equal(res.body.gid,'fixture');
    const callbackRequest=new URL(callbackUrl);
    const state=await readCheckoutReturnToken(callbackRequest.searchParams.get('state'));
    assert.deepEqual(state.checkout,query);
    assert.equal(state.merchantTxnId,res.body.merchantTxnId);

    for(const [gatewayStatus,expected] of [['CAPTURED','success'],['FAILED','failed']] as const) {
      const token=await new CompactSign(new TextEncoder().encode(JSON.stringify({gid:'fixture',status:gatewayStatus,merchantTxnId:res.body.merchantTxnId})))
        .setProtectedHeader({alg:'RS256'}).sign(keys.privateKey);
      const result=response();
      await callback({method:'POST',headers:{'content-type':'application/json'},body:{'x-gl-token':token},query:Object.fromEntries(callbackRequest.searchParams)},result);
      assert.equal(result.code,302);
      assert.match(result.location,/^\/GarenaCheckout\?result=/);
      assert.doesNotMatch(result.location,/pkg=|diamonds=|codashop\.online/i);
      const resultToken=new URL(result.location,'https://example.invalid').searchParams.get('result');
      const decoded=await readCheckoutResultToken(resultToken);
      assert.equal(decoded.status,expected);
      assert.deepEqual(decoded.checkout,query);
      const page=response();
      await servePrivateCheckout({method:'GET',query:{result:resultToken}},page);
      assert.equal(page.code,200);
      assert.match(page.body,new RegExp(`"status":"${expected}"`));
      const tampered=response();
      await servePrivateCheckout({method:'GET',query:{result:`${resultToken}x`}},tampered);
      assert.equal(tampered.code,404);
    }
    const unverified=response();
    await callback({method:'POST',headers:{'content-type':'application/json'},body:{'x-gl-token':'invalid.callback.token'},query:Object.fromEntries(callbackRequest.searchParams)},unverified);
    const unverifiedToken=new URL(unverified.location,'https://example.invalid').searchParams.get('result');
    assert.equal((await readCheckoutResultToken(unverifiedToken)).status,'failed');
  } finally {
    globalThis.fetch=original;console.log=originalLog;
    for(const [key,value] of Object.entries(previous)) value===undefined ? delete process.env[key] : process.env[key]=value;
  }
});
