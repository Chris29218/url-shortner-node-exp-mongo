import User from "../models/user.js";
import Session from "../models/session.js";
import { setUser } from "../service/auth.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  // Match the cookie lifetime to the server-side session lifetime.
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function getDeviceLabel(userAgent = "") {
  if (/android/i.test(userAgent)) return "Android device";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS device";
  if (/mobile/i.test(userAgent)) return "Mobile device";
  if (/windows/i.test(userAgent)) return "Windows device";
  if (/macintosh/i.test(userAgent)) return "Mac device";
  if (/linux/i.test(userAgent)) return "Linux device";
  return "Unknown device";
}

async function handleUserSignUp(req, res) {
  try {
    console.log("Request body:", JSON.stringify(req.body));
    const { name, email, password, role } = req.body;

    const userInDB = await User.findOne({ email });

    if (userInDB) {
      return res.redirect("/login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log("user is created ", JSON.stringify(req.body));

    return res.redirect("/login");
  } 
  catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).send("Signup failed");
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("login", {
        error: "Invalid username or password",
      });
    }

    // Create a separate session ID for every login, including another device.
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Session.create({
      sid: sessionId,
      user: user._id,
      deviceLabel: getDeviceLabel(req.get("user-agent")),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      expiresAt,
    });

    const token = setUser(user.toObject(), sessionId);
    res.cookie("uuid", token, SESSION_COOKIE_OPTIONS);

    return res.redirect("/");
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send("Login failed");
  }
}

async function handleUserLogout(req, res) {
  // Revoke only the current device session.
  if (req.session?.sid) {
    await Session.deleteOne({ sid: req.session.sid });
  }

  res.clearCookie("uuid");
  return res.redirect("/login");
}

async function handleLogoutAll(req, res) {
  if (!req.user?._id) {
    return res.redirect("/login");
  }

  // Revoke every session belonging to this user.
  await Session.deleteMany({ user: req.user._id });
  res.clearCookie("uuid");
  return res.redirect("/login");
}

export { handleUserSignUp, handleUserLogin, handleUserLogout, handleLogoutAll };
