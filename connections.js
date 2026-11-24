import mongoose from "mongoose";

// mongoose connection
async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/url-shortner-1");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

export default connectDB;