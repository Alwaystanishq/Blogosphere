import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authToken } from "./middlewares/authMiddleware.js";
import userRoutes from "./routes/userRoute.js";
import blogRoutes from "./routes/blogRoute.js";
import { connectDB } from "./config/db.js";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const port = process.env.PORT || 5000;
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/blogs", authToken, blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
