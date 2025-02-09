import Razorpay from "razorpay";
import { config } from "dotenv";
config();

class RazorpayInstance {
  constructor() {
    if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
      throw new Error(
        "Razorpay credentials are not properly configured in environment variables"
      );
    }

    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RazorpayInstance();
    }
    return this.instance.razorpay;
  }
}

export default RazorpayInstance.getInstance();
