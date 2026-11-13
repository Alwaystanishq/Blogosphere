import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "../components/Comments";
import { imageUrl } from "../utils/imageUrl";
import BlogTopics from "../components/BlogTopics";
import ArticleContent from "../components/ArticleContent";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { BiSolidLike } from "react-icons/bi";

function BlogContent({ id }) {
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liking, setLiking] = useState(false);
  const [likeError, setLikeError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`, { signal: controller.signal });

        if (res.data.success) {
          const blogData = res.data.blog;

          setBlog(blogData);
          setLikesCount(blogData.likedBy?.length || 0);

          if (user) {
            const alreadyLiked = blogData.likedBy?.some(
              (likeId) => likeId.toString() === (user._id || user.id).toString(),
            );

            setLiked(alreadyLiked);
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchBlog();
    return () => controller.abort();
  }, [id, user]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    setLikeError("");
    try {
      await api.post(`/blogs/like/${id}`);

      setLiked(!liked);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      setLikeError(err.response?.data?.message || "Could not update your like. Please try again.");
    } finally { setLiking(false); }
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
    <div className="reading-page max-w-4xl mx-auto px-4 pt-20 pb-10">
      <div className="reading-sheet">
        {blog.coverImage && <img src={imageUrl(blog.coverImage)} alt="" width="800" height="450" className="w-full max-h-96 object-cover rounded-2xl mb-6" />}
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-6 leading-tight">
          {blog.title}
        </h1>

        <BlogTopics category={blog.category} tags={blog.tags} />

        {/* Author + Like */}
        <div className="article-byline flex justify-between items-center mb-10 pb-6 border-b border-zinc-200">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Link to={`/profile/${blog.writtenBy?.username}`}>
              <img
                src={imageUrl(blog.writtenBy?.profilePic || "/uploads/default.png")}
                alt={`${blog.writtenBy?.username || "Writer"}’s profile`}
                width="48" height="48"
                className="w-12 h-12 rounded-full object-cover border border-zinc-300 hover:scale-105 transition"
              />
            </Link>

            <div>
              <Link
                to={`/profile/${blog.writtenBy?.username}`}
                className="font-semibold text-indigo-600 hover:underline"
              >
                @{blog.writtenBy?.username}
              </Link>

              <p className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Like Button */}
          <button
            hidden={blog.status === "draft"}
            onClick={handleLike}
            disabled={liking}
            aria-pressed={Boolean(liked)}
            aria-label={`${liked ? "Unlike" : "Like"} this story (${likesCount} likes)`}
            className="like-button flex items-center gap-2 px-5 py-2 rounded-full font-medium"
          >
            <BiSolidLike size={18} />
            <span>{likesCount}</span>
          </button>
        </div>

        {likeError && <p role="alert" className="error-state mb-6">{likeError}</p>}
        <article className="leading-9 text-lg text-zinc-700">
          <ArticleContent article={blog.article} format={blog.articleFormat} />
        </article>
        {blog.status !== "draft" && <Comments key={blog._id} blogId={blog._id} blogAuthorId={blog.writtenBy?._id} />}
      </div>
    </div>
  );
}

export default function Blog() {
  const { id } = useParams();
  return <BlogContent key={id} id={id} />;
}
