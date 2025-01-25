import Razorpay from "razorpay";
import { config } from "dotenv";
config();

console.log("RazorpayKey", process.env.RAZORPAY_KEY);
console.log("RazorSceret", process.env.RAZORPAY_SECRET);

if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
  throw new Error(
    "Razorpay credentials are not properly configured in environment variables"
  );
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
export default razorpayInstance;
