import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const conditionStyle = {
  New: 'bg-mint-100 text-mint-600',
  Good: 'bg-brand-100 text-brand-600',
  Fair: 'bg-sunshine-100 text-sunshine-600',
};

const BookCard = ({ book }) => {
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/books/${book._id}`}
      className="group bg-white rounded-2xl border-2 border-ink/10 overflow-hidden hover:border-ink/90 hover:-translate-y-1 transition-all duration-150 shadow-card"
    >
      <div className="aspect-[4/3] bg-brand-50 overflow-hidden relative">
        {book.images?.[0] ? (
          <img
            src={getImageUrl(book.images[0])}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-300 text-sm font-medium">No image</div>
        )}
        {book.isSold && (
          <span className="absolute top-2 left-2 bg-ink text-paper text-xs font-bold px-2.5 py-1 rounded-full border-2 border-ink">SOLD</span>
        )}
        {!book.isSold && book.reservedBy && (
          <span className="absolute top-2 left-2 bg-sunshine-400 text-ink text-xs font-bold px-2.5 py-1 rounded-full border-2 border-ink">RESERVED</span>
        )}
        {/* Signature price-tag sticker, pinned to the corner of every listing */}
        <div
          className="sticker absolute -bottom-1 -right-1 bg-sunshine-400 border-2 border-ink rounded-xl px-3 py-1.5"
          style={{ '--tilt': '-4deg' }}
        >
          <span className="font-display font-bold text-ink text-lg leading-none">₹{book.sellingPrice}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-ink truncate">{book.title}</h3>
        <p className="text-sm text-ink/50 truncate">{book.subject} &middot; Sem {book.semester}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            {book.originalPrice > book.sellingPrice && (
              <span className="text-xs text-ink/40 line-through">₹{book.originalPrice}</span>
            )}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionStyle[book.condition] || 'bg-gray-100 text-ink/80'}`}>
            {book.condition}
          </span>
        </div>
        {discount > 0 && <p className="text-xs text-mint-600 font-medium mt-1.5">{discount}% off original price</p>}
      </div>
    </Link>
  );
};

export default BookCard;