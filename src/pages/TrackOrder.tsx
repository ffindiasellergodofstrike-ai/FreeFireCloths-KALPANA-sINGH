import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, CheckCircle2, Clock, Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export default function TrackOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      triggerTrack(idFromUrl);
    }
  }, []);

  const triggerTrack = async (id: string) => {
    if (!id.trim()) return;
    setIsSearching(true);
    try {
      const trimmedId = id.trim().replace('#', '');
      const numId = parseInt(trimmedId, 10);
      
      let matchedOrder: any = null;
      
      // Query by orderNumber if it's a number
      if (!isNaN(numId)) {
        const q1 = query(
          collection(db, 'orders'),
          where('orderNumber', '==', numId),
          limit(1)
        );
        const snap1 = await getDocs(q1);
        if (!snap1.empty) {
          const doc = snap1.docs[0];
          matchedOrder = { id: doc.id, ...doc.data() };
        }
      }
      
      // If not found, try by document ID for the logged in user
      if (!matchedOrder && user) {
        const q2 = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid || user.email),
          limit(50)
        );
        const snap2 = await getDocs(q2);
        const docMatch = snap2.docs.find(doc => doc.id === trimmedId);
        if (docMatch) {
          matchedOrder = { id: docMatch.id, ...docMatch.data() };
        }
      }

      if (matchedOrder) {
        // Calculate status dynamically based on rules (3 days, 10 days)
        let datePlaced: Date;
        const createdAt = matchedOrder.createdAt;
        if (typeof createdAt === 'string') {
          datePlaced = new Date(createdAt);
        } else if (createdAt?.toDate) {
          datePlaced = createdAt.toDate();
        } else if (createdAt?.seconds) {
          datePlaced = new Date(createdAt.seconds * 1000);
        } else {
          datePlaced = new Date();
        }

        const diffTime = Math.abs(new Date().getTime() - datePlaced.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        let finalStatus = matchedOrder.status || 'Order Placed';
        let stepIndex = 0; // index for completed steps

        if (diffDays >= 10) {
          finalStatus = 'Delivered';
          stepIndex = 4;
        } else if (diffDays >= 3) {
          finalStatus = 'In Transit';
          stepIndex = 2;
        } else {
          stepIndex = 1;
        }

        const steps = [
          { status: 'Order Placed', date: datePlaced.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), completed: true },
          { status: 'Confirmed', date: 'Authorized', completed: stepIndex >= 1 },
          { status: 'In Transit', date: 'Dispatched', completed: stepIndex >= 2 },
          { status: 'Out for Delivery', date: '-', completed: stepIndex >= 3 },
          { status: 'Delivered', date: '-', completed: stepIndex >= 4 },
        ];

        setTrackingData({
          id: matchedOrder.orderNumber ? `#${matchedOrder.orderNumber}` : matchedOrder.id,
          status: finalStatus,
          lastUpdate: finalStatus === 'Delivered' ? 'Your package has been successfully delivered.' : finalStatus === 'In Transit' ? 'Package is in transit and reaching sorting center.' : 'Your order has been confirmed and is being packed.',
          estimatedDelivery: finalStatus === 'Delivered' ? 'Delivered' : finalStatus === 'In Transit' ? '1-3 Working Days' : '4-7 Working Days',
          steps: steps
        });
      } else {
        toast.error('Order not found or access restricted.');
        setTrackingData(null);
      }
    } catch (e) {
      console.error('Track error:', e);
      toast.error('Error tracking order. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderId) return;
    triggerTrack(orderId);
  };

  if (!user) {
    return (
      <div className="pt-40 pb-24 px-6 text-center min-h-screen max-w-lg mx-auto">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Clock size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4">Sign In Required</h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">Please sign in to your account to track your orders and view shipping status.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-black text-white font-bold py-4 rounded-xl text-xs hover:bg-slate-800 transition-colors uppercase tracking-widest"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Track Your Package</h1>
        <p className="text-slate-500 font-medium">Enter your Order ID to see real-time updates from our logistics partners.</p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required
              type="text" 
              placeholder="Enter Order ID (e.g. 828132)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-black transition-colors"
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching}
            className="bg-black text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[160px]"
          >
            {isSearching ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Track Order'}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {trackingData ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8 bg-black text-white rounded-[2rem] shadow-lg">
                <div className="space-y-1">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Current Protocol</span>
                  <p className="text-xl sm:text-2xl font-black flex items-center gap-3">
                    <Truck size={24} /> {trackingData.status}
                  </p>
                </div>
                <div className="space-y-1 sm:text-right border-t border-white/10 pt-4 sm:pt-0 sm:border-none">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Est. Arrival</span>
                  <p className="text-lg sm:text-xl font-bold">{trackingData.estimatedDelivery}</p>
                </div>
              </div>

              <div className="relative pl-10 sm:pl-12 flex flex-col gap-10 sm:gap-14 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2.5px] before:bg-slate-100">
                {trackingData.steps.map((step: any, index: number) => (
                  <div key={index} className="relative min-h-[40px] h-auto flex flex-col justify-start">
                    <div className={`absolute -left-[16px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-colors ${step.completed ? 'bg-black text-white' : 'bg-slate-100 text-slate-300'}`}>
                      {step.completed ? <CheckCircle2 size={14} /> : <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" />}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full pt-1">
                      <div className="flex-1">
                        <h4 className={`font-black text-sm sm:text-base uppercase tracking-tight ${step.completed ? 'text-black' : 'text-slate-400'}`}>{step.status}</h4>
                        {index === 2 && step.completed && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100"
                          >
                            {trackingData.lastUpdate}
                          </motion.p>
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 self-start sm:self-center bg-white px-2">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : !isSearching && (
            <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">Your tracking history will appear here.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-black text-white p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="max-w-md">
          <h3 className="text-xl font-bold mb-2">View Your Order History</h3>
          <p className="text-slate-400 text-sm">Don't remember your Order ID? Access your personal archive to see all your transactions and real-time status updates.</p>
        </div>
        <Link to="/my-orders" className="bg-white text-black px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center gap-2 whitespace-nowrap">
          My Orders <ArrowRight size={14} />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
            <Clock size={20} />
          </div>
          <div>
            <h5 className="font-bold text-sm">Delivery Timeline</h5>
            <p className="text-[10px] text-slate-500 font-medium">9-15 Working Days</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
            <Truck size={20} />
          </div>
          <div>
            <h5 className="font-bold text-sm">Safe Transit</h5>
            <p className="text-[10px] text-slate-500 font-medium">Handled with extreme care</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h5 className="font-bold text-sm">Secured Delivery</h5>
            <p className="text-[10px] text-slate-500 font-medium">OTP based verification</p>
          </div>
        </div>
      </div>
    </div>
  );
}
