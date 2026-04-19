import mongoose, { Schema, models } from "mongoose";

const PriceAlertSchema = new Schema(
  {
    email: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    isNotified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.PriceAlert || mongoose.model("PriceAlert", PriceAlertSchema);
