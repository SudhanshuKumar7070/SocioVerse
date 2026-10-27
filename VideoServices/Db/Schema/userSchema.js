import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, select: false },
    profilePicture: { type: String },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    RefreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
    collection: "users", // Explicitly map to the users collection in shared MongoDB
    strict: false,       // Allow access to other fields present on the document
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
