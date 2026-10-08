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
    <section className="edit-reviews product-reviews" aria-labelledby="reviews-heading">
      <div className="review-heading">
        <h2 id="reviews-heading">Verified Customer Reviews</h2>
        {isEligible && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-outline">
            <MessageSquare size={16} /> Write a review
          </button>
        )}
      </div>

      {showForm && (
        <div className="review-form-container">
          <div className="review-form-heading">
            <h3>Share your experience</h3>
            <button onClick={() => setShowForm(false)} className="review-cancel">Cancel</button>
          </div>
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <span className="form-label" id="review-rating-label">Rating</span>
              <div className="review-rating-picker" role="group" aria-labelledby="review-rating-label">
                {[1, 2, 3, 4, 5].map(num => (
                  <button key={num} type="button" onClick={() => setRating(num)} aria-label={`${num} out of 5 stars`} aria-pressed={rating === num}>
                    <Star size={22} fill={num <= rating ? "currentColor" : "none"} color={num <= rating ? "currentColor" : "#c4b6a8"} />
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="review-text">Your review</label>
              <textarea id="review-text" className="form-input" required value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="What did you think of this product? Mention the fit, material and quality..." />
            </div>
            <button type="submit" disabled={submitting} className="btn btn-black">
              {submitting ? 'Submitting...' : <><Send size={16} /> Submit review</>}
            </button>
          </form>
        </div>
      )}

      {status === "loading" ? (
        <p role="status">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <div className="review-empty">
          <p>No reviews for this piece yet.</p>
          {user && !isEligible && (
            <p className="review-note">Only customers who have purchased and received this product can write a review.</p>
          )}
        </div>
      ) : (
        <>
          <div className="edit-review-grid">
            {reviews.slice(0, limit).map((review) => (
              <article key={review.id} className="review-entry">
                <div className="review-author">
                  <strong>{review.author}</strong>
                  <span className="review-verified"><CheckCircle2 size={12} /> Verified purchase</span>
                  <small>{review.variant ? `${review.variant} · ` : ''}{review.date}</small>
                </div>
                <div className="review-content">
                  <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} color={i < review.rating ? "currentColor" : "#c4b6a8"} />
                    ))}
                  </div>
                  <p>{review.text}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="review-photos">
                      {catalogImages(review.images).map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noreferrer">
                          <img src={url} alt={`Review photo ${idx + 1}`} loading="lazy" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          {reviews.length > limit && (
            <div className="review-more">
              <button className="btn btn-outline" onClick={() => setLimit((value) => value + 6)}>Load more reviews</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
