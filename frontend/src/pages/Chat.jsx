import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';

// Single conversation thread about one book, between the logged-in user and one other user.
// Polls every 4s for new messages — a simple stand-in for real-time updates.
// (For a production upgrade, replace the polling interval with a Socket.io connection.)
const Chat = () => {
  const { bookId, otherUserId } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchThread = async () => {
    const { data } = await api.get(`/messages/thread/${bookId}/${otherUserId}`);
    setMessages(data.messages);
    setBook(data.book);
    setLoading(false);
  };

  useEffect(() => {
    fetchThread();
    const interval = setInterval(fetchThread, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [bookId, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.post('/messages', { bookId, receiverId: otherUserId, text });
      setText('');
      await fetchThread();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col h-[calc(100vh-4rem)]">
      <Link to="/messages" className="text-sm font-semibold text-ink/50 hover:text-brand-600 mb-3 inline-flex items-center gap-1 w-fit">
        ← Back to Messages
      </Link>

      {/* Header: book context, so both people know what they're talking about */}
      {book && (
        <Link
          to={`/books/${book._id}`}
          className="flex items-center gap-3 bg-white border-2 border-ink/10 rounded-2xl p-3 shadow-card mb-4"
        >
          <div className="w-12 h-12 rounded-lg bg-brand-50 overflow-hidden shrink-0">
            {book.images?.[0] && <img src={getImageUrl(book.images[0])} alt={book.title} className="w-full h-full object-cover" />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-ink truncate">{book.title}</p>
            <p className="text-sm text-ink/50">₹{book.sellingPrice} {book.isSold && '· Sold'}</p>
          </div>
        </Link>
      )}

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {loading ? (
          <p className="text-ink/50 text-center mt-8">Loading conversation...</p>
        ) : messages.length === 0 ? (
          <p className="text-ink/50 text-center mt-8">Say hi 👋 — ask about condition, pickup, or price.</p>
        ) : (
          messages.map((m) => {
            const isMine = m.sender._id === user._id;
            return (
              <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`sticker max-w-[75%] rounded-2xl px-4 py-2.5 border-2 border-ink ${
                    isMine ? 'bg-brand-500 text-white' : 'bg-sunshine-100 text-ink'
                  }`}
                  style={{ '--tilt': isMine ? '1deg' : '-1deg' }}
                >
                  <p className="text-sm whitespace-pre-line">{m.text}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-ink/40'}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="flex gap-2 mt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border-2 border-ink/15 rounded-full px-4 py-2.5 focus:border-brand-400 focus:outline-none transition-colors"
        />
        <button
          disabled={sending || !text.trim()}
          className="bg-brand-500 text-white px-5 rounded-full font-semibold border-2 border-ink shadow-sticker hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;