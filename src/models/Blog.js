import mongoose, { Schema, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String },
    content: { type: String, required: true },
    featuredImage: { type: String },
    tags: [{ type: String }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
);

export default models.Blog || mongoose.model("Blog", BlogSchema);
