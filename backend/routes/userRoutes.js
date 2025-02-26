import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser); // Signup
router.post("/login", loginUser); // Login
router.get("/profile", protect, getUserProfile); // Get user profile (Protected route)

export default router;
