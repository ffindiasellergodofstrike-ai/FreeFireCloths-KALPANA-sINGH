// Preserved for an explicitly authorized legacy deployment. Not imported by the storefront.
// Restoring these routes also restores the legacy component's external redirects.
import React from 'react';
import { Route } from 'react-router-dom';
import GarenaCheckoutWrapper from '../src/components/GarenaCheckoutWrapper';

export function legacyCheckoutRoutes() {
  return <>
    <Route path="/garena-checkout" element={<GarenaCheckoutWrapper />} />
    <Route path="/garenacheckout" element={<GarenaCheckoutWrapper />} />
    <Route path="/GarenaCheckout" element={<GarenaCheckoutWrapper />} />
    <Route path="/Garenacheckout" element={<GarenaCheckoutWrapper />} />
    <Route path="/garenaCheckout" element={<GarenaCheckoutWrapper />} />
  </>;
}
