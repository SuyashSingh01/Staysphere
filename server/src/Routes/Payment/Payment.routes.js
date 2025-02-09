import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.post("/checkout", auth, controllers.payment.capturePayment);
router.post("/verifyPayment", auth, controllers.payment.verifyPayment);
// router.post(
//   "/sendPaymentSuccessEmail",
//   auth,
//   controllers.payment.sendPaymentSuccessEmail
// );
export default router;
