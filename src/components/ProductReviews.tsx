import React, { useEffect, useState } from "react";
import { catalogImages } from '../data/catalog-media';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

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

export default function ProductReviews({ productId }: { productId: number }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState("loading");
  const [limit, setLimit] = useState(6);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleOrderId, setEligibleOrderId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    // 1. Fetch Imported Reviews from JSON
    const controller = new AbortController();
    let imported: Review[] = [];

    const fetchImported = async () => {
      try {
        const response = await fetch(`/reviews/${productId}.json`, { signal: controller.signal });
        if (response.ok) {
          const data = await response.json();
          if (data.productId === productId && Array.isArray(data.reviews)) {
            imported = data.reviews.map((r: any) => ({ ...r, isReal: false }));
          }
        }
      } catch (e) {
        console.warn("Imported reviews fetch failed or not found");
      }
    };

    // 2. Fetch Real Reviews from Firestore
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeReal = onSnapshot(q, (snapshot) => {
      const realReviews = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          author: data.userName || 'Anonymous',
          rating: data.rating,
          date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
          text: data.text,
          isReal: true
        } as Review;
      });

      setReviews([...realReviews, ...imported]);
      setStatus("ready");
    }, (err) => {
      console.error("Real reviews fetch error:", err);
      // Fallback to just imported if real fails
      setReviews(imported);
      setStatus("ready");
    });

    fetchImported();

    return () => {
      controller.abort();
      unsubscribeReal();
    };
  }, [productId]);

  useEffect(() => {
    // 3. Check Eligibility (User has delivered order for this product)
    if (!user) {
      setIsEligible(false);
      return;
    }

    const checkEligibility = async () => {
      try {
        // Query orders for this user that are 'Delivered'
        // Note: Checking case-insensitive or common variations
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          where('status', 'in', ['Delivered', 'delivered', 'DELIVERED'])
        );
        
        const querySnapshot = await getDocs(q);
        let found = false;
        let orderId = null;

        querySnapshot.forEach((doc) => {
          const order = doc.data();
          if (order.items && Array.isArray(order.items)) {
            const hasProduct = order.items.some((item: any) => Number(item.id) === productId);
            if (hasProduct) {
              found = true;
              orderId = doc.id;
            }
          }
        });

        setIsEligible(found);
        setEligibleOrderId(orderId);
      } catch (err) {
        console.error("Eligibility check failed:", err);
      }
    };

    checkEligibility();
  }, [user, productId]);

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

      toast.success("Thank you! Your review has been published.");
      setShowForm(false);
      setReviewText("");
    } catch (err) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="edit-reviews" aria-labelledby="reviews-heading" style={{ marginTop: '64px', borderTop: '1px solid var(--border)', paddingTop: '48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 id="reviews-heading" style={{ margin: 0, fontFamily: 'var(--font-h)', fontSize: '20px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Verified Customer Reviews
          </h2>
          <div style={{ width: '40px', height: '2px', background: 'var(--accent)', marginTop: '8px' }}></div>
        </div>

        {isEligible && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-black btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <MessageSquare size={16} /> WRITE A REVIEW
          </button>
        )}
      </div>

      {showForm && (
        <div className="review-form-container" style={{ background: '#f8fafc', padding: '32px', borderRadius: '16px', marginBottom: '48px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-h)' }}>SHARE YOUR EXPERIENCE</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>CANCEL</button>
          </div>
          
          <form onSubmit={handleSubmitReview}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Rating</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(num => (
                  <button 
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star 
                      size={24} 
                      fill={num <= rating ? "var(--black)" : "none"} 
                      color={num <= rating ? "var(--black)" : "#cbd5e1"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Your Review</label>
              <textarea 
                required
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="What did you think of this product? Mention the fit, material and quality..."
                style={{ 
                  width: '100%', 
                  minHeight: '120px', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: '1px solid #cbd5e1', 
                  background: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="btn btn-black"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {submitting ? 'SUBMITTING...' : <><Send size={16} /> SUBMIT REVIEW</>}
            </button>
          </form>
        </div>
      )}

      {status === "loading" ? (
        <p role="status">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fff', border: '1px dashed var(--border)', borderRadius: '12px' }}>
          <p style={{ color: 'var(--gray)', margin: 0 }}>No reviews for this piece yet.</p>
          {user && !isEligible && (
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Only customers who have purchased and received this product can write a review.</p>
          )}
        </div>
      ) : (
        <>
          <div className="edit-review-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {reviews.slice(0, limit).map((review) => (
              <article 
                key={review.id} 
                style={{ 
                  padding: '24px', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px',
                  background: '#fff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '15px', color: 'var(--dark)' }}>{review.author}</strong>
                    <span style={{ fontSize: '10px', color: '#166534', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <CheckCircle2 size={10} /> VERIFIED PURCHASE
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < review.rating ? "var(--black)" : "none"} color={i < review.rating ? "var(--black)" : "#cbd5e1"} />
                    ))}
                  </div>
                </div>
                
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', marginBottom: '16px' }}>{review.text}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <small style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: 600 }}>
                    {review.variant ? `${review.variant} · ` : ''}{review.date}
                  </small>
                </div>

                {review.images && review.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {catalogImages(review.images).map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noreferrer" style={{ flexShrink: 0 }}>
                        <img
                          src={url}
                          alt={`Review photo ${idx + 1}`}
                          loading="lazy"
                          style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
          
          {reviews.length > limit && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                className="btn btn-outline"
                onClick={() => setLimit((value) => value + 6)}
              >
                LOAD MORE REVIEWS
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
