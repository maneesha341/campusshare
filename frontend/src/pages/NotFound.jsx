import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[calc(100vh-4rem)] paper-grid flex flex-col items-center justify-center text-center px-4">
    <span
      className="sticker inline-block bg-coral-100 border-2 border-ink text-coral-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4"
      style={{ '--tilt': '-4deg' }}
    >
      🔍 nothing pinned here
    </span>
    <h1 className="text-7xl sm:text-8xl font-display font-bold text-ink">404</h1>
    <p className="text-ink/50 mt-2">This page must have fallen off the board.</p>
    <Link
      to="/"
      className="mt-6 bg-brand-500 text-white px-6 py-3 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all inline-block"
    >
      Go back home
    </Link>
  </div>
);

export default NotFound;