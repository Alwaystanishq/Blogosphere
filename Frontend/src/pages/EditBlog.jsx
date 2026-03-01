import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    article: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);

        if (res.data.success) {
          setForm({
            title: res.data.blog.title,
            article: res.data.blog.article,
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title && !form.article) {
      setError("At least one field is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await api.patch(`/blogs/${id}`, form);

      if (res.data.success) {
        navigate("/myblog");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center pt-24">Loading blog...</div>;
  }

  if (error && !form.title) {
    return <div className="text-center text-red-500 pt-24">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-2 font-medium">Title</label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        {/* Article */}
        <div>
          <label className="block mb-2 font-medium">Article</label>

          <textarea
            name="article"
            rows="10"
            value={form.article}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {saving ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}

export default EditBlog;
