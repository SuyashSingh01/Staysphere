import express from "express";
import { auth } from "../../middleware/auth.js";
import { controllers } from "../../controllers/index.controller.js";
const router = express.Router();

router.get("/account/profile", auth, controllers.userProfile.getProfileById);
router.put(
  "/account/profileupdate",
  auth,
  controllers.userProfile.updateprofileDetails
);
router.put(
  "/account/updateDisplaypic",
  auth,
  controllers.userProfile.updateDisplayPicture
);
router.delete(
  "/account/deleteprofile",
  auth,
  controllers.userProfile.deleteprofile
);
router.put("/profile/updateEmail", auth, controllers.userProfile.updateEmail);
router.put(
  "/profile/updatePassword",
  auth,
  controllers.userProfile.updatePassword
);
router.get(
  "/profile/transactions",
  auth,
  controllers.userProfile.getTransactions
);
router.get("/host/earnings/:hostId", controllers.userProfile.getHostEarnings);

export default router;
