import {Router} from 'express'
import { verifyJWT } from '../Middlewares/verifyJwt.js';
import {updateIsRead,getFriendRequestNotification,getChatNotification} from "../Controllers/notification.controller.js"
const router = Router();
router.route('/update_isRead/:notificationId').patch(verifyJWT,updateIsRead);
router.route('/friendRequestsNotifications').get(verifyJWT,getFriendRequestNotification);
router.route('/chatsNotifications').get(verifyJWT,getChatNotification);
export default router
