import axios from "axios";

const TALLY_API_URL = process.env.TALLY_API_URL || "https://your-tally-api-url.com";

export const fetchTallyData = async () => {
  try {
    const response = await axios.get(`${TALLY_API_URL}/skus`);
    return response.data;
  } catch (err) {
    console.warn("⚠️ Skipping Tally sync (no API connected yet)");
return []; // returns empty SKU list for now

  }
};

// 🔁 Optional: Automatically sync SKUs every 5 minutes
export const scheduleTallySync = async (SKUModel) => {
  try {
    const tallyData = await fetchTallyData();
    for (const sku of tallyData) {
      await SKUModel.upsert({
        name: sku.name,
        price: sku.price,
        stock: sku.stock,
        code: sku.code,
      });
    }
    console.log("✅ SKU data synced from Tally");
  } catch (err) {
    console.error("Error syncing SKUs:", err.message);
  }
};
