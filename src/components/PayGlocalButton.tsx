import React, { useState } from 'react';
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

export interface PayGlocalButtonProps {
  amount: number | string;
  email: string;
  orderId?: string;
  customerId?: string;
  productName?: string;
  onSuccess?: (redirectUrl: string, gid: string) => void;
  onError?: (errorMessage: string) => void;
  className?: string;
  disabled?: boolean;
}

export function PayGlocalButton({
  amount,
  email,
  orderId,
  customerId,
  productName,
  onSuccess,
  onError,
  className = '',
  disabled = false,
}: PayGlocalButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!email) {
      if (onError) onError('Please provide a valid email address.');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      if (onError) onError('Invalid order total amount.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payglocal/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(amount),
          email,
          orderId: orderId || `ORD-${Date.now()}`,
          customerId: customerId || `CUST-${Date.now()}`,
          productName,
        }),
      });

      const resText = await response.text();
      let result: any = {};
      try {
        result = resText ? JSON.parse(resText) : {};
      } catch {
        result = {
          success: false,
          error: 'Server configuration error: Please add PayGlocal API keys to Vercel Environment Variables.',
        };
      }

      if (response.ok && result.success && result.redirectUrl) {
        if (onSuccess) {
          onSuccess(result.redirectUrl, result.gid);
        }
        // Redirect customer using GET method to PayGlocal hosted UPI page
        window.location.href = result.redirectUrl;
      } else {
        const errorMsg =
          result.error ||
          'Failed to initialize PayGlocal payment. Please check your PayGlocal API keys in Vercel Environment Variables.';
        if (onError) onError(errorMsg);
        setLoading(false);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Payment initiation error:', error);
      const errorMsg = error.message || 'Network error while connecting to payment service.';
      if (onError) onError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading || disabled}
      className={`w-full py-3.5 px-6 rounded-lg font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span>Connecting to PayGlocal...</span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Pay ₹{Number(amount).toLocaleString('en-IN')} via UPI</span>
          <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
        </>
      )}
    </button>
  );
}

export default PayGlocalButton;
