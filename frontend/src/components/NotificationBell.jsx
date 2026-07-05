import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const typeIcon = {
  order_requested: '🛒',
  order_accepted: '✓',
  order_declined: '✕',
  order_completed: '📦',
  message: '💬',
};

// Bell icon in the navbar: checks for updates on load, polls periodically,
// and shows an unread-count badge. Clicking it opens a dropdown of recent
// notifications; clicking a notification marks it read and navigates to it.
const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  const fetchCount = async () => {
    const { data } = await api.get('/notifications/unread-count');
    setCount(data.count);
  };

  const fetchList = async () => {
    const { data } = await api.get('/notifications');
    setNotifications(data);
    setLoaded(true);
  };

  // Check for updates as soon as the app loads (and whenever the user logs in),
  // then keep polling every 20s so the badge stays fresh without needing a refresh.
  useEffect(() => {
    if (!user) return;
    fetchCount();
    const interval = setInterval(fetchCount, 20000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [user]);

  // Close the dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleToggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && !loaded) await fetchList();
  };

  const handleNotificationClick = async (n) => {
    setOpen(false);
    if (!n.read) {
      await api.put(`/notifications/${n._id}/read`);
      setCount((c) => Math.max(0, c - 1));
      setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
    }
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = async () => {
    await api.put('/notifications/read-all');
    setCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 border-ink/15 text-ink hover:bg-brand-50 transition-colors"
        aria-label="Notifications"
      >
        🔔
        {count > 0 && (
          <span className="sticker absolute -top-1.5 -right-1.5 bg-coral-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-ink" style={{ '--tilt': '0deg' }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 max-w-[85vw] bg-white border-2 border-ink/10 rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-ink/10">
            <p className="font-semibold text-ink text-sm">Notifications</p>
            {notifications.some((n) => !n.read) && (
              <button onClick={handleMarkAllRead} className="text-xs font-semibold text-brand-600">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!loaded ? (
              <p className="text-sm text-ink/50 px-4 py-6 text-center">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-ink/50 px-4 py-6 text-center">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-ink/5 hover:bg-brand-50 transition-colors ${!n.read ? 'bg-brand-50/60' : ''}`}
                >
                  <span className="text-lg shrink-0">{typeIcon[n.type] || '🔔'}</span>
                  <div className="min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-ink' : 'text-ink/70'}`}>{n.text}</p>
                    <p className="text-[11px] text-ink/40 mt-0.5">
                      {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;