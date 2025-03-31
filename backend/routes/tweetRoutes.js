const express = require("express");
const {
    createTweet,
    getFeedTweets,
    getTweet,
    deleteTweet,
    likeTweet,
    retweetTweet,
    getUserTweets,
    searchTweets,
} = require("../controllers/tweetController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all routes in this router
router.use(protect);

// Create tweet and get feed tweets
router.route("/").post(createTweet);
router.route("/feed").get(getFeedTweets);

// Search tweets
router.route("/search").get(searchTweets);

// Get user tweets
router.route("/user/:userId").get(getUserTweets);

// Like and retweet operations
router.route("/:id/like").put(likeTweet);
router.route("/:id/retweet").put(retweetTweet);

// Get and delete tweet by id
router.route("/:id").get(getTweet).delete(deleteTweet);

module.exports = router;
