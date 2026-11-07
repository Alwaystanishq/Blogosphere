# Blogosphere

A MERN blogging application built with MongoDB, Express, React, and Node.js.

## Features

- **Accounts:** signup with a profile picture, login/logout, HTTP-only JWT cookies, and protected pages.
- **Writing:** create, edit, and delete posts. Use Markdown formatting buttons for headings, emphasis, lists, quotes, links, and code; switch between Write and Preview. Existing plain-text posts keep their original formatting.
- **Drafts:** save incomplete posts privately to your account and publish later from My Blogs. Unfinished editor content is automatically recovered in the same browser, separately for each account. Use Save Draft to persist it across devices.
- **Topics:** add an optional category (up to 60 characters) and up to five comma-separated tags (up to 30 characters each). Topics are trimmed, lowercased, and deduplicated. Click topic badges or combine category/tag filters on Latest Blogs.
- **Search:** search published titles, article content, author names/usernames, categories, and tags. Combine topic filters and sort by newest, oldest, or most liked. Blank searches browse all published posts. Queries are limited to 200 characters and matched as literal text, ignoring case.
- **Cover images:** upload, replace, or remove a cover in the editor. PNG, JPEG, and WebP files up to 5 MB are accepted. Uploaded covers appear on cards and article pages and are preserved with saved drafts and browser recovery.
- **Comments and replies:** signed-in readers can comment on published posts and reply to top-level comments. Comments support up to 2,000 characters of plain text. Comment authors and the post author can remove comments; removed text is replaced by a placeholder so existing replies remain. Replies have one level of nesting. Load more fetches older discussion threads in groups of 20.
- **Reading:** browse the latest ten matching published posts, view author profiles, and like/unlike articles. The API also supports liked and most-liked lists.

Draft posts are excluded from search, discovery, public profiles, likes, and discussion. Cover files are served through static upload URLs; removing a cover detaches it from the post and does not delete the uploaded file.

## Stack

**Frontend:** React, Vite, React Router, Axios, Tailwind CSS, React Icons, react-markdown, and remark-breaks.

**Backend:** Express, Mongoose, JWT, bcrypt, cookie-parser, Multer, dotenv, and Redis (optional feed cache).

## Project structure

```text
Backend/
  config/          Database connection
  controllers/     Accounts, posts, and comments
  middlewares/     Authentication and image uploads
  models/          User, Blog, and Comment schemas
  routes/          Account and blog routes
  uploads/         Profile pictures and cover files
  utils/           Topic validation
  server.js
Frontend/
  src/
    api/           Axios client
    components/    Editor, Markdown rendering, cards, topics, and discussion
    context/       Authentication state
    pages/         Application pages
    utils/         Formatting and image URL helpers
```

## Local setup

Use a current Node.js release compatible with Vite 7 (Node 20.19+ or 22.12+) and a MongoDB instance. Directory names are case-sensitive.

1. Install backend dependencies:

   ```sh
   cd Backend
   npm install
   ```

2. Create `Backend/.env`:

   ```dotenv
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/blogosphere
   JWT_SECRET=replace_with_a_long_random_secret
   NODE_ENV=development
   # Optional; omit to use MongoDB without caching
   REDIS_URL=redis://127.0.0.1:6379
   REDIS_KEY_PREFIX=blogosphere:feeds:v1
   ```

3. Start the API from the `Backend` directory:

   ```sh
   npm run dev
   ```

   The API runs at `http://localhost:5000`. `npm start` runs without watch mode.

4. In another terminal, install and start the frontend:

   ```sh
   cd Frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:5173`.

The frontend API base URL is configured in `Frontend/src/api/api.js`. Backend CORS allows `http://localhost:5173`. Update both when using different origins. Profile pictures currently also use the localhost API origin in their UI components.

Uploaded files are stored on the backend filesystem. Keep `Backend/uploads` on persistent storage when deploying. JWT cookies use the `secure` flag when `NODE_ENV=production`.

## Redis feed caching

Set `REDIS_URL` in `Backend/.env` to enable Redis for `GET /api/blogs/latest`
and `GET /api/blogs/topLiked`. Without it, both routes query MongoDB directly.
Use `rediss://` for a TLS Redis endpoint. Use a different `REDIS_KEY_PREFIX` for
applications or environments sharing a Redis database.

Run a local Redis instance before starting the backend, for example:

```sh
redis-server
```

- Successful feed responses are cached for 5 minutes (300 seconds). Normalized category/tag combinations have separate latest-feed entries.
- Creating, updating, deleting, publishing, or liking/unliking a post invalidates both feeds, including topic options and every filtered latest-feed entry.
- A shared generation key makes invalidation work across backend processes. In-flight reads cannot repopulate the active generation with old results. Obsolete entries expire automatically.
- Authentication and filter validation run before cache reads. Draft posts are excluded from both feeds.
- Redis connects in the background and reconnects automatically. Offline commands are not queued; cache commands have a 250 ms deadline. Redis failures fall back to MongoDB without failing requests. If invalidation cannot reach Redis during an outage, old entries may remain until their 5-minute expiry.
- Invalid requests and database errors are never cached. Restart the backend after changing Redis settings.

## Commands

```sh
npm run build --prefix Frontend   # Production frontend build
npm run preview --prefix Frontend # Preview the production build
npm run lint --prefix Frontend    # ESLint checks
npm run dev --prefix Backend      # API with Node watch mode
npm start --prefix Backend        # API
```

For backend startup, run from `Backend` as shown in the setup steps so dotenv and profile uploads resolve correctly.

## API

Account routes are under `/api/user`. All `/api/blogs` routes require the authentication cookie.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/user/signup` | Signup; multipart form supports `profilePic` |
| POST | `/api/user/login` | Login with email and password |
| POST | `/api/user/logout` | Clear authentication cookie |
| GET | `/api/user/check` | Current account |
| GET | `/api/blogs` | Current user's posts, including drafts |
| POST | `/api/blogs` | Create a post or draft |
| PATCH | `/api/blogs/:id` | Update a post owned by the current user |
| DELETE | `/api/blogs/:id` | Delete an owned post and its discussion |
| GET | `/api/blogs/:id` | Post details; drafts are owner-only |
| GET | `/api/blogs/latest?category=&tag=` | Latest ten matching published posts and available topics |
| GET | `/api/blogs/search?q=&category=&tag=&sort=newest` | Published search results; sort: `newest`, `oldest`, `popular` |
| GET | `/api/blogs/liked` | Current user's liked posts |
| GET | `/api/blogs/topLiked` | Ten most-liked published posts |
| POST | `/api/blogs/like/:id` | Toggle a like |
| GET | `/api/blogs/profile/:username` | Profile and published posts |
| POST | `/api/blogs/cover` | Upload one multipart `cover` file; returns `coverImage` path |
| GET | `/api/blogs/:id/comments?page=1` | Discussion threads with replies and `hasMore` |
| POST | `/api/blogs/:id/comments` | Add `{ "text": "...", "parent": null }`; use a top-level comment ID as `parent` for a reply |
| DELETE | `/api/blogs/:id/comments/:commentId` | Remove comment text as its author or the post author |

Post create/update accepts JSON fields `title`, `article`, `articleFormat` (`plain` or `markdown`), `status` (`draft` or `published`), `category`, `tags` (array of strings), and `coverImage` (an uploaded path, or `""` to remove). Publishing requires a nonblank title and article. Omitted fields on update retain their stored values.

## Author

Tanishq Chauhan
