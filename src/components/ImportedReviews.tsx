import React, { useEffect, useState } from "react";
import { catalogImages } from '../data/catalog-media';
interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  variant: string;
  images: string[];
}
export default function ImportedReviews({ sourceId }: { sourceId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState("loading");
  const [limit, setLimit] = useState(6);
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setReviews([]);
    setLimit(6);
    fetch(`/reviews/${sourceId}.json`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Reviews unavailable");
        const data = await response.json();
        if (data.productId !== sourceId || !Array.isArray(data.reviews))
          throw new Error("Invalid reviews");
        if (!controller.signal.aborted) {
          setReviews(data.reviews);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => controller.abort();
  }, [sourceId]);
  return (
    <section className="edit-reviews" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading">Verified Customer Reviews</h2>
      {status === "loading" ? (
        <p role="status">Loading reviews…</p>
      ) : status === "error" ? (
        <p role="status">Reviews are temporarily unavailable.</p>
      ) : reviews.length === 0 ? (
        <p>No reviews for this piece yet.</p>
      ) : (
        <>
          <div className="edit-review-grid">
            {reviews.slice(0, limit).map((review) => (
              <article key={review.id}>
                <strong>{review.author}</strong>
                <span aria-label={`${review.rating} out of 5 stars`}>
                  {"★".repeat(
                    Math.max(0, Math.min(5, Math.round(review.rating))),
                  )}
                </span>
                <p>{review.text}</p>
                <small>
                  {review.variant} · {review.date}
                </small>
                <div>
                  {catalogImages(review.images).map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer">
                      <img
                        src={url}
                        alt={`Product photo from ${review.author}`}
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
          {reviews.length > limit && (
            <button
              className="edit-button edit-outline"
              onClick={() => setLimit((value) => value + 6)}
            >
              More reviews
            </button>
          )}
        </>
      )}
    </section>
  );
}
