import multer from "multer";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } }).single("cover");
export function uploadCover(req, res) {
  upload(req, res, async (error) => {
    if (error) return res.status(400).json({ success: false, message: error.code === "LIMIT_FILE_SIZE" ? "Cover image must be 5 MB or smaller" : "Upload one image using the cover field" });
    if (!req.file) return res.status(400).json({ success: false, message: "Choose a cover image" });
    const bytes = req.file.buffer;
    const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const webp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
    if (!png && !jpg && !webp) return res.status(400).json({ success: false, message: "Choose a PNG, JPEG, or WebP image" });
    try {
      const filename = `cover-${randomUUID()}.${png ? "png" : jpg ? "jpg" : "webp"}`;
      const folder = new URL("../uploads/", import.meta.url);
      await mkdir(folder, { recursive: true });
      await writeFile(new URL(filename, folder), bytes);
      res.status(201).json({ success: true, coverImage: `/uploads/${filename}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to upload image" });
    }
  });
}
