import { createReceiptToken } from '../../server/order-receipt.js';
import { isRetiredProduct } from '../../src/data/retired-products.js';
import { generateJWEAndJWS } from 'payglocal-js-client';
import crypto from 'crypto';
import { readCheckoutParameters } from '../../src/lib/garena-checkout-access.js';
import { denyCheckout, protectedHeaders } from '../../server/private-checkout.js';
import { createCheckoutReturnToken } from '../../server/checkout-return.js';

// Products mapping from website catalog based on checkout price
const WEBSITE_PRODUCT_CATALOG = {
  '395.50': [
    'Wide Leg Fit Jeans With 4 Pocket For Women',
    'Wall Mounted Bathroom Storage Shelf with Towel Rack'
  ],
  '450': [
    'Race Print T-Shirt & Shorts Set For Boys'
  ],
  '490': [
    'Wide Leg Fit Jeans With 5 Pocket For Women',
    'Korean Fashion Oversized Casual Cotton T-Shirt'
  ],
  '499': [
    'Women Multi Coloured Floral Regular Fit Crop Top',
    'Light Blue Mid Embroidered Rise Fit Skirt For Women',
    'Wide Leg Fit Jeans With 6 Pocket For Women'
  ],
  '550': [
    'Women Multi Coloured Floral Regular Fit Crop Top',
    'Black High Rise Skinny Fit Shapewear For Women',
    'Drop Shoulder Sleeves Regular Fit Sweatshirt For Women',
    'Portable Handheld Ring LED Light Photography Lamp'
  ],
  '750': [
    'Blue Stripes Relaxed Fit Shirt For Women',
    'Nylon Blend Regular Fit Bra For Women',
    'Solid Tube Bra For Women',
    'Mens Corduroy Loose Fit Wide Leg Pants'
  ],
  '1000': [
    'Floral Print Straight Kurta For Women',
    'Yellow Puff Sleeves Regular Fit Dress For Women',
    'Men Slim Fit Denim Jacket Vintage Edition'
  ],
  '1100': [
    'White and Black Wide Leg Fit Casual Trouser With 2 Pocket For Women',
    'Regular Fit Casual Trouser With 1 Pocket For Women',
    'Light Blue Solid Flared Jeans For Women',
    'BT21 Anime Cartoon Keychain Doll Pendant'
  ],
  '1400': [
    'Stripes Regular Fit Shirt For Men',
    'Skinny Fit Jeans With 5 Pocket For Women',
    'Striped Regular Fit T-Shirt For Infant Boys',
    'Cute Bear Phone Charms & Keychain Pendant'
  ],
  '5500': [
    'Slim Fit Utility Pocket Trouser For Men',
    'Mens Slim Solid Navy Formal Trousers',
    'Solid Rayon Pant For Women',
    'LED Selfie Ring Lamp with Phone Holder & Tripod',
    'Cotton Blend Straight Fit Trouser for Women'
  ],
  '7500': [
    'Olive Slim Fit Utility Pocket Trouser For Men',
    'Cotton Blend Regular Fit Shirt For Men',
    'Cotton Blend Solid Pant For Women',
    'Solid Plazzos For Women And Girls',
    'Stylish Women Maroon Gown Dress'
  ]
};

