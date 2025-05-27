import {Router} from 'express';
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
  router.route("/followUser/:followingId").post(verifyJWT, followUser);
  router.route("/unfollowUser/:userId").post(verifyJWT, unfollowUser);
    router.route("/getAllFollowers/:userId ").get(verifyJWT, getAllFollowers);
    router.route("/getAllFollowings/:userId ").get(verifyJWT, getAllFollowings);
    router.route("/getAllFollowersOfLoggedInUser").get(verifyJWT, getALlFollowersOfLoggedInUser);
    router.route("/getAllFollowingsOfLoggedInUser").get(verifyJWT, getAllFollowingsOfLoggedInUser);
 
 export default router;
