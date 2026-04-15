import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "editor"]).default("admin"),
});

export const CategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe (lowercase, hyphens)"),
  description: z.string().optional().default(""),
});

export const PostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe (lowercase, hyphens only)"),
  excerpt: z.string().min(5, "Excerpt is too short"),
  content: z.string().min(1, "Content is required"),
  // featuredImage can be a URL or empty string (optional)
  featuredImage: z.union([z.string().url("Must be a valid image URL"), z.literal("")]).optional().default(""),
  author: z.string().optional().default("Admin"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().optional().default(true),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
}).passthrough(); // allow extra fields like _id, __v from edit payloads

export const ProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe"),
  image: z.string().url("Must be a valid image URL").min(1, "Product image is required"),
  affiliateLink: z.union([z.string().url("Must be a valid URL"), z.literal("")]).optional().default(""),
  links: z.array(z.object({
    platform: z.string().min(1, "Platform name is required"),
    url: z.string().url("Must be a valid URL"),
  })).optional().default([]),
  pros: z.array(z.string()).optional().default([]),
  cons: z.array(z.string()).optional().default([]),
  specs: z.record(z.string()).optional().default({}),
  rating: z.number().min(0).max(5).default(0),
  category: z.string().min(1, "Category is required"),
}).passthrough();
