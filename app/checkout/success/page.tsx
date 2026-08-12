'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const gid = searchParams.get('gid') || searchParams.get('merchantTxnId') || 'GL-TXN-SUCCESS';
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Clean cart state / localStorage on successful payment
    try {
      localStorage.removeItem('cart');
      localStorage.removeItem('garena_cart');
      window.dispatchEvent(new Event('cart-cleared'));
      setCleared(true);
    } catch (e) {
      console.error('Failed to clear cart storage:', e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Successful!</h1>
          <p className="text-sm text-slate-600 mt-2">
            Thank you for your purchase. Your order has been placed successfully via PayGlocal UPI.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Payment Status</span>
            <span className="font-semibold text-emerald-600 uppercase">Paid (Success)</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>PayGlocal GID</span>
            <span className="font-mono text-slate-900 font-medium select-all">{gid}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Store</span>
            <span className="text-slate-800 font-medium">Garena Official Store</span>
          </div>
        </div>

        {cleared && (
          <p className="text-xs text-slate-400 italic">Cart cleared automatically.</p>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <a
            href="/"
            className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading status...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
