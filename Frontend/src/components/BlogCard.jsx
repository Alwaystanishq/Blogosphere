import { BiSolidLike } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

function BlogCard({ blog, showActions = false, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold text-indigo-600 mb-2">
            {blog.title}
          </h1>

          {/* Article Preview */}
          <p className="text-zinc-600 line-clamp-2">{blog.article}</p>

          {/* Author */}
          <div className="flex items-center gap-2 mt-4">
            <Link
              to={`/profile/${blog.writtenBy?.username}`}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`http://localhost:5000${
                  blog.writtenBy?.profilePic || "/uploads/default.png"
                }`}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover border border-zinc-300 hover:scale-105 transition"
              />
            </Link>

            <Link
              to={`/profile/${blog.writtenBy?.username}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              @{blog.writtenBy?.username}
            </Link>
          </div>
        </div>

        {/* Likes */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 bg-rose-100 text-rose-600 px-3 py-2 rounded-full"
        >
          <BiSolidLike />
          <span>{blog.likedBy?.length || 0}</span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div
          className="flex justify-end gap-4 mt-5 pt-4 border-t border-zinc-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogCard;
