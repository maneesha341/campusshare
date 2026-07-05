import axios from 'axios';

// In development, Vite's proxy (vite.config.js) forwards '/api' to localhost:5000.
// In production there's no dev server to proxy through, so we need the real backend
// URL — set VITE_API_URL in your deployment platform's environment variables
// (e.g. Vercel) to something like https://your-backend.onrender.com/api.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handling -> log the user out
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('cs_token');
      localStorage.removeItem('cs_user');
    }
    return Promise.reject(err);
  }
);

export default api;