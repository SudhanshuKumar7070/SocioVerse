import {Router} from "express"
import { verifyJWT } from "../Middlewares/verifyJwt.js";
import {sendFriendRequest, acceptFriendRequest,checkIsFriendRequestAccepted,getAllFriendRequest,rejectFriendRequest} from '../Controllers/friendRequest.controller.js'
 const router = Router();

 router.route("/send_friend_request/:receiverId").post(verifyJWT,sendFriendRequest);
 router.route("/accept_friend_request/:friendRequestId").patch(verifyJWT, acceptFriendRequest);
 router.route("/reject_friend_request/:friendRequestId").patch(verifyJWT, rejectFriendRequest);
 router.route("/check_request_status/:friendRequestId").get(verifyJWT, checkIsFriendRequestAccepted);
  router.route("/fetch_friend_requests").get(verifyJWT,getAllFriendRequest)
 export default router;