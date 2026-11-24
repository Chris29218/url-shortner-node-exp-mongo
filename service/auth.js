import jwt from "jsonwebtoken";
const secret = "Skyinfotech$$999$$";

function setUser(user) {  
  return jwt.sign({_id: user._id, name:user.name, email: user.email, role: user.role}, secret);
} 

function getUser(token) {
  try{
    return jwt.verify(token, secret);
  }
  catch(err) {
    console.error("err in getUser : "+err)
  }
}

export { setUser, getUser };
