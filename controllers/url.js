import URL from "../models/url.js";
import { nanoid } from "nanoid";
import { getUser } from "../service/auth.js";

// get function on /
const getHome = async (req, res) => {
  try {
    const uuid = req.cookies?.uuid;
    const user = getUser(uuid);
  
    const allURLs = await URL.find({ createdBy: user._id });
    return res.render("home", { allURLs });
  } catch (error) {
    console.error("Error loading URLs:", error);
    return res.status(500).send("Unable to load URLs");
  }
};

// post function on api/:shortId
const generateNewShortURL = async (req, res) => {
  try {
    const body = req.body;
    if (!body.url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const result = await URL.findOne({ redirectURL: body.url });
    let shortId = "";
    if (result == null) {
      shortId = nanoid(8);
      await URL.create({
        shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id
      });
    } else {
      shortId = result.shortId;
    }
    console.log(`Generated new short URL: ${shortId} for ${body.url}`);

    const allURLs = await URL.find({ createdBy: req.user._id });
    return res.render("home", { shortURL: shortId, allURLs });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const body = req.body;
    const allURLRes = await URL.find({});
    return res.render("home", {  allURLs: allURLRes });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { getHome, generateNewShortURL, getAllUrls};
