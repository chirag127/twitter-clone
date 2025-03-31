import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import AuthNavigator from "./navigation/AuthNavigator";
import MainNavigator from "./navigation/MainNavigator";

// Store
import { useAuthStore } from "./store/authStore";

const Stack = createNativeStackNavigator();

export default function App() {
    const { isAuthenticated, setToken, setUser } = useAuthStore();

    useEffect(() => {
        // Check if user is logged in
        const bootstrapAsync = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const userData = await AsyncStorage.getItem("user");

                if (token && userData) {
                    setToken(token);
                    setUser(JSON.parse(userData));
                }
            } catch (e) {
                console.error("Failed to load authentication state:", e);
            }
        };

        bootstrapAsync();
    }, []);

    return (
        <NavigationContainer>
            <StatusBar style="dark" />
            {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
