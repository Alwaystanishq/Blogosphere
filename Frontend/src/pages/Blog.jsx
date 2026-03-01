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

  // Fetch Blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);

        if (res.data.success) {
          const blogData = res.data.blog;

          setBlog(blogData);

          // Likes Count
          setLikesCount(blogData.likedBy?.length || 0);

          // Check if current user liked
          if (user) {
            const alreadyLiked = blogData.likedBy?.includes(user.id);

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

  // Toggle Like
  const handleLike = async () => {
    try {
      await api.post(`/blogs/like/${id}`);

      setLiked(!liked);

      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.log("Like failed", error);
    }
  };

  if (loading) return <div className="text-center pt-24">Loading blog...</div>;

  if (error)
    return <div className="text-center text-red-500 pt-24">{error}</div>;

  if (!blog) return <div className="text-center pt-24">Blog not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

      {/* Author + Like Row */}

      <div className="flex justify-between items-center mb-10">
        {/* Author */}

        <div className="flex items-center gap-3">
          <img
            src={`http://localhost:5000${blog.writtenBy?.profilePic}`}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <p className="font-medium">@{blog.writtenBy?.username}</p>

            <p className="text-sm text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Like Button */}

        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition
          ${liked ? "bg-black text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}
        >
          <BiSolidLike />

          <span>{likesCount}</span>
        </button>
      </div>

      {/* Article */}

      <div className="leading-8 text-gray-800 whitespace-pre-line">
        {blog.article}
      </div>
    </div>
  );
}

export default Blog;
