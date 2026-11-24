import mongoose from "mongoose";

// mongoose connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MongoDB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

export default connectDB;