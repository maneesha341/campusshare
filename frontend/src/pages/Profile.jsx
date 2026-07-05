import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', college: user?.college || '',
    department: user?.department || '', semester: user?.semester || '', password: '',
  });
  const [message, setMessage] = useState('');

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.put('/auth/me', form);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink mb-6">👤 My Profile</h1>
      <div className="bg-white border-2 border-ink/10 rounded-2xl shadow-card p-5 sm:p-8">
        {message && <p className="bg-brand-50 text-brand-700 text-sm font-medium rounded-xl px-3 py-2 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink/80">Name</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)}
              className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-sm font-semibold text-ink/80">Department</label>
              <input value={form.department} onChange={(e) => update('department', e.target.value)}
                className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink/80">Semester</label>
              <input type="number" value={form.semester} onChange={(e) => update('semester', e.target.value)}
                className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink/80">New Password (optional)</label>
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)}
              className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" placeholder="Leave blank to keep current" />
          </div>
          <button className="w-full bg-brand-500 text-white py-2.5 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;