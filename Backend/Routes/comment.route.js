import {Router} from 'express';
import { createComment, deleteTheComment, editComment, getAllCommentsofTweets  } from '../Controllers/comment.controllers.js'
import { verifyJWT } from '../Middlewares/verifyJwt.js';
 const router = Router();
router.route("/createComment/:tweetId").post(verifyJWT, createComment);
router.route("/deleteComment/:commentId").delete(verifyJWT,deleteTheComment);
router.route("/editComment/:commentId").patch(verifyJWT, editComment);
router.route("/getAllCommentsOfTweet/:tweetId").get(verifyJWT, getAllCommentsofTweets );
 export default router;
 