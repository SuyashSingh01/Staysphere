import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// Favorites
router.get("/account/liked-place", auth, controllers.favourite.getFavorite);
router.post("/add-favorite/:placeID", auth, controllers.favourite.addFavorite); // Add to favorites
router.delete(
  "/remove-favorite/:id",
  auth,
  controllers.favourite.removeFavorite
); // Remove from favorites

export default router;
