import React, { Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import { hasValidGarenaCheckoutPackage } from '../lib/garena-checkout-access';

const LazyGarenaCheckout = lazy(() => import('../pages/GarenaCheckout'));

export default function GarenaCheckoutWrapper() {
  const [searchParams] = useSearchParams();

  if (!hasValidGarenaCheckoutPackage(searchParams)) {
    return <NotFound />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyGarenaCheckout />
    </Suspense>
  );
}
