import express from "express";
import { handleLogoutAll, handleUserLogin, handleUserLogout, handleUserSignUp } from "../controllers/user.js";

const router = express.Router();

// SIGN UP
router.route("/signup").post(handleUserSignUp);
// LOG IN
router.route("/login").post(handleUserLogin)
// LOG OUT
router.route("/logout").post(handleUserLogout)
// LOG OUT OF EVERY DEVICE
router.route("/logout-all").post(handleLogoutAll)

export default router;