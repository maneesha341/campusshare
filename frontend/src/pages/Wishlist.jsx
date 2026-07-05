import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/wishlist').then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink">My Wishlist</h1>
        {items.length > 0 && (
          <span
            className="sticker bg-bubblegum-100 border-2 border-ink text-bubblegum-600 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ '--tilt': '4deg' }}
          >
            {items.length} saved
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-ink/50">Loading...</p>
      ) : items.length === 0 ? (
        <div className="paper-grid rounded-2xl border-2 border-dashed border-ink/15 py-16 px-6 text-center">
          <span
            className="sticker inline-block bg-bubblegum-100 border-2 border-ink text-3xl w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ '--tilt': '-6deg' }}
          >
            ♡
          </span>
          <p className="text-ink font-semibold">Your wishlist is empty</p>
          <p className="text-ink/50 text-sm mt-1 max-w-sm mx-auto">
            Tap the heart on any book to pin it here for later.
          </p>
          <Link
            to="/books"
            className="mt-5 inline-block bg-brand-500 text-white px-5 py-2.5 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
          >
            Browse the board
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item) => item.book && <BookCard key={item._id} book={item.book} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;