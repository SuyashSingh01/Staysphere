import express from "express";
const router = express.Router();

const { login, signup } = require("../controller/Auth");
const { auth, isAdmin, isHost } = require("../../middleware/auth");

// Routes

router.post("/login", login);
router.post("/signup", signup);

// Testing Purpose Routes
router.get("/test", auth, (req, res) => {
  res.json({
    message: "Welcome to Test Routes",
    success: true,
  });
});

// Protected Routes

router.get("/account/", auth, (req, res) => {
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

module.exports = router;
