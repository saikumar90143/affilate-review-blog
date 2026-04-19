import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb.js";
import Post from "../src/models/Post.js";
import Category from "../src/models/Category.js";

async function checkPosts() {
  try {
    await connectToDatabase();
    console.log("Connected to database.");

    const posts = await Post.find({}).populate('category').lean();
    console.log(`Found ${posts.length} posts in total.`);

    posts.forEach((post, i) => {
      console.log(`\nPost ${i + 1}:`);
      console.log(`  Title:       ${post.title}`);
      console.log(`  Slug:        ${post.slug}`);
      console.log(`  isPublished: ${post.isPublished}`);
      console.log(`  Category:    ${post.category ? post.category.name : "MISSING"}`);
      console.log(`  CreatedAt:   ${post.createdAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error checking posts:", error);
    process.exit(1);
  }
}

checkPosts();
