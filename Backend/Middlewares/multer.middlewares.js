import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import { existsSync, mkdirSync } from "fs";

// Resolve the upload directory relative to the project root (Backend/)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../public/temp");

// Ensure the directory exists (Render's filesystem is ephemeral)
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const upload = multer({ storage: storage });
