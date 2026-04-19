import mongoose, { Schema, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    username: { type: String, required: true, default: "Anonymous Gadgeteer" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String },
    isVerified: { type: Boolean, default: false }, // Could be true if they verify email later
  },
  { timestamps: true }
);

export default models.Review || mongoose.model("Review", ReviewSchema);
