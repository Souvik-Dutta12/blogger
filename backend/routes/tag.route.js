import { Router } from "express";
import {

    getAllTags,
    
} from "../controllers/tag.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllTags)

//secured routes



export default router;