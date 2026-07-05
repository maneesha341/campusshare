import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import Filters from '../components/Filters';

const BookList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchBooks = async (targetPage = 1) => {
    setLoading(true);
    const params = { page: targetPage, limit: 12, keyword, sort, ...filters };
    Object.keys(params).forEach((k) => (params[k] === '' || params[k] === undefined) && delete params[k]);
    const { data } = await api.get('/books', { params });
    setBooks(data.books);
    setPage(data.page);
    setPages(data.pages);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks(1);
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(1);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== '' && v !== undefined).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink mb-6">Browse the Board 📌</h1>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by title, subject, or author..."
          className="flex-1 border-2 border-ink/15 rounded-full px-4 py-2.5 focus:border-brand-400 focus:outline-none transition-colors"
        />
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 sm:flex-none border-2 border-ink/15 rounded-full px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors text-sm"
          >
            <option value="">Sort: Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
          <button className="bg-brand-500 text-white px-6 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all">
            Search
          </button>
        </div>
      </form>

      {/* Mobile-only filter toggle */}
      <button
        onClick={() => setShowFilters((s) => !s)}
        className="md:hidden w-full mb-4 flex items-center justify-between border-2 border-ink/15 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink"
      >
        <span>🔎 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
        <span>{showFilters ? '▲' : '▼'}</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          <Filters filters={filters} setFilters={setFilters} onApply={() => { fetchBooks(1); setShowFilters(false); }} />
        </div>

        <div className="md:col-span-3">
          {loading ? (
            <p className="text-ink/50">Loading books...</p>
          ) : books.length === 0 ? (
            <p className="text-ink/50">No books match your search. Try different filters.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {books.map((b) => <BookCard key={b._id} book={b} />)}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center flex-wrap gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchBooks(p)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold border-2 ${
                        p === page ? 'bg-brand-500 text-white border-ink' : 'bg-white border-ink/15 text-ink/70'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;