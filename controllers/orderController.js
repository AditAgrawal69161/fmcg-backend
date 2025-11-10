// controllers/orderController.js
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  try {
    const retailerId = req.user?.id; // From JWT
    const { items } = req.body;

    console.log("🛒 Incoming order items:", items);

    if (!retailerId) {
      return res.status(400).json({ message: "Missing retailer ID" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order format: items must be a non-empty array" });
    }

    const products = await Product.findAll();
    let totalAmount = 0;
    const validProducts = [];

    for (const item of items) {
      const skuOrId = item.sku || item.skuId || item.id;
      const product = products.find(
        (p) =>
          p.sku === skuOrId ||
          p.id.toString() === skuOrId?.toString() ||
          p.name.toLowerCase() === item.name?.toLowerCase()
      );

      if (!product) {
        console.error("❌ Could not find product for item:", item);
        return res.status(400).json({
          message: `Invalid SKU or product not found: ${item.name || skuOrId}`,
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      // Deduct stock
      const newStock = product.stock - item.quantity;
      await product.update({ stock: newStock });

      totalAmount += product.price * item.quantity;
      validProducts.push({
        sku: product.sku,
        name: product.name,
        qty: item.quantity,
        price: product.price,
      });
    }

    // ✅ Create order
    const order = await Order.create({
      retailer_id: retailerId,
      products: validProducts,
      total_amount: totalAmount,
      status: "pending",
    });

    console.log("✅ Order successfully created:", order.id);
    return res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
};

// 🧾 Get all orders for a retailer
export const getOrdersByRetailer = async (req, res) => {
  try {
    const retailerId = req.user?.id;
    if (!retailerId) return res.status(400).json({ message: "Missing retailerId" });

    const orders = await Order.findAll({
      where: { retailer_id: retailerId },
      order: [["createdAt", "DESC"]],
    });

    return res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
