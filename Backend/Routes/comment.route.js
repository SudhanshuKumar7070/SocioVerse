import {Router} from 'express';
import { apiRateLimiter } from '../Middlewares/ratelimiter.js';
import { createComment, deleteTheComment, editComment, getAllCommentsofTweets  } from '../Controllers/comment.controllers.js'
import { verifyJWT } from '../Middlewares/verifyJwt.js';
 const router = Router();
router.route("/createComment/:tweetId").post(verifyJWT,apiRateLimiter, createComment);
router.route("/deleteComment/:commentId").delete(verifyJWT,apiRateLimiter,deleteTheComment);
router.route("/editComment/:commentId").patch(verifyJWT,apiRateLimiter, editComment);
router.route("/getAllCommentsOfTweet/:tweetId").get(verifyJWT,apiRateLimiter, getAllCommentsofTweets );
 export default router;
 