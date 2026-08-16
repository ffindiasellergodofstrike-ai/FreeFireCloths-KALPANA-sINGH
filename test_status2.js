import * as dotenv from 'dotenv';
dotenv.config();

async function testStatus() {
  const merchantId = "dummy";
  const privateKeyId = "dummy";
  
  let res = await fetch(`https://api.payglocal.in/gl/v1/payments/12345/status/`, {
    headers: {
      "x-gl-merchantid": merchantId,
      "x-gl-kid": privateKeyId
    }
  });
  console.log("Status:", res.status, await res.text());
}
testStatus();
