# Blogosphere

Blogosphere is a MERN blogging application for writing, publishing, and discussing articles. It includes a Markdown editor, private drafts, cover images, topic filters, author profiles, likes, and threaded comments.

The project has a React frontend and an Express API backed by MongoDB. Redis is optional and caches discovery feeds. Reading posts and interacting with them require an account.

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [How the application works](#how-the-application-works)
- [File structure](#file-structure)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Frontend routes](#frontend-routes)
- [API reference](#api-reference)
- [Data models](#data-models)
- [Redis feed caching](#redis-feed-caching)
- [Rate limiting](#rate-limiting)

## Features

### Accounts and authentication

- Sign up with a name, unique username, email address, password, and optional profile picture.
- Sign in and out using a JWT stored in an HTTP-only cookie.
- Restore the current session when the frontend loads.
- View author profiles and their published posts.
- Protect blog pages in React Router and enforce authentication on every blog API route.

Passwords are hashed with bcrypt. Authentication tokens expire after 30 days. Cookies use `sameSite: "strict"` and enable `secure` when `NODE_ENV=production`.

### Writing and drafts

- Create, edit, publish, and delete your own posts.
- Write in plain text or Markdown, with separate Write and Preview views.
- Apply headings, bold, italics, bullet and numbered lists, quotes, links, inline code, and code blocks using editor buttons.
- View word counts and estimated reading time.
- Save incomplete posts as private drafts and publish them later from My stories.
- Recover unfinished editor content from browser storage, separately for each account and post.

Browser recovery saves to the current browser. **Save Draft** saves to MongoDB through your account so you can resume on another device. Publishing requires a nonblank title and article. Drafts are excluded from discovery, search, author profiles, likes, and comments, and only their owner can fetch them directly.

### Images and topics

- Upload, replace, or remove a post's cover image.
- Display covers on article cards and post pages.
- Add an optional category and up to five tags.
- Click topic badges to browse related posts.
- Combine category and tag filters in discovery and search.

Categories are limited to 60 characters and tags to 30 characters each. Topics are trimmed, lowercased, and tags are deduplicated. Cover uploads accept PNG, JPEG, and WebP files up to 5 MB and check file signatures. Profile pictures accept JPEG and PNG MIME types up to 5 MB, with a default picture for accounts that omit one.

### Reading and discovery

- Browse ten matching published posts, ordered by newest or most liked.
- Search titles, article content, author names and usernames, categories, and tags.
- Combine search text with topic filters and sort by newest, oldest, or most liked.
- Like and unlike published posts.

Search queries accept up to 200 characters and match literal text without case sensitivity. A blank query browses published posts. Search filters are stored in the URL. The API also exposes liked-post and top-liked feeds; a dedicated liked-post page file exists but is not registered in the frontend router.

### Comments and replies

- Add plain-text comments of up to 2,000 characters to published posts.
- Reply to top-level comments with one level of nesting.
- Load older discussion threads in groups of 20.
- Remove comments as either the comment author or the post author.

Removing a comment clears its text and leaves a placeholder so existing replies remain. Deleting a post also deletes its comments.

### Caching and request limits

- Optional Redis caching for the latest and top-liked feeds.
- Feed invalidation when posts are created, updated, deleted, or liked/unliked.
- General API rate limiting with stricter limits for login and signup.
- HTTP 429 responses with retry information when a client exceeds a limit.

## Tech stack

Versions below show the major versions declared in the package manifests. Exact resolved versions are recorded in each directory's `package-lock.json`.

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19 | Components, state, and authentication context |
| Routing | React Router 7 | Page navigation, URL filters, and protected routes |
| Build tooling | Vite 7 | Development server and production builds |
| Styling | Tailwind CSS 4 and custom CSS | Layout, components, and responsive styles |
| Animation | GSAP 3 and ScrollTrigger | Entrance and scroll animations with reduced-motion handling |
| HTTP client | Axios 1 | API requests with authentication cookies |
| Article rendering | react-markdown 10 and remark-breaks 4 | Markdown rendering and line breaks; raw HTML is skipped |
| Icons | React Icons 5 | Navigation and interface icons |
| Backend | Node.js and Express 5 | HTTP API and static upload serving |
| Database | MongoDB and Mongoose 8 | Users, posts, comments, and schema validation |
| Authentication | jsonwebtoken 9, bcrypt 6, cookie-parser | JWT creation/verification, password hashing, and cookies |
| Uploads | Multer 2 | Multipart profile-picture and cover uploads |
| Cache | Redis and the redis 6 client | Optional shared feed cache |
| Rate limiting | express-rate-limit 8 | IP-based API and authentication quotas |
| Configuration | dotenv 17 and cors | Environment variables and credentialed frontend access |
| Linting | ESLint 9 with React plugins | Frontend code checks |

The frontend also declares `react-toastify`; it currently uses inline errors and status messages without a mounted toast container.

## How the application works

```text
React frontend (localhost:5173)
    |
    | Axios requests with cookies
    v
Express API (localhost:5000)
    |-- CORS and API rate limiting
    |-- Account routes and login/signup limits
    |-- JWT authentication for blog routes
    |-- Controllers and Mongoose models --> MongoDB
    |-- Discovery feed cache ------------> Redis (optional)
    `-- Image uploads -------------------> Backend/uploads/
```

`AuthContext` checks `/api/user/check` when the application loads. Protected pages redirect visitors without a session to `/login`. The API independently verifies the JWT and loads the user before allowing access to blog routes. Ownership checks restrict post updates and deletions to the author.

## File structure

```text
Blogosphere/
├── Backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── redis.js               # Redis connection, retries, and command deadlines
│   ├── controllers/
│   │   ├── userController.js      # Signup, login, logout, and session checks
│   │   ├── BlogController.js      # Post CRUD, discovery, search, likes, and profiles
│   │   └── commentController.js   # Discussion threads, replies, and removal
│   ├── middlewares/
│   │   ├── authMiddleware.js      # JWT verification and current-user lookup
│   │   ├── Multer.js              # Profile-picture uploads
│   │   ├── coverUpload.js         # Cover validation and file storage
│   │   └── rateLimit.js           # API, login, and signup limits
│   ├── models/
│   │   ├── userModel.js           # User schema and password hashing
│   │   ├── BlogModel.js           # Post schema, topics, draft state, and likes
│   │   └── CommentModel.js        # Comments, reply references, and deletion state
│   ├── routes/
│   │   ├── userRoute.js           # /api/user endpoints
│   │   └── blogRoute.js           # /api/blogs endpoints
│   ├── uploads/
│   │   └── default.png           # Default avatar; uploaded images also live here
│   ├── utils/
│   │   ├── blogTopics.js          # Topic normalization and validation
│   │   └── feedCache.js           # Feed caching and shared invalidation
│   ├── .env.example              # Backend configuration template
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                 # Express setup, service connections, and startup
├── Frontend/
│   ├── src/
│   │   ├── api/api.js            # Axios base URL and cookie configuration
│   │   ├── components/          # Editor, cards, comments, topics, navigation, and guards
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useReveal.js    # GSAP entrance and scroll animations
│   │   ├── pages/               # Home, accounts, discovery, writing, search, and profiles
│   │   ├── utils/
│   │   │   ├── imageUrl.js       # Resolve image paths against the API origin
│   │   │   └── markdownEditing.js # Markdown toolbar text transformations
│   │   ├── App.jsx              # Frontend route definitions
│   │   ├── main.jsx             # React root, router, and auth provider
│   │   └── index.css            # Tailwind import and application styles
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

Key shared components include `BlogEditor`, `MarkdownEditor`, `ArticleContent`, `CoverImageInput`, `BlogCard`, `BlogTopics`, `Comments`, `Navbar`, `Footer`, and `ProtectedRoute`.

## Local setup

### Prerequisites

- Node.js 20.19+ in the 20.x line, or Node.js 22.12+ and newer, as required by the installed Vite version.
- npm.
- A running MongoDB instance, locally or through a hosted connection URI.
- Redis only if you want feed caching.

Run the following from the repository root. The `Backend` and `Frontend` directory names are case-sensitive.

### 1. Install dependencies

```sh
npm ci --prefix Backend
npm ci --prefix Frontend
```

### 2. Configure the backend

```sh
cp Backend/.env.example Backend/.env
```

Edit `Backend/.env`:

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blogosphere
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development

# Optional: leave empty or remove to disable feed caching.
REDIS_URL=
REDIS_KEY_PREFIX=blogosphere:feeds:v1
```

The example file supplies a local Redis URL. Clear it if you are running without Redis. MongoDB must be reachable before using account or blog features.

### 3. Start the API

```sh
cd Backend
npm run dev
```

The API listens at `http://localhost:5000` by default. Start it from `Backend` so dotenv and profile-picture uploads resolve their relative paths correctly.

### 4. Start the frontend

In a second terminal, from the repository root:

```sh
cd Frontend
npm run dev
```

Open `http://localhost:5173`, create an account, and start a post. The frontend and backend run as separate processes.

## Environment variables

Backend variables are loaded from `Backend/.env`.

| Variable | Required | Purpose / default |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection URI |
| `JWT_SECRET` | Yes | Secret used to sign and verify authentication tokens |
| `PORT` | No | API port; defaults to `5000` |
| `NODE_ENV` | No | Setting `production` enables secure authentication cookies |
| `REDIS_URL` | No | Redis connection URL; empty or omitted disables caching; use `rediss://` for TLS |
| `REDIS_KEY_PREFIX` | No | Feed-cache namespace; defaults to `blogosphere:feeds:v1` |

The frontend currently uses a fixed API URL in `Frontend/src/api/api.js`, rather than a `VITE_*` environment variable. Backend CORS allows `http://localhost:5173`. Change both when using a different origin or port.

## Frontend routes

| Route | Page | Access |
| --- | --- | --- |
| `/` | Home | Public |
| `/login` | Sign in | Public |
| `/signup` | Create account | Public |
| `/myblog` | Manage your drafts and published posts | Signed in |
| `/create` | Write a new post | Signed in |
| `/edit/:id` | Edit your post | Signed in; API enforces ownership |
| `/blog/:id` | Read a post and its discussion | Signed in; drafts are owner-only |
| `/latest` | Discover posts with sorting and topic filters | Signed in |
| `/search` | Search published posts | Signed in |
| `/profile/:username` | Author profile and published posts | Signed in |
| Any unmatched path | Not found | Public |

## API reference

Local base URL: `http://localhost:5000/api`.

Use JSON request bodies unless a route specifies multipart form data. Send authentication cookies with protected requests; Axios is configured with `withCredentials: true`. Responses use a `success` boolean with route-specific data or an error `message`.

### Accounts

| Method | Path | Purpose / body |
| --- | --- | --- |
| `POST` | `/user/signup` | Create account: `name`, `username`, `email`, `password`, optional multipart `profilePic` |
| `POST` | `/user/login` | Sign in: `{ "email": "...", "password": "..." }` |
| `POST` | `/user/logout` | Clear the authentication cookie |
| `GET` | `/user/check` | Return the current user; requires authentication |

### Posts and discovery

All routes below require authentication.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/blogs` | Your posts, including drafts, ordered by last update |
| `POST` | `/blogs` | Create a post or draft |
| `GET` | `/blogs/:id` | Fetch a post; drafts are owner-only |
| `PATCH` | `/blogs/:id` | Update your post |
| `DELETE` | `/blogs/:id` | Delete your post and its comments |
| `GET` | `/blogs/latest` | Ten published posts and available topics; accepts `category`, `tag`, and `sort=newest` or `popular` |
| `GET` | `/blogs/search` | Published search results; accepts `q`, `category`, `tag`, and `sort=newest`, `oldest`, or `popular` |
| `GET` | `/blogs/liked` | Published posts you have liked |
| `GET` | `/blogs/topLiked` | Ten most-liked published posts |
| `GET` | `/blogs/profile/:username` | Author profile and published posts |
| `POST` | `/blogs/like/:id` | Toggle your like on a published post |
| `POST` | `/blogs/cover` | Upload one multipart `cover` image; returns a `coverImage` path |

Example post body:

```json
{
  "title": "My first story",
  "article": "## Hello\n\nThis is my first post.",
  "articleFormat": "markdown",
  "status": "published",
  "category": "technology",
  "tags": ["javascript", "writing"],
  "coverImage": ""
}
```

`articleFormat` accepts `plain` or `markdown`; `status` accepts `draft` or `published`. On creation, omitted values default to `plain` and `published`. Drafts may have empty titles and articles. On update, omitted fields retain their stored values.

Upload a cover first, then pass the returned `/uploads/cover-...` path as `coverImage`. Use an empty string to detach a cover. Topic filters use normalized category and tag values. Search results currently have no pagination; discovery feeds return at most ten posts.

### Comments

These routes require authentication and a published post.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/blogs/:id/comments?page=1` | Up to 20 top-level comments, their replies, and `hasMore` |
| `POST` | `/blogs/:id/comments` | Add `{ "text": "...", "parent": null }`; set `parent` to a top-level comment ID to reply |
| `DELETE` | `/blogs/:id/comments/:commentId` | Clear comment text as its author or the post author |

Comment pages start at 1. Top-level threads are ordered newest first and replies oldest first. Replies can target an existing, undeleted top-level comment on the same post.

## Data models

All models include creation and update timestamps.

| Model | Main fields | Relationships |
| --- | --- | --- |
| User | `name`, `username`, `email`, hashed `password`, `profilePic` | Unique username and email |
| Blog | `title`, `article`, `articleFormat`, `status`, `coverImage`, `category`, `tags` | `writtenBy` references User; `likedBy` stores User references |
| Comment | `text`, `deleted` | References a Blog and author User; optional `parent` references a top-level Comment |

MongoDB stores post and discussion data. Image files live on the backend filesystem, and browser recovery data lives in local storage.

## Redis feed caching

Set `REDIS_URL` to enable caching for `GET /api/blogs/latest` and `GET /api/blogs/topLiked`. Without Redis, those endpoints load directly from MongoDB.

- Successful feed responses are cached for five minutes (300 seconds).
- Category, tag, and sort combinations have separate cache entries.
- Creating, editing, publishing, deleting, or liking/unliking a post invalidates the feeds and their topic options.
- A shared generation key coordinates invalidation across backend processes. In-flight readers write to their original generation, and obsolete entries expire automatically.
- Authentication and input validation run before cache access. Drafts are excluded from the feeds.
- Redis connects in the background, reconnects automatically, and does not queue offline commands. Cache commands have a 250 ms deadline, with MongoDB fallback on failure.
- If an invalidation cannot reach Redis during an outage, an old entry may remain until its five-minute expiry.

Use a different `REDIS_KEY_PREFIX` for environments sharing a Redis database. Restart the backend after changing its Redis configuration.

## Rate limiting

Limits apply per client IP in 15-minute windows, as configured in `Backend/middlewares/rateLimit.js`.

| Scope | Limit |
| --- | --- |
| All `/api` routes combined | 300 requests |
| `POST /api/user/login` | 10 attempts |
| `POST /api/user/signup` | 5 attempts |

Successful and failed requests count. Login and signup have independent quotas and also consume the general API quota. The general limiter runs before JSON parsing and authentication; signup limiting runs before profile-picture uploads. Static `/uploads` requests and CORS preflight requests do not consume API quota.

Responses include `RateLimit` and `RateLimit-Policy` headers. Blocked requests return HTTP 429, `Retry-After` in seconds, and a JSON body such as:

```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

Login and signup forms display the server's error message. IPv6 clients are grouped by /56 subnet. Counters are held in memory per backend process and reset on restart; the Redis feed cache does not store them. Use a shared rate-limit store when running multiple backend instances.
