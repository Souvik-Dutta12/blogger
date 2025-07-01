import { Router } from "express";

import {
    signUpUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateProfileImage,
    getUserById,
    updateUserProfile,
    getBlogsByUser
} from "../controllers/user.controller.js";


import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(signUpUser)
router.route("/login").post(loginUser)



//secured route
router.route("/user/logout").post(verifyJWT, logoutUser)
router.route("/user/refresh-token").post(refreshAccessToken)
// router.route("/user/profile-image").patch(verifyJWT,upload.single("profileImage"),updateProfileImage)
router.route("/user/update-profile").patch(verifyJWT, upload.single("profileImage"), updateUserProfile)
router.route("/user/:userId").get(verifyJWT, getUserById)


router.route("/user/:userId/blogs").get(verifyJWT, getBlogsByUser)



export default router 