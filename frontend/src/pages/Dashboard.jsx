import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageUrl';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMine = async () => {
    setLoading(true);
    const [booksRes, ordersRes] = await Promise.all([
      api.get('/books/mine/all'),
      api.get('/orders/seller'),
    ]);
    setBooks(booksRes.data);
    setOrders(ordersRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchMine(); }, []);

  const markSold = async (id, isSold) => {
    await api.put(`/books/${id}`, { isSold: !isSold });
    fetchMine();
  };

  const remove = async (id) => {
    if (!confirm('Delete this listing permanently?')) return;
    await api.delete(`/books/${id}`);
    fetchMine();
  };

  const handleOrderAction = async (orderId, action) => {
    await api.put(`/orders/${orderId}`, { action });
    fetchMine();
  };

  const active = books.filter((b) => !b.isSold);
  const sold = books.filter((b) => b.isSold);
  const pendingRequests = orders.filter((o) => o.status === 'requested');
  const acceptedRequests = orders.filter((o) => o.status === 'accepted');

  const orderStatusStyle = {
    requested: 'bg-sunshine-100 text-sunshine-600',
    accepted: 'bg-mint-100 text-mint-600',
    completed: 'bg-ink/10 text-ink/70',
    declined: 'bg-coral-100 text-coral-600',
    cancelled: 'bg-ink/10 text-ink/50',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink">Seller Dashboard</h1>
        <Link
          to="/upload"
          className="inline-block text-center bg-brand-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
        >
          + Sell a Book
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
        <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
          <p className="text-xs sm:text-sm text-ink/50">Total</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-ink">{books.length}</p>
        </div>
        <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
          <p className="text-xs sm:text-sm text-ink/50">Active</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-brand-600">{active.length}</p>
        </div>
        <div className="bg-white border-2 border-ink/10 rounded-2xl p-4 sm:p-5 shadow-card">
          <p className="text-xs sm:text-sm text-ink/50">Sold</p>
          <p className="text-xl sm:text-2xl font-display font-bold text-mint-600">{sold.length}</p>
        </div>
      </div>

      {(pendingRequests.length > 0 || acceptedRequests.length > 0) && (
        <div className="mb-8 sm:mb-10">
          <h2 className="text-lg font-display font-semibold text-ink mb-4">🛒 Purchase Requests</h2>
          <div className="space-y-3">
            {[...pendingRequests, ...acceptedRequests].map((o) => (
              <div key={o._id} className="bg-white border-2 border-ink/10 rounded-2xl p-4 shadow-card flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 rounded-xl bg-brand-50 overflow-hidden shrink-0">
                  {o.book?.images?.[0] && <img src={getImageUrl(o.book.images[0])} alt={o.book.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">{o.book?.title}</p>
                  <p className="text-sm text-ink/50">from {o.buyer?.name} &middot; ₹{o.book?.sellingPrice}</p>
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${orderStatusStyle[o.status]}`}>
                  {o.status}
                </span>
                <div className="flex items-center gap-3 text-sm font-semibold shrink-0">
                  {o.status === 'requested' && (
                    <>
                      <button onClick={() => handleOrderAction(o._id, 'accept')} className="text-mint-600">Accept</button>
                      <button onClick={() => handleOrderAction(o._id, 'decline')} className="text-coral-600">Decline</button>
                    </>
                  )}
                  {o.status === 'accepted' && (
                    <>
                      <button onClick={() => handleOrderAction(o._id, 'complete')} className="text-mint-600">Mark Completed</button>
                      <button onClick={() => handleOrderAction(o._id, 'cancel')} className="text-coral-600">Cancel</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-ink/50">Loading your listings...</p>
      ) : books.length === 0 ? (
        <p className="text-ink/50">You haven't listed any books yet.</p>
      ) : (
        <>
          {/* Desktop/tablet: table */}
          <div className="hidden sm:block bg-white border-2 border-ink/10 rounded-2xl overflow-hidden shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 text-left text-ink/50">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Views</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b._id} className="border-t-2 border-ink/5">
                    <td className="p-3 font-medium text-ink">{b.title}</td>
                    <td className="p-3">₹{b.sellingPrice}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${b.isSold ? 'bg-ink/10 text-ink/70' : 'bg-mint-100 text-mint-600'}`}>
                        {b.isSold ? 'Sold' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3">{b.views}</td>
                    <td className="p-3 text-right space-x-3 whitespace-nowrap">
                      <Link to={`/edit/${b._id}`} className="text-brand-600 font-semibold">Edit</Link>
                      <button onClick={() => markSold(b._id, b.isSold)} className="text-ink/70 font-semibold">
                        {b.isSold ? 'Mark Active' : 'Mark Sold'}
                      </button>
                      <button onClick={() => remove(b._id)} className="text-coral-600 font-semibold">Delete</button>
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
                  <p className="font-semibold text-ink">{b.title}</p>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${b.isSold ? 'bg-ink/10 text-ink/70' : 'bg-mint-100 text-mint-600'}`}>
                    {b.isSold ? 'Sold' : 'Active'}
                  </span>
                </div>
                <p className="text-sm text-ink/50 mt-1">₹{b.sellingPrice} &middot; {b.views} views</p>
                <div className="flex items-center gap-4 mt-3 text-sm font-semibold">
                  <Link to={`/edit/${b._id}`} className="text-brand-600">Edit</Link>
                  <button onClick={() => markSold(b._id, b.isSold)} className="text-ink/70">
                    {b.isSold ? 'Mark Active' : 'Mark Sold'}
                  </button>
                  <button onClick={() => remove(b._id)} className="text-coral-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;