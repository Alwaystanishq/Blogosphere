import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "../uploads/default.png",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (!this.password) {
      return next(new Error("Password is required."));
    }
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
