import express from "express";
const router = express.Router();
import {getAllUrls} from "../controllers/url.js";
import { restrictTo } from "../middlewares/auth.js";

router.route("/urls").get(restrictTo(["ADMIN"]), getAllUrls);

export default router;