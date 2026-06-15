import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync, mkdirSync } from "fs";

// Ensure upload directory exists (Render's filesystem is ephemeral)
const uploadDir = "./Public/temp";
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique ID per upload, not once at module load
    const id = uuidv4();
    cb(null, file.fieldname + "-" + id + path.extname(file.originalname));
  },
});
export const upload = multer({ storage: storage });