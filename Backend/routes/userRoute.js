import express from "express";
import {
  checkLogin,
  loginController,
  logoutController,
  signupController,
} from "../controllers/userController.js";
import { authToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/Multer.js";
const router = express.Router();

router.post("/login", loginController);
router.post("/signup", upload.single("profilePic"),signupController);
router.post("/logout", logoutController);
router.get("/check", authToken, checkLogin);
export default router;
