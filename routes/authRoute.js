import express from "express";
import { signupUser, verifyOtp } from "../controllers/authController/authController.js";

const router = express.Router();

router.post("/signup",signupUser)
router.post('/verify-otp',verifyOtp)

export default router;