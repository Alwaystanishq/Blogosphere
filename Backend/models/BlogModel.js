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
    articleFormat: {
      type: String,
      enum: ["plain", "markdown"],
      default: "plain",
    },
    category: { type: String, trim: true, lowercase: true, maxlength: 60, default: "", index: true },
    tags: {
      type: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
      default: [],
      validate: { validator: (tags) => tags.length <= 5, message: "Use up to 5 tags" },
      index: true,
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
