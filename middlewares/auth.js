import { getUser } from "../service/auth.js";

function checkForAuthentication(req, res, next) {
  const token = req.cookies?.uuid;
  
  req.user = token ? getUser(token) : null;
  
  next();
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