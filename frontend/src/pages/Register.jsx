import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', college: '', department: '', semester: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] paper-grid flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span
            className="sticker inline-block bg-mint-100 border-2 border-ink text-mint-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4"
            style={{ '--tilt': '3deg' }}
          >
            📌 join the board
          </span>
          <h1 className="text-3xl font-display font-semibold text-ink">Create your account</h1>
        </div>

        <div className="bg-white border-2 border-ink/10 rounded-2xl shadow-card p-6 sm:p-8">
          {error && <p className="bg-coral-100 text-coral-600 text-sm font-medium rounded-xl px-3 py-2 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-ink/80">Full Name</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)}
                className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/80">Email</label>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/80">Password</label>
              <input type="password" required minLength={6} value={form.password} onChange={(e) => update('password', e.target.value)}
                className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-ink/80">Phone</label>
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink/80">College</label>
                <input value={form.college} onChange={(e) => update('college', e.target.value)}
                  className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-ink/80">Department</label>
                <input value={form.department} onChange={(e) => update('department', e.target.value)}
                  className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink/80">Semester</label>
                <input type="number" min={1} max={8} value={form.semester} onChange={(e) => update('semester', e.target.value)}
                  className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full bg-brand-500 text-white py-2.5 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </div>

        <p className="text-sm text-ink/50 mt-5 text-center">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;