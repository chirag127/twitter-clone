const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 280
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
TweetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Tweet', TweetSchema);