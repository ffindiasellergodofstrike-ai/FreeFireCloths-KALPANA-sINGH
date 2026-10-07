import React, { Suspense, lazy } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';

const LazyGarenaCheckout = lazy(() => import('../pages/GarenaCheckout'));

export default function GarenaCheckoutWrapper() {
  const [searchParams] = useSearchParams();

  const pkgParam      = searchParams.get('pkg');
  const diamondsParam = searchParams.get('diamonds');
  const uidParam      = searchParams.get('uid');
  const nickParam     = searchParams.get('nick');
  const levelParam    = searchParams.get('level');
  const statusParam   = searchParams.get('status');

  const isCallback = statusParam === 'success' || statusParam === 'failed';

  const hasValidParams = Boolean(
    pkgParam &&
    uidParam &&
    (diamondsParam || nickParam || levelParam || Number(pkgParam) > 0)
  );

  // If not valid, and not a callback, do not render or download the heavy component
  if (!isCallback && !hasValidParams) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyGarenaCheckout />
    </Suspense>
  );
}