function getRandomProductForPrice(price) {
  const priceKey = String(price).trim();
  const list = WEBSITE_PRODUCT_CATALOG[priceKey];
  if (list && list.length > 0) {
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }
  return 'Women Multi Coloured Floral Regular Fit Crop Top';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  try {
    const { customerData, source } = req.body;
    const isGarena = source === 'garena';
    let checkout = null;
    if (isGarena) {
      protectedHeaders(res);
      const supplied = req.body.checkout;
      if (!supplied || typeof supplied !== 'object' || Array.isArray(supplied) || Object.values(supplied).some(value => typeof value !== 'string')) return denyCheckout(res);
      checkout = readCheckoutParameters(new URLSearchParams(supplied));
      if (!checkout) return denyCheckout(res);
    }
    const amount = checkout ? checkout.pkg : req.body.amount;
    if (Array.isArray(req.body.items) && req.body.items.some(item => isRetiredProduct(item.id))) return res.status(400).json({ error: 'A product in your bag is no longer available' });
    
    if (!amount || !customerData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (isGarena && (typeof customerData.firstName !== 'string' || customerData.firstName.trim().length < 2 || customerData.firstName.length > 120 || typeof customerData.email !== 'string' || customerData.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email) || typeof customerData.phone !== 'string' || !/^\d{10}$/.test(customerData.phone))) {
      return res.status(400).json({ error: 'Invalid customer details' });
    }

    const merchantTxnId = `PG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const host = req.headers.host || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
    const checkoutReturnToken = checkout ? await createCheckoutReturnToken(checkout, merchantTxnId) : null;
    
    // Digital purchases must be described accurately to the payment gateway.
    const resolvedProductName = checkout ? `Free Fire Diamonds (${checkout.diamonds})` : getRandomProductForPrice(amount);
    const formattedAmount = Number(amount).toFixed(2).toString();

    const callbackSourceParam = isGarena ? '&src=garena' : '';

    // Format phone: ensure 10 digits without leading 91 or +91 for phoneNumber field
    let rawPhone = String(customerData.phone || '9999999999').replace(/[^0-9]/g, '');
    if (rawPhone.length > 10 && (rawPhone.startsWith('91') || rawPhone.startsWith('+91'))) {
      rawPhone = rawPhone.slice(-10);
    }
    let cleanPhone = rawPhone.slice(-10).padStart(10, '9');

    const emailId = customerData.email || "customer@gmail.com";

    // For Garena Checkout: Send only country 'IN' (no street/city/state/pincode)
    // For Website Checkout: Send full customer shipping address
    const billingInfo = isGarena ? {
      firstName: customerData.firstName || "Customer",
      lastName: customerData.lastName || "",
      emailId: emailId,
      callingCode: "+91",
      phoneNumber: cleanPhone,
      addressCountry: "IN"
    } : {
      firstName: customerData.firstName || "Customer",
      lastName: customerData.lastName || "",
      emailId: emailId,
      callingCode: "+91",
      phoneNumber: cleanPhone,
      addressCountry: "IN",
      addressStreet1: customerData.address || "Main Street",
      addressCity: customerData.city || "Delhi",
      addressState: customerData.state || "Delhi",
      addressPostalCode: customerData.pincode || "110001"
    };

    const payload = {
      merchantTxnId,
      comments: resolvedProductName,
      paymentData: {
        totalAmount: formattedAmount,
        txnCurrency: "INR",
        comments: resolvedProductName,
        billingData: billingInfo
      },
      billingData: billingInfo,
      riskData: {
        orderItems: [
          {
            itemId: `SKU-${Math.round(amount)}`,
            itemName: resolvedProductName,
            itemDescription: resolvedProductName,
            itemCategory: isGarena ? "DIGITAL_GOODS" : "APPAREL_AND_ACCESSORIES",
            itemQuantity: 1,
            itemPrice: formattedAmount
          }
        ]
      },
      merchantCallbackURL: `${protocol}://${host}/api/payglocal/callback?txnId=${merchantTxnId}${callbackSourceParam}${checkoutReturnToken ? `&state=${encodeURIComponent(checkoutReturnToken)}` : ''}`
    };

    console.log(`[Backend Gateway Init] TxnId: ${merchantTxnId}, Amount: ₹${formattedAmount}, Product: "${resolvedProductName}"`);


    function loadKey(raw) {
      if (!raw) throw new Error('KEY ENV EMPTY');
      let k = raw.trim();
      if (!k.includes('-----BEGIN')) {              // stored as base64
        k = Buffer.from(k, 'base64').toString('utf8').trim();
      }
      k = k.replace(/\\n/g, '\n');                   // fix escaped newlines
      return k;
    }

    let privateKey = loadKey(process.env.PAYGLOCAL_PRIVATE_KEY);
    const publicKey = loadKey(process.env.PAYGLOCAL_PUBLIC_KEY);

    console.log('PRIV_DEBUG len=', privateKey.length,
                '| firstLine=', JSON.stringify(privateKey.split('\n')[0]),
                '| lines=', privateKey.split('\n').length,
                '| pkcs8=', privateKey.includes('BEGIN PRIVATE KEY'),
                '| pkcs1=', privateKey.includes('BEGIN RSA PRIVATE KEY'));

    // If key is PKCS#1, convert to PKCS#8 (jose needs PKCS#8)
    if (privateKey.includes('BEGIN RSA PRIVATE KEY')) {
      privateKey = crypto.createPrivateKey(privateKey)
                         .export({ type: 'pkcs8', format: 'pem' });
    }

    const { jweToken, jwsToken } = await generateJWEAndJWS({
      payload,
      publicKey,
      privateKey,
      merchantId: process.env.PAYGLOCAL_MERCHANT_ID,
      privateKeyId: process.env.PAYGLOCAL_PRIVATE_KEY_ID,
      publicKeyId: process.env.PAYGLOCAL_PUBLIC_KEY_ID
    });

    const initRes = await fetch("https://api.payglocal.in/gl/v1/payments/initiate/paycollect", {
      method: "POST",
      headers: {
        "Content-Type": process.env.PAYGLOCAL_CONTENT_TYPE || "application/json",
        "x-gl-token-external": jwsToken,
        "x-gl-merchantid": process.env.PAYGLOCAL_MERCHANT_ID,
        "x-gl-kid": process.env.PAYGLOCAL_PRIVATE_KEY_ID
      },
      body: jweToken
    });

    if (!initRes.ok) {
      const errTxt = await initRes.text();
      console.error("PayGlocal Init Error:", errTxt);
      return res.status(initRes.status).json({ error: 'Payment gateway error', details: errTxt });
    }

    const data = await initRes.json();
    console.log("=== FULL PAYGLOCAL INITIATE RESPONSE ===", JSON.stringify(data, null, 2));

    const gid = data.gid;
    const redirectUrl = data.data?.redirectUrl;

    console.log("=== PAYGLOCAL EXACT REDIRECT URL ===", redirectUrl);

    if (!gid || !redirectUrl) {
      return res.status(500).json({ error: 'Invalid response from PayGlocal', data });
    }

    let orderReceipt = null;
    if (!isGarena) {
      try { orderReceipt = createReceiptToken(req.body, gid, merchantTxnId); }
      catch { console.warn('Order email receipt unavailable; payment initiation continues.'); }
    }
    return res.json({ redirectUrl, gid, merchantTxnId, ...(orderReceipt ? { orderReceipt } : {}) });

  } catch (error) {
    console.error("Initiate error:", error);
    return res.status(500).json({ error: error.message });
  }
}
