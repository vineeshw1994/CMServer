import express from "express";
import {loginAuthentication,signupUser, verifyOtp} from '../controllers/authController/authController.js'


const router = express.Router();

router.post("/signup",signupUser)
router.post('/verify-otp',verifyOtp)

router.post('/login',loginAuthentication)



export default router;