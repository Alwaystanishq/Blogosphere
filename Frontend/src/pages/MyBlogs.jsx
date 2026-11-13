import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlinePencilAlt } from "react-icons/hi";
import api from "../api/api";
import BlogCard from "../components/BlogCard";

export default function MyBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [attempt, setAttempt] = useState(0);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get("/blogs", { signal: controller.signal }).then(({ data }) => {
      setBlogs(data.blogs || []);
    }).catch((err) => {
      if (!controller.signal.aborted) setError(err.response?.data?.message || "Could not load your stories.");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);

  const handleDelete = async (id) => {
    if (deleting || !window.confirm("Delete this story permanently? This also removes its comments.")) return;
    setDeleting(id);
    setError("");
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((current) => current.filter((blog) => blog._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this story. Please try again.");
    } finally { setDeleting(null); }
  };
  const visible = blogs.filter((blog) => filter === "all" || (filter === "draft" ? blog.status === "draft" : blog.status !== "draft"));
  const count = (status) => blogs.filter((blog) => status === "all" || (status === "draft" ? blog.status === "draft" : blog.status !== "draft")).length;
  return <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
    <div className="page-heading flex flex-col md:flex-row justify-between md:items-center gap-6">
      <div><p className="eyebrow">Your writing desk</p><h1>Your stories.</h1><p className="text-zinc-500 mt-4">A home for your published words and your next big idea.</p></div>
      <Link to="/create" className="button-primary"><HiOutlinePencilAlt aria-hidden="true" /> Write a story</Link>
    </div>
    <div className="story-tabs" role="group" aria-label="Filter your stories">{[["all", "All stories"], ["published", "Published"], ["draft", "Drafts"]].map(([value, label]) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{count(value)}</span></button>)}</div>
    {error && <div role="alert" className="error-state mb-6"><p>{error}</p><button onClick={() => { setError(""); setLoading(true); setAttempt(attempt + 1); }}>Try again</button></div>}
    {loading ? <p className="page-status" role="status">Opening your writing desk…</p> : visible.length ? <div className="stories-grid">{visible.map((blog) => <BlogCard key={blog._id} blog={blog} showActions onEdit={() => navigate(`/edit/${blog._id}`)} onDelete={() => handleDelete(blog._id)} deleting={deleting === blog._id} />)}</div> : !error && <div className="empty-state"><h2>{filter === "draft" ? "Room for your next idea." : filter === "published" ? "Your audience can wait." : "Start with a sentence."}</h2><p>{filter === "published" ? "Your published stories will appear here. Keep working on a draft, or start something new." : "You don’t need the perfect words to begin. Start a story and save a private draft whenever you need a break."}</p><Link to="/create" className="button-primary">Write a story</Link></div>}
  </div>;
}
