import mongoose, { Schema, models } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    source: { type: String, default: "exit-intent" },
  },
  { timestamps: true }
);

export default models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
