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
          setBlogs(res.data.blogs || []);
        }
      } catch (err) {
        setError("Failed to search blogs" ,err);
      } finally {
        setLoading(false);
      }
    };

    if (q) fetchSearch();
  }, [q]);

  if (loading) return <div className="text-center pt-24">Searching...</div>;
  if (error)
    return <div className="text-center pt-24 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{q}"</h1>

      {blogs.length === 0 ? (
        <p>No results found.</p>
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
