import React, { useEffect, useState, useMemo } from "react";
import { catalogImages } from '../data/catalog-media';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ThumbsUp, 
  Camera, 
  Truck, 
  RefreshCw, 
  Award,
  X,
  Sparkles,
  Lock,
  Loader2
} from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  variant?: string;
  images?: string[];
  isReal?: boolean;
}

interface ErrorModalState {
  isOpen: boolean;
  type: 'not_logged_in' | 'not_delivered' | 'no_order';
  title: string;
  message: string;
  orderId?: string | null;
  orderStatus?: string | null;
}

export default function ProductReviews({ productId }: { productId: number }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState("loading");
  const [limit, setLimit] = useState(6);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleOrderId, setEligibleOrderId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [errorModal, setErrorModal] = useState<ErrorModalState | null>(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Filter & Interactive States
  const [filterRating, setFilterRating] = useState<number | 'all' | 'photos'>('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch Imported Reviews from JSON using absolute ID
    const controller = new AbortController();
    let imported: Review[] = [];
    let realReviews: Review[] = [];
    const absoluteId = Math.abs(productId);

    const updateCombinedReviews = () => {
      if (!controller.signal.aborted) {
        setReviews([...realReviews, ...imported]);
        setStatus("ready");
      }
    };

    const fetchImported = async () => {
      try {
        const response = await fetch(`/reviews/${absoluteId}.json`, { signal: controller.signal });
        if (response.ok) {
          const data = await response.json();
          if (Math.abs(data.productId) === absoluteId && Array.isArray(data.reviews)) {
            imported = data.reviews.map((r: any) => ({ ...r, isReal: false }));
            updateCombinedReviews();
          }
        }
      } catch {
        console.warn("Imported reviews fetch failed or not found for ID:", absoluteId);
        updateCombinedReviews();
      }
    };

    // Trigger imported reviews fetch
    fetchImported();

    // 2. Fetch Real Reviews from Firestore
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId)
    );

    const unsubscribeReal = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          author: data.userName || 'Anonymous',
          rating: data.rating,
          date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
          text: data.text,
          createdAt: data.createdAt,
          isReal: true
        };
      });

      // Sort client-side by createdAt descending
      docs.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      realReviews = docs as Review[];
      updateCombinedReviews();
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'reviews');
    });

    return () => {
      controller.abort();
      unsubscribeReal();
    };
  }, [productId]);

  // Check Eligibility Helper: Only delivered orders can review
  const checkUserEligibility = async (): Promise<{
    eligible: boolean;
    orderId?: string | null;
    orderStatus?: string | null;
    type?: 'not_logged_in' | 'not_delivered' | 'no_order';
  }> => {
    if (!user) {
      return { eligible: false, type: 'not_logged_in' };
    }

    try {
      const ordersToCheck: any[] = [];
      const seenIds = new Set<string>();

      // 1. Fetch orders by userId == user.uid
      const qUid = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const snapUid = await getDocs(qUid);
      snapUid.forEach(docSnap => {
        if (!seenIds.has(docSnap.id)) {
          seenIds.add(docSnap.id);
          ordersToCheck.push({ id: docSnap.id, ...docSnap.data() });
        }
      });

      // 2. Fetch orders by user.email if distinct
      if (user.email && user.email !== user.uid) {
        try {
          const qEmail = query(
            collection(db, 'orders'),
            where('userId', '==', user.email)
          );
          const snapEmail = await getDocs(qEmail);
          snapEmail.forEach(docSnap => {
            if (!seenIds.has(docSnap.id)) {
              seenIds.add(docSnap.id);
              ordersToCheck.push({ id: docSnap.id, ...docSnap.data() });
            }
          });
        } catch {
          // ignore index errors
        }

        try {
          const qUserEmail = query(
            collection(db, 'orders'),
            where('userEmail', '==', user.email)
          );
          const snapUserEmail = await getDocs(qUserEmail);
          snapUserEmail.forEach(docSnap => {
            if (!seenIds.has(docSnap.id)) {
              seenIds.add(docSnap.id);
              ordersToCheck.push({ id: docSnap.id, ...docSnap.data() });
            }
          });
        } catch {
          // ignore
        }
      }

      // Filter for orders containing this product
      const targetId = Number(productId);
      const matchingOrders = ordersToCheck.filter(order => {
        if (!order.items || !Array.isArray(order.items)) return false;
        return order.items.some((item: any) => {
          const itemId = Number(item.id);
          return itemId === targetId || Math.abs(itemId) === Math.abs(targetId) || String(item.id) === String(productId);
        });
      });

      if (matchingOrders.length === 0) {
        return { eligible: false, type: 'no_order' };
      }

      // Check if any matching order has status Delivered
      const deliveredOrder = matchingOrders.find(order => {
        const s = String(order.status || '').trim().toLowerCase();
        return s === 'delivered' || s === 'order delivered';
      });

      if (deliveredOrder) {
        return { 
          eligible: true, 
          orderId: deliveredOrder.id,
          orderStatus: deliveredOrder.status || 'Delivered'
        };
      }

      // Found an order for this product, but not delivered yet
      const pendingOrder = matchingOrders[0];
      return {
        eligible: false,
        type: 'not_delivered',
        orderId: pendingOrder.orderNumber ? `#${pendingOrder.orderNumber}` : `#${pendingOrder.id.slice(0, 8)}`,
        orderStatus: pendingOrder.status || 'In Transit'
      };
    } catch (err) {
      console.error('Error verifying review eligibility:', err);
      return { eligible: false, type: 'no_order' };
    }
  };

  useEffect(() => {
    // Background check on load/user change
    if (!user) {
      setIsEligible(false);
      setEligibleOrderId(null);
      return;
    }

    let isMounted = true;
    checkUserEligibility().then(res => {
      if (isMounted) {
        if (res.eligible && res.orderId) {
          setIsEligible(true);
          setEligibleOrderId(res.orderId);
        } else {
          setIsEligible(false);
          setEligibleOrderId(null);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user, productId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setErrorModal(null);
        setActiveModalImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWriteReviewClick = async () => {
    if (!user) {
      setErrorModal({
        isOpen: true,
        type: 'not_logged_in',
        title: 'Sign In Required to Review',
        message: 'To keep all customer reviews 100% genuine and protect against spam, only customers with a delivered order can write a review. Please sign in to verify your purchase.'
      });
      return;
    }

    setCheckingEligibility(true);
    try {
      const result = await checkUserEligibility();
      setCheckingEligibility(false);

      if (result.eligible && result.orderId) {
        setIsEligible(true);
        setEligibleOrderId(result.orderId);
        setShowForm(true);
        setTimeout(() => {
          const formEl = document.querySelector('.review-form-container');
          if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else if (result.type === 'not_delivered') {
        setErrorModal({
          isOpen: true,
          type: 'not_delivered',
          title: 'Order Delivery Pending',
          message: `We found your purchase order (${result.orderId}), but its current delivery status is "${result.orderStatus}". Reviews can only be submitted once your order has been successfully delivered!`,
          orderId: result.orderId,
          orderStatus: result.orderStatus
        });
      } else {
        setErrorModal({
          isOpen: true,
          type: 'no_order',
          title: 'Verified Purchase Required',
          message: 'Only verified buyers who have received delivery of this product can write a review. We could not find a delivered order for this item under your account.'
        });
      }
    } catch {
      setCheckingEligibility(false);
      toast.error('Could not verify order status. Please try again.');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !eligibleOrderId) return;
    if (!reviewText.trim()) {
      toast.error("Please write something in your review.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        userName: user.name || user.email.split('@')[0],
        rating,
        text: reviewText.trim(),
        orderId: eligibleOrderId,
        createdAt: serverTimestamp()
      });

      toast.success("Thank you! Your verified review has been published.");
      setShowForm(false);
      setReviewText("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpfulClick = (reviewId: string) => {
    if (userVoted[reviewId]) {
      toast.info("You already marked this review as helpful.");
      return;
    }
    setUserVoted(prev => ({ ...prev, [reviewId]: true }));
    setHelpfulVotes(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));
    toast.success("Thank you for your feedback!");
  };

  // Metrics computation
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        avgRating: 4.9,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        percentages: { 5: 92, 4: 8, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        photosCount: 0,
        recommendRate: 98
      };
    }

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    let photosCount = 0;

    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
      sum += (r.rating || 5);
      if (r.images && r.images.length > 0) photosCount++;
    });

    const avgRating = Number((sum / total).toFixed(1));
    const percentages: Record<number, number> = {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100),
    };

    const recommendRate = Math.min(100, Math.round(((counts[5] + counts[4]) / total) * 100));

    return { avgRating, counts, percentages, photosCount, recommendRate };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (filterRating === 'all') return reviews;
    if (filterRating === 'photos') return reviews.filter(r => r.images && r.images.length > 0);
    return reviews.filter(r => Math.round(r.rating || 5) === filterRating);
  }, [reviews, filterRating]);

  return (
    <section 
      className="edit-reviews" 
      aria-labelledby="reviews-heading" 
      style={{ marginTop: '72px', borderTop: '1px solid #e2e8f0', paddingTop: '56px' }}
    >
      {/* Title & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '11px', 
              fontWeight: 800, 
              letterSpacing: '1px', 
              textTransform: 'uppercase', 
              color: '#047857', 
              background: '#ecfdf5', 
              padding: '4px 10px', 
              borderRadius: '999px', 
              border: '1px solid #a7f3d0' 
            }}>
              <ShieldCheck size={13} /> 100% Genuine Customer Ratings
            </span>
          </div>
          <h2 id="reviews-heading" style={{ margin: 0, fontFamily: 'var(--font-h)', fontSize: '24px', fontWeight: '800', letterSpacing: '0.5px' }}>
            Customer Feedback & Reviews
          </h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '13px' }}>
            Authentic experiences from verified buyers across India
          </p>
        </div>

        {!showForm && (
          <button 
            onClick={handleWriteReviewClick}
            disabled={checkingEligibility}
            className="btn btn-black btn-sm"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontWeight: 700,
              cursor: checkingEligibility ? 'wait' : 'pointer',
              opacity: checkingEligibility ? 0.85 : 1,
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
          >
            {checkingEligibility ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> VERIFYING...
              </>
            ) : (
              <>
                <MessageSquare size={16} /> WRITE A REVIEW
              </>
            )}
          </button>
        )}
      </div>

      {/* Review Submission Form Modal / Box */}
      {showForm && (
        <div className="review-form-container" style={{ background: '#f8fafc', padding: '32px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-h)', letterSpacing: '0.5px' }}>WRITE A VERIFIED REVIEW</h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Help fellow shoppers make the right choice.</p>
            </div>
            <button 
              onClick={() => setShowForm(false)} 
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '12px', fontWeight: 700, padding: '4px 8px' }}
            >
              CANCEL
            </button>
          </div>
          
          <form onSubmit={handleSubmitReview}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Your Rating
              </label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map(num => (
                  <button 
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.1s' }}
                    aria-label={`Rate ${num} star`}
                  >
                    <Star 
                      size={28} 
                      fill={num <= rating ? "#f59e0b" : "none"} 
                      color={num <= rating ? "#f59e0b" : "#cbd5e1"} 
                    />
                  </button>
                ))}
                <span style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {rating === 5 ? '⭐⭐⭐⭐⭐ Excellent' : rating === 4 ? '⭐⭐⭐⭐ Good' : rating === 3 ? '⭐⭐⭐ Average' : `${rating} Stars`}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Your Experience & Fit Feedback
              </label>
              <textarea 
                required
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your thoughts on the fabric quality, stitching, comfort, and fitting..."
                style={{ 
                  width: '100%', 
                  minHeight: '120px', 
                  padding: '16px', 
                  borderRadius: '10px', 
                  border: '1px solid #cbd5e1', 
                  background: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none',
                  resize: 'vertical',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="btn btn-black"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '8px' }}
            >
              {submitting ? 'PUBLISHING...' : <><Send size={16} /> SUBMIT VERIFIED REVIEW</>}
            </button>
          </form>
        </div>
      )}

      {/* Aggregate Rating Summary Card */}
      {reviews.length > 0 && (
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '16px', 
          padding: '28px', 
          marginBottom: '36px',
          boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', alignItems: 'center' }}>
            {/* Left: Overall Score */}
            <div style={{ textAlign: 'center', borderRight: '1px solid #f1f5f9', paddingRight: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'var(--font-h)', color: '#0f172a', lineHeight: 1 }}>
                {stats.avgRating}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', margin: '8px 0 6px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.round(stats.avgRating) ? "#f59e0b" : "none"} 
                    color={i < Math.round(stats.avgRating) ? "#f59e0b" : "#cbd5e1"} 
                  />
                ))}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                Based on {reviews.length} Verified {reviews.length === 1 ? 'Review' : 'Reviews'}
              </div>
              <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Sparkles size={12} /> {stats.recommendRate}% of buyers recommend this product
              </div>
            </div>

            {/* Middle: Rating Breakdown Bars */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b', marginBottom: '10px' }}>
                Rating Distribution
              </div>
              {[5, 4, 3, 2, 1].map(starNum => {
                const count = stats.counts[starNum] || 0;
                const pct = stats.percentages[starNum] || 0;
                return (
                  <div 
                    key={starNum}
                    onClick={() => setFilterRating(prev => prev === starNum ? 'all' : starNum)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginBottom: '6px', 
                      cursor: 'pointer',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      background: filterRating === starNum ? '#f1f5f9' : 'transparent',
                      transition: 'background 0.15s'
                    }}
                    title={`Filter by ${starNum} star`}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '32px', color: '#334155', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {starNum} <Star size={11} fill="#f59e0b" color="#f59e0b" />
                    </span>
                    <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${pct}%`, 
                          height: '100%', 
                          background: starNum >= 4 ? '#f59e0b' : '#94a3b8', 
                          borderRadius: '999px',
                          transition: 'width 0.4s ease'
                        }} 
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', minWidth: '28px', textAlign: 'right' }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Trust Assurances */}
            <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b', marginBottom: '12px' }}>
                Buyer Guarantee
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a' }}>100% Verified Buyers</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Only completed delivered orders can review</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Truck size={16} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a' }}>Express Tracked Shipping</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Fast dispatch across all India pin codes</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <RefreshCw size={16} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a' }}>7-Day Easy Returns</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Hassle-free size replacement guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Filters Bar */}
      {reviews.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterRating('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: filterRating === 'all' ? '#0f172a' : '#cbd5e1',
              background: filterRating === 'all' ? '#0f172a' : '#ffffff',
              color: filterRating === 'all' ? '#ffffff' : '#334155',
              transition: 'all 0.15s ease'
            }}
          >
            All Reviews ({reviews.length})
          </button>

          {stats.counts[5] > 0 && (
            <button
              onClick={() => setFilterRating(prev => prev === 5 ? 'all' : 5)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterRating === 5 ? '#f59e0b' : '#cbd5e1',
                background: filterRating === 5 ? '#fef3c7' : '#ffffff',
                color: filterRating === 5 ? '#92400e' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <Star size={12} fill="#f59e0b" color="#f59e0b" /> 5 Stars ({stats.counts[5]})
            </button>
          )}

          {stats.counts[4] > 0 && (
            <button
              onClick={() => setFilterRating(prev => prev === 4 ? 'all' : 4)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterRating === 4 ? '#f59e0b' : '#cbd5e1',
                background: filterRating === 4 ? '#fef3c7' : '#ffffff',
                color: filterRating === 4 ? '#92400e' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <Star size={12} fill="#f59e0b" color="#f59e0b" /> 4 Stars ({stats.counts[4]})
            </button>
          )}

          {stats.photosCount > 0 && (
            <button
              onClick={() => setFilterRating(prev => prev === 'photos' ? 'all' : 'photos')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterRating === 'photos' ? '#2563eb' : '#cbd5e1',
                background: filterRating === 'photos' ? '#eff6ff' : '#ffffff',
                color: filterRating === 'photos' ? '#1d4ed8' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <Camera size={13} /> With Photos ({stats.photosCount})
            </button>
          )}
        </div>
      )}

      {/* Review Cards Grid or Empty State */}
      {status === "loading" ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #cbd5e1', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px', fontSize: '13px' }}>Loading verified customer reviews…</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '16px' }}>
          <p style={{ color: '#475569', fontWeight: 600, margin: 0, fontSize: '15px' }}>
            {reviews.length === 0 ? "Be the first to review this piece." : "No reviews found matching the selected filter."}
          </p>
          {reviews.length === 0 && !showForm && (
            <div style={{ marginTop: '16px' }}>
              <button 
                onClick={handleWriteReviewClick}
                disabled={checkingEligibility}
                className="btn btn-black btn-sm"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: checkingEligibility ? 'wait' : 'pointer'
                }}
              >
                {checkingEligibility ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...
                  </>
                ) : (
                  <>
                    <MessageSquare size={15} /> Write a Review
                  </>
                )}
              </button>
            </div>
          )}
          {user && !isEligible && reviews.length === 0 && (
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px', marginBottom: 0 }}>
              Only customers who have purchased and received this product can write a verified review.
            </p>
          )}
          {filterRating !== 'all' && (
            <button 
              onClick={() => setFilterRating('all')} 
              className="btn btn-outline btn-sm" 
              style={{ marginTop: '16px', padding: '8px 16px' }}
            >
              View All Reviews
            </button>
          )}
        </div>
      ) : (
        <div 
          className="reviews-unified-card" 
          style={{ 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px -2px rgba(0,0,0,0.04)',
            marginBottom: '32px'
          }}
        >
          {/* Header row inside the unified card - Amazon & Flipkart style */}
          <div style={{ 
            padding: '20px 28px', 
            background: '#f8fafc', 
            borderBottom: '1px solid #f1f5f9', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Customer Reviews
              </span>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                color: '#475569', 
                background: '#e2e8f0', 
                padding: '2px 8px', 
                borderRadius: '12px' 
              }}>
                {filteredReviews.length}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
              <ShieldCheck size={14} />
              <span>100% Genuine Buyer Feedback</span>
            </div>
          </div>

          {/* List of reviews inside this single unified card */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredReviews.slice(0, limit).map((review, idx, arr) => {
              const initial = (review.author || 'C').charAt(0).toUpperCase();
              const isLast = idx === arr.length - 1;
              return (
                <article 
                  key={review.id} 
                  style={{ 
                    padding: '24px 28px', 
                    borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    background: '#ffffff',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  {/* Review Header: Author, Avatar & Certified Buyer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        background: '#0f172a', 
                        color: '#ffffff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 800, 
                        fontSize: '13px',
                        flexShrink: 0
                      }}>
                        {initial}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                            {review.author}
                          </strong>
                          <span style={{ 
                            fontSize: '11px', 
                            color: '#047857', 
                            fontWeight: 700, 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '3px', 
                            background: '#ecfdf5',
                            padding: '2px 7px',
                            borderRadius: '4px'
                          }}>
                            <CheckCircle2 size={11} color="#059669" /> Certified Buyer
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                      {review.date}
                    </div>
                  </div>

                  {/* Rating + Variant row (Amazon / Flipkart style) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '3px', 
                      background: review.rating >= 4 ? '#15803d' : review.rating === 3 ? '#d97706' : '#dc2626', 
                      color: '#ffffff', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 800
                    }}>
                      <span>{review.rating}</span>
                      <Star size={11} fill="#ffffff" color="#ffffff" />
                    </div>

                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={13} 
                          fill={i < review.rating ? "#f59e0b" : "none"} 
                          color={i < review.rating ? "#f59e0b" : "#cbd5e1"} 
                        />
                      ))}
                    </div>

                    {review.variant && (
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                        <span style={{ color: '#cbd5e1' }}>•</span> Variant: <strong style={{ color: '#334155' }}>{review.variant}</strong>
                      </span>
                    )}
                  </div>
                  
                  {/* Review Text */}
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155', margin: '2px 0 4px', whiteSpace: 'pre-line' }}>
                    "{review.text}"
                  </p>

                  {/* Customer Photos */}
                  {review.images && review.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', margin: '4px 0', overflowX: 'auto', paddingBottom: '4px' }}>
                      {catalogImages(review.images).map((url, imgIdx) => (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => setActiveModalImage(url)}
                          style={{ 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '8px', 
                            padding: 0, 
                            cursor: 'pointer', 
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#f8fafc',
                            transition: 'transform 0.15s, border-color 0.15s'
                          }}
                          aria-label={`View full customer photo ${imgIdx + 1}`}
                        >
                          <img
                            src={url}
                            alt={`Review photo ${imgIdx + 1}`}
                            loading="lazy"
                            style={{ width: '68px', height: '68px', objectFit: 'cover' }}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Footer: Helpful feedback button & Verification badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(review.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: userVoted[review.id] ? '#f1f5f9' : '#ffffff',
                        border: '1px solid',
                        borderColor: userVoted[review.id] ? '#94a3b8' : '#e2e8f0',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: userVoted[review.id] ? '#0f172a' : '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <ThumbsUp size={11} color={userVoted[review.id] ? "#0f172a" : "#64748b"} />
                      <span>Helpful ({helpfulVotes[review.id] || 0})</span>
                    </button>

                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Verified Purchase • Free Fire Store
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
          
          {/* Load More Reviews inside the bottom of the unified card */}
          {filteredReviews.length > limit && (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px', 
              background: '#fafbfc', 
              borderTop: '1px solid #f1f5f9' 
            }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setLimit((value) => value + 6)}
                style={{ borderRadius: '8px', padding: '10px 28px', fontWeight: 700, fontSize: '13px', background: '#ffffff' }}
              >
                LOAD MORE REVIEWS ({filteredReviews.length - limit} REMAINING)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trust & Guarantee Banner at Bottom of Reviews */}
      <div style={{ 
        marginTop: '48px', 
        padding: '24px 28px', 
        background: '#f8fafc', 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={18} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', fontWeight: 800 }}>100% Quality Tested</strong>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
              Every apparel piece is pre-shrunk, bio-washed and stitch-inspected before dispatch.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Truck size={18} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', fontWeight: 800 }}>Safe Pan-India Delivery</strong>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
              Shipped via trusted courier partners with end-to-end SMS tracking.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', fontWeight: 800 }}>Authentic Customer Policy</strong>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
              Zero fabricated reviews. Real customers, real photos, transparent ratings.
            </p>
          </div>
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {activeModalImage && (
        <div 
          onClick={() => setActiveModalImage(null)}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.85)', 
            zIndex: 9999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px' 
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ position: 'relative', maxWidth: '640px', width: '100%', background: '#000', borderRadius: '12px', overflow: 'hidden' }}
          >
            <button
              onClick={() => setActiveModalImage(null)}
              style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                background: 'rgba(0,0,0,0.6)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '50%', 
                width: '36px', 
                height: '36px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer' 
              }}
              aria-label="Close photo preview"
            >
              <X size={20} />
            </button>
            <img 
              src={activeModalImage} 
              alt="Enlarged customer review" 
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} 
            />
          </div>
        </div>
      )}

      {/* Verified Review Eligibility Error Modal */}
      {errorModal && (
        <div 
          onClick={() => setErrorModal(null)}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(15, 23, 42, 0.65)', 
            backdropFilter: 'blur(6px)', 
            zIndex: 9999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px' 
          }}
          role="dialog"
          aria-modal="true"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              position: 'relative', 
              maxWidth: '460px', 
              width: '100%', 
              background: '#ffffff', 
              borderRadius: '20px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              animation: 'fadeInUp 0.2s ease-out'
            }}
          >
            {/* Header close button */}
            <button
              onClick={() => setErrorModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div style={{ padding: '32px 28px' }}>
              {/* Badge & Icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: errorModal.type === 'not_logged_in' ? '#fef2f2' : errorModal.type === 'not_delivered' ? '#eff6ff' : '#fff7ed',
                  color: errorModal.type === 'not_logged_in' ? '#dc2626' : errorModal.type === 'not_delivered' ? '#2563eb' : '#ea580c',
                  border: `1px solid ${errorModal.type === 'not_logged_in' ? '#fecaca' : errorModal.type === 'not_delivered' ? '#bfdbfe' : '#fed7aa'}`
                }}>
                  {errorModal.type === 'not_logged_in' && <Lock size={24} />}
                  {errorModal.type === 'not_delivered' && <Truck size={24} />}
                  {errorModal.type === 'no_order' && <ShieldCheck size={24} />}
                </div>

                <div>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    color: errorModal.type === 'not_logged_in' ? '#b91c1c' : errorModal.type === 'not_delivered' ? '#1d4ed8' : '#c2410c',
                    background: errorModal.type === 'not_logged_in' ? '#fee2e2' : errorModal.type === 'not_delivered' ? '#dbeafe' : '#ffedd5',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    marginBottom: '4px'
                  }}>
                    {errorModal.type === 'not_logged_in' ? 'Account Sign In Required' : errorModal.type === 'not_delivered' ? 'Delivery In Progress' : 'Verified Buyer Policy'}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-h)' }}>
                    {errorModal.title}
                  </h3>
                </div>
              </div>

              {/* Message */}
              <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#475569' }}>
                {errorModal.message}
              </p>

              {/* Specific info card depending on type */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '24px',
                fontSize: '12px',
                color: '#334155',
                lineHeight: 1.5
              }}>
                {errorModal.type === 'not_logged_in' && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <ShieldCheck size={16} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <strong>Why this is required:</strong> We maintain 100% spam-free, authentic buyer reviews. Logging in allows us to verify your delivered order.
                    </span>
                  </div>
                )}
                {errorModal.type === 'not_delivered' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: 700, color: '#0f172a' }}>
                      <span>Order Number:</span>
                      <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{errorModal.orderId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b' }}>
                      <span>Current Status:</span>
                      <span style={{ 
                        fontWeight: 700, 
                        color: '#d97706',
                        background: '#fef3c7',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textTransform: 'uppercase'
                      }}>
                        {errorModal.orderStatus || 'In Transit'}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '4px' }}>
                      Once our courier marks your package as <strong>Delivered</strong>, you can write and publish your review anytime!
                    </div>
                  </div>
                )}
                {errorModal.type === 'no_order' && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <ShieldCheck size={16} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <strong>Authenticity Guarantee:</strong> Only verified customers who ordered and received this piece can review it. If you placed this order under another email, please switch accounts.
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                {errorModal.type === 'not_logged_in' && (
                  <button
                    onClick={() => {
                      setErrorModal(null);
                      navigate('/login');
                    }}
                    className="btn btn-black"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}
                  >
                    SIGN IN TO VERIFY PURCHASE
                  </button>
                )}

                {errorModal.type === 'not_delivered' && (
                  <button
                    onClick={() => {
                      setErrorModal(null);
                      navigate('/my-orders');
                    }}
                    className="btn btn-black"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}
                  >
                    TRACK MY ORDERS
                  </button>
                )}

                {errorModal.type === 'no_order' && (
                  <button
                    onClick={() => {
                      setErrorModal(null);
                      navigate('/my-orders');
                    }}
                    className="btn btn-black"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}
                  >
                    VIEW MY ORDERS
                  </button>
                )}

                <button
                  onClick={() => setErrorModal(null)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
