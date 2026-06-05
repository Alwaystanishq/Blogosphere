import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";
import BlogCard from "../components/BlogCard";

function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q");

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await api.get(`/blogs/search?q=${q}`);

        if (res.data.success) {
          setBlogs(res.data.results || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to search blogs");
      } finally {
        setLoading(false);
      }
    };

    if (q) {
      fetchSearch();
    } else {
      setLoading(false);
    }
  }, [q]);

  if (loading) {
    return (
      <div className="text-center pt-24 text-indigo-600 font-medium">
        Searching...
      </div>
    );
  }

  if (error) {
    return <div className="text-center pt-24 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">
          Search Results
        </h1>

        <p className="text-zinc-500">
          Showing results for{" "}
          <span className="font-semibold text-zinc-700">"{q}"</span>
        </p>
      </div>

      {/* Results */}
      {blogs.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-zinc-500">No blogs found matching "{q}".</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
