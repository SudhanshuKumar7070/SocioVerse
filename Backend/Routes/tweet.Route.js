import  {Router} from 'express';
import { upload } from '../Middlewares/multer.middlewares.js';
import { apiRateLimiter } from '../Middlewares/ratelimiter.js';
import  {createTweet,deleteTweet,editTweet,listAllTweetsOfUser,getAllTweets, getTweetByTweetId,getIndividualsTweets} from "../Controllers/tweet.controller.js"
import { verifyJWT } from '../Middlewares/verifyJwt.js';

 const router = Router();
 router.route("/getAllTweets").get(verifyJWT,getAllTweets);
  router.route("/createTweet").post(verifyJWT,upload.fields([{
    name:"contentImage", maxCount:1
  },
{
  name:"contentVideo" , maxCount:1
}]),createTweet);
  router.route("/deleteTweet/:tweetId").delete(verifyJWT,apiRateLimiter,deleteTweet);
   router.route("/editTweet/:tweetId").patch(verifyJWT,apiRateLimiter,editTweet);
   router.route("/listAllTweetsOfUser").get(verifyJWT,apiRateLimiter,listAllTweetsOfUser);
   router.route("/getTweetById/:tweet_id").get(verifyJWT,apiRateLimiter,getTweetByTweetId);
   router.route("/userTweets/:userId").get(verifyJWT,apiRateLimiter,getIndividualsTweets)
 export default router
