import { Router } from "express";
// import { ratelimiter } from "../Middlewares/ratelimiter.js";
import { registerUser ,loginUser,addRegisterContacts, LogoutUser ,setBio, resetPassword, sendResetPassMail,matchForgotCode,
   } from "../Controllers/user.controllers.js";
import { upload } from "../Middlewares/multer.middlewares.js";
import { verifyJWT } from "../Middlewares/verifyJwt.js";
const router = Router();
 
const sayHello = (req,res)=>{
  res.send("hello ji")
}
router.route("/register").post(
  upload.single("profilePicture"),
  registerUser
)
router.route("/add_register_Contact/:userId").post(addRegisterContacts);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT,LogoutUser)
router.route("/moreInfo_bio/:userId").post(upload.single("bannerImage"),setBio);
router.route("/hi").get(sayHello);

//  forgot password routes
 router.route("/sendResetPasswordMail").post(sendResetPassMail);
 router.route("/match_forgot_passCode/:email").post(matchForgotCode);
 router.route("/reset_password/:email/:forgot_pass_code").post(resetPassword)
export default router;