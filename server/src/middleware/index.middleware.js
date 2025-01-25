import { auth, isHost, isAdmin } from "./auth";
import { authorize } from "./authorize";

export const middleware = {
  auth: auth,
  isHost: isHost,
  isAdmin: isAdmin,
  authorize: authorize,
};
