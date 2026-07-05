# CampusShare — Campus Textbook Marketplace (MERN Stack)

A full-stack marketplace where students buy and sell used academic books
within their campus. Built with MongoDB, Express, React (Vite), and Node.js.

## 1. Project Structure

```
campusshare/
├── backend/
│   ├── config/
│   │   └── db.js                # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js    # register, login, profile
│   │   ├── bookController.js    # CRUD, search, filters
│   │   ├── wishlistController.js
│   │   └── userController.js    # admin: users, stats
│   ├── middleware/
│   │   ├── auth.js              # protect + admin JWT middleware
│   │   ├── errorHandler.js
│   │   └── upload.js            # multer image upload
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Wishlist.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/                 # book image storage (local dev)
│   ├── utils/generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/axios.js         # axios instance + JWT interceptor
    │   ├── components/
    │   │   ├── Navbar.jsx / Footer.jsx
    │   │   ├── BookCard.jsx / Filters.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx / Login.jsx / Register.jsx
    │   │   ├── BookList.jsx / BookDetail.jsx / UploadBook.jsx
    │   │   ├── Dashboard.jsx / Wishlist.jsx / Profile.jsx
    │   │   ├── Admin.jsx / NotFound.jsx
    │   │   └── App.jsx / main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

## 2. Database Schema (MongoDB Collections)

**Users**: name, email (unique), password (bcrypt-hashed), phone, college,
department, semester, avatar, role (`student`/`admin`), rating, numReviews.

**Books**: seller (ref User), title, author, subject, department, semester,
condition (`New`/`Good`/`Fair`), originalPrice, sellingPrice, description,
images[], isSold, isApproved, views. Has a text index on title/subject/author
for full-text search.

**Wishlist**: user (ref User), book (ref Book) — unique compound index so a
user can't wishlist the same book twice.

**Message** (scaffolded for in-app chat): book, sender, receiver, text, read.

## 3. API Design

| Method | Route                        | Access        | Purpose |
|--------|-------------------------------|---------------|---------|
| POST   | /api/auth/register            | Public        | Create account |
| POST   | /api/auth/login               | Public        | Login, get JWT |
| GET    | /api/auth/me                  | Private       | Get own profile |
| PUT    | /api/auth/me                  | Private       | Update profile |
| GET    | /api/books                    | Public        | List/search/filter books |
| POST   | /api/books                    | Private       | Create listing (multipart, up to 5 images) |
| GET    | /api/books/:id                | Public        | Book detail (+view counter) |
| PUT    | /api/books/:id                | Private (owner/admin) | Edit / mark sold |
| DELETE | /api/books/:id                | Private (owner/admin) | Delete listing |
| GET    | /api/books/mine/all           | Private       | Seller dashboard listings |
| GET    | /api/wishlist                 | Private       | Get wishlist |
| POST   | /api/wishlist/:bookId         | Private       | Add to wishlist |
| DELETE | /api/wishlist/:bookId         | Private       | Remove from wishlist |
| GET    | /api/users                    | Private/Admin | List all users |
| DELETE | /api/users/:id                | Private/Admin | Remove a user |
| GET    | /api/users/stats/overview     | Private/Admin | Platform stats |
| POST   | /api/messages                 | Private       | Send a message about a book |
| GET    | /api/messages/thread/:bookId/:otherUserId | Private | Get full chat thread, marks incoming as read |
| GET    | /api/messages/inbox           | Private       | List conversations (grouped by book + other user) with unread counts |

`GET /api/books` query params: `keyword, department, semester, subject,
condition, minPrice, maxPrice, sort (priceAsc|priceDesc|popular), page, limit`.

## 4. Authentication

JWT-based. On login/register the API returns a signed token (`JWT_SECRET`,
expires per `JWT_EXPIRES_IN`). The frontend stores it in `localStorage` and
an axios interceptor (`src/api/axios.js`) attaches it as `Authorization:
Bearer <token>` on every request. `middleware/auth.js` verifies the token
server-side and attaches `req.user`; `admin` middleware further restricts
admin-only routes.

## 5. Running Locally

**Backend**
```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # nodemon, http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173 (proxies /api to :5000)
```

Create a MongoDB Atlas free cluster (or run MongoDB locally) and paste the
connection string into `backend/.env` as `MONGO_URI`.

## 6. Deployment

**Backend → Render**
1. Push `backend/` to GitHub.
2. New Web Service on Render, root directory `backend`, build `npm install`,
   start `npm start`.
3. Add env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`
   (your Vercel frontend URL), `NODE_ENV=production`.
4. Note: Render's filesystem is ephemeral, so uploaded images in
   `/uploads` will NOT persist across deploys/restarts. For production,
   swap `middleware/upload.js`'s disk storage for Cloudinary or S3
   (multer-storage-cloudinary is a drop-in replacement).

**Frontend → Vercel**
1. Push `frontend/` to GitHub, import into Vercel, root directory `frontend`.
2. Build command `npm run build`, output `dist`.
3. Set `vite.config.js` proxy only applies in dev — in production, either
   set `VITE_API_URL` env var and update `src/api/axios.js` `baseURL` to
   point at your Render backend URL, or configure a Vercel rewrite to
   `/api/*` → your Render backend.

## 7. What's Implemented vs. Extension Ideas

Implemented: registration/login/JWT, profile editing, book CRUD with image
upload, search + multi-filter + sort + pagination, book detail with seller
contact info, wishlist, seller dashboard (mark sold, edit, delete, view
counts), admin panel (user management + platform stats), in-app chat
(inbox + per-book conversation thread, polling-based).

Good next additions (scaffolded/easy to extend):
- **Real-time chat**: the current chat polls every 4s (`frontend/src/pages/Chat.jsx`).
  Swap the `setInterval` for a Socket.io connection for instant delivery
  and typing indicators.
- **Ratings & reviews**: add a `Review` model (book/seller, rating, comment)
  and update `User.rating`/`numReviews` on save.
- **Admin listing moderation**: flip `Book.isApproved` from the Admin page
  (route already supports it via `PUT /api/books/:id`).
- **Cloud image storage**: replace multer disk storage with Cloudinary/S3
  for persistence on Render.
- **AI price suggestion**: a small endpoint that averages `sellingPrice` of
  similar books (same subject/condition) as a starting suggestion.
- **Notifications**: simple polling endpoint or Socket.io for real-time
  wishlist/sold alerts.

## 8. Best Practices Followed

- Passwords hashed with bcrypt, never returned in API responses.
- JWT auth middleware separated from route handlers.
- `express-async-handler` to avoid repetitive try/catch and centralize
  error handling via `errorHandler.js`.
- Ownership checks on update/delete (`seller.toString() === req.user._id`)
  so users can only modify their own listings; admins bypass this.
- Environment variables via `.env` (never committed — see `.gitignore`).
- MongoDB text index for efficient search; compound index on Wishlist to
  prevent duplicates at the DB level.
- Clear separation of concerns: models / controllers / routes / middleware
  on the backend; api / components / context / pages on the frontend.