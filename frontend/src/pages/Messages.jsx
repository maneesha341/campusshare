import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageUrl';

// Inbox: one row per (book, other user) conversation, newest first.
const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages/inbox').then((res) => {
      setConversations(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink mb-8">Messages</h1>

      {loading ? (
        <p className="text-ink/50">Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <div className="paper-grid rounded-2xl border-2 border-dashed border-ink/15 py-16 px-6 text-center">
          <span
            className="sticker inline-block bg-brand-100 border-2 border-ink text-3xl w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ '--tilt': '5deg' }}
          >
            💬
          </span>
          <p className="text-ink font-semibold">No conversations yet</p>
          <p className="text-ink/50 text-sm mt-1 max-w-sm mx-auto">
            Message a seller from any book's page to start a chat about it.
          </p>
          <Link
            to="/books"
            className="mt-5 inline-block bg-brand-500 text-white px-5 py-2.5 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
          >
            Browse the board
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => (
            <Link
              key={`${c.book._id}_${c.otherUser._id}`}
              to={`/chat/${c.book._id}/${c.otherUser._id}`}
              className="flex items-center gap-3 sm:gap-4 bg-white border-2 border-ink/10 rounded-2xl p-3 sm:p-4 shadow-card hover:border-ink/90 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-brand-50 overflow-hidden shrink-0">
                {c.book.images?.[0] && (
                  <img src={getImageUrl(c.book.images[0])} alt={c.book.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-ink truncate">{c.book.title}</p>
                  {c.unreadCount > 0 && (
                    <span className="sticker bg-coral-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-ink shrink-0" style={{ '--tilt': '0deg' }}>
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink/50 truncate">with {c.otherUser.name}</p>
                <p className="text-sm text-ink/70 truncate mt-0.5">{c.lastMessage}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;