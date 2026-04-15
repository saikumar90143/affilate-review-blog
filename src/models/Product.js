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
  },
  { timestamps: true }
);

export default models.Product || mongoose.model("Product", ProductSchema);
