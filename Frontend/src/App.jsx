import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MyBlogs from "./pages/MyBlogs";
import LatestBlogs from "./pages/LatestBlogs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditBlog from "./pages/EditBlog";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/myblog" element={<MyBlogs />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/latest" element={<LatestBlogs />} />
          <Route path="/edit/:id" element={<EditBlog />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
