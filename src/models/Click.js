import mongoose, { Schema, models } from "mongoose";

const ClickSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    postSlug: { type: String }, // Which post did it come from?
    platform: { type: String }, // Amazon, Flipkart, etc.
    userAgent: { type: String },
    referrer: { type: String },
  },
  { timestamps: true }
);

export default models.Click || mongoose.model("Click", ClickSchema);
