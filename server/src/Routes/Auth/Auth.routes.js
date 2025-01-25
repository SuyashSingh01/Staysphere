import express from "express";
import { controllers } from "../../controllers/index.controller.js";
const router = express.Router();

// User Authentication
router.post("/register", controllers.auth.signup); // User Registration
router.post("/login", controllers.auth.login); // User Login
router.post("/forgot", controllers.auth.forgotPassword); // Forgot Password
router.post("/reset", controllers.auth.resetPassword); // Reset Password

// Host Authentication
router.post("/host/register", controllers.auth.hostRegister); // Host Registration
router.post("/host/register/verify", controllers.auth.hostVerify); // Host Registration Verify
router.post("/host/login", controllers.auth.hostLogin); // Host Login

export default router;
