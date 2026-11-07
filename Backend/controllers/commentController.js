import mongoose from "mongoose";
import Blog from "../models/BlogModel.js";
import Comment from "../models/CommentModel.js";

async function publishedBlog(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid blog ID" });
    return null;
  }
  const blog = await Blog.findOne({ _id: req.params.id, status: { $ne: "draft" } });
  if (!blog) res.status(404).json({ success: false, message: "Published blog not found" });
  return blog;
}

export async function getComments(req, res) {
  try {
    if (!await publishedBlog(req, res)) return;
    const page = Number(req.query.page || 1);
    if (!Number.isSafeInteger(page) || page < 1 || page > 10000) return res.status(400).json({ success: false, message: "Invalid page" });
    const roots = await Comment.find({ blog: req.params.id, parent: null }).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(21).populate("author", "username profilePic").lean();
    const hasMore = roots.length > 20;
    const comments = roots.slice(0, 20);
    const replies = await Comment.find({ blog: req.params.id, parent: { $in: comments.map((comment) => comment._id) } }).sort({ createdAt: 1, _id: 1 }).populate("author", "username profilePic").lean();
    res.json({ success: true, comments: comments.map((comment) => ({ ...comment, replies: replies.filter((reply) => String(reply.parent) === String(comment._id)) })), hasMore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load comments" });
  }
}

export async function addComment(req, res) {
  try {
    if (!await publishedBlog(req, res)) return;
    const { text, parent = null } = req.body;
    if (typeof text !== "string" || !text.trim() || text.trim().length > 2000) return res.status(400).json({ success: false, message: "Write a comment between 1 and 2000 characters" });
    if (parent !== null) {
      if (!mongoose.isValidObjectId(parent)) return res.status(400).json({ success: false, message: "Invalid reply target" });
      const root = await Comment.findOne({ _id: parent, blog: req.params.id, parent: null, deleted: false });
      if (!root) return res.status(404).json({ success: false, message: "Comment is no longer available for replies" });
    }
    const comment = await Comment.create({ blog: req.params.id, author: req.user._id, text: text.trim(), parent });
    await comment.populate("author", "username profilePic");
    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to post comment" });
  }
}

export async function deleteComment(req, res) {
  try {
    const blog = await publishedBlog(req, res);
    if (!blog) return;
    if (!mongoose.isValidObjectId(req.params.commentId)) return res.status(400).json({ success: false, message: "Invalid comment ID" });
    const comment = await Comment.findOne({ _id: req.params.commentId, blog: blog._id });
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    if (String(comment.author) !== String(req.user._id) && String(blog.writtenBy) !== String(req.user._id)) return res.status(403).json({ success: false, message: "You cannot remove this comment" });
    comment.text = "";
    comment.deleted = true;
    await comment.save();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to remove comment" });
  }
}
