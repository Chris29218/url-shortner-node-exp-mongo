import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    // Unique identifier stored inside the JWT for this login session.
    sid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Each login on a device is linked to the same user but stored separately.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    deviceLabel: {
      type: String,
      default: "Unknown device",
    },
    ipAddress: String,
    userAgent: String,
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// MongoDB removes sessions automatically when their expiresAt time passes.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
