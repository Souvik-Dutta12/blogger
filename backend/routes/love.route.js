import { Router } from "express";
import { getLoveCount } from "../controllers/love.controller.js";

const router = Router();

router.route("/love-count/:commentId").get(getLoveCount)

export default router;