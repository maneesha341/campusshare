// Book images are stored as relative paths like "/uploads/xyz.jpg" by the backend.
// In dev, Vite's proxy (vite.config.js) forwards those to localhost:5000 automatically.
// In production there's no such proxy, so we resolve them against the real backend
// origin, derived from VITE_API_URL (e.g. https://your-backend.onrender.com/api).
const apiUrl = import.meta.env.VITE_API_URL || '';
const backendOrigin = apiUrl.replace(/\/api\/?$/, '');

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path; // already absolute (e.g. future cloud storage URLs)
  return `${backendOrigin}${path}`;
};