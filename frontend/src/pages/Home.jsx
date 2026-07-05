import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';

const Home = () => {
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    api.get('/books?limit=8&sort=newest').then((res) => setRecent(res.data.books));
    api.get('/books?limit=8&sort=popular').then((res) => setPopular(res.data.books));
  }, []);

  return (
    <div>
      {/* Hero — a campus notice board: torn tags, sticky notes, hand-pinned energy */}
      <section className="relative overflow-hidden paper-grid torn-edge pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="max-w-3xl">
            <span
              className="sticker inline-block bg-sunshine-400 border-2 border-ink text-ink text-xs font-bold px-3 py-1.5 rounded-full mb-6"
              style={{ '--tilt': '-4deg' }}
            >
              📌 pinned by students, for students
            </span>

            <h1 className="text-5xl sm:text-6xl font-display font-semibold tracking-tight text-ink leading-[1.05]">
              Your senior's old textbook
              <br />
              is someone's <span className="text-brand-500 italic">semester saver.</span>
            </h1>

            <p className="mt-6 text-lg text-ink/70 max-w-xl">
              Stop paying full price for books you'll use for one semester. Browse
              what's on the board, or pin your own books for the next batch to find.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/books"
                className="bg-ink text-paper font-semibold px-7 py-3.5 rounded-full border-2 border-ink shadow-sticker hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                Browse the board
              </Link>
              <Link
                to="/upload"
                className="bg-white text-ink font-semibold px-7 py-3.5 rounded-full border-2 border-ink hover:bg-brand-50 hover:-translate-y-0.5 transition-all"
              >
                Pin your books &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Floating sticky-note price tags — decorative, signature element */}
        <div className="hidden lg:block absolute top-16 right-16 sticker bg-mint-100 border-2 border-ink rounded-2xl px-5 py-4 w-40" style={{ '--tilt': '6deg' }}>
          <p className="text-xs font-semibold text-mint-600">Data Structures</p>
          <p className="font-display text-xl font-bold text-ink">₹250</p>
          <p className="text-[11px] text-ink/50">was ₹650</p>
        </div>
        <div className="hidden lg:block absolute bottom-6 right-40 sticker bg-bubblegum-100 border-2 border-ink rounded-2xl px-5 py-4 w-36" style={{ '--tilt': '-5deg' }}>
          <p className="text-xs font-semibold text-bubblegum-600">Condition</p>
          <p className="font-display text-lg font-bold text-ink">Good ✓</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Fresh on the board
            <span className="sticker inline-block bg-coral-100 border-2 border-ink text-coral-600 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ '--tilt': '4deg' }}>NEW</span>
          </h2>
          <Link to="/books" className="text-brand-600 text-sm font-semibold hover:text-brand-700">View all &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {recent.map((b) => <BookCard key={b._id} book={b} />)}
        </div>
        {recent.length === 0 && <p className="text-ink/50">No listings yet — be the first to pin a book!</p>}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Most wanted</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {popular.map((b) => <BookCard key={b._id} book={b} />)}
        </div>
      </section>
    </div>
  );
};

export default Home;