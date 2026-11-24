import express from "express";
const router = express.Router();
import {getHome, generateNewShortURL} from "../controllers/url.js";

router.route("/")
.post(async (req, res) => {
  return generateNewShortURL(req, res);
});

export default router;