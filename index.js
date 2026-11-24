// JH
import "dotenv/config";
import express from "express";
import userRouter from "./routes/user.js";
import connectDB from "./connections.js";
import { middlewareLogger } from "./middlewares/index.js";
import urlRouter from "./routes/url.js";
import redirectRouter from "./routes/redirect.js";
import staticRouter from "./routes/staticRouter.js"
import path from 'path';
import cookieParser from "cookie-parser";
import { restrictTo, checkForAuthentication } from "./middlewares/auth.js"
import adminRouter from "./routes/adminRouter.js"

// connect to db
connectDB();

const app = express();

// set up views with ejs
app.set('view engine', 'ejs'); // my view engine is ejs
app.set('views', path.resolve('./views')) // take views from views folder

// built in middleware
app.use(express.json()) // support json data
app.use(express.urlencoded({extended : false})) // support form data
app.use(cookieParser()); // to work with cookies

const PORT = process.env.PORT;

app.use(middlewareLogger);
app.use(checkForAuthentication);

// set routes
app.use("/api/users", userRouter); // sign up, log in, log out
app.use("/api/url", restrictTo(["ADMIN", "NORMAL"]), urlRouter); // create short url
app.use("/api", redirectRouter); // redirect to
app.use("/", staticRouter); // render home, log in, log out
app.use("/admin", adminRouter); // admin

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
