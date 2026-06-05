import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { BiSolidLike } from "react-icons/bi";

function Blog() {
  const { id } = useParams();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);

        if (res.data.success) {
          const blogData = res.data.blog;

          setBlog(blogData);
          setLikesCount(blogData.likedBy?.length || 0);

          if (user) {
            const alreadyLiked = blogData.likedBy?.some(
              (id) => id.toString() === user.id.toString(),
            );

            setLiked(alreadyLiked);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, user]);

  const handleLike = async () => {
    try {
      await api.post(`/blogs/like/${id}`);

      setLiked(!liked);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.log("Like failed", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center pt-24 text-indigo-600 font-medium">
        Loading blog...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 pt-24">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center pt-24">Blog not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
      <div className="bg-white rounded-3xl shadow-lg border border-zinc-200 p-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Author + Like */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <img
              src={`http://localhost:5000${
                blog.writtenBy?.profilePic || "/uploads/default.png"
              }`}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover border border-zinc-300"
            />

            <div>
              <p className="font-semibold text-zinc-800">
                @{blog.writtenBy?.username}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition font-medium
            ${
              liked
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-rose-100 text-rose-600 hover:bg-rose-200"
            }`}
          >
            <BiSolidLike size={18} />
            <span>{likesCount}</span>
          </button>
        </div>

        {/* Article */}
        <article className="leading-9 text-lg text-zinc-700 whitespace-pre-line">
          {blog.article}
        </article>
      </div>
    </div>
  );
}

export default Blog;
