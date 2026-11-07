import { cachedFeed, invalidateFeeds } from "../utils/feedCache.js";
import { parseTopics } from "../utils/blogTopics.js";
import Comment from "../models/CommentModel.js";
import Blog from "../models/BlogModel.js";
import User from "../models/userModel.js";

export const getBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogs = await Blog.find({ writtenBy: userId }).populate("writtenBy", "username profilePic").sort({ updatedAt: -1 });
    if (blogs.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No blog found for this user" });
    }
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(`Error in getBlog route ${error}`);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const getlatestBlog = async (req, res) => {
  try {
    const { tag, category } = req.query;
    const sort = req.query.sort === "popular" ? "popular" : "newest";
    const { topics, error } = parseTopics({
      category,
      tags: tag === undefined ? undefined : [tag],
    });
    if (error) return res.status(400).json({ success: false, message: error });
    const payload = await cachedFeed("latest", [topics.category || "", topics.tags?.[0] || "", sort], async () => {
      const published = { status: { $ne: "draft" } };
      const filter = { ...published };
      if (topics.category) filter.category = topics.category;
      if (topics.tags?.length) filter.tags = topics.tags[0];
      const [blogs, categories, tags] = await Promise.all([
        sort === "popular"
          ? Blog.aggregate([
            { $match: filter },
            { $addFields: { likesCount: { $size: { $ifNull: ["$likedBy", []] } } } },
            { $sort: { likesCount: -1, createdAt: -1, _id: -1 } },
            { $limit: 10 },
          ]).then((blogs) => Blog.populate(blogs, { path: "writtenBy", select: "username profilePic" }))
          : Blog.find(filter).populate("writtenBy", "username profilePic").sort({ createdAt: -1, _id: -1 }).limit(10),
        Blog.distinct("category", published),
        Blog.distinct("tags", published),
      ]);
      return { success: true, blogs, topics: { categories: categories.filter(Boolean).sort(), tags: tags.filter(Boolean).sort() } };
    });
    res.status(200).json(payload);
  } catch (error) {
    console.error(`Error in getlatestBlog route ${error}`);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;
    const blog = await Blog.findOneAndDelete({
      _id: blogId,
      writtenBy: userId,
    });
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    await invalidateFeeds();
    await Comment.deleteMany({ blog: blogId });
    res.status(200).json({ success: true, message: "Blog Deleted" });
  } catch (error) {
    console.error(`Error in deleteBlog route ${error}`);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const oneBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId).populate(
      "writtenBy",
      "username profilePic",
    );

    if (!blog || (blog.status === "draft" && String(blog.writtenBy?._id || blog.writtenBy) !== String(req.user._id))) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(`Error in oneBlog route ${error}`);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { coverImage } = req.body;
    if (coverImage !== undefined && (typeof coverImage !== "string" || (coverImage !== "" && !/^\/uploads\/cover-[a-f0-9-]+\.(png|jpg|webp)$/.test(coverImage)))) {
      return res.status(400).json({ success: false, message: "Upload a valid cover image first" });
    }
    const { topics, error } = parseTopics(req.body);
    if (error) return res.status(400).json({ success: false, message: error });
    const userId = req.user._id;
    const { title = "", article = "", status = "published", articleFormat = "plain" } = req.body;
    if (!["plain", "markdown"].includes(articleFormat) || !["draft", "published"].includes(status) || typeof title !== "string" || typeof article !== "string") {
      return res.status(400).json({ success: false, message: "Invalid blog fields" });
    }
    if (status === "published" && (!title.trim() || !article.trim())) {
      return res.status(400).json({ success: false, message: "Title and article are required to publish" });
    }
    const blog = await Blog.create({ title, article, status, articleFormat, coverImage, ...topics, writtenBy: userId });
    await invalidateFeeds();
    res.status(201).json({ success: true, message: "Blog created", blog });
  } catch (error) {
    console.error(`Error in createBlog route ${error}`);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;
    const { coverImage } = req.body;
    if (coverImage !== undefined && (typeof coverImage !== "string" || (coverImage !== "" && !/^\/uploads\/cover-[a-f0-9-]+\.(png|jpg|webp)$/.test(coverImage)))) {
      return res.status(400).json({ success: false, message: "Upload a valid cover image first" });
    }
    const { topics, error } = parseTopics(req.body);
    if (error) return res.status(400).json({ success: false, message: error });
    const { title, article, status, articleFormat } = req.body;
    if ((articleFormat !== undefined && !["plain", "markdown"].includes(articleFormat)) ||
        (title !== undefined && typeof title !== "string") ||
        (article !== undefined && typeof article !== "string") ||
        (status !== undefined && !["draft", "published"].includes(status))) {
      return res.status(400).json({ success: false, message: "Invalid blog fields" });
    }
    const blog = await Blog.findOne({ _id: blogId, writtenBy: userId });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    Object.assign(blog, topics);
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (articleFormat !== undefined) blog.articleFormat = articleFormat;
    if (title !== undefined) blog.title = title;
    if (article !== undefined) blog.article = article;
    if (status !== undefined) blog.status = status;
    if (blog.status !== "draft" && (!blog.title.trim() || !blog.article.trim())) {
      return res.status(400).json({ success: false, message: "Title and article are required to publish" });
    }
    await blog.save();
    await invalidateFeeds();
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error(`Error in updateBlog route ${error}`);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const searchBlog = async (req, res) => {
  try {
    const { q = "", category, tag, sort = "newest" } = req.query;
    if (typeof q !== "string" || q.length > 200 || !["newest", "oldest", "popular"].includes(sort)) {
      return res.status(400).json({ success: false, message: "Use a search query up to 200 characters and a valid sort order" });
    }
    const { topics, error } = parseTopics({ category, tags: tag === undefined ? undefined : [tag] });
    if (error) return res.status(400).json({ success: false, message: error });
    const filter = { status: { $ne: "draft" } };
    if (topics.category) filter.category = topics.category;
    if (topics.tags?.length) filter.tags = topics.tags[0];
    if (q.trim()) {
      const pattern = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matches = { $regex: pattern, $options: "i" };
      const authors = await User.find({ $or: [{ username: matches }, { name: matches }] }).select("_id");
      filter.$or = [{ title: matches }, { article: matches }, { category: matches }, { tags: matches }, { writtenBy: { $in: authors.map((author) => author._id) } }];
    }
    const results = await Blog.aggregate([
      { $match: filter },
      { $addFields: { likesCount: { $size: { $ifNull: ["$likedBy", []] } } } },
      { $sort: sort === "popular" ? { likesCount: -1, createdAt: -1, _id: -1 } : { createdAt: sort === "oldest" ? 1 : -1, _id: sort === "oldest" ? 1 : -1 } },
    ]);
    await Blog.populate(results, { path: "writtenBy", select: "username profilePic" });
    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error(`Error in searchBlog route ${error}`);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const getLikedBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogs = await Blog.find({ likedBy: userId, status: { $ne: "draft" } })
      .populate("writtenBy", "username")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(`Error in getLikedBlogs controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const toggleLikeBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;
    const blog = await Blog.findOne({ _id: blogId, status: { $ne: "draft" } });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    const alreadyLiked = blog.likedBy.includes(userId);
    if (alreadyLiked) {
      blog.likedBy.pull(userId);
    } else {
      blog.likedBy.push(userId);
    }
    await blog.save();
    await invalidateFeeds();
    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Blog unliked" : "Blog liked",
    });
  } catch (error) {
    console.error(`Error in toggleLikeBlog: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTopLikedBlog = async (req, res) => {
  try {
    const payload = await cachedFeed("topLiked", [], async () => {
      const blogs = await Blog.aggregate([
        { $match: { status: { $ne: "draft" } } },
        { $addFields: { likesCount: { $size: { $ifNull: ["$likedBy", []] } } } },
        { $sort: { likesCount: -1, createdAt: -1, _id: -1 } },
        { $limit: 10 },
      ]);
      return { success: true, blogs };
    });
    return res.status(200).json(payload);
  } catch (error) {
    console.error(`Error in getTopLikedBlogs: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({
      username: username,
    }).select("username profilePic");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const blogs = await Blog.find({
      writtenBy: user._id,
      status: { $ne: "draft" },
    })
      .populate("writtenBy", "username")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      user,
      blogs,
    });
  } catch (error) {
    console.error(`Error in profile route: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
