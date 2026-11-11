import express from "express";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authToken } from "./middlewares/authMiddleware.js";
import userRoutes from "./routes/userRoute.js";
import blogRoutes from "./routes/blogRoute.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { connectDB } from "./config/db.js";
import { apiLimiter } from "./middlewares/rateLimit.js";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api", apiLimiter);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(fileURLToPath(new URL("./uploads/", import.meta.url))));
const port = process.env.PORT || 5000;
connectDB();
connectRedis();

app.use("/api/user", userRoutes);
app.use("/api/blogs", authToken, blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.once("SIGINT", () => { disconnectRedis(); process.exit(0); });
process.once("SIGTERM", () => { disconnectRedis(); process.exit(0); });
