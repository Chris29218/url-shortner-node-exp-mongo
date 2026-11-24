import { getUser } from "../service/auth.js";
import Session from "../models/session.js";

async function checkForAuthentication(req, res, next) {
  const token = req.cookies?.uuid;
  const payload = token ? getUser(token) : null;

  // A JWT without a session ID belongs to an older authentication flow.
  if (!payload?.sid) {
    req.user = null;
    req.session = null;
    return next();
  }

  try {
    // The session must belong to this user and must not be revoked or expired.
    const session = await Session.findOne({
      sid: payload.sid,
      user: payload._id,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      req.user = null;
      req.session = null;
      res.clearCookie("uuid");
      return next();
    }

    session.lastUsedAt = new Date();
    await session.save();

    req.user = payload;
    req.session = session;
    return next();
  } 
  catch (error) {
    console.error("Error validating authentication session:", error);
    req.user = null;
    req.session = null;
    return next();
  }
}

function restrictTo(roles = []){
  return function(req, res, next){
    if(!req.user){
      return res.redirect("/login");
    }

    if(!roles.includes(req.user.role)){
      return res.status(403).send("Unauthorized");
    }

    next();
  }
}

export { restrictTo, checkForAuthentication };