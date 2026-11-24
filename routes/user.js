import express from "express";
import { handleUserLogin, handleUserLogout, handleUserSignUp } from "../controllers/user.js";

const router = express.Router();

// SIGN UP
router.route("/signup").post(handleUserSignUp);
// LOG IN
router.route("/login").post(handleUserLogin)
// LOG OUT
router.route("/logout").post(handleUserLogout)

export default router;