import {Router} from "express"
import { apiRateLimiter } from "../Middlewares/ratelimiter.js";
import { verifyJWT } from "../Middlewares/verifyJwt.js";
import {
  listAllContacts,
  getUserContacts,
  particularUserInfo,
  getCurrentUserData,
  updateProfileDetails,
  changeCurrentPassword,
} from "../Controllers/user.controllers.js";
import { getIndividualsTweets } from "../Controllers/tweet.controller.js";
import { upload } from "../Middlewares/multer.middlewares.js";

const router = Router();
router.route("/appContacts").get(listAllContacts);
router.route("/user_contacts/:userId").get(getUserContacts);
router.route("/user_tweets/:userId").get(verifyJWT, apiRateLimiter, getIndividualsTweets);
router.route("/user_data/:userId").get(verifyJWT, apiRateLimiter, particularUserInfo);
router.route("/current_user_data").get(verifyJWT, apiRateLimiter, getCurrentUserData);

// Update profile details and change password
router.route("/update_profile").patch(
  verifyJWT,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  updateProfileDetails
);

router.route("/change_password").post(verifyJWT, changeCurrentPassword);

export default router;