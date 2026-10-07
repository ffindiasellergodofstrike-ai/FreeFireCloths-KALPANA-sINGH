import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes } from 'react-router-dom';
import { legacyCheckoutRoutes } from '../archive/legacy-checkout-routes';
import { hasValidGarenaCheckoutPackage } from '../src/lib/garena-checkout-access';

const aliases = [
  '/garena-checkout',
  '/garenacheckout',
  '/GarenaCheckout',
  '/Garenacheckout',
  '/garenaCheckout',
];

function renderLegacyRoute(path: string): string {
  return renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      { initialEntries: [path] },
      React.createElement(Routes, null, legacyCheckoutRoutes()),
    ),
  );
}

test('all Garena checkout aliases use the guarded wrapper and reject direct access', () => {
  const routes = readFileSync('archive/legacy-checkout-routes.tsx', 'utf8');

  for (const path of aliases) {
    assert.ok(routes.includes(`<Route path="${path}" element={<GarenaCheckoutWrapper />} />`));
    assert.equal(hasValidGarenaCheckoutPackage(new URLSearchParams()), false, path);
    const rendered = renderLegacyRoute(path);
    assert.match(rendered, /id="notfound-page-root"/, path);
    assert.doesNotMatch(rendered, /Loading\.\.\./, path);
  }
});

test('missing, malformed, duplicate, and non-positive packages are rejected', () => {
  const invalidQueries = [
    '',
    'status=success',
    'status=failed',
    'pkg=not-a-package&uid=123456789',
    'pkg=0&uid=123456789',
    'pkg=-490&uid=123456789',
    `pkg=${'9'.repeat(400)}&uid=123456789`,
    'pkg=395.50&uid=',
    'pkg=395.50&uid=player123',
    `pkg=395.50&uid=${'1'.repeat(21)}`,
    'pkg=395.50&uid=123456789&pkg=490',
    'pkg=395.50&uid=%20',
  ];

  for (const query of invalidQueries) {
    assert.equal(hasValidGarenaCheckoutPackage(new URLSearchParams(query)), false, query);
  }

  assert.match(renderLegacyRoute('/garena-checkout?status=success'), /id="notfound-page-root"/);
  assert.match(renderLegacyRoute('/garena-checkout?status=failed'), /id="notfound-page-root"/);
  assert.match(renderLegacyRoute('/garena-checkout?pkg=not-a-package&uid=123456789'), /id="notfound-page-root"/);
});

test('external package amounts with a numeric UID remain valid', () => {
  const amounts = ['395.50', '490', '987.65'];

  for (const amount of amounts) {
    const params = new URLSearchParams({ pkg: amount, uid: '123456789', diamonds: '100', nick: 'Player', level: '10' });
    assert.equal(hasValidGarenaCheckoutPackage(params), true, amount);
  }

  const rendered = renderLegacyRoute('/garena-checkout?pkg=490&uid=123456789&diamonds=100');
  assert.doesNotMatch(rendered, /id="notfound-page-root"/);
  assert.match(rendered, /Loading\.\.\./);
});

test('normal checkout route remains registered', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  assert.ok(app.includes('<Route path="/checkout" element={<Checkout />} />'));
});
