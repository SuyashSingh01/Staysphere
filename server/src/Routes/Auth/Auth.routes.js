import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

// User Authentication
router.post("/auth/register", controllers.auth.signup); // User Registration
router.post("/auth/login", controllers.auth.login); // User Login
router.post("/auth/forgot", controllers.auth.forgotPassword); // Forgot Password
router.post("/auth/reset-password/:token", controllers.auth.resetPassword); // Reset Password
router.post("/auth/change-password", auth, controllers.auth.changePassword); // Change Password
router.post("/auth/verify-email", controllers.auth.emailVerification);
router.post(
  "/auth/verify-email-otp",
  controllers.auth.emailVerificationWithOTP
);
router.post("/auth/verify-phone", controllers.auth.phoneVerification);
router.post(
  "/auth/verify-phone-otp",
  auth,
  controllers.auth.phoneVerificationWithOTP
);

// Host Authentication
router.post("/host/register", controllers.auth.hostRegister); // Host Registration
router.post("/host/register/verify", controllers.auth.hostVerify); // Host Registration Verify
router.post("/host/login", controllers.auth.hostLogin); // Host Login

export default router;
