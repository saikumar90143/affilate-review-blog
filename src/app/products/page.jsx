import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { Suspense } from "react";
import ProductsClientContent from "./ProductsClientContent";

export const metadata = {
  title: "Products | EliteReviews",
  description: "Browse our curated selection of elite-tested and reviewed products.",
};

export const revalidate = 60; // ISR: Revalidate static data every 60 seconds

export default async function ProductsPage() {
  await connectToDatabase();

  let products = [];
  let categories = [];

  try {
    const rawCategories = await Category.find({ for: "product" }).sort({ name: 1 }).lean();
    categories = JSON.parse(JSON.stringify(rawCategories));

    const rawProducts = await Product.find({})
      .sort({ rating: -1 })
      .populate("category", "name slug")
      .lean();
    products = JSON.parse(JSON.stringify(rawProducts));
    console.log(`[Products] Statically loaded ${products.length} products and ${categories.length} categories.`);
  } catch (e) {
    console.error("[Products] Error:", e);
  }

  return (
    <Suspense fallback={
      <div className="py-24 bg-dark-bg min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">Loading Elite Products…</div>
      </div>
    }>
      <ProductsClientContent initialProducts={products} categories={categories} />
    </Suspense>
  );
}
