import Router from "express"
import { apiRateLimiter } from '../Middlewares/ratelimiter.js';
import { toggleTweetLike ,toggleCommentLike,IsCurrentTweetOrCommentLiked} from "../Controllers/like.controller.js"
import { verifyJWT } from "../Middlewares/verifyJwt.js";
const router = Router();
router.route("/toggle_tweet_like/:tweetId").put(verifyJWT,apiRateLimiter,toggleTweetLike)
router.route("/isContentLiked/tweet/:tweetId").get(verifyJWT, IsCurrentTweetOrCommentLiked);
router.route("/isContentLiked/comment/:commentId").get(verifyJWT, IsCurrentTweetOrCommentLiked);
export default router
