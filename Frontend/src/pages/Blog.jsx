import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function Blog() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);

        if (res.data.success) {
          setBlog(res.data.blog);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Loading
  if (loading) return <div className="text-center pt-24">Loading blog...</div>;

  // Error
  if (error)
    return <div className="text-center text-red-500 pt-24">{error}</div>;

  // No Blog
  if (!blog) return <div className="text-center pt-24">Blog not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

      {/* Author */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <span>
          Written by{" "}
          <span className="font-medium">@{blog.writtenBy?.username}</span>
        </span>

        <span>•</span>

        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Article */}
      <div className="prose max-w-none leading-7 text-gray-800 whitespace-pre-line">
        {blog.article}
      </div>
    </div>
  );
}

export default Blog;
