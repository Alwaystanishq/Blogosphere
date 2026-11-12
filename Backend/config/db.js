import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URI?.trim()) {
    throw new Error("MONGO_URI is required in Backend/.env");
  }
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`Database connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};
