import { auth, isHost, isAdmin } from "./auth";
import { authorize } from "./authorize";
import {limiter} from "./rateLimiter.js";

export const middleware = {
  auth: auth,
  isHost: isHost,
  isAdmin: isAdmin,
  authorize: authorize,
  rateLimiter: limiter,
};
