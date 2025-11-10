import Product from "../models/Product.js";

/**
 * Automatically manages demo product seeding:
 * ✅ Adds demo products with SKUs when DB is empty
 * 🧹 Removes them once real data exists
 * ♻️ Reseeds if DB becomes empty again
 */
export const autoSeedProducts = async () => {
  try {
    const products = await Product.findAll();

    // 🧹 If real products exist, delete demo ones
    const hasReal = products.some((p) => !p.isDemo);
    if (hasReal) {
      const deleted = await Product.destroy({ where: { isDemo: true } });
      if (deleted > 0)
        console.log(`🧹 Removed ${deleted} demo products (real SKUs detected)`);
      return;
    }

    // 🌱 If DB empty, add demo SKUs
    if (products.length === 0) {
      const randomStock = () => Math.floor(Math.random() * 100) + 50;
      const demoProducts = [
        {
          sku: "SKU-DETTOL-125",
          name: "Dettol Soap 125g",
          price: 35,
          stock: randomStock(),
          category: "Personal Care",
          isDemo: true,
        },
        {
          sku: "SKU-COLGATE-100",
          name: "Colgate Toothpaste 100g",
          price: 55,
          stock: randomStock(),
          category: "Oral Care",
          isDemo: true,
        },
        {
          sku: "SKU-PARLEG-100",
          name: "Parle-G Biscuit 100g",
          price: 10,
          stock: randomStock(),
          category: "Snacks",
          isDemo: true,
        },
        {
          sku: "SKU-TATASALT-1KG",
          name: "Tata Salt 1kg",
          price: 22,
          stock: randomStock(),
          category: "Grocery",
          isDemo: true,
        },
      ];

      await Product.bulkCreate(demoProducts);
      console.log(`✨ Auto-seeded ${demoProducts.length} demo products with SKUs`);
    }
  } catch (err) {
    console.error("❌ Auto-seeding failed:", err.message);
  }
};
