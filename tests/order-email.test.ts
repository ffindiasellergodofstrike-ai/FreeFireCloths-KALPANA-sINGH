import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createReceiptToken, readReceiptToken } from '../server/order-receipt';
import { orderMessage } from '../server/order-message';
import handler from '../api/order-confirmation';

const body = () => ({amount:550,orderNumber:123456,customerData:{firstName:'Test <script>',lastName:'Customer',email:'receipt-test@example.invalid',address:'Synthetic address 12',city:'Lucknow',state:'UP',pincode:'226001',phone:'0000000000'},items:[{id:301,qty:1,size:'S',color:''}]});
function response() { return {code:200,body:null as any,setHeader(){},status(code:number){this.code=code;return this;},json(value:any){this.body=value;return this;}}; }
test('signed receipt, gateway check and attachment-free email retry contracts',async()=>{
  const env={...process.env};const originalFetch=globalThis.fetch;
  Object.assign(process.env,{ORDER_EMAIL_SECRET:crypto.randomBytes(32).toString('hex'),RESEND_API_KEY:'re_synthetic_fixture',RESEND_FROM_EMAIL:'orders@example.invalid'});
  try {
    assert.equal(createReceiptToken({...body(),amount:0.001},'gl_tiny','PG-tiny'),null);
    const token=createReceiptToken(body(),'gl_fixture123','PG-fixture123')!;
    const receipt=readReceiptToken(token);
    assert.equal(receipt.items.length,1);assert.equal(receipt.items[0].name,'Women Multi Coloured Floral Regular Fit Crop Top');
    assert.throws(()=>readReceiptToken(token.slice(0,-3)+'abc'));
    assert.throws(()=>readReceiptToken(token,receipt.expires+1));
    const forged=token.split('.');forged[0]=Buffer.from(JSON.stringify({...receipt,email:'other@example.invalid'})).toString('base64url');
    assert.throws(()=>readReceiptToken(forged.join('.')));
    const rejected=response();globalThis.fetch=async()=>{throw Error('Must not fetch');};
    await handler({method:'POST',body:{receipt:'invalid'}},rejected);assert.equal(rejected.code,400);
    const messages:any[]=[];let status='PENDING';
    globalThis.fetch=async(input,init)=>{
      if(String(input).startsWith('https://api.payglocal.in/')) { const gid=String(input).split('/').at(-2)!;return new Response(JSON.stringify({data:{status,gid,merchantTxnId:gid.replace('gl_','PG-')}})); }
      messages.push({body:JSON.parse(String(init?.body)),key:(init?.headers as any)['Idempotency-Key']});
      return new Response(JSON.stringify({id:'synthetic-email'}));
    };
    const unpaid=response();await handler({method:'POST',body:{receipt:token,isPaid:true}},unpaid);assert.equal(unpaid.code,409);assert.equal(messages.length,0);
    status='CAPTURED';const sent=response();await handler({method:'POST',body:{receipt:token}},sent);assert.deepEqual(sent.body,{sent:true});
    assert.equal(messages[0].key,'order-confirmation/gl_fixture123');assert.deepEqual(messages[0].body.to,['receipt-test@example.invalid']);
    assert.ok(messages[0].body.html.includes('&lt;script&gt;'));assert.ok(!messages[0].body.html.includes('<script>'));
    assert.ok(!('attachments' in messages[0].body));
    assert.doesNotMatch(messages[0].body.html + messages[0].body.text, /invoice|Kalpana|SULTANPUR|PRANNATHPUR|connectwithgarena/i);
    assert.match(messages[0].body.text, /Synthetic address 12/);
    const retry=response();await handler({method:'POST',body:{receipt:token}},retry);assert.deepEqual(messages[1],messages[0],'stable payload + idempotency key on retries');
    const basic=readReceiptToken(createReceiptToken({...body(),items:[{id:999999,qty:1,size:'S'}]},'gl_basic123','PG-basic123')!);assert.equal(basic.items.length,0);assert.match(orderMessage({...basic,payment:'online'}).text,/Online payment confirmed/);
    const basicResult=response();await handler({method:'POST',body:{receipt:createReceiptToken({...body(),items:[]},'gl_basic123','PG-basic123')}},basicResult);assert.deepEqual(basicResult.body,{sent:true});
    globalThis.fetch=async(input)=>String(input).includes('payglocal') ? new Response(JSON.stringify({data:{status:'CAPTURED',gid:'wrong'}})) : new Response('{}');
    const mismatch=response();await handler({method:'POST',body:{receipt:token}},mismatch);assert.equal(mismatch.code,409);
    delete process.env.ORDER_EMAIL_SECRET;assert.equal(createReceiptToken(body(),'gl_x','PG-x'),null);
  } finally { globalThis.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in env))delete process.env[key];Object.assign(process.env,env); }
});
