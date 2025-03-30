const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Tweet content cannot be empty'],
    trim: true,
    maxlength: [280, 'Tweet cannot exceed 280 characters'], // Twitter character limit
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'Tweet must have an author'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References users who liked the tweet
  }],
  // We can add fields for retweets and replies later
  // retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // parentTweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }, // For replies
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Optional: Indexing for performance on common queries
TweetSchema.index({ author: 1, createdAt: -1 }); // Index for fetching user tweets chronologically

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;