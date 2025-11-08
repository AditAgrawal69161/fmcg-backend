import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, products, totalAmount, paymentMode } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const order = await Order.create({
      UserId: userId,
      products,
      totalAmount,
      paymentStatus: paymentMode === "COD" ? "pending" : "paid",
    });

    // 🧾 Log retailer details
    console.log(`🆕 New order from ${user.shopName || user.name}`);
    console.log(`📍 Address: ${user.address || "N/A"}, ${user.city || ""}`);
    console.log(`📞 Mobile: ${user.mobile}`);
    console.log(`💰 Amount: ₹${totalAmount}`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
      retailer: {
        name: user.name,
        shopName: user.shopName,
        address: user.address,
        city: user.city,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

export default router;
