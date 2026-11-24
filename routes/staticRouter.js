import express from "express";
import { getHome } from "../controllers/url.js";
import { restrictTo } from "../middlewares/auth.js";

const router = express.Router();
// in line middleware
router.route("/").get(restrictTo(["NORMAL", "ADMIN"]), getHome);
router.route("/signup").get((req, res) => res.render("signup"));
router.route("/login").get((req, res) => res.render("login"));

export default router;
