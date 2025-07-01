
import { Router } from "express";
import {
    createComment,
    getCommentsByBlog,
    toggleLove,
    deleteComment
} from "../controllers/comment.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/comment/:slug").get(getCommentsByBlog)

//secured routes
router.route("/comment/:slug/create").post(verifyJWT, createComment)
router.route("/comment/:commentId/toggle").patch(verifyJWT, toggleLove)
router.route("/comment/:commentId").delete(verifyJWT, deleteComment)

export default router;

