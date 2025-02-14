import express from "express";
import { controllers } from "../../controllers/index.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// Reviews
router.post("/place/addReview", auth, controllers.review.addReview); // Submit a review
router.get("/place/getReviews/:id", controllers.review.getReviewsForPlace); // Get reviews for a specific listing

export default router;
