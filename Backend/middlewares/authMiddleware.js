import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token Not found, Login again" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(`Error in AuthToken Middleware ${error}`);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};
