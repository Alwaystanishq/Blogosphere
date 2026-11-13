import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import BlogCard from "../components/BlogCard";

function SearchView({ filters, onSearch, onClear }) {
  const [form, setForm] = useState(filters);
  const [result, setResult] = useState(null);
  const [topics, setTopics] = useState({ categories: [], tags: [] });
  const { q, category, tag, sort } = filters;
  useEffect(() => {
    const controller = new AbortController();
    api.get("/blogs/search", { params: { q, category, tag, sort }, signal: controller.signal }).then(({ data }) => {
      setResult({ blogs: data.results || [] });
    }).catch((err) => {
      if (!controller.signal.aborted) setResult({ error: err.response?.data?.message || "Failed to search blogs" });
    });
    api.get("/blogs/latest", { signal: controller.signal }).then(({ data }) => setTopics(data.topics || { categories: [], tags: [] })).catch(() => {});
    return () => controller.abort();
  }, [q, category, tag, sort]);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const options = (values, current) => [...new Set([...values, ...(current ? [current] : [])])].sort();
  return <>
    <form onSubmit={(event) => { event.preventDefault(); onSearch(form); }} className="search-form space-y-4">
      <div>
        <label htmlFor="search-query" className="block font-semibold text-zinc-700 mb-2">Search</label>
        <input id="search-query" name="q" value={form.q} onChange={change} maxLength={200} placeholder="Search titles, articles, authors, or topics" className="w-full border border-zinc-300 rounded-xl p-3" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium text-zinc-700">Category
          <select name="category" value={form.category} onChange={change} className="block w-full border border-zinc-300 rounded-xl p-3 mt-2">
            <option value="">All categories</option>
            {options(topics.categories, form.category).map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-zinc-700">Tag
          <select name="tag" value={form.tag} onChange={change} className="block w-full border border-zinc-300 rounded-xl p-3 mt-2">
            <option value="">All tags</option>
            {options(topics.tags, form.tag).map((value) => <option key={value} value={value}>#{value}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-zinc-700">Sort by
          <select name="sort" value={form.sort} onChange={change} className="block w-full border border-zinc-300 rounded-xl p-3 mt-2">
            <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="popular">Most liked</option>
          </select>
        </label>
      </div>
      <div className="flex gap-4">
        <button className="rounded-xl bg-indigo-600 text-white px-5 py-3 font-semibold">Search stories</button>
        <button type="button" onClick={onClear} className="text-indigo-600 hover:underline">Clear search</button>
      </div>
    </form>
    {!result ? <p role="status" className="page-status">Searching...</p> : result.error ? <p role="alert" className="error-state">{result.error}</p> : <>
      <p role="status" className="text-zinc-500 mb-4">{result.blogs.length} {result.blogs.length === 1 ? "post" : "posts"} found{q ? ` for “${q}”` : ""}.</p>
      {result.blogs.length === 0 ? <div className="empty-state">No matching posts. Try different words or clear the filters.</div> : <div className="stories-grid">{result.blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}</div>}
    </>}
  </>;
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [revision, setRevision] = useState(0);
  const filters = {
    q: params.get("q") || "",
    category: params.get("category") || "",
    tag: params.get("tag") || "",
    sort: params.get("sort") || "newest",
  };
  const onSearch = (form) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(form)) if (value.trim()) next.set(key, value.trim());
    setParams(next);
    setRevision((current) => current + 1);
  };
  return <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
    <div className="page-heading"><p className="eyebrow">A little exploration</p><h1>Find your next read.</h1><p className="text-zinc-500">Search stories, writers, and the topics on your mind.</p></div>
    <SearchView key={`${params.toString()}:${revision}`} filters={filters} onSearch={onSearch} onClear={() => { setParams({}); setRevision((current) => current + 1); }} />
  </div>;
}
