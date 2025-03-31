import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create an instance of axios
const api = axios.create({
    baseURL: "http://192.168.31.232:5000", // Update with your actual backend IP/URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to retry yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear stored token and user data
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");

            // Redirect to login will be handled by App.js detecting no token
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
