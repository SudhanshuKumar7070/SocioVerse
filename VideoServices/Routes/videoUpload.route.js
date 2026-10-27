import { Router } from "express";
import { upload } from "../Middleware/multer.setup.js";
import { processVideo } from "../controller/videoUpload.controller.js";
import { verifyJWT } from "../Middleware/verifyJwt.js";

const router = new Router();

// Protect upload endpoint: verify authentication before processing file upload
router.route("/video/upload").post(verifyJWT, upload.single("file"), processVideo);

export default router;