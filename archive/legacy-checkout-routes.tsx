// Preserved for an explicitly authorized legacy deployment. Not imported by the storefront.
// Restoring these routes also restores the legacy component's external redirects.
import React from 'react';
import { Route } from 'react-router-dom';
import GarenaCheckout from '../src/pages/GarenaCheckout';

export function legacyCheckoutRoutes() {
  return <>
    <Route path="/garena-checkout" element={<GarenaCheckout />} />
    <Route path="/garenacheckout" element={<GarenaCheckout />} />
    <Route path="/GarenaCheckout" element={<GarenaCheckout />} />
    <Route path="/Garenacheckout" element={<GarenaCheckout />} />
    <Route path="/garenaCheckout" element={<GarenaCheckout />} />
  </>;
}
