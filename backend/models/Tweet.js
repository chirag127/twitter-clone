const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please add tweet content"],
            maxlength: [280, "Tweet cannot be more than 280 characters"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        retweetedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        retweetData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tweet",
        },
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tweet",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Tweet", TweetSchema);
