const User = require("../models/User");

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("following", "name username profileImage")
            .populate("followers", "name username profileImage");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, profileImage } = req.body;

        // Find user and update profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                name: name || req.user.name,
                bio: bio !== undefined ? bio : req.user.bio,
                profileImage: profileImage || req.user.profileImage,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Follow/Unfollow a user
// @route   PUT /api/users/:id/follow
// @access  Private
exports.followUser = async (req, res) => {
    try {
        // Check if user is trying to follow themselves
        if (req.params.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
        }

        // Find the user to follow
        const userToFollow = await User.findById(req.params.id);
        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Find the current user
        const currentUser = await User.findById(req.user.id);

        // Check if already following
        const isFollowing = currentUser.following.includes(req.params.id);

        if (isFollowing) {
            // Unfollow: Remove from current user's following
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== req.params.id
            );

            // Remove from other user's followers
            userToFollow.followers = userToFollow.followers.filter(
                (id) => id.toString() !== req.user.id
            );
        } else {
            // Follow: Add to current user's following
            currentUser.following.push(req.params.id);

            // Add to other user's followers
            userToFollow.followers.push(req.user.id);
        }

        // Save both users
        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({
            success: true,
            isFollowing: !isFollowing,
            data: {
                currentUser: {
                    id: currentUser._id,
                    following: currentUser.following,
                },
                userToFollow: {
                    id: userToFollow._id,
                    followers: userToFollow.followers,
                },
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all users (with optional search)
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res) => {
    try {
        let query = {};

        // Search functionality
        if (req.query.search) {
            query = {
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { username: { $regex: req.query.search, $options: "i" } },
                ],
            };
        }

        // Don't return the current user
        query._id = { $ne: req.user.id };

        const users = await User.find(query).select(
            "name username profileImage bio"
        );

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Private
exports.getUserFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate(
            "followers",
            "name username profileImage bio"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            count: user.followers.length,
            data: user.followers,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get user's following
// @route   GET /api/users/:id/following
// @access  Private
exports.getUserFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate(
            "following",
            "name username profileImage bio"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            count: user.following.length,
            data: user.following,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
