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
      className="border border-zinc-200 rounded-2xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="max-w-xl">
          {/* Title */}
          <h1 className="text-xl md:text-2xl font-semibold mb-1">
            {blog.title}
          </h1>

          {/* Article */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {blog.article}
          </p>

          {/* Author */}
          <div className="flex items-center gap-2 mt-3">
            <img
              src={`http://localhost:5000${
                blog.writtenBy?.profilePic || "/uploads/default.png"
              }`}
              alt="profile"
              className="w-6 h-6 rounded-full object-cover"
            />

            <span className="text-sm text-gray-500">
              @{blog.writtenBy?.username}
            </span>
          </div>
        </div>

        {/* Like */}
        <div
          className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 rounded-full px-3 py-1 text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <BiSolidLike />
          <p>{blog.likedBy?.length || 0}</p>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div
          className="flex justify-end gap-4 mt-4 text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onEdit}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogCard;