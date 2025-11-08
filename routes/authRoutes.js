import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// ✅ Register new retailer
router.post("/register", register);

// ✅ Login existing retailer
router.post("/login", login);

export default router;
