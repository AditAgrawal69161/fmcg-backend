import User from "../models/User.js";

// ✅ REGISTER — new retailer signup
export const register = async (req, res) => {
  try {
    const { name, mobile, password, shopName, address, city, pincode } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { mobile } });
    if (existingUser) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    const user = await User.create({
      name,
      mobile,
      password,
      shopName,
      address,
      city,
      pincode,
    });

    return res.status(201).json({
      success: true,
      user,
      message: "Retailer registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ LOGIN — authenticate retailer
export const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: "Missing mobile or password" });
    }

    const user = await User.findOne({ where: { mobile } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      success: true,
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default { register, login };
