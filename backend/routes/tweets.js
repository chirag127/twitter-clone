const express = require('express');
const Tweet = require('../models/Tweet');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/tweets
// @desc    Create a tweet
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Tweet content cannot be empty' });
    }

    const newTweet = new Tweet({
      content,
      author: req.user.id
    });

    const tweet = await newTweet.save();
    // Optionally populate author details if needed immediately
    // await tweet.populate('author', 'name username profilePicture');

    res.status(201).json(tweet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/tweets
// @desc    Get tweets (e.g., for timeline - basic implementation)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Basic: Get latest tweets from everyone
    // TODO: Implement timeline logic (tweets from followed users)
    const tweets = await Tweet.find()
      .populate('author', 'name username profilePicture') // Populate author details
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Limit the number of tweets

    res.json(tweets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tweets/like/:id
// @desc    Like/unlike a tweet
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    // Check if already liked by this user
    const isLiked = tweet.likes.some(like => like.toString() === req.user.id);

    if (isLiked) {
      // Unlike
      tweet.likes = tweet.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like
      tweet.likes.push(req.user.id);
    }

    await tweet.save();
    res.json(tweet.likes); // Return updated likes array

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Tweet not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tweets/retweet/:id
// @desc    Retweet/unretweet a tweet (basic implementation)
// @access  Private
router.post('/retweet/:id', auth, async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }

        // Check if already retweeted by this user
        const isRetweeted = tweet.retweets.some(retweet => retweet.toString() === req.user.id);

        if (isRetweeted) {
            // Unretweet
            tweet.retweets = tweet.retweets.filter(retweet => retweet.toString() !== req.user.id);
            // TODO: Potentially remove the retweeted tweet if it was created as a separate entity
        } else {
            // Retweet
            tweet.retweets.push(req.user.id);
            // TODO: Potentially create a new tweet referencing the original
        }

        await tweet.save();
        res.json({ retweets: tweet.retweets, message: isRetweeted ? 'Unretweeted' : 'Retweeted' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Tweet not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;