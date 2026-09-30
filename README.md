# Blog Platform with Comments

A full-stack MERN blogging platform where registered users can create, edit,
and delete their own blog posts, and comment on any post. Built with a
React (Vite) frontend and a Node.js/Express/MongoDB REST API backend, secured
with JWT authentication and bcrypt password hashing.

## Features

- User registration and secure login (JWT-based sessions)
- Create, read, update, and delete blog posts
- Post ownership enforced — only the author can edit/delete their own post
- Comment on any post; delete only your own comments
- Protected frontend routes that redirect unauthenticated users to Login
- Centralized Axios client with automatic JWT attachment
- Centralized backend error handling with meaningful HTTP status codes
- Frontend and backend input validation
- Fully responsive UI (desktop, tablet, mobile)
- Loading states, friendly error messages, and confirmation modals for
  destructive actions

## Technologies Used

**Frontend:** React 18, Vite, React Router 6, Axios, plain CSS
**Backend:** Node.js, Express 4, JWT (`jsonwebtoken`), `bcryptjs`, `dotenv`, `cors`
**Database:** MongoDB with Mongoose (MongoDB Atlas compatible)

## Folder Structure

```
blog-platform/
├── client/                     React + Vite frontend
│   ├── src/
│   │   ├── components/         Navbar, PostCard, CommentSection, ProtectedRoute, etc.
│   │   ├── pages/               Home, Login, Register, CreatePost, EditPost, PostDetails, NotFound
│   │   ├── context/             AuthContext.jsx (auth state)
│   │   ├── services/            api.js (Axios instance)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                     Node/Express backend
│   ├── config/db.js             MongoDB connection
│   ├── models/                  User.js, Post.js, Comment.js (Mongoose schemas)
│   ├── controllers/             authController.js, postController.js, commentController.js
│   ├── routes/                  authRoutes.js, postRoutes.js, commentRoutes.js
│   ├── middleware/               auth.js, errorHandler.js, asyncHandler.js
│   ├── utils/                    generateToken.js, ApiError.js
│   ├── server.js                Express app entry point
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

## Requirements

- Node.js 18+ and npm
- A MongoDB database — either a local MongoDB instance or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Installation

Clone or copy the project, then install dependencies for both apps:

```bash
# Backend
cd server
npm install

# Frontend (in a new terminal)
cd client
npm install
```

## Environment Variables

Both apps read configuration from `.env` files that are **not** committed to
source control (see `.gitignore`). Copy the provided examples and fill in
your own values.

### Backend — `server/.env`

Copy `server/.env.example` to `server/.env`:

```bash
cd server
cp .env.example .env
```

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

- `MONGODB_URI` — your MongoDB Atlas (or local) connection string (see below)
- `JWT_SECRET` — any long, random string used to sign JWTs (never share this)
- `CLIENT_URL` — the URL of the running frontend, used for CORS

### Frontend — `client/.env`

Copy `client/.env.example` to `client/.env`:

```bash
cd client
cp .env.example .env
```

```
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Atlas Setup

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a new cluster (the free M0 tier is enough).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, add your current IP address (or `0.0.0.0/0` for
   development only) so your machine can connect.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/blogplatform?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user's credentials,
   and paste the full string into `server/.env` as `MONGODB_URI`.

Your MongoDB password should **never** be committed to source control or
hardcoded anywhere in the codebase — it only ever lives in your local `.env`
file, which `.gitignore` excludes.

## Running the Application

### Start the backend

```bash
cd server
npm run dev      # uses nodemon for auto-restart
# or: npm start
```

You should see:
```
MongoDB connected successfully: <host>
Server running in development mode on port 5000
```

If MongoDB fails to connect, the console will print a clear
`MongoDB connection error: ...` message and the process will exit — double
check `MONGODB_URI`, your Atlas network access list, and your credentials.

### Start the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

Vite will start the dev server at `http://localhost:5173`.

Open that URL in your browser to use the app.

### Production build (frontend)

```bash
cd client
npm run build      # outputs static files to client/dist
npm run preview    # preview the production build locally
```

## API Endpoints

### Auth

| Method | Endpoint            | Access  | Description                     |
|--------|----------------------|---------|----------------------------------|
| POST   | `/api/auth/register` | Public  | Register a new user             |
| POST   | `/api/auth/login`    | Public  | Log in, receive a JWT           |
| GET    | `/api/auth/me`       | Private | Get the current authenticated user |

### Posts

| Method | Endpoint          | Access           | Description                          |
|--------|-------------------|------------------|----------------------------------------|
| GET    | `/api/posts`      | Public           | List all posts                        |
| GET    | `/api/posts/:id`  | Public           | Get a single post                     |
| POST   | `/api/posts`      | Private          | Create a post                         |
| PUT    | `/api/posts/:id`  | Private (owner)  | Update your own post                  |
| DELETE | `/api/posts/:id`  | Private (owner)  | Delete your own post                  |

