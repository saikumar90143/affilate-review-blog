import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://elitereviews:Nopassword123@elitereviews.jujnlrv.mongodb.net/?appName=elitereviews";

async function checkPosts() {
  try {
    console.log("Connecting to production database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const postsCollection = db.collection("posts");
    
    // Check total posts
    const totalPosts = await postsCollection.countDocuments();
    console.log(`Total posts in 'posts' collection: ${totalPosts}`);

    if (totalPosts > 0) {
      const posts = await postsCollection.find({}).toArray();
      posts.forEach((post, i) => {
        console.log(`\nPost ${i + 1}:`);
        console.log(`  Title:       ${post.title}`);
        console.log(`  Slug:        ${post.slug}`);
        console.log(`  isPublished: ${post.isPublished}`);
        console.log(`  Category ID: ${post.category}`);
        console.log(`  CreatedAt:   ${post.createdAt}`);
      });
    }

    // Also check categories
    const categoriesCollection = db.collection("categories");
    const totalCategories = await categoriesCollection.countDocuments();
    console.log(`\nTotal categories: ${totalCategories}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error checking production posts:", error);
    process.exit(1);
  }
}

checkPosts();
