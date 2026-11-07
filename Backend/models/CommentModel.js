import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  text: { type: String, trim: true, maxlength: 2000, default: "" },
  deleted: { type: Boolean, default: false },
}, { timestamps: true });
commentSchema.index({ blog: 1, parent: 1, createdAt: -1 });
export default mongoose.model("Comment", commentSchema);
