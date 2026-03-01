import { BiSolidLike } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function BlogCard({ blog }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border border-zinc-200 rounded-2xl p-4 flex justify-between items-start hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="max-w-xl">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-semibold mb-1">{blog.title}</h1>

        {/* Article Preview */}
        <p className="text-gray-600 text-sm line-clamp-2">{blog.article}</p>

        {/* Author */}
        <div className="flex items-center gap-2 mt-3">
          <img
            src={`http://localhost:5000${blog.writtenBy?.profilePic || "/uploads/default.png"}`}
            alt="profile"
            className="w-6 h-6 rounded-full object-cover"
          />

          <span className="text-sm text-gray-500">
            @{blog.writtenBy?.username}
          </span>
        </div>
      </div>

      {/* Likes */}
      <div
        className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 rounded-full px-3 py-1 text-sm"
        onClick={(e) => e.stopPropagation()} // prevent navigation when clicking likes
      >
        <BiSolidLike />
        <p>{blog.likedBy?.length || 0}</p>
      </div>
    </div>
  );
}

export default BlogCard;