### Comments

| Method | Endpoint                        | Access           | Description                    |
|--------|----------------------------------|------------------|---------------------------------|
| GET    | `/api/posts/:postId/comments`    | Public           | List comments on a post        |
| POST   | `/api/posts/:postId/comments`    | Private          | Add a comment to a post        |
| DELETE | `/api/comments/:id`              | Private (owner)  | Delete your own comment        |

All private endpoints require an `Authorization: Bearer <token>` header.

## Authentication Explained

1. On register/login, the backend hashes/verifies the password with bcrypt
   and returns a signed JWT (`jsonwebtoken`) containing the user's ID.
2. The frontend stores this token in `localStorage` and attaches it to every
   subsequent API request via an Axios request interceptor
   (`client/src/services/api.js`).
3. On the backend, the `protect` middleware (`server/middleware/auth.js`)
   verifies the token, loads the user from MongoDB, and attaches it to
   `req.user` for use in controllers. Missing, invalid, or expired tokens are
   rejected with `401 Unauthorized`.
4. Ownership checks in `postController.js` and `commentController.js` compare
   `req.user._id` against the resource's `author` field and return
   `403 Forbidden` if they don't match.
5. On the frontend, `AuthContext` calls `GET /api/auth/me` on load to restore
   the session if a token is present, and `ProtectedRoute` redirects
   unauthenticated users to `/login`.

## Testing Instructions (Manual Checklist)

1. Start the backend (`npm run dev` in `server/`).
2. Start the frontend (`npm run dev` in `client/`).
3. Register a new user on `/register`.
4. Confirm the user document appears in your MongoDB `users` collection.
5. Log out, then log back in on `/login`.
6. Confirm the navbar shows your name and "Create Post"/"Logout" links.
7. Create a blog post from `/create-post`.
8. Confirm it appears on the Home page.
9. Open the post's details page.
10. Add a comment and confirm it appears immediately.
11. Edit the post and confirm the changes are reflected.
12. Delete the post and confirm it disappears from Home (and its comments
    are removed too).
13. Log out and confirm `/create-post` and `/edit-post/:id` redirect to
    `/login`.
14. Register/login as a **second** user, create a post as the first user
    (or reuse an earlier one), and confirm the second user does **not** see
    Edit/Delete buttons on it, and a direct `PUT`/`DELETE` API call returns
    `403 Forbidden`.
15. Confirm the second user cannot delete a comment left by the first user
    (no delete button shown; API returns `403`).
16. Visit a nonexistent route (e.g. `/does-not-exist`) and confirm the
    404 page appears with a "Back Home" button.

## Common Errors and Solutions

| Symptom | Likely Cause | Fix |
|---|---|---|
| `MongoDB connection error: ...` on server start | Wrong `MONGODB_URI`, IP not whitelisted in Atlas, or wrong DB password | Double-check the connection string, add your IP under Atlas Network Access, verify the database user's password |
| `Error: JWT_SECRET is not defined` | Missing `server/.env` file | Copy `.env.example` to `.env` and set `JWT_SECRET` |
| CORS errors in the browser console | `CLIENT_URL` in `server/.env` doesn't match the frontend's actual URL | Set `CLIENT_URL=http://localhost:5173` (or whatever port Vite uses) |
| Frontend requests fail / Network Error | Backend not running, or `VITE_API_URL` in `client/.env` points to the wrong port | Start the backend first; confirm `VITE_API_URL=http://localhost:5000/api` |
| `401 Unauthorized` right after logging in | Token not attached to request | Confirm you're using the shared `api` instance (`src/services/api.js`) rather than raw `axios` calls |
| `403 Forbidden` when editing/deleting | You are not the owner of that post/comment | Expected behavior — only the original author can edit/delete their own content |
| Blank page after `npm run dev` (frontend) | Dependencies not installed, or a JS error in the browser console | Run `npm install` in `client/`, then check the browser dev console for the exact error |
| `EADDRINUSE` on backend start | Port 5000 already in use | Stop the other process, or change `PORT` in `server/.env` |

## Notes on This Build

Every backend file has been syntax-checked with `node --check`, and every
frontend file has been syntax-checked for valid JSX. All relative
`import`/`require` paths have been verified to resolve to real files, and all
named imports/exports have been cross-checked to match. Dependency versions
in both `package.json` files are current, stable releases as of this build.
Because this was built in an offline sandbox, `npm install` itself was not
run here — run it in your own environment (with internet access and a
MongoDB Atlas connection string) as the first step, then follow "Running the
Application" above.
