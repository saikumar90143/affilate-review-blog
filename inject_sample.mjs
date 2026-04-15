import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is missing');
  process.exit(1);
}

// Define schemas directly to avoid ESM/CommonJS model reuse errors in scripts
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: String,
});

const ProductSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  image: String,
  links: [{ platform: String, url: String }],
  rating: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  pros: [String],
  cons: [String],
});

const PostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  content: String,
  excerpt: String,
  featuredImage: String,
  isPublished: Boolean,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
  const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

  // 1. Create/Get Category
  let category = await Category.findOne({ slug: 'tech-reviews' });
  if (!category) {
    category = await Category.create({
      name: 'Tech Reviews',
      slug: 'tech-reviews',
      description: 'The latest in high-end gadgets and consumer electronics.'
    });
    console.log('Created Category');
  }

  // 2. Create Product
  const productSlug = 'sony-wh-1000xm5-silver';
  await Product.deleteOne({ slug: productSlug });
  const product = await Product.create({
    title: 'Sony WH-1000XM5 (Silver)',
    slug: productSlug,
    image: 'https://images.unsplash.com/photo-1618366712277-70f39e535837?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    category: category._id,
    links: [
      { platform: 'Amazon', url: 'https://www.amazon.com/s?k=Sony+WH-1000XM5' },
      { platform: 'Flipkart', url: 'https://www.flipkart.com/search?q=Sony+WH-1000XM5' }
    ],
    pros: ['Industry-leading noise canceling', 'Superb sound quality', 'Extremely comfortable'],
    cons: ['Expensive', 'Case is bulky', 'Non-folding design']
  });
  console.log('Created Product');

  // 3. Create Post
  const postSlug = 'best-noise-canceling-headphones-2026';
  await Post.deleteOne({ slug: postSlug });
  await Post.create({
    title: 'Top 3 Noise Canceling Headphones of 2026',
    slug: postSlug,
    excerpt: 'Discover the best audio gear to buy this year, featuring the legendary Sony XM5 and its closest competitors.',
    featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    content: `
      <h2>The Audio Revolution is Here</h2>
      <p>Whether you are commuting or working in a busy cafe, noise cancellation is no longer a luxury—it is a necessity. This year, we have seen some incredible releases.</p>
      
      <h3>1. Sony WH-1000XM5</h3>
      <p>The Sony XM5 continues to dominate the market with its 8-microphone system and incredible battery life. It is the gold standard for anybody who wants silence on demand.</p>
      
      <h3>2. Bose QuietComfort Ultra</h3>
      <p>Bose remains an incredible contender for comfort, offering the softest earcups we have tested in a long time.</p>
      
      <p>Check out our detailed product cards below for the best prices available today!</p>
    `,
    isPublished: true,
    category: category._id
  });
  console.log('Created Post');

  await mongoose.disconnect();
  console.log('Done');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
