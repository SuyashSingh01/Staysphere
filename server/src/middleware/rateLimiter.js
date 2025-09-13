
import rateLimit from "express-rate-limit";
import { ENV } from "../constant/env.js";

export const limiter = rateLimit({
  windowMs: ENV.RATE_LIMIT.WINDOW_MS|| 15 * 60 * 1000,  // 15 minutes
  max: ENV.RATE_LIMIT.MAX_REQUESTS|| 100, // limit each IP to 100 requests per window
  message: {
    success: false,
    message:"Too many requests, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,  
});
export const ratelimiter = () => limiter;
