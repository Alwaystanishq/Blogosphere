import express from "express";
import { uploadCover } from "../middlewares/coverUpload.js";
import { getComments, addComment, deleteComment } from "../controllers/commentController.js";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getlatestBlog,
  getLikedBlog,
  getTopLikedBlog,
  oneBlog,
  profile,
  searchBlog,
  toggleLikeBlog,
  updateBlog,
} from "../controllers/BlogController.js";

const router = express.Router();

router.get("/", getBlog);
router.get("/latest", getlatestBlog);
router.post("/", createBlog);
router.post("/cover", uploadCover);
router.get("/:id/comments", getComments);
router.post("/:id/comments", addComment);
router.delete("/:id/comments/:commentId", deleteComment);
router.get("/search", searchBlog);
router.get("/liked", getLikedBlog);
router.get("/topLiked", getTopLikedBlog);
router.get("/profile/:username", profile);
router.post("/like/:id", toggleLikeBlog);
router.delete("/:id", deleteBlog);
router.get("/:id", oneBlog);
router.patch("/:id", updateBlog);

export default router;
