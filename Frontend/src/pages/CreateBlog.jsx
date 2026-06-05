import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function CreateBlog() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    article: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.article) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/blogs", form);

      if (res.data.success) {
        navigate("/myblog");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
      <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-8">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">
          Create New Blog
        </h1>

        <p className="text-zinc-500 mb-8">
          Share your thoughts with the Blogosphere community.
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
              placeholder="Enter an engaging title..."
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
              value={form.article}
              onChange={handleChange}
              rows="12"
              placeholder="Write your story here..."
              className="w-full border border-zinc-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition disabled:opacity-70"
            >
              {loading ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
