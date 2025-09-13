import { config } from "dotenv";
config();

export const ENV = {
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLOUDINARY_SERVICE: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  MAIL_SERVICE: {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_USER: process.env.MAIL_USER,
  },
  TWILIO_SERVICE: {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  },
  RAZORPAY_SERVICE: {
    RAZORPAY_KEY: process.env.RAZORPAY_KEY,
    RAZORPAY_SECRET: process.env.RAZORPAY_SECRET,
  },
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  },
  FIREBASE_SERVICE: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? process.env.FIREBASE_API_KEY : null,
    FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) : null,
  },
  REDIS_SERVICE: {
    REDIS_URL: process.env.REDIS_URL || null,
    REDIS_USERNAME: process.env.REDIS_USERNAME || 'default',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || null,
  },
};
