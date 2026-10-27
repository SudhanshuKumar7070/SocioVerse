import { Router } from "express";
import { apiRateLimiter } from "../Middlewares/ratelimiter.js";
import { verifyJWT } from "../Middlewares/verifyJwt.js";
import {
  updateIsRead,
  getAllUserNotifications,
  getFriendRequestNotification,
  getChatNotification,
  getTweetNotification,
} from "../Controllers/notification.controller.js";

const router = Router();

router.route("/allNotifications").get(verifyJWT, apiRateLimiter, getAllUserNotifications);
router.route("/update_isRead/:notificationId").patch(verifyJWT, apiRateLimiter, updateIsRead);
router.route("/friendRequestsNotifications").get(verifyJWT, apiRateLimiter, getFriendRequestNotification);
router.route("/chatsNotifications").get(verifyJWT, apiRateLimiter, getChatNotification);
router.route("/tweetNotifications").get(verifyJWT, apiRateLimiter, getTweetNotification);

export default router;
