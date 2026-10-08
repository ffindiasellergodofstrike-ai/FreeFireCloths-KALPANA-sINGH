import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import GarenaCheckout from '../../src/pages/GarenaCheckout';
import type { CheckoutParameters } from '../../src/lib/garena-checkout-access';

declare global { interface Window { __CHECKOUT__: CheckoutParameters } }

// The data and this bundle are supplied only by the parameter-gated server handler.
const data = window.__CHECKOUT__;
delete (window as Partial<Window>).__CHECKOUT__;
createRoot(document.getElementById('root')!).render(
  <MemoryRouter initialEntries={['/?' + new URLSearchParams(data).toString()]}>
    <GarenaCheckout />
  </MemoryRouter>,
);
