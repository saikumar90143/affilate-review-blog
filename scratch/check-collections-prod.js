import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://elitereviews:Nopassword123@elitereviews.jujnlrv.mongodb.net/?appName=elitereviews";

async function checkCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    console.log("Production Collections:");
    collections.forEach(c => console.log(`- ${c.name}`));

    const productsCount = await db.collection("products").countDocuments();
    const clicksCount = await db.collection("clicks").countDocuments();
    
    console.log(`\nProducts count: ${productsCount}`);
    console.log(`Clicks count: ${clicksCount}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkCollections();
