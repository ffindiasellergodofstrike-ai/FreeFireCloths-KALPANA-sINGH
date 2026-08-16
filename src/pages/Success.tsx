import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Success() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart and pending payment on landing on success page
    sessionStorage.removeItem('pendingPayment');
    clearCart();
  }, [clearCart]);

  return (
    <div className="pt-28 pb-24 px-6 text-center min-h-screen flex flex-col items-center justify-center bg-white" id="success-screen">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 relative" id="success-icon-container">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
        <ShieldCheck size={48} className="text-green-600 relative z-10" id="success-icon-main" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-4 uppercase" id="success-title">Order Secured!</h2>
      <p className="text-slate-500 mb-10 max-w-md mx-auto text-sm sm:text-base leading-relaxed" id="success-desc">
        Prepaid payment confirmed. Your official order has been secured and broadcasted to our dispatch hub. Tracking details will be available shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto" id="success-actions">
        <Link to="/my-orders" className="flex-1 bg-black text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl text-center" id="success-btn-orders">
          My Orders
        </Link>
        <Link to="/" className="flex-1 bg-white border-2 border-slate-100 text-black px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all text-center" id="success-btn-home">
          Return Home
        </Link>
      </div>
    </div>
  );
}
