import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

// Used for both "Sell a Book" (create) and "Edit Listing" (update) via route param :id
const UploadBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', author: '', subject: '', department: '', semester: '',
    condition: 'Good', originalPrice: '', sellingPrice: '', description: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      images.forEach((img) => data.append('images', img));

      if (id) {
        await api.put(`/books/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/books', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Listing' : 'Sell a Book'}</h1>
      {error && <p className="bg-red-50 text-coral-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="text-sm font-medium text-ink/80">Book Title *</label>
          <input required value={form.title} onChange={(e) => update('title', e.target.value)}
            className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">Author</label>
          <input value={form.author} onChange={(e) => update('author', e.target.value)}
            className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink/80">Subject *</label>
            <input required value={form.subject} onChange={(e) => update('subject', e.target.value)}
              className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">Department *</label>
            <input required value={form.department} onChange={(e) => update('department', e.target.value)}
              className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink/80">Semester *</label>
            <input type="number" min={1} max={8} required value={form.semester} onChange={(e) => update('semester', e.target.value)}
              className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">Condition</label>
            <select value={form.condition} onChange={(e) => update('condition', e.target.value)}
              className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors">
              <option>New</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink/80">Original Price (₹)</label>
            <input type="number" value={form.originalPrice} onChange={(e) => update('originalPrice', e.target.value)}
              className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">Selling Price (₹) *</label>
            <input type="number" required value={form.sellingPrice} onChange={(e) => update('sellingPrice', e.target.value)}
              className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)}
            className="mt-1 w-full border-2 border-ink/15 rounded-xl px-3 py-2.5 focus:border-brand-400 focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80">Images (up to 5)</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))}
            className="mt-1 w-full text-sm" />
        </div>
        <button disabled={loading} className="w-full bg-brand-500 text-white py-2.5 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all disabled:opacity-60">
          {loading ? 'Saving...' : id ? 'Update Listing' : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
};

export default UploadBook;