import {Router} from "express"
import { apiRateLimiter } from "../Middlewares/ratelimiter.js";
import { verifyJWT } from "../Middlewares/verifyJwt.js";
import { listAllContacts , getUserContacts,particularUserInfo } from "../Controllers/user.controllers.js";
import { getCurrentUserData } from "../Controllers/user.controllers.js";
import { getIndividualsTweets } from "../Controllers/tweet.controller.js";
const router = Router();
router.route("/appContacts").get(listAllContacts);
router.route("/user_contacts/:userId").get(getUserContacts);
router.route("/user_tweets/:userId").get(verifyJWT,apiRateLimiter,getIndividualsTweets);
router.route("/user_data/:userId").get(verifyJWT,apiRateLimiter,particularUserInfo);
router.route("/current_user_data").get(verifyJWT,apiRateLimiter,getCurrentUserData);
export default router;