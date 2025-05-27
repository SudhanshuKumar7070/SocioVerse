import  {Router} from 'express';
import { upload } from '../Middlewares/multer.middlewares.js';
import  {createTweet,deleteTweet,editTweet,listAllTweetsOfUser,getAllTweets} from "../Controllers/tweet.controller.js"
import { verifyJWT } from '../Middlewares/verifyJwt.js';

 const router = Router();
 router.route("/getAllTweets").get(verifyJWT,getAllTweets);
  router.route("/createTweet").post(verifyJWT,upload.fields([{
    name:"contentImage", maxCount:1
  },
{
  name:"contentVideo" , maxCount:1
}]),createTweet);
  router.route("/deleteTweet/:tweetId").delete(verifyJWT,deleteTweet);
   router.route("/editTweet/:tweetId").patch(verifyJWT,editTweet);
   router.route("/listAllTweetsOfUser").get(verifyJWT,listAllTweetsOfUser);
 export default router
