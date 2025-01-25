import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// Favorites
router.post("/", auth, controllers.favourite.addFavorite); // Add to favorites
router.delete("/:id", auth, controllers.favourite.removeFavorite); // Remove from favorites

export default router;
