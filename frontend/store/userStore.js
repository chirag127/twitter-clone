import { create } from "zustand";
import api from "../utils/api";

export const useUserStore = create((set) => ({
    users: [],
    profileUser: null,
    followers: [],
    following: [],
    isLoading: false,
    error: null,

    // Get all users (with optional search)
    getUsers: async (search = "") => {
        try {
            set({ isLoading: true, error: null });

            const endpoint = search
                ? `/api/users?search=${encodeURIComponent(search)}`
                : "/api/users";

            const response = await api.get(endpoint);

            set({
                users: response.data.data,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to load users",
            });
            return { success: false };
        }
    },

    // Get user profile
    getUserProfile: async (userId) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.get(`/api/users/${userId}`);

            set({
                profileUser: response.data.data,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to load user profile",
            });
            return { success: false };
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.put(`/api/users/profile`, profileData);

            set({
                profileUser: response.data.data,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message || "Failed to update profile",
            });
            return { success: false };
        }
    },

    // Follow/Unfollow user
    followUser: async (userId) => {
        try {
            const response = await api.put(`/api/users/${userId}/follow`);

            set((state) => ({
                // Update profileUser if it's the user being followed/unfollowed
                profileUser:
                    state.profileUser?._id === userId
                        ? {
                              ...state.profileUser,
                              followers:
                                  response.data.data.userToFollow.followers,
                          }
                        : state.profileUser,
            }));

            return {
                success: true,
                isFollowing: response.data.isFollowing,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to follow/unfollow user",
            };
        }
    },

    // Get user's followers
    getUserFollowers: async (userId) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.get(`/api/users/${userId}/followers`);

            set({
                followers: response.data.data,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message || "Failed to load followers",
            });
            return { success: false };
        }
    },

    // Get user's following
    getUserFollowing: async (userId) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.get(`/api/users/${userId}/following`);

            set({
                following: response.data.data,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error.response?.data?.message || "Failed to load following",
            });
            return { success: false };
        }
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },
}));
