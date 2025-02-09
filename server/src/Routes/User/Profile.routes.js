import express from "express";
import { auth } from "../../middleware/auth";

const router = express.Router();

import {
  updateprofileDetails,
  deleteprofile,
  getProfileById,
  updateDisplayPicture,
} from "../../controllers/user/userProfile.controller";

router.get("/account/profile", auth, getProfileById);
router.put("/account/profileupdate", auth, updateprofileDetails);
router.put("/account/updateDisplaypic", auth, updateDisplayPicture);
router.delete("/account/deleteprofile", auth, deleteprofile);
router.put("/profile/updateEmail", auth, updateEmail);
router.put("/profile/updatePassword", auth, updatePassword);

export default router;
