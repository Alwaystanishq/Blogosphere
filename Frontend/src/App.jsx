import { lazy, Suspense, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Footer from "./components/Footer";
import LikedBlogs from "./pages/LikedBlog";
import Home from "./pages/Home";
import MyBlogs from "./pages/MyBlogs";
import LatestBlogs from "./pages/LatestBlogs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
const EditBlog = lazy(() => import("./pages/EditBlog"));
const Blog = lazy(() => import("./pages/Blog"));
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Search from "./pages/Search";
const CreateBlog = lazy(() => import("./pages/CreateBlog"));

function App() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const isAccountPage = pathname === "/login" || pathname === "/signup";
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    const titles = { "/": "Stories for curious minds", "/latest": "Discover stories", "/search": "Search stories", "/myblog": "My stories", "/liked": "Liked stories", "/create": "Write a story", "/login": "Sign in", "/signup": "Create an account" };
    document.title = `${titles[pathname] || (pathname.startsWith("/edit/") ? "Edit your story" : pathname.startsWith("/blog/") ? "Read a story" : pathname.startsWith("/profile/") ? "Writer profile" : "Page not found")} · Blogosphere`;
  }, [pathname]);
  return (
    <div className="app-shell">
      <Navbar key={pathname} />
      <main ref={mainRef} id="main-content" className={pathname === "/" ? "home-screen" : isAccountPage ? "account-screen" : undefined} tabIndex={-1}>
      <Suspense fallback={<p className="page-status" role="status">Opening this page…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/liked" element={<LikedBlogs />} />
          <Route path="/myblog" element={<MyBlogs />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/latest" element={<LatestBlogs />} />
          <Route path="/edit/:id" element={<EditBlog />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/search" element={<Search />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      </main>
      {pathname !== "/" && !isAccountPage && <Footer />}
    </div>
  );
}

export default App;
