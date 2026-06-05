import { BiSolidLike } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function BlogCard({ blog, showActions = false, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border border-zinc-200 bg-white rounded-2xl p-5 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold text-indigo-600 mb-2 hover:text-indigo-700 transition">
            {blog.title}
          </h1>

          {/* Article Preview */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-6">
            {blog.article}
          </p>

          {/* Author */}
          <div className="flex items-center gap-2 mt-4">
            <img
              src={`http://localhost:5000${
                blog.writtenBy?.profilePic || "/uploads/default.png"
              }`}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover border border-zinc-200"
            />

            <span className="text-sm font-medium text-zinc-700">
              @{blog.writtenBy?.username}
            </span>
          </div>
        </div>

        {/* Like Badge */}
        <div
          className="flex items-center gap-1 bg-rose-100 text-rose-600 rounded-full px-3 py-2 text-sm font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          <BiSolidLike />
          <p>{blog.likedBy?.length || 0}</p>
        </div>
      </div>

      {/* Edit / Delete */}
      {showActions && (
        <div
          className="flex justify-end gap-4 mt-5 pt-4 border-t border-zinc-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onEdit}
            className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogCard;
