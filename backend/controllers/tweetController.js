const Tweet = require("../models/Tweet");
const User = require("../models/User");

// @desc    Create new tweet
// @route   POST /api/tweets
// @access  Private
exports.createTweet = async (req, res) => {
    try {
        const { content, replyTo } = req.body;

        // Create tweet
        const newTweet = await Tweet.create({
            content,
            user: req.user.id,
            replyTo: replyTo || null,
        });

        // Populate user information
        const tweet = await Tweet.findById(newTweet._id).populate({
            path: "user",
            select: "name username profileImage",
        });

        res.status(201).json({
            success: true,
            data: tweet,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all tweets for feed (tweets from users the current user follows)
// @route   GET /api/tweets/feed
// @access  Private
exports.getFeedTweets = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const following = user.following;

        // Add current user's id to show their tweets in feed too
        following.push(req.user.id);

        const tweets = await Tweet.find({
            $or: [
                { user: { $in: following } },
                { retweetedBy: { $in: following } },
            ],
        })
            .populate({
                path: "user",
                select: "name username profileImage",
            })
            .populate({
                path: "retweetData",
                populate: {
                    path: "user",
                    select: "name username profileImage",
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tweets.length,
            data: tweets,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get tweet by id
// @route   GET /api/tweets/:id
// @access  Private
exports.getTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id)
            .populate({
                path: "user",
                select: "name username profileImage",
            })
            .populate({
                path: "retweetData",
                populate: {
                    path: "user",
                    select: "name username profileImage",
                },
            });

        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found",
            });
        }

        res.status(200).json({
            success: true,
            data: tweet,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete tweet
// @route   DELETE /api/tweets/:id
// @access  Private
exports.deleteTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found",
            });
        }

        // Make sure user owns the tweet
        if (tweet.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not authorized to delete this tweet",
            });
        }

        await tweet.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Like/Unlike a tweet
// @route   PUT /api/tweets/:id/like
// @access  Private
exports.likeTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found",
            });
        }

        // Check if tweet has already been liked by user
        const isLiked = tweet.likes.includes(req.user.id);

        if (isLiked) {
            // Unlike
            tweet.likes = tweet.likes.filter(
                (id) => id.toString() !== req.user.id
            );
        } else {
            // Like
            tweet.likes.push(req.user.id);
        }

        await tweet.save();

        res.status(200).json({
            success: true,
            data: tweet,
            isLiked: !isLiked,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Retweet/Unretweet a tweet
// @route   PUT /api/tweets/:id/retweet
// @access  Private
exports.retweetTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);

        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found",
            });
        }

        // Check if tweet has already been retweeted by user
        const isRetweeted = tweet.retweetedBy.includes(req.user.id);

        if (isRetweeted) {
            // Unretweet
            tweet.retweetedBy = tweet.retweetedBy.filter(
                (id) => id.toString() !== req.user.id
            );

            // Delete retweet entry if it exists
            await Tweet.deleteOne({
                retweetData: req.params.id,
                user: req.user.id,
            });
        } else {
            // Retweet
            tweet.retweetedBy.push(req.user.id);

            // Create retweet entry
            await Tweet.create({
                user: req.user.id,
                retweetData: req.params.id,
                content: "",
            });
        }

        await tweet.save();

        res.status(200).json({
            success: true,
            data: tweet,
            isRetweeted: !isRetweeted,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get tweets by user id
// @route   GET /api/tweets/user/:userId
// @access  Private
exports.getUserTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find({
            $or: [
                { user: req.params.userId },
                { retweetedBy: req.params.userId },
            ],
        })
            .populate({
                path: "user",
                select: "name username profileImage",
            })
            .populate({
                path: "retweetData",
                populate: {
                    path: "user",
                    select: "name username profileImage",
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tweets.length,
            data: tweets,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Search tweets by content
// @route   GET /api/tweets/search
// @access  Private
exports.searchTweets = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Please provide a search query",
            });
        }

        const tweets = await Tweet.find({
            content: { $regex: query, $options: "i" },
        })
            .populate({
                path: "user",
                select: "name username profileImage",
            })
            .populate({
                path: "retweetData",
                populate: {
                    path: "user",
                    select: "name username profileImage",
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tweets.length,
            data: tweets,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
