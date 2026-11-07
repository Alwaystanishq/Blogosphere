import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      required: function () { return this.status !== "draft"; },
    },
    article: {
      type: String,
      default: "",
      required: function () { return this.status !== "draft"; },
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
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
