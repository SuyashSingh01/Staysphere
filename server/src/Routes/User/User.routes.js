import express from "express";
const router = express.Router();

import { auth, isAdmin, isHost } from "../../middleware/auth.js";

// Testing Purpose Routes

// Protected Routes

router.get("/account", (req, res) => {
  res.json({
    message: "Welcome to Protected Routes of User",
    success: true,
  });
});
router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    message: "Welcome to Protected Routes of Admin",
    success: true,
  });
});

router.get("/host", auth, isHost, (req, res) => {
  res.json({
    message: "Welcome to Protected Routes of Host",
    success: true,
  });
});

export default router;
