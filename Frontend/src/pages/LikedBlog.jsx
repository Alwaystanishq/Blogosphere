import { useEffect, useState } from "react";
import api from "../api/api";
import BlogCard from "../components/BlogCard";

function LikedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikedBlogs = async () => {
      try {
        const res = await api.get("/blogs/liked");

        if (res.data.success) {
          setBlogs(res.data.blogs || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load liked blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedBlogs();
  }, []);

  if (loading) {
    return (
      <div className="text-center pt-24 text-rose-500 font-medium">
        Loading liked blogs...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 pt-24">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-rose-500 mb-2">
          ❤️ Liked Blogs
        </h1>

        <p className="text-zinc-500">
          Blogs you've enjoyed and saved with a like.
        </p>
      </div>

      {/* Blogs */}
      {blogs.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-zinc-500">You haven't liked any blogs yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedBlogs;
