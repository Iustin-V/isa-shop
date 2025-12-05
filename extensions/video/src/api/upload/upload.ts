import multer from "multer";
import path from "path";
import fs from "fs";
import { moveFile } from "../../utils/move-file.js";

const upload = multer({ dest: "/tmp" }).single("video");

export default async function (req, res, next) {
  upload(req, res, async function (err) {
    if (err) {
      return next(err);
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const videosDir = path.join(process.cwd(), "videos");
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir);
      }

      const originalExt = path.extname(req.file.originalname);
      const finalName = req.file.filename + originalExt;
      const finalPath = path.join(videosDir, finalName);

      await moveFile(req.file.path, finalPath);

      return res.json({
        success: true,
        filename: finalName,
      });
    } catch (e) {
      next(e);
    }
  });
}
