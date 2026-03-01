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
    <div className="max-w-4xl mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>

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
            placeholder="Enter blog title"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        {/* Article */}
        <div>
          <label className="block mb-2 font-medium">Article</label>

          <textarea
            name="article"
            value={form.article}
            onChange={handleChange}
            rows="10"
            placeholder="Write your article..."
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
