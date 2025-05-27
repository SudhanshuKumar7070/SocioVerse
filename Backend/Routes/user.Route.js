import {Router} from "express"
import { verifyJWT } from "../Middlewares/verifyJwt.js";
import { listAllContacts , getUserContacts,particularUserInfo } from "../Controllers/user.controllers.js";
import { getIndividualsTweets } from "../Controllers/tweet.controller.js";
const router = Router();
router.route("/appContacts").get(listAllContacts);
router.route("/user_contacts/:userId").get(getUserContacts);
router.route("/user_tweets/:userId").get(verifyJWT,getIndividualsTweets);
router.route("/user_data/:userId").get(verifyJWT,particularUserInfo)

export default router;