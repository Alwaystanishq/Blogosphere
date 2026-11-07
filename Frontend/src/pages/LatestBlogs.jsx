import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import BlogCard from "../components/BlogCard";

function FilteredBlogs({ category, tag, onFilter, onClear }) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    api.get("/blogs/latest", { params: { category: category || undefined, tag: tag || undefined }, signal: controller.signal })
      .then(({ data }) => {
        setResult({ blogs: data.blogs || [], topics: data.topics || { categories: [], tags: [] } });
      })
      .catch((err) => {
        if (!controller.signal.aborted) setResult({ error: err.response?.data?.message || "Failed to load blogs" });
      });
    return () => controller.abort();
  }, [category, tag]);

  const options = (values, selected) => [...new Set([...(values || []), ...(selected ? [selected] : [])])].sort();
  return (
    <>
      <div className="flex flex-wrap items-end gap-4 mb-8 bg-white border border-zinc-200 rounded-2xl p-5">
        <div className="flex-1 min-w-44">
          <label htmlFor="category-filter" className="block text-sm font-semibold text-zinc-700 mb-2">Category</label>
          <select id="category-filter" value={category} onChange={(event) => onFilter("category", event.target.value)} className="w-full border border-zinc-300 rounded-xl p-3">
            <option value="">All categories</option>
            {options(result?.topics?.categories, category).map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-44">
          <label htmlFor="tag-filter" className="block text-sm font-semibold text-zinc-700 mb-2">Tag</label>
          <select id="tag-filter" value={tag} onChange={(event) => onFilter("tag", event.target.value)} className="w-full border border-zinc-300 rounded-xl p-3">
            <option value="">All tags</option>
            {options(result?.topics?.tags, tag).map((value) => <option key={value} value={value}>#{value}</option>)}
          </select>
        </div>
        {(category || tag) && <button onClick={onClear} className="px-4 py-3 text-indigo-600 font-medium hover:underline">Clear filters</button>}
      </div>
      {!result ? <p role="status" className="text-center text-indigo-600">Loading latest blogs...</p>
        : result.error ? <p role="alert" className="text-center text-red-500">{result.error}</p>
        : result.blogs.length === 0 ? <div role="status" className="bg-white border border-zinc-200 rounded-2xl p-8 text-center text-zinc-500">{category || tag ? "No published blogs match these topics. Try another filter." : "No blogs found."}</div>
        : <div className="stories-grid">{result.blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}</div>}
    </>
  );
}

export default function LatestBlogs() {
  const [params, setParams] = useSearchParams();
  const category = (params.get("category") || "").trim().toLowerCase();
  const tag = (params.get("tag") || "").trim().toLowerCase();
  const onFilter = (name, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next);
  };
  const onClear = () => {
    const next = new URLSearchParams(params);
    next.delete("category");
    next.delete("tag");
    setParams(next);
  };
  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
      <div className="page-heading mb-10">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">Discover your next great read.</h1>
        <p className="text-zinc-500">Discover the newest stories, or browse by category and tag.</p>
      </div>
      <FilteredBlogs key={JSON.stringify([category, tag])} category={category} tag={tag} onFilter={onFilter} onClear={onClear} />
    </div>
  );
}
