import {Router} from 'express';
import { apiRateLimiter } from '../Middlewares/ratelimiter.js';
import {
    followUser,
    unfollowUser,
    getAllFollowers,
    getAllFollowings,
    getALlFollowersOfLoggedInUser,
    getAllFollowingsOfLoggedInUser,
    isFolllowingUser,
  } from "../Controllers/follower.controller.js"
 import { verifyJWT } from '../Middlewares/verifyJwt.js';
 const router = Router();
 router.route("/isFollowingUser").get(verifyJWT, isFolllowingUser);
  router.route("/followUser/:followingId").post(verifyJWT,apiRateLimiter, followUser);
  router.route("/unfollowUser/:userId").post(verifyJWT,apiRateLimiter, unfollowUser);
    router.route("/getAllFollowers/:userId ").get(verifyJWT,apiRateLimiter, getAllFollowers);
    router.route("/getAllFollowings/:userId ").get(verifyJWT,apiRateLimiter, getAllFollowings);
    router.route("/getAllFollowersOfLoggedInUser").get(verifyJWT,apiRateLimiter, getALlFollowersOfLoggedInUser);
    router.route("/getAllFollowingsOfLoggedInUser").get(verifyJWT,apiRateLimiter, getAllFollowingsOfLoggedInUser);
 
 export default router;
