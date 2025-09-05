import { Router } from "express";
import {addLike, showNumberOfLike, createDislike, showNumberOfDislikes } from '../controller/video.likes.controller.js'
const router = new Router();

router.route("/video/like-video/{videoId}").patch(addLike);
router.route("/video/dislike-video/{videoId}").patch(createDislike);
router.route("/video/show-video-likes/{videoId}").get(showNumberOfLike);
router.route("/video/show-video-dislikes/{videoId}").get(showNumberOfDislikes);
export {router}

