const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register and login routes
router.post("/register", register);
router.post("/login", login);

// Protected route to get current user
router.get("/me", protect, getMe);

module.exports = router;
