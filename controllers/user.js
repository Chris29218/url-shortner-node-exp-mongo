import User from "../models/user.js";
import { setUser, getUser } from "../service/auth.js";
import bcrypt from "bcrypt";

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
    const token = setUser(user.toObject());

    res.cookie("uuid", token);

    return res.redirect("/");
  } catch (err) {
    console.log("Error in login");
  }
}

async function handleUserLogout(req, res) {
  res.clearCookie("uuid");

  return res.redirect("/login");
}

export { handleUserSignUp, handleUserLogin, handleUserLogout };
