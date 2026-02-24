import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    article: {
      type: String,
      required: true,
    },
    writtenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
