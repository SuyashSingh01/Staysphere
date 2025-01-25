import { config } from "dotenv";
config();

export const ENV = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_USER: process.env.MAIL_USER,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,

  RAZORPAY_KEY: process.env.RAZORPAY_KEY,
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET,
};
