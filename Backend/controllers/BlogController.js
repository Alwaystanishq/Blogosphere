import { parseTopics } from "../utils/blogTopics.js";
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
    const { topics, error } = parseTopics({
      category,
      tags: tag === undefined ? undefined : [tag],
    });
    if (error) return res.status(400).json({ success: false, message: error });
    const published = { status: { $ne: "draft" } };
    const filter = { ...published };
    if (topics.category) filter.category = topics.category;
    if (topics.tags?.length) filter.tags = topics.tags[0];
    const [blogs, categories, tags] = await Promise.all([
      Blog.find(filter).populate("writtenBy", "username profilePic").sort({ createdAt: -1 }).limit(10),
      Blog.distinct("category", published),
      Blog.distinct("tags", published),
    ]);
    res.status(200).json({
      success: true,
      blogs,
      topics: { categories: categories.filter(Boolean).sort(), tags: tags.filter(Boolean).sort() },
    });
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
    const blog = await Blog.create({ title, article, status, articleFormat, ...topics, writtenBy: userId });
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
    if (articleFormat !== undefined) blog.articleFormat = articleFormat;
    if (title !== undefined) blog.title = title;
    if (article !== undefined) blog.article = article;
    if (status !== undefined) blog.status = status;
    if (blog.status !== "draft" && (!blog.title.trim() || !blog.article.trim())) {
      return res.status(400).json({ success: false, message: "Title and article are required to publish" });
    }
    await blog.save();
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
    const q = req.query.q;
    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const results = await Blog.find({
      title: { $regex: q, $options: "i" },
      status: { $ne: "draft" },
    });
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
    const blogs = await Blog.aggregate([
      { $match: { status: { $ne: "draft" } } },
      {
        $addFields: {
          likesCount: { $size: "$likedBy" },
        },
      },
      {
        $sort: { likesCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    return res.status(200).json({
      success: true,
      blogs,
    });
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
