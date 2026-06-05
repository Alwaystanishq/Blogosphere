import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import BlogCard from "../components/BlogCard";

function MyBlogs() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const res = await api.get("/blogs");

        if (res.data.success) {
          setBlogs(res.data.blogs || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/blogs/${id}`);

      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="text-center pt-24 text-indigo-600 font-medium">
        Loading your blogs...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 pt-24">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">My Blogs</h1>

          <p className="text-zinc-500">
            Manage and edit your published articles.
          </p>
        </div>

        <button
          onClick={() => navigate("/create")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold transition shadow-md"
        >
          + Create Blog
        </button>
      </div>

      {/* Blogs */}
      {blogs.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-zinc-500">You haven't written any blogs yet.</p>

          <button
            onClick={() => navigate("/create")}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl transition"
          >
            Write Your First Blog
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              showActions={true}
              onEdit={() => navigate(`/edit/${blog._id}`)}
              onDelete={() => handleDelete(blog._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBlogs;
