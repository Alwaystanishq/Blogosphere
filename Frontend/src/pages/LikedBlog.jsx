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

  if (loading)
    return <div className="text-center pt-24">Loading liked blogs...</div>;

  if (error)
    return <div className="text-center text-red-500 pt-24">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-10">
      <h1 className="text-3xl font-bold mb-8">Liked Blogs ❤️</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">You haven't liked any blogs yet.</p>
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
