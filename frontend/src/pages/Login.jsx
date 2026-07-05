import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] paper-grid flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span
            className="sticker inline-block bg-sunshine-400 border-2 border-ink text-ink text-xs font-bold px-3 py-1.5 rounded-full mb-4"
            style={{ '--tilt': '-3deg' }}
          >
            👋 good to see you again
          </span>
          <h1 className="text-3xl font-display font-semibold text-ink">Welcome back</h1>
        </div>

        <div className="bg-white border-2 border-ink/10 rounded-2xl shadow-card p-6 sm:p-8">
          {error && <p className="bg-coral-100 text-coral-600 text-sm font-medium rounded-xl px-3 py-2 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-ink/80">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/80">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors"
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-brand-500 text-white py-2.5 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-sm text-ink/50 mt-5 text-center">
          Don't have an account? <Link to="/register" className="text-brand-600 font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;