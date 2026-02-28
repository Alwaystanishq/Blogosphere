import React from "react";
import { BiSolidLike } from "react-icons/bi";

function BlogCard() {
  return (
    <div className="border border-zinc-200 rounded-2xl p-4 flex justify-between items-start hover:shadow-md transition-all duration-300">
      <div className="max-w-xl">
        <h1 className="text-xl md:text-2xl font-semibold mb-1">Blog Title</h1>

        <p className="text-gray-600 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit...
        </p>

        <div className="flex items-center gap-2 mt-3">
          <img
            src="/avatar.png"
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-500">@username</span>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 rounded-full px-3 py-1 text-sm cursor-pointer">
        <BiSolidLike />
        <p>100</p>
      </div>
    </div>
  );
}

export default BlogCard;
