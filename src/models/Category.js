import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    for: { 
      type: [String], 
      enum: ['post', 'product'], 
      default: ['post', 'product'] 
    },
  },
  { timestamps: true }
);

export default models.Category || mongoose.model("Category", CategorySchema);
