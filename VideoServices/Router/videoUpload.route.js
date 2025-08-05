import { Router } from "express";
import { upload } from "../Middleware/multer.setup.js";
import {processVideo} from '../controller/videoUpload.controller.js'
 const router = new Router();
 router.route("/video/upload").post(upload.single('file'), processVideo)
 export default router