import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    affiliateLink: { type: String }, // Fallback / Primary link
    links: [
      {
        platform: { type: String, required: true }, // e.g. "Amazon", "Flipkart"
        url: { type: String, required: true },
      }
    ],
    pros: [{ type: String }],
    cons: [{ type: String }],
    specs: { type: Map, of: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    scores: {
      performance: { type: Number, default: 85 },
      value: { type: Number, default: 80 },
      build: { type: Number, default: 90 },
      features: { type: Number, default: 85 },
      design: { type: Number, default: 88 }
    },
    flashDeal: {
      active: { type: Boolean, default: false },
      headline: { type: String, default: "" },
      code: { type: String, default: "" },
      expiresAt: { type: Date }
    }
  },
  { timestamps: true }
);

export default models.Product || mongoose.model("Product", ProductSchema);
