import { Router } from "express";
import {
    createBlog,
    getAllBlog,
    getBlogBySlug,
    updateBlogDetails,
    updatBlogCoverImage,
    generateAIDescriptionOnly,
    deleteBlog,
    toggleStatus,
    getBlogsByTags
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/blog").get(getAllBlog)
router.route("/blog/:slug").get(getBlogBySlug)


router.route("/tags").get(getBlogsByTags)

//secured route
router.route("/blog/create").post(verifyJWT, upload.single("coverImage"), createBlog)
router.route("/blog/preview").post(verifyJWT, generateAIDescriptionOnly)
router.route("/blog/:slug").patch(verifyJWT, updateBlogDetails)
router.route("/blog/:slug/cover-image").patch(verifyJWT, upload.single("coverImage"), updatBlogCoverImage)
router.route("/blog/:slug").delete(verifyJWT, deleteBlog)
router.route("/blog/:slug/status").patch(verifyJWT, toggleStatus)

export default router;
