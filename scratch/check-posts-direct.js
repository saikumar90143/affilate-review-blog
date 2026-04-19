import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/elitereviews_local_dev";

async function checkPosts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to database.");

    const db = mongoose.connection.db;
    const postsCollection = db.collection("posts");
    
    const posts = await postsCollection.find({}).toArray();
    console.log(`Found ${posts.length} documents in 'posts' collection.`);

    posts.forEach((post, i) => {
      console.log(`\nPost ${i + 1}:`);
      console.log(`  Title:       ${post.title}`);
      console.log(`  Slug:        ${post.slug}`);
      console.log(`  isPublished: ${post.isPublished}`);
      console.log(`  Category ID: ${post.category}`);
      console.log(`  CreatedAt:   ${post.createdAt}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error checking posts:", error);
    process.exit(1);
  }
}

checkPosts();
