import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import SellerReviews from '../components/SellerReviews';
import { getImageUrl } from '../utils/imageUrl';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [myOrder, setMyOrder] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const loadBook = () => api.get(`/books/${id}`).then((res) => setBook(res.data));

  useEffect(() => {
    loadBook();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (user) {
      api.get(`/orders/mine/${id}`).then((res) => setMyOrder(res.data));
    }
  }, [id, user]);

  const toggleWishlist = async () => {
    if (!user) return navigate('/login');
    if (inWishlist) {
      await api.delete(`/wishlist/${id}`);
      setInWishlist(false);
    } else {
      await api.post(`/wishlist/${id}`);
      setInWishlist(true);
    }
  };

  const handleRequestToBuy = async () => {
    if (!user) return navigate('/login');
    setOrderError('');
    setRequesting(true);
    try {
      const { data } = await api.post('/orders', { bookId: id });
      setMyOrder(data);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Could not send request');
    } finally {
      setRequesting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!myOrder) return;
    await api.put(`/orders/${myOrder._id}`, { action: 'cancel' });
    setMyOrder(null);
    loadBook();
  };

  if (!book) return <div className="text-center py-20 text-ink/50">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid md:grid-cols-2 gap-8 md:gap-10">
      <div>
        <div className="aspect-[4/3] bg-brand-50 rounded-2xl overflow-hidden border-2 border-ink/10">
          {book.images?.[activeImg] ? (
            <img src={getImageUrl(book.images[activeImg])} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/40">No image available</div>
          )}
        </div>
        {book.images?.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {book.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImg ? 'border-brand-500' : 'border-transparent'}`}>
                <img src={getImageUrl(img)} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink">{book.title}</h1>
        <p className="text-ink/50 mt-1">{book.author && `by ${book.author}`}</p>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="text-2xl sm:text-3xl font-display font-bold text-brand-600">₹{book.sellingPrice}</span>
          {book.originalPrice > book.sellingPrice && (
            <span className="text-ink/40 line-through">₹{book.originalPrice}</span>
          )}
          {book.isSold && <span className="bg-ink text-paper text-xs font-bold px-2.5 py-1 rounded-full border-2 border-ink">SOLD</span>}
          {!book.isSold && book.reservedBy && (
            <span className="bg-sunshine-400 text-ink text-xs font-bold px-2.5 py-1 rounded-full border-2 border-ink">
              RESERVED
            </span>
          )}
        </div>

        {/* Request-to-buy flow: no payment, just a request/accept handshake between buyer and seller */}
        {user && !isAdmin && book.seller && user._id !== book.seller._id && !book.isSold && (
          <div className="mt-4">
            {orderError && <p className="text-coral-600 text-sm font-medium mb-2">{orderError}</p>}

            {myOrder?.status === 'requested' && (
              <div className="flex items-center gap-3">
                <span className="sticker bg-sunshine-100 border-2 border-ink text-ink text-sm font-semibold px-4 py-2 rounded-full" style={{ '--tilt': '-2deg' }}>
                  ⏳ Request pending
                </span>
                <button onClick={handleCancelRequest} className="text-sm text-coral-600 font-semibold">Cancel</button>
              </div>
            )}

            {myOrder?.status === 'accepted' && (
              <span className="sticker inline-block bg-mint-100 border-2 border-ink text-mint-600 text-sm font-semibold px-4 py-2 rounded-full" style={{ '--tilt': '2deg' }}>
                ✓ Accepted — coordinate pickup with the seller in chat
              </span>
            )}

            {myOrder?.status === 'completed' && (
              <span className="sticker inline-block bg-ink text-paper text-sm font-semibold px-4 py-2 rounded-full" style={{ '--tilt': '-2deg' }}>
                ✓ Purchase completed
              </span>
            )}

            {(!myOrder || myOrder.status === 'declined' || myOrder.status === 'cancelled') && (
              book.reservedBy ? (
                <p className="text-sm text-ink/50">This book is reserved for another buyer right now.</p>
              ) : (
                <button
                  onClick={handleRequestToBuy}
                  disabled={requesting}
                  className="bg-mint-500 text-white px-6 py-3 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-mint-600 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                >
                  {requesting ? 'Sending request...' : '🛒 Request to Buy'}
                </button>
              )
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-6 text-sm">
          <div className="bg-brand-50 rounded-xl p-3"><span className="text-ink/50">Department</span><p className="font-semibold text-ink">{book.department}</p></div>
          <div className="bg-brand-50 rounded-xl p-3"><span className="text-ink/50">Semester</span><p className="font-semibold text-ink">{book.semester}</p></div>
          <div className="bg-brand-50 rounded-xl p-3"><span className="text-ink/50">Subject</span><p className="font-semibold text-ink">{book.subject}</p></div>
          <div className="bg-brand-50 rounded-xl p-3"><span className="text-ink/50">Condition</span><p className="font-semibold text-ink">{book.condition}</p></div>
        </div>

        {book.description && (
          <div className="mt-6">
            <h3 className="font-semibold mb-1 text-ink">Description</h3>
            <p className="text-ink/70 text-sm whitespace-pre-line">{book.description}</p>
          </div>
        )}

        <div className="mt-8 border-t-2 border-ink/10 pt-6">
          <h3 className="font-semibold mb-2 text-ink">Seller Details</h3>
          <p className="text-sm text-ink/80">{book.seller?.name}</p>
          <p className="text-sm text-ink/50">{book.seller?.college}</p>
          {book.seller?.numReviews > 0 ? (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={book.seller.rating} size="text-sm" />
              <span className="text-xs text-ink/50">{book.seller.rating} ({book.seller.numReviews} review{book.seller.numReviews > 1 ? 's' : ''})</span>
            </div>
          ) : (
            <p className="text-xs text-ink/40 mt-1">No reviews yet</p>
          )}
          {user ? (
            <div className="mt-3 space-y-1 text-sm">
              {book.seller?.email && <p>📧 {book.seller.email}</p>}
              {book.seller?.phone && <p>📞 {book.seller.phone}</p>}
            </div>
          ) : (
            <p className="text-sm text-brand-600 mt-2">Login to view contact details</p>
          )}

          {user && !isAdmin && book.seller && user._id !== book.seller._id && (
            <Link
              to={`/chat/${book._id}/${book.seller._id}`}
              className="mt-4 inline-flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
            >
              💬 Message Seller
            </Link>
          )}
        </div>

        {book.seller && <SellerReviews sellerId={book.seller._id} bookId={book._id} />}

        {!isAdmin && (
          <button
            onClick={toggleWishlist}
            className="mt-6 w-full border-2 border-ink text-ink py-2.5 rounded-full font-semibold hover:bg-bubblegum-100 hover:text-bubblegum-600 transition-colors"
          >
            {inWishlist ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookDetail;