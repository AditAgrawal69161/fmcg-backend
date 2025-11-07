import express from "express";
import { verifyFirebaseToken } from "../controllers/authController.js";
const router = express.Router();

router.post("/verify", verifyFirebaseToken);

export default router;
