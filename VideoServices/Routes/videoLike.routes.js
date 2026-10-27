import { Router } from "express";
import {
  addLike,
  showNumberOfLike,
  createDislike,
  showNumberOfDislikes,
  addVideoComment,
  getVideoComments,
} from "../controller/video.likes.controller.js";
import { verifyJWT } from "../Middleware/verifyJwt.js";

const router = new Router();

// Protected routes: require authenticated user
router.route("/video/like-video/:videoId").patch(verifyJWT, addLike);
router.route("/video/dislike-video/:videoId").patch(verifyJWT, createDislike);
router.route("/video/comment/:videoId").post(verifyJWT, addVideoComment);

// Public read routes
router.route("/video/show-video-likes/:videoId").get(showNumberOfLike);
router.route("/video/show-video-dislikes/:videoId").get(showNumberOfDislikes);
router.route("/video/comments/:videoId").get(getVideoComments);

export { router };
