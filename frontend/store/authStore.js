import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Set token
    setToken: (token) => {
        set({ token, isAuthenticated: !!token });
    },

    // Set user
    setUser: (user) => {
        set({ user });
    },

    // Register user
    register: async (userData) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.post("/api/auth/register", userData);

            const { token, user } = response.data;

            // Store token and user data in AsyncStorage
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("user", JSON.stringify(user));

            // Set token and user in state
            set({
                token,
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Registration failed",
            });
            return {
                success: false,
                error: error.response?.data?.message || "Registration failed",
            };
        }
    },

    // Login user
    login: async (email, password) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.post("/api/auth/login", {
                email,
                password,
            });

            const { token, user } = response.data;

            // Store token and user data in AsyncStorage
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("user", JSON.stringify(user));

            // Set token and user in state
            set({
                token,
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return { success: true };
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Login failed",
            });
            return {
                success: false,
                error: error.response?.data?.message || "Login failed",
            };
        }
    },

    // Logout user
    logout: async () => {
        try {
            // Remove token and user data from AsyncStorage
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");

            // Clear state
            set({
                token: null,
                user: null,
                isAuthenticated: false,
                error: null,
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: "Logout failed" };
        }
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },
}));
