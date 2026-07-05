import { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';

const TABS = [
  { key: 'overview', label: '📊 Overview' },
  { key: 'listings', label: '📚 Listings' },
  { key: 'orders', label: '🛒 Sales' },
  { key: 'reviews', label: '⭐ Reviews' },
  { key: 'users', label: '👥 Users' },
];

const bookStatusStyle = {
  Sold: 'bg-ink/10 text-ink/70',
  Reserved: 'bg-sunshine-100 text-sunshine-600',
  Active: 'bg-mint-100 text-mint-600',
};

const orderStatusStyle = {
  requested: 'bg-sunshine-100 text-sunshine-600',
  accepted: 'bg-brand-100 text-brand-600',
  completed: 'bg-mint-100 text-mint-600',
  declined: 'bg-coral-100 text-coral-600',
  cancelled: 'bg-ink/10 text-ink/50',
};

// Admin gets a purpose-built view of the platform — not the student marketplace UI.
// Tabs: overview stats, every listing (with moderation), every sale (who bought what
// from whom for how much), every review, and user management.
const Admin = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [statsRes, usersRes, booksRes, ordersRes, reviewsRes] = await Promise.all([
      api.get('/users/stats/overview'),
      api.get('/users'),
      api.get('/admin/books'),
      api.get('/admin/orders'),
      api.get('/admin/reviews'),
    ]);
    setStats(statsRes.data);
    setUsers(usersRes.data);
    setBooks(booksRes.data);
    setOrders(ordersRes.data);
    setReviews(reviewsRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const removeUser = async (id) => {
    if (!confirm('Remove this user? This cannot be undone.')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  const toggleApproval = async (book) => {
    await api.put(`/books/${book._id}`, { isApproved: !book.isApproved });
    load();
  };

  const deleteReview = async (id) => {
    if (!confirm('Remove this review?')) return;
    await api.delete(`/reviews/${id}`);
    load();
  };

  const bookStatus = (b) => (b.isSold ? 'Sold' : b.reservedBy ? 'Reserved' : 'Active');
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.book?.sellingPrice || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink mb-2">Admin Panel 🛠</h1>
      <p className="text-sm text-ink/50 mb-6">Platform oversight — not a marketplace account.</p>

      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b-2 border-ink/10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
              tab === t.key ? 'bg-ink text-paper border-ink' : 'bg-white text-ink/60 border-ink/10 hover:border-ink/30'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink/50">Loading platform data...</p>
      ) : (
        <>
          {tab === 'overview' && stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
                <p className="text-xs sm:text-sm text-ink/50">Total Users</p>
                <p className="text-xl sm:text-2xl font-display font-bold text-ink">{stats.totalUsers}</p>
              </div>
              <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
                <p className="text-xs sm:text-sm text-ink/50">Total Listings</p>
                <p className="text-xl sm:text-2xl font-display font-bold text-ink">{stats.totalBooks}</p>
              </div>
              <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
                <p className="text-xs sm:text-sm text-ink/50">Active</p>
                <p className="text-xl sm:text-2xl font-display font-bold text-brand-600">{stats.activeBooks}</p>
              </div>
              <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
                <p className="text-xs sm:text-sm text-ink/50">Sold</p>
                <p className="text-xl sm:text-2xl font-display font-bold text-mint-600">{stats.soldBooks}</p>
              </div>
              <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
                <p className="text-xs sm:text-sm text-ink/50">Completed Sales</p>
                <p className="text-xl sm:text-2xl font-display font-bold text-ink">{completedOrders.length}</p>
              </div>
              <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
                <p className="text-xs sm:text-sm text-ink/50">Total Sales Value</p>
                <p className="text-xl sm:text-2xl font-display font-bold text-mint-600">₹{totalRevenue}</p>
              </div>
              <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
                <p className="text-xs sm:text-sm text-ink/50">Pending Requests</p>
                <p className="text-xl sm:text-2xl font-display font-bold text-sunshine-600">{orders.filter((o) => o.status === 'requested').length}</p>
              </div>
              <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
                <p className="text-xs sm:text-sm text-ink/50">Total Reviews</p>
                <p className="text-xl sm:text-2xl font-display font-bold text-ink">{reviews.length}</p>
              </div>
            </div>
          )}

          {tab === 'listings' && (
            <>
              {/* Desktop/tablet: table */}
              <div className="hidden sm:block bg-white border-2 border-ink/10 rounded-2xl overflow-hidden shadow-card">
                <table className="w-full text-sm">
                  <thead className="bg-brand-50 text-left text-ink/50">
                    <tr>
                      <th className="p-3">Book</th>
                      <th className="p-3">Seller</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((b) => (
                      <tr key={b._id} className="border-t-2 border-ink/5">
                        <td className="p-3 font-medium text-ink">{b.title}</td>
                        <td className="p-3 text-ink/70">{b.seller?.name}</td>
                        <td className="p-3">₹{b.sellingPrice}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${bookStatusStyle[bookStatus(b)]}`}>
                            {bookStatus(b)}
                          </span>
                          {!b.isApproved && (
                            <span className="ml-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-coral-100 text-coral-600">Hidden</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button onClick={() => toggleApproval(b)} className={`font-semibold ${b.isApproved ? 'text-coral-600' : 'text-mint-600'}`}>
                            {b.isApproved ? 'Hide Listing' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: stacked cards */}
              <div className="sm:hidden space-y-3">
                {books.map((b) => (
                  <div key={b._id} className="bg-white border-2 border-ink/10 rounded-2xl p-4 shadow-card">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-ink truncate">{b.title}</p>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${bookStatusStyle[bookStatus(b)]}`}>
                        {bookStatus(b)}
                      </span>
                    </div>
                    <p className="text-sm text-ink/50 mt-1">₹{b.sellingPrice} &middot; seller: {b.seller?.name}</p>
                    <button onClick={() => toggleApproval(b)} className={`text-sm font-semibold mt-2 ${b.isApproved ? 'text-coral-600' : 'text-mint-600'}`}>
                      {b.isApproved ? 'Hide Listing' : 'Approve'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'orders' && (
            <>
              {orders.length === 0 ? (
                <p className="text-ink/50">No purchase activity yet.</p>
              ) : (
                <>
                  {/* Desktop/tablet: table */}
                  <div className="hidden sm:block bg-white border-2 border-ink/10 rounded-2xl overflow-hidden shadow-card">
                    <table className="w-full text-sm">
                      <thead className="bg-brand-50 text-left text-ink/50">
                        <tr>
                          <th className="p-3">Book</th>
                          <th className="p-3">Buyer</th>
                          <th className="p-3">Seller</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o._id} className="border-t-2 border-ink/5">
                            <td className="p-3 font-medium text-ink">{o.book?.title || '(deleted)'}</td>
                            <td className="p-3 text-ink/70">{o.buyer?.name}</td>
                            <td className="p-3 text-ink/70">{o.seller?.name}</td>
                            <td className="p-3">₹{o.book?.sellingPrice}</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${orderStatusStyle[o.status]}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-3 text-ink/50 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: stacked cards */}
                  <div className="sm:hidden space-y-3">
                    {orders.map((o) => (
                      <div key={o._id} className="bg-white border-2 border-ink/10 rounded-2xl p-4 shadow-card">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-ink truncate">{o.book?.title || '(deleted)'}</p>
                          <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${orderStatusStyle[o.status]}`}>
                            {o.status}
                          </span>
                        </div>
                        <p className="text-sm text-ink/50 mt-1">₹{o.book?.sellingPrice}</p>
                        <p className="text-sm text-ink/70 mt-1">Buyer: {o.buyer?.name} &middot; Seller: {o.seller?.name}</p>
                        <p className="text-xs text-ink/40 mt-1">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-ink/50">No reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="bg-white border-2 border-ink/10 rounded-2xl p-4 shadow-card flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-ink">{r.reviewer?.name}</p>
                        <span className="text-ink/40 text-sm">→</span>
                        <p className="text-sm text-ink/70">{r.seller?.name}</p>
                        <span className="text-ink/30 text-xs">on "{r.book?.title || '(deleted)'}"</span>
                      </div>
                      <StarRating value={r.rating} size="text-sm" />
                      {r.comment && <p className="text-sm text-ink/70 mt-1">{r.comment}</p>}
                      <p className="text-xs text-ink/40 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteReview(r._id)} className="text-coral-600 font-semibold text-sm shrink-0">
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'users' && (
            <>
              {/* Desktop/tablet: table */}
              <div className="hidden sm:block bg-white border-2 border-ink/10 rounded-2xl overflow-hidden shadow-card">
                <table className="w-full text-sm">
                  <thead className="bg-brand-50 text-left text-ink/50">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-t-2 border-ink/5">
                        <td className="p-3 font-medium text-ink">{u.name}</td>
                        <td className="p-3 text-ink/70">{u.email}</td>
                        <td className="p-3 capitalize">{u.role}</td>
                        <td className="p-3 text-right">
                          {u.role !== 'admin' && (
                            <button onClick={() => removeUser(u._id)} className="text-coral-600 font-semibold">Remove</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: stacked cards */}
              <div className="sm:hidden space-y-3">
                {users.map((u) => (
                  <div key={u._id} className="bg-white border-2 border-ink/10 rounded-2xl p-4 shadow-card">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">{u.name}</p>
                        <p className="text-sm text-ink/50 truncate">{u.email}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 capitalize">{u.role}</span>
                    </div>
                    {u.role !== 'admin' && (
                      <button onClick={() => removeUser(u._id)} className="text-coral-600 font-semibold text-sm mt-3">Remove</button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;