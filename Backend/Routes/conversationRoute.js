import {Router} from "express"
import { apiRateLimiter } from '../Middlewares/ratelimiter.js';
 import { getConversation } from "../Controllers/conversation.controllers.js"
 const router =Router();
 import { verifyJWT } from "../Middlewares/verifyJwt.js";
//  get previous and new coversation 
// for testing purpose i can remove verifyJWT 
router.route("/fetchConversation/:conversationId").get(verifyJWT,apiRateLimiter,getConversation);
 export default router