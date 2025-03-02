import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { authorize } from "../../middleware/authorize.js";
import { auth } from "../../middleware/auth.js";
import { multerUpload } from "../../config/cloudinary.js";
const router = express.Router();

// Host Authentication

router.post(
  "/host/addplace",
  auth,
  authorize("Host"),
  // multerUpload.array("images", 10),
  controllers.host.addHostPlace
); // host place

router.delete(
  "/host/deletehostplace/:placeId",
  auth,
  authorize("Host"),
  controllers.host.deleteHostPlace
); // Host place deletion
router.get(
  "/host/gethostplaceById/:id",
  auth,
  authorize("Host"),
  controllers.host.getHostPlaceById
); // Host place by id
router.get(
  "/host/getallhostplace",
  auth,
  authorize("Host"),
  controllers.host.getAllHostPlaces
); // All Host place
router.put(
  "/host/updatehostplace/:placeId",
  auth,
  authorize("Host"),
  // multerUpload.array("images", 1),
  controllers.host.updateHostPlace
); // Update Host place

export default router;
