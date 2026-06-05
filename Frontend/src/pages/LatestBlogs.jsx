import { useEffect, useState } from "react";
import api from "../api/api";
import BlogCard from "../components/BlogCard";

function LatestBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get("/blogs/latest");

        if (res.data.success) {
          setBlogs(res.data.blogs || []);
        }
      } catch (err) {
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="text-center pt-24 text-indigo-600 font-medium">
        Loading latest blogs...
      </div>
    );
  }

  if (error) {
    return <div className="text-center pt-24 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">
          Latest Blogs
        </h1>

        <p className="text-zinc-500">
          Discover the newest stories from the Blogosphere community.
        </p>
      </div>

      {/* Blogs */}
      {blogs.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-zinc-500">No blogs found.</p>
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

export default LatestBlogs;
