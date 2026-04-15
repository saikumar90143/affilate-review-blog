import mongoose, { Schema, models } from "mongoose";

const SettingsSchema = new Schema(
  {
    authorName: { type: String, default: "EliteReviews Expert" },
    authorBio: { type: String, default: "Gadget enthusiast and tech reviewer with over 10 years of experience testing the latest consumer electronics." },
    authorImage: { type: String, default: "" },
    socials: {
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    siteName: { type: String, default: "EliteReviews" },
    siteDescription: { type: String, default: "Professional product reviews and buying guides." },
  },
  { timestamps: true }
);

export default models.Settings || mongoose.model("Settings", SettingsSchema);
