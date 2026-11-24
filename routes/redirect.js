import express from "express";
import URL from "../models/url.js"

const router = express.Router();

router.route("/:shortId").get(async (req, res) => {
  try {
    const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: new Date() } } },
  );

  let redirectURL = entry.redirectURL;
  redirectURL = `http://${redirectURL}`; // Prepend "http://" to the redirect URL
  res.redirect(redirectURL);
} 
catch (error) {
  console.error("Error occurred while redirecting:", error);
  res.status(500).send("Internal Server Error");
}
});
router.route('/analytics/:shortId').get(async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOne({ shortId });
    return res.json({ totalClicks: entry.visitHistory.length, analytics: entry.visitHistory });
  }
  catch (error) {
    console.error("Error occurred while fetching analytics:", error);
    res.status(500).send("Internal Server Error");
  }
});
export default router;
