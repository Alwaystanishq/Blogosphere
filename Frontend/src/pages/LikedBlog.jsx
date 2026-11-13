import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <div className="page-heading">
        <h1 className="text-4xl font-bold text-rose-500 mb-2">
          Worth another read.
        </h1>

        <p className="text-zinc-500">
          The stories you liked, all in one place.
        </p>
      </div>

      {/* Blogs */}
      {blogs.length === 0 ? (
        <div className="empty-state">
          <h2>Keep a good story close.</h2><p>Like a story as you read and find it here whenever you want to return.</p><Link to="/latest" className="button-primary">Discover stories</Link>
        </div>
      ) : (
        <div className="stories-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedBlogs;
