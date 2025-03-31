const express = require("express");
const {
    getUserProfile,
    updateProfile,
    followUser,
    getUsers,
    getUserFollowers,
    getUserFollowing,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all routes in this router
router.use(protect);

// Get all users and search users
router.route("/").get(getUsers);

// Update profile
router.route("/profile").put(updateProfile);

// Follow/unfollow user
router.route("/:id/follow").put(followUser);

// Get user followers & following
router.route("/:id/followers").get(getUserFollowers);
router.route("/:id/following").get(getUserFollowing);

// Get user profile
router.route("/:id").get(getUserProfile);

module.exports = router;
