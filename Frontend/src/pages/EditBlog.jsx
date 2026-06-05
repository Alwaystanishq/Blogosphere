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
    return (
      <div className="text-center pt-24 text-indigo-600 font-medium">
        Loading blog...
      </div>
    );
  }

  if (error && !form.title) {
    return <div className="text-center text-red-500 pt-24">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
      <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-8">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">Edit Blog</h1>

        <p className="text-zinc-500 mb-8">
          Update your article and keep it fresh.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold text-zinc-700">
              Blog Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-zinc-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Article */}
          <div>
            <label className="block mb-2 font-semibold text-zinc-700">
              Article
            </label>

            <textarea
              name="article"
              rows="12"
              value={form.article}
              onChange={handleChange}
              className="w-full border border-zinc-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition disabled:opacity-70"
            >
              {saving ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
