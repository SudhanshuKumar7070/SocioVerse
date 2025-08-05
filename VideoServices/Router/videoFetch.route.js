import { Router } from "express";
const router = new Router();
import {fetchReelVideo} from "../controller/videoUpload.controller.js"
router.route("/video/fetch").get(fetchReelVideo);
 export default router