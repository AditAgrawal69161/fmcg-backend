// backend-api/utils/autoSeed.js
import Product from "../models/Product.js";

/**
 * Automatically manages demo product seeding:
 * ✅ Adds demo products when DB is empty
 * 🧹 Removes them once real data exists
 * ♻️ Re-seeds if DB becomes empty again
 */
export const autoSeedProducts = async () => {
  try {
    const products = await Product.findAll();

    // 🧹 Clean up demo products if real products exist
    const hasRealProducts = products.some((p) => !p.isDemo);
    if (hasRealProducts) {
      const deleted = await Product.destroy({ where: { isDemo: true } });
      if (deleted > 0) console.log(`🧹 Removed ${deleted} demo products (real data detected)`);
      return;
    }

    // 🌱 If database empty, insert demo data
    if (products.length === 0) {
      const randomStock = () => Math.floor(Math.random() * 100) + 50;
      const demoProducts = [
        { name: "Dettol Soap 125g", price: 35, stock: randomStock(), category: "Personal Care", isDemo: true },
        { name: "Colgate Toothpaste 100g", price: 55, stock: randomStock(), category: "Oral Care", isDemo: true },
        { name: "Parle-G Biscuit 100g", price: 10, stock: randomStock(), category: "Snacks", isDemo: true },
        { name: "Tata Salt 1kg", price: 22, stock: randomStock(), category: "Grocery", isDemo: true },
      ];

      await Product.bulkCreate(demoProducts);
      console.log(`✨ Auto-seeded ${demoProducts.length} demo products`);
    }
  } catch (err) {
    console.error("❌ Auto-seeding failed:", err.message);
  }
};
