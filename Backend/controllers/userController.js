import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ success: false, message: "All field are required" });
    }
    const loginUser = await User.findOne({ email: email });
    if (!loginUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const ismatch = await bcrypt.compare(password, loginUser.password);
    if (!ismatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: loginUser._id,
        email: loginUser.email,
        name: loginUser.name,
        username: loginUser.username,
        profilePic: loginUser.profilePic,
      },
    });
  } catch (error) {
    console.error(`server error in loginController ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    console.error(`server error in logoutController ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const signupController = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All field are required" });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already registered" });
    }
    const usernameExists = await User.findOne({ username: username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ success: false, message: "This Username is not available" });
    }
    let profilePicPath;
    if (req.file) {
      profilePicPath = `/uploads/${req.file.filename}`;
    }
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
      username: username,
      profilePic: profilePicPath,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        profilePic: newUser.profilePic,
      },
    });
  } catch (error) {
    console.error(`server error in signupController ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const checkLogin = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(`server error in checkLoginController ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
