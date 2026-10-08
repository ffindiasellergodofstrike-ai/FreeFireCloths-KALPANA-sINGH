import React, { useEffect, useState, useMemo } from "react";
import { catalogImages } from '../data/catalog-media';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
        title: 'Sign in to write a review',
        message: 'Sign in to continue.'
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
          title: 'Order delivery pending',
          message: 'Reviews can be submitted once your order has been delivered.',
          orderId: result.orderId,
          orderStatus: result.orderStatus
        });
      } else {
        setErrorModal({
          isOpen: true,
          type: 'no_order',
          title: 'Purchase required',
          message: 'Only customers who have purchased and received this product can write a review.'
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
      className="product-reviews edit-reviews" 
      aria-labelledby="reviews-heading" 
      style={{ marginTop: '56px', borderTop: '1px solid var(--polish-line, #e2d9cf)', paddingTop: '32px' }}
    >
      {/* Title & Action Bar */}
      <div className="review-heading">
        <div>
          <h2 id="reviews-heading">Customer Reviews ({reviews.length})</h2>
          {reviews.length > 0 && (
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--polish-muted, #75685d)' }}>
              Average rating: <strong>{stats.avgRating}</strong> out of 5
            </p>
          )}
        </div>

        {!showForm && (
          <button 
            type="button"
            onClick={handleWriteReviewClick}
            disabled={checkingEligibility}
            className="btn btn-black"
          >
            {checkingEligibility ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', display: 'inline', marginRight: '6px' }} /> Verifying...
              </>
            ) : (
              'Write a review'
            )}
          </button>
        )}
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <div className="review-form-container">
          <div className="review-form-heading">
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Write a review</h3>
            <button 
              type="button"
              onClick={() => setShowForm(false)} 
              className="review-cancel"
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleSubmitReview}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
                Your Rating
              </label>
              <div className="review-rating-picker">
                {[1, 2, 3, 4, 5].map(num => (
                  <button 
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    aria-label={`Rate ${num} star`}
                  >
                    <Star 
                      size={24} 
                      fill={num <= rating ? "#f59e0b" : "none"} 
                      color={num <= rating ? "#f59e0b" : "#cbd5e1"} 
                    />
                  </button>
                ))}
                <span style={{ marginLeft: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--polish-ink, #372b22)', alignSelf: 'center' }}>
                  {rating === 5 ? '5 Stars — Excellent' : rating === 4 ? '4 Stars — Good' : rating === 3 ? '3 Stars — Average' : `${rating} Stars`}
                </span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
                Your review
              </label>
              <textarea 
                required
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your thoughts on the quality, comfort and fit..."
                className="form-input"
                style={{ width: '100%', minHeight: '120px' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="btn btn-black"
            >
              {submitting ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        </div>
      )}

      {/* Aggregate Rating Breakdown */}
      {reviews.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '24px', 
          alignItems: 'center',
          padding: '20px 0',
          borderBlock: '1px solid var(--polish-line, #e2d9cf)',
          marginBottom: '24px'
        }}>
          {/* Overall score */}
          <div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--polish-ink, #372b22)', lineHeight: 1 }}>
              {stats.avgRating} <span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--polish-muted, #75685d)' }}>/ 5</span>
            </div>
            <div style={{ display: 'flex', gap: '3px', margin: '8px 0 6px' }}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < Math.round(stats.avgRating) ? "#f59e0b" : "none"} 
                  color={i < Math.round(stats.avgRating) ? "#f59e0b" : "#cbd5e1"} 
                />
              ))}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--polish-muted, #75685d)' }}>
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          {/* Rating breakdown bars */}
          <div>
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
                    marginBottom: '4px', 
                    cursor: 'pointer',
                    padding: '2px 4px',
                    borderRadius: '2px'
                  }}
                  title={`Filter by ${starNum} star`}
                >
                  <span style={{ fontSize: '12px', minWidth: '40px', color: 'var(--polish-muted, #75685d)' }}>
                    {starNum} star
                  </span>
                  <div style={{ flex: 1, height: '6px', background: '#eee5d8', borderRadius: '2px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${pct}%`, 
                        height: '100%', 
                        background: '#876340', 
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--polish-muted, #75685d)', minWidth: '24px', textAlign: 'right' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Filters Bar */}
      {reviews.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setFilterRating('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '2px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: filterRating === 'all' ? 'var(--polish-accent, #67492f)' : 'var(--polish-line, #e2d9cf)',
              background: filterRating === 'all' ? 'var(--polish-accent, #67492f)' : 'transparent',
              color: filterRating === 'all' ? '#ffffff' : 'var(--polish-ink, #372b22)',
            }}
          >
            All ({reviews.length})
          </button>

          {[5, 4].map(s => stats.counts[s] > 0 && (
            <button
              key={s}
              type="button"
              onClick={() => setFilterRating(prev => prev === s ? 'all' : s)}
              style={{
                padding: '6px 14px',
                borderRadius: '2px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterRating === s ? 'var(--polish-accent, #67492f)' : 'var(--polish-line, #e2d9cf)',
                background: filterRating === s ? 'var(--polish-accent, #67492f)' : 'transparent',
                color: filterRating === s ? '#ffffff' : 'var(--polish-ink, #372b22)',
              }}
            >
              {s} Stars ({stats.counts[s]})
            </button>
          ))}

          {stats.photosCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterRating(prev => prev === 'photos' ? 'all' : 'photos')}
              style={{
                padding: '6px 14px',
                borderRadius: '2px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterRating === 'photos' ? 'var(--polish-accent, #67492f)' : 'var(--polish-line, #e2d9cf)',
                background: filterRating === 'photos' ? 'var(--polish-accent, #67492f)' : 'transparent',
                color: filterRating === 'photos' ? '#ffffff' : 'var(--polish-ink, #372b22)',
              }}
            >
              With photos ({stats.photosCount})
            </button>
          )}
        </div>
      )}

      {/* Review List or Empty State */}
      {status === "loading" ? (
        <p className="review-empty">Loading reviews…</p>
      ) : filteredReviews.length === 0 ? (
        <div className="review-empty">
          <p>{reviews.length === 0 ? "No reviews for this piece yet." : "No reviews matching the selected filter."}</p>
          {filterRating !== 'all' && (
            <button 
              type="button"
              onClick={() => setFilterRating('all')} 
              className="btn btn-outline" 
              style={{ marginTop: '12px' }}
            >
              View all reviews
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="edit-review-grid">
            {filteredReviews.slice(0, limit).map((review) => (
              <article key={review.id} className="review-entry">
                <div className="review-author">
                  <strong>{review.author}</strong>
                  <small>
                    {review.variant ? `${review.variant} · ` : ''}{review.date}
                  </small>
                </div>

                <div className="review-content">
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={13} 
                        fill={i < review.rating ? "#f59e0b" : "none"} 
                        color={i < review.rating ? "#f59e0b" : "#cbd5e1"} 
                      />
                    ))}
                  </div>

                  <p>{review.text}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="review-photos">
                      {catalogImages(review.images).map((url, imgIdx) => (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => setActiveModalImage(url)}
                          style={{ border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }}
                          aria-label={`View customer photo ${imgIdx + 1}`}
                        >
                          <img
                            src={url}
                            alt={`Review photo ${imgIdx + 1}`}
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '14px' }}>
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(review.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: userVoted[review.id] ? '#eee5d8' : 'transparent',
                        border: '1px solid var(--polish-line, #e2d9cf)',
                        borderRadius: '2px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--polish-ink, #372b22)',
                        cursor: 'pointer'
                      }}
                    >
                      <ThumbsUp size={11} />
                      <span>Helpful ({helpfulVotes[review.id] || 0})</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {filteredReviews.length > limit && (
            <div className="review-more" style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setLimit((value) => value + 6)}
              >
                Load more reviews
              </button>
            </div>
          )}
        </>
      )}

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
            style={{ position: 'relative', maxWidth: '640px', width: '100%', background: '#000', borderRadius: '4px', overflow: 'hidden' }}
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

      {/* Simplified Review Eligibility Modal */}
      {errorModal && (
        <div 
          onClick={() => setErrorModal(null)}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0, 0, 0, 0.4)', 
            backdropFilter: 'blur(2px)', 
            zIndex: 9999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px' 
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              position: 'relative', 
              maxWidth: '420px', 
              width: '100%', 
              background: '#fcfaf6', 
              borderRadius: '4px', 
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
              overflow: 'hidden',
              border: '1px solid #d6c9bd',
              padding: '28px 24px'
            }}
          >
            <button
              onClick={() => setErrorModal(null)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#75685d',
                padding: '4px'
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {errorModal.type === 'not_logged_in' ? (
              <div>
                <h3 id="review-modal-title" style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600, color: '#372b22' }}>
                  Sign in to write a review
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#75685d', lineHeight: 1.6 }}>
                  Sign in to continue.
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setErrorModal(null);
                      navigate('/login');
                    }}
                    className="btn btn-black"
                    style={{ flex: 1 }}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => setErrorModal(null)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>

                <p style={{ margin: '16px 0 0', fontSize: '13px', color: '#75685d', textAlign: 'center' }}>
                  New to Free Fire Store? <Link to="/register" onClick={() => setErrorModal(null)} style={{ color: '#372b22', fontWeight: 600, textDecoration: 'underline' }}>Create account</Link>
                </p>
              </div>
            ) : errorModal.type === 'not_delivered' ? (
              <div>
                <h3 id="review-modal-title" style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600, color: '#372b22' }}>
                  Order delivery pending
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#75685d', lineHeight: 1.6 }}>
                  Reviews can be submitted once your order has been delivered.
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setErrorModal(null);
                      navigate('/my-orders');
                    }}
                    className="btn btn-black"
                    style={{ flex: 1 }}
                  >
                    View orders
                  </button>
                  <button
                    onClick={() => setErrorModal(null)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 id="review-modal-title" style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600, color: '#372b22' }}>
                  Purchase required
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#75685d', lineHeight: 1.6 }}>
                  Only customers who have purchased and received this product can write a review.
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setErrorModal(null);
                      navigate('/my-orders');
                    }}
                    className="btn btn-black"
                    style={{ flex: 1 }}
                  >
                    View orders
                  </button>
                  <button
                    onClick={() => setErrorModal(null)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
