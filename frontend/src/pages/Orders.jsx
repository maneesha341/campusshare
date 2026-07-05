import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageUrl';

const statusStyle = {
  requested: 'bg-sunshine-100 text-sunshine-600',
  accepted: 'bg-mint-100 text-mint-600',
  completed: 'bg-ink/10 text-ink/70',
  declined: 'bg-coral-100 text-coral-600',
  cancelled: 'bg-ink/10 text-ink/50',
};

const statusLabel = {
  requested: '⏳ Pending',
  accepted: '✓ Accepted',
  completed: '✓ Completed',
  declined: 'Declined',
  cancelled: 'Cancelled',
};

// Buyer-side view of every "Request to Buy" the logged-in user has sent.
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/orders/mine');
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const cancelOrder = async (id) => {
    await api.put(`/orders/${id}`, { action: 'cancel' });
    load();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink mb-8">🛒 My Orders</h1>

      {loading ? (
        <p className="text-ink/50">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="paper-grid rounded-2xl border-2 border-dashed border-ink/15 py-16 px-6 text-center">
          <span
            className="sticker inline-block bg-mint-100 border-2 border-ink text-3xl w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ '--tilt': '-5deg' }}
          >
            🛒
          </span>
          <p className="text-ink font-semibold">No purchase requests yet</p>
          <p className="text-ink/50 text-sm mt-1 max-w-sm mx-auto">
            Find a book you want and tap "Request to Buy" on its page.
          </p>
          <Link
            to="/books"
            className="mt-5 inline-block bg-brand-500 text-white px-5 py-2.5 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
          >
            Browse the board
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="bg-white border-2 border-ink/10 rounded-2xl p-4 shadow-card flex items-center gap-4">
              <Link to={`/books/${o.book?._id}`} className="w-14 h-14 rounded-xl bg-brand-50 overflow-hidden shrink-0">
                {o.book?.images?.[0] && <img src={getImageUrl(o.book.images[0])} alt={o.book.title} className="w-full h-full object-cover" />}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/books/${o.book?._id}`} className="font-semibold text-ink truncate hover:text-brand-600 block">
                  {o.book?.title}
                </Link>
                <p className="text-sm text-ink/50">₹{o.book?.sellingPrice} &middot; seller: {o.seller?.name}</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[o.status]}`}>
                {statusLabel[o.status]}
              </span>
              {['requested', 'accepted'].includes(o.status) && (
                <button onClick={() => cancelOrder(o._id)} className="text-sm font-semibold text-coral-600 shrink-0">
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;