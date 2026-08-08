import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

export default function Failure() {
  return (
    <div className="pt-28 pb-24 px-6 text-center min-h-screen flex flex-col items-center justify-center bg-white" id="failure-screen">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8 relative" id="failure-icon-container">
        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-25"></div>
        <XCircle size={48} className="text-red-600 relative z-10" id="failure-icon-main" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-4 uppercase text-red-600" id="failure-title">Payment Aborted</h2>
      <p className="text-slate-500 mb-10 max-w-md mx-auto text-sm sm:text-base leading-relaxed" id="failure-desc">
        The transaction was declined, cancelled, or interrupted. No funds have been debited for pending orders. You can retry security synchronization via your checkout lobby.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto justify-center" id="failure-actions">
        <Link to="/checkout" className="flex-grow bg-black text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl text-center flex items-center justify-center gap-2" id="failure-btn-retry">
          <ArrowLeft size={14} /> Back to Checkout
        </Link>
      </div>
    </div>
  );
}
