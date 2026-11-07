import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function BlogEditor({ id, initialBlog = {} }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const storageKey = `blogosphere:writing:${user._id || user.id}:${id || "new"}`;
  const [recovered] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return saved && typeof saved.title === "string" && typeof saved.article === "string" ? saved : null;
    } catch {
      return null;
    }
  });
  const [form, setForm] = useState(recovered || {
    title: initialBlog.title || "",
    article: initialBlog.article || "",
  });
  const [recoveryMessage, setRecoveryMessage] = useState(recovered ? "Recovered your unfinished writing from this browser." : "Changes are saved automatically in this browser.");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const warnBeforeLeaving = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(form));
    } catch {
      // Keep writing possible even when browser storage is unavailable.
      window.addEventListener("beforeunload", warnBeforeLeaving);
    }
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [form, storageKey]);

  const handleChange = (event) => {
    const next = { ...form, [event.target.name]: event.target.value };
    setForm(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setRecoveryMessage("Changes saved in this browser. Use Save Draft to save to your account.");
    } catch {
      setRecoveryMessage("Browser recovery is unavailable. Save your changes to your account before leaving.");
    }
  };

  const save = async (status) => {
    if (status === "published" && (!form.title.trim() || !form.article.trim())) {
      setError("A title and article are required to publish.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { title: form.title, article: form.article, status };
      if (id) await api.patch(`/blogs/${id}`, payload);
      else await api.post("/blogs", payload);
      try { localStorage.removeItem(storageKey); } catch { /* Storage may be disabled. */ }
      navigate("/myblog");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save. Your writing is still in the editor.");
    } finally {
      setSaving(false);
    }
  };

  const isPublished = initialBlog.status !== "draft" && Boolean(id);
  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
      <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">{id ? "Edit Blog" : "Create New Blog"}</h1>
        <p role="status" className="text-zinc-500 mb-6">{recoveryMessage}</p>
        {error && <p role="alert" className="bg-red-100 text-red-600 p-3 rounded-xl mb-6">{error}</p>}
        <form onSubmit={(event) => { event.preventDefault(); save("published"); }} className="space-y-6">
          <fieldset disabled={saving} className="space-y-6">
            <div>
              <label htmlFor="blog-title" className="block mb-2 font-semibold text-zinc-700">Blog Title</label>
              <input id="blog-title" name="title" value={form.title} onChange={handleChange} placeholder="Enter an engaging title..." className="w-full border border-zinc-300 px-4 py-3 rounded-xl" />
            </div>
            <div>
              <label htmlFor="blog-article" className="block mb-2 font-semibold text-zinc-700">Article</label>
              <textarea id="blog-article" name="article" value={form.article} onChange={handleChange} rows="12" placeholder="Write your story here..." className="w-full border border-zinc-300 px-4 py-3 rounded-xl" />
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              {!isPublished && <button type="button" onClick={() => save("draft")} className="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-xl font-semibold">Save Draft</button>}
              <button type="submit" className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold">{saving ? "Saving..." : isPublished ? "Update Blog" : "Publish Blog"}</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
