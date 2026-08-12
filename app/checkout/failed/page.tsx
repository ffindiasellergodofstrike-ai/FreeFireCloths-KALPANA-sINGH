'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

function FailedContent() {
  const searchParams = useSearchParams();
  const gid = searchParams.get('gid');
  const status = searchParams.get('status') || 'PAYMENT_FAILED';

  const getStatusDescription = (st: string) => {
    switch (st.toUpperCase()) {
      case 'CUSTOMER_CANCELLED':
        return 'Payment was cancelled by the user.';
      case 'ISSUER_DECLINE':
        return 'Declined by bank or payment provider.';
      case 'EXPIRED':
        return 'Payment session expired.';
      case 'MISSING_TOKEN':
        return 'Invalid payment callback verification token.';
      default:
        return 'The payment transaction could not be completed.';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Failed</h1>
          <p className="text-sm text-slate-600 mt-2">{getStatusDescription(status)}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Status Code</span>
            <span className="font-semibold text-red-600 uppercase">{status}</span>
          </div>
          {gid && (
            <div className="flex justify-between text-xs text-slate-500">
              <span>Transaction GID</span>
              <span className="font-mono text-slate-900 font-medium select-all">{gid}</span>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <a
            href="/checkout"
            className="flex-1 py-3 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </a>
          <a
            href="/"
            className="py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading status...</div>}>
      <FailedContent />
    </Suspense>
  );
}
