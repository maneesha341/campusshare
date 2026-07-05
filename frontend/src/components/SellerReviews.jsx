import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

// Shows a seller's rating + review list for a given book listing, and lets the
// logged-in buyer (if not the seller, and if they haven't already) leave one review per book.
const SellerReviews = ({ sellerId, bookId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formRating, setFormRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const reviewsRes = await api.get(`/reviews/seller/${sellerId}`);
    setReviews(reviewsRes.data);
    if (user) {
      const mineRes = await api.get(`/reviews/mine/${bookId}`);
      setMyReview(mineRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [sellerId, bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formRating === 0) {
      setError('Pick a star rating first');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/reviews', { sellerId, bookId, rating: formRating, comment });
      setFormRating(0);
      setComment('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const canReview = user && user._id !== sellerId && !myReview;

  return (
    <div className="mt-8 border-t-2 border-ink/10 pt-6">
      <h3 className="font-semibold text-ink mb-3">Reviews {reviews.length > 0 && `(${reviews.length})`}</h3>

      {loading ? (
        <p className="text-sm text-ink/50">Loading reviews...</p>
      ) : (
        <>
          {reviews.length === 0 && !canReview && (
            <p className="text-sm text-ink/50">No reviews yet.</p>
          )}

          <div className="space-y-3 mb-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-brand-50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{r.reviewer?.name || 'Anonymous'}</p>
                  <StarRating value={r.rating} size="text-xs" />
                </div>
                {r.comment && <p className="text-sm text-ink/70 mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>

          {myReview && (
            <div className="bg-mint-100 rounded-xl p-3 text-sm text-mint-600 font-medium">
              ✓ You rated this seller {myReview.rating} star{myReview.rating > 1 ? 's' : ''} for this listing.
            </div>
          )}

          {canReview && (
            <form onSubmit={handleSubmit} className="bg-white border-2 border-ink/10 rounded-2xl p-4 shadow-card">
              <p className="text-sm font-semibold text-ink mb-2">Rate this seller</p>
              <StarRating value={formRating} onChange={setFormRating} size="text-2xl" />
              {error && <p className="text-coral-600 text-xs mt-2">{error}</p>}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional: how was the transaction?"
                rows={2}
                className="mt-3 w-full border-2 border-ink/15 rounded-xl px-3 py-2 text-sm focus:border-brand-400 focus:outline-none transition-colors"
              />
              <button
                disabled={submitting}
                className="mt-3 bg-brand-500 text-white px-4 py-2 rounded-full text-sm font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 disabled:opacity-60 transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default SellerReviews;