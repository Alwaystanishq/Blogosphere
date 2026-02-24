import Blog from "../models/BlogModel.js";
import User from "../models/userModel.js";

export const getBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogs = await Blog.find({ writtenBy: userId });
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
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, blogs });
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
    const userId = req.user._id;
    const blogId = req.params.id;
    const blog = await Blog.findOne({ _id: blogId, writtenBy: userId });
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error(`Error in oneBlog route ${error}`);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, article } = req.body;
    if (!title || !article) {
      return res
        .status(400)
        .json({ success: false, message: "all field are required" });
    }
    const blog = await Blog.create({
      title,
      article,
      writtenBy: userId,
    });
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
    const { title, article } = req.body;
    if (!title && !article) {
      return res
        .status(400)
        .json({ success: false, message: "At least one field is required" });
    }
    const blog = await Blog.findOne({
      _id: blogId,
      writtenBy: userId,
    });
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    if (title) blog.title = title;
    if (article) blog.article = article;
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
    const blogs = await Blog.find({ likedBy: userId })
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
    const blog = await Blog.findById(blogId);
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
    }).populate("writtenBy", "username").sort({ createdAt:-1 });
    return res.status(200).json({
      success:true,
      user,
      blogs
    })
  } catch (error) {
    console.error(`Error in profile route: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
