import Razorpay from "razorpay";
import {ENV} from "../constant/env.js";

class RazorpayInstance {
  constructor() {
    if (!ENV.RAZORPAY_SERVICE.RAZORPAY_KEY || !ENV.RAZORPAY_SERVICE.RAZORPAY_SECRET) {
      throw new Error(
        "Razorpay credentials are not properly configured in environment variables"
      );
    }

    this.razorpay = new Razorpay({
      key_id: ENV.RAZORPAY_SERVICE.RAZORPAY_KEY,
      key_secret: ENV.RAZORPAY_SERVICE.RAZORPAY_SECRET,
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
