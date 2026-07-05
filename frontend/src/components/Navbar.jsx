import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const linkClass = 'hover:text-brand-600 transition-colors';
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b-2 border-ink/90">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-ink" onClick={() => setMenuOpen(false)}>
          <span
            className="sticker inline-flex w-9 h-9 rounded-full bg-sunshine-400 text-ink text-center items-center justify-center font-display font-bold border-2 border-ink"
            style={{ '--tilt': '-8deg' }}
          >
            C
          </span>
          CampusShare
          {isAdmin && (
            <span className="sticker bg-coral-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-ink ml-1" style={{ '--tilt': '3deg' }}>
              ADMIN
            </span>
          )}
        </Link>

        {/* Admins get a stripped-down nav — no student marketplace actions */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-ink/70">
          <Link to="/books" className={linkClass}>Browse Books</Link>
          {user && !isAdmin && <Link to="/upload" className={linkClass}>Sell a Book</Link>}
          {user && !isAdmin && <Link to="/messages" className={linkClass}>Messages</Link>}
          {user && !isAdmin && <Link to="/orders" className={linkClass}>My Orders</Link>}
          {user && !isAdmin && <Link to="/wishlist" className="hover:text-bubblegum-600 transition-colors">Wishlist</Link>}
          {user && !isAdmin && <Link to="/dashboard" className={linkClass}>Dashboard</Link>}
          {isAdmin && <Link to="/admin" className="hover:text-coral-600 transition-colors font-bold">Admin Panel</Link>}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-ink/70 hover:text-brand-600">Login</Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-brand-500 text-white px-4 py-2 rounded-full border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {!isAdmin && <NotificationBell />}
              <span className="text-sm text-ink/60">Hi, {user.name.split(' ')[0]} 👋</span>
              <button onClick={handleLogout} className="text-sm font-semibold text-ink/70 hover:text-coral-600">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile: bell (students only) + hamburger toggle */}
        <div className="md:hidden flex items-center gap-2">
          {user && !isAdmin && <NotificationBell />}
          <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-ink/15 text-ink"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {/* Compact floating dropdown, anchored to the hamburger — not a full-screen panel */}
          {menuOpen && (
            <>
              {/* Invisible backdrop to close the menu on outside tap */}
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-12 z-50 w-56 bg-white border-2 border-ink/10 rounded-2xl shadow-card p-3 space-y-1 text-sm font-semibold text-ink/80">
                <Link to="/books" className="block px-3 py-2 rounded-xl hover:bg-brand-50" onClick={() => setMenuOpen(false)}>📚 Browse Books</Link>
                {user && !isAdmin && <Link to="/upload" className="block px-3 py-2 rounded-xl hover:bg-brand-50" onClick={() => setMenuOpen(false)}>➕ Sell a Book</Link>}
                {user && !isAdmin && <Link to="/messages" className="block px-3 py-2 rounded-xl hover:bg-brand-50" onClick={() => setMenuOpen(false)}>💬 Messages</Link>}
                {user && !isAdmin && <Link to="/orders" className="block px-3 py-2 rounded-xl hover:bg-brand-50" onClick={() => setMenuOpen(false)}>🛒 My Orders</Link>}
                {user && !isAdmin && <Link to="/wishlist" className="block px-3 py-2 rounded-xl hover:bg-brand-50" onClick={() => setMenuOpen(false)}>♡ Wishlist</Link>}
                {user && !isAdmin && <Link to="/dashboard" className="block px-3 py-2 rounded-xl hover:bg-brand-50" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>}
                {user && !isAdmin && <Link to="/profile" className="block px-3 py-2 rounded-xl hover:bg-brand-50" onClick={() => setMenuOpen(false)}>👤 Profile</Link>}
                {isAdmin && <Link to="/admin" className="block px-3 py-2 rounded-xl hover:bg-coral-100 text-coral-600 font-bold" onClick={() => setMenuOpen(false)}>🛠 Admin Panel</Link>}

                <div className="pt-2 mt-1 border-t-2 border-ink/10">
                  {!user ? (
                    <div className="flex flex-col gap-2">
                      <Link to="/login" className="px-3 py-2 rounded-xl hover:bg-brand-50" onClick={() => setMenuOpen(false)}>Login</Link>
                      <Link
                        to="/register"
                        className="text-center bg-brand-500 text-white px-3 py-2 rounded-full border-2 border-ink"
                        onClick={() => setMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </div>
                  ) : (
                    <div className="px-3 py-1 flex items-center justify-between">
                      <span className="text-ink/60 font-normal text-xs">Hi, {user.name.split(' ')[0]} 👋</span>
                      <button onClick={handleLogout} className="text-coral-600">Logout</button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;