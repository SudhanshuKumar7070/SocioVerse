import {Router} from 'express';
import { apiRateLimiter } from '../Middlewares/ratelimiter.js';
import { verifyJWT } from '../Middlewares/verifyJwt.js';
import {updateIsRead,getFriendRequestNotification,getChatNotification} from "../Controllers/notification.controller.js"
const router = Router();
router.route('/update_isRead/:notificationId').patch(verifyJWT,apiRateLimiter,updateIsRead);
router.route('/friendRequestsNotifications').get(verifyJWT,apiRateLimiter,getFriendRequestNotification);
router.route('/chatsNotifications').get(verifyJWT,apiRateLimiter,getChatNotification);
export default router
