import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { registerUserThroughUsername , loginUserThroughUsername ,logoutUser , googleLogin , fetchUserData , addBookmark , markDone} from "../controllers/user.controller.js";


const router = Router();

router.route("/register").post(registerUserThroughUsername);
router.route("/login").post(loginUserThroughUsername);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/google").get(googleLogin);
router.route("/fetchUserData").get(verifyJWT, fetchUserData);
router.route("/addBookmark").get(verifyJWT, addBookmark);
router.route("/markDone").get(verifyJWT, markDone);

export default router;