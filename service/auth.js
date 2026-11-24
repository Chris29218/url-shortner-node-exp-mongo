import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is required. Add it to your .env file.");
}

function setUser(user, sessionId) {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Links this JWT to one device-specific server-side session.
      sid: sessionId,
    },
    secret,
    { expiresIn: "7d" },
  );
} 

function getUser(token) {
  try{
    return jwt.verify(token, secret);
  }
  catch {
    return null;
  }
}

export { setUser, getUser };
