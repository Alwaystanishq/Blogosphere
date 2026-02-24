import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, randomName + ext);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG files are allowed"), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
