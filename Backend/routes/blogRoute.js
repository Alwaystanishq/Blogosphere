import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getlatestBlog,
  getLikedBlog,
  getTopLikedBlog,
  oneBlog,
  searchBlog,
  toggleLikeBlog,
  updateBlog,
} from "../controllers/BlogController.js";

const router = express.Router();

router.get("/", getBlog);
router.get("/latest", getlatestBlog);
router.post("/", createBlog);
router.get("/search", searchBlog);
router.get("/liked", getLikedBlog)
router.get("/topLiked", getTopLikedBlog)
router.post("/like/:id", toggleLikeBlog)
router.delete("/:id", deleteBlog);
router.get("/:id", oneBlog);
router.patch("/:id", updateBlog);

export default router;
