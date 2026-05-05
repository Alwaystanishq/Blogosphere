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
      "Are you sure you want to delete this blog?"
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
    return <div className="text-center pt-24">Loading your blogs...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 pt-24">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Blogs</h1>

        <button
          onClick={() => navigate("/create")}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Create Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-500">You haven’t written any blogs yet.</p>
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