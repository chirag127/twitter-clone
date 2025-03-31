import { create } from "zustand";
import api from "../utils/api";

export const useTweetStore = create((set, get) => ({
    tweets: [],
    userTweets: [],
    currentTweet: null,
    isLoading: false,
    error: null,

    // Get feed tweets
    getFeedTweets: async () => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.get("/api/tweets/feed");

            set({
                tweets: response.data.data,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to load tweets",
            });
            return { success: false };
        }
    },

    // Get user tweets
    getUserTweets: async (userId) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.get(`/api/tweets/user/${userId}`);

            set({
                userTweets: response.data.data,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to load user tweets",
            });
            return { success: false };
        }
    },

    // Get tweet by ID
    getTweet: async (tweetId) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.get(`/api/tweets/${tweetId}`);

            set({
                currentTweet: response.data.data,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to load tweet",
            });
            return { success: false };
        }
    },

    // Create tweet
    createTweet: async (content, replyTo = null) => {
        try {
            set({ isLoading: true, error: null });

            const tweetData = { content };
            if (replyTo) tweetData.replyTo = replyTo;

            const response = await api.post("/api/tweets", tweetData);

            // Add new tweet to beginning of tweets array
            set((state) => ({
                tweets: [response.data.data, ...state.tweets],
                isLoading: false,
            }));

            return { success: true, tweet: response.data.data };
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message || "Failed to create tweet",
            });
            return { success: false };
        }
    },

    // Delete tweet
    deleteTweet: async (tweetId) => {
        try {
            set({ isLoading: true, error: null });

            await api.delete(`/api/tweets/${tweetId}`);

            // Remove tweet from tweets and userTweets arrays
            set((state) => ({
                tweets: state.tweets.filter((tweet) => tweet._id !== tweetId),
                userTweets: state.userTweets.filter(
                    (tweet) => tweet._id !== tweetId
                ),
                isLoading: false,
            }));

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message || "Failed to delete tweet",
            });
            return { success: false };
        }
    },

    // Like/unlike tweet
    likeTweet: async (tweetId) => {
        try {
            const response = await api.put(`/api/tweets/${tweetId}/like`);

            // Update tweets and userTweets arrays
            set((state) => ({
                tweets: state.tweets.map((tweet) =>
                    tweet._id === tweetId ? response.data.data : tweet
                ),
                userTweets: state.userTweets.map((tweet) =>
                    tweet._id === tweetId ? response.data.data : tweet
                ),
                currentTweet:
                    state.currentTweet?._id === tweetId
                        ? response.data.data
                        : state.currentTweet,
            }));

            return { success: true, isLiked: response.data.isLiked };
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to like/unlike tweet",
            };
        }
    },

    // Retweet/unretweet
    retweetTweet: async (tweetId) => {
        try {
            const response = await api.put(`/api/tweets/${tweetId}/retweet`);

            // Refresh tweets after retweet
            get().getFeedTweets();

            // If userTweets is not empty, also refresh them
            if (get().userTweets.length > 0) {
                const userId = get().userTweets[0].user._id;
                get().getUserTweets(userId);
            }

            return { success: true, isRetweeted: response.data.isRetweeted };
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to retweet/unretweet",
            };
        }
    },

    // Search tweets
    searchTweets: async (query) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.get(`/api/tweets/search?query=${query}`);

            set({
                tweets: response.data.data,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message || "Failed to search tweets",
            });
            return { success: false };
        }
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },
}));
