import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://elitereviews:Nopassword123@elitereviews.jujnlrv.mongodb.net/?appName=elitereviews";

async function checkCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const categoriesCollection = db.collection("categories");
    const categories = await categoriesCollection.find({}).toArray();
    
    console.log("Production Categories:");
    categories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id}, slug: ${cat.slug}, for: ${JSON.stringify(cat.for)})`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkCategories();
