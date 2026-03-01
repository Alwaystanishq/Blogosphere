# 📝 Blogosphere — MERN Blogging Platform

A full-stack blogging platform built using the **MERN Stack** (MongoDB, Express, React, Node.js).

Users can:

- 🔐 Signup & Login (JWT Authentication)
- 📝 Create, Edit, Delete Blogs
- ❤️ Like / Unlike Blogs
- 🔍 Search Blogs
- 👤 View User Profiles
- 📚 View Liked Blogs
- 📰 Browse Latest Blogs

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt
- Multer (Image Upload)
- Cookie-based authentication

---

## 📂 Project Structure

```
blogosphere/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── api/
│   └── vite.config.js
│
└── README.md
```

---

## ✨ Features

### 🔐 Authentication
- Signup with profile picture
- Login with email & password
- JWT stored in HTTP-only cookies
- Protected routes

---

### 📝 Blog System
- Create blog
- Edit blog
- Delete blog
- View single blog
- View latest blogs
- Search blogs by title

---

### ❤️ Like System
- Toggle like/unlike
- Like count updates instantly
- View all liked blogs

---

### 👤 Profile Page
- View user profile
- See user’s blogs
- Profile picture support

---

## 🔧 Environment Variables (Backend)

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/Alwaystanishq/blogosphere.git
cd blogosphere
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔌 API Routes Overview

### Auth Routes

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/check
POST   /api/auth/logout
```

### Blog Routes

```
GET    /api/blogs
GET    /api/blogs/latest
GET    /api/blogs/search?q=
GET    /api/blogs/liked
GET    /api/blogs/topLiked
GET    /api/blogs/:id
POST   /api/blogs
PATCH  /api/blogs/:id
DELETE /api/blogs/:id
POST   /api/blogs/like/:id
```

### Profile Route

```
GET    /api/blogs/profile/:username
```

---

## 🔒 Authentication Flow

1. User logs in
2. Backend sends JWT token in HTTP-only cookie
3. Frontend stores user in AuthContext
4. ProtectedRoute checks authentication
5. Secure access to protected pages

---

## 🎨 UI & UX

- Fully responsive design
- Tailwind CSS styling
- Reusable components (BlogCard, Navbar, ProtectedRoute)
- Clean and modern layout

---


## 👨‍💻 Author

Developed by Tanishq Chauhan

---
