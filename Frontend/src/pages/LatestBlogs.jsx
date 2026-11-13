import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/api";
import BlogCard from "../components/BlogCard";

function FilteredBlogs({ category, tag, sort, onFilter, onClear }) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    api.get("/blogs/latest", { params: { category: category || undefined, tag: tag || undefined, sort }, signal: controller.signal })
      .then(({ data }) => {
        setResult({ blogs: data.blogs || [], topics: data.topics || { categories: [], tags: [] } });
      })
      .catch((err) => {
        if (!controller.signal.aborted) setResult({ error: err.response?.data?.message || "Failed to load blogs" });
      });
    return () => controller.abort();
  }, [category, tag, sort, attempt]);

  const options = (values, selected) => [...new Set([...(values || []), ...(selected ? [selected] : [])])].sort();
  return (
    <>
      <div className="filter-bar">
        <div className="flex-1 min-w-44">
          <label htmlFor="sort-filter" className="block text-sm font-semibold text-zinc-700 mb-2">Sort by</label>
          <select id="sort-filter" value={sort} onChange={(event) => onFilter("sort", event.target.value)} className="w-full border border-zinc-300 rounded-xl p-3">
            <option value="newest">Most recent</option>
            <option value="popular">Most liked</option>
          </select>
        </div>
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
      {!result ? <p role="status" className="page-status">Finding your next read…</p>
        : result.error ? <div role="alert" className="error-state"><p>{result.error}</p><button onClick={() => { setResult(null); setAttempt(attempt + 1); }}>Try again</button></div>
        : result.blogs.length === 0 ? <div role="status" className="empty-state"><h2>{category || tag ? "A different topic, perhaps?" : "The first story could be yours."}</h2><p>{category || tag ? "No stories match these filters. Clear them to see what else is here." : "There are no published stories here yet. Share a thought to start the conversation."}</p>{category || tag ? <button className="button-primary" onClick={onClear}>Clear filters</button> : <Link className="button-primary" to="/create">Write a story</Link>}</div>
        : <><div className="feed-label"><span>{sort === "popular" ? "Stories readers liked" : "Fresh perspectives"}</span><span>{result.blogs.length} {result.blogs.length === 1 ? "story" : "stories"}</span></div><div className="stories-grid">{result.blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}</div></>}

    </>
  );
}

export default function LatestBlogs() {
  const [params, setParams] = useSearchParams();
  const category = (params.get("category") || "").trim().toLowerCase();
  const tag = (params.get("tag") || "").trim().toLowerCase();
  const sort = params.get("sort") === "popular" ? "popular" : "newest";
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
        <p className="eyebrow">The reading room</p>
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">Follow your curiosity.</h1>
        <p className="text-zinc-500">A fresh perspective is a good place to start. Browse stories and find a topic that draws you in.</p>
      </div>
      <FilteredBlogs key={JSON.stringify([category, tag, sort])} category={category} tag={tag} sort={sort} onFilter={onFilter} onClear={onClear} />
    </div>
  );
}
