import { Router } from "express";
import { registerUser ,loginUser,addRegisterContacts, LogoutUser ,setBio } from "../Controllers/user.controllers.js";
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
router.route("/logout").post(verifyJWT,LogoutUser)
router.route("/moreInfo_bio/:userId").post(upload.single("bannerImage"),setBio);
router.route("/hi").get(sayHello);

export default router;