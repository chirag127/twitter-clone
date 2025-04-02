import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

// Screens
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import NewTweetScreen from "../screens/NewTweetScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TweetScreen from "../screens/TweetScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import FollowScreen from "../screens/FollowScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SCREEN_WIDTH = Dimensions.get("window").width;
const IS_TABLET = SCREEN_WIDTH >= 768;

// Home Stack Navigator
const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Feed"
                component={HomeScreen}
                options={{
                    headerShown: false, // Hide header for HomeScreen
                }}
            />
            <Stack.Screen
                name="Tweet"
                component={TweetScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UserProfile"
                component={ProfileScreen}
                options={({ route }) => ({
                    headerShown: false,
                })}
            />
            <Stack.Screen
                name="Follow"
                component={FollowScreen}
                options={({ route }) => ({
                    headerShown: false,
                })}
            />
        </Stack.Navigator>
    );
};

// Search Stack Navigator
const SearchStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SearchMain"
                component={SearchScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SearchTweet"
                component={TweetScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SearchUserProfile"
                component={ProfileScreen}
                options={({ route }) => ({
                    headerShown: false,
                })}
            />
        </Stack.Navigator>
    );
};

// Profile Stack Navigator
const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MyProfile"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProfileTweet"
                component={TweetScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProfileFollow"
                component={FollowScreen}
                options={({ route }) => ({
                    headerShown: false,
                })}
            />
        </Stack.Navigator>
    );
};

// Main Tab Navigator
const MainNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Search") {
                        iconName = focused ? "search" : "search-outline";
                    } else if (route.name === "NewTweet") {
                        iconName = focused
                            ? "add-circle"
                            : "add-circle-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "#1DA1F2",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
                // Hide bottom tab bar on tablets since we have the side navigation
                tabBarStyle: IS_TABLET ? { display: "none" } : undefined,
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Search" component={SearchStack} />
            <Tab.Screen
                name="NewTweet"
                component={NewTweetScreen}
                options={{
                    tabBarLabel: "Tweet",
                    unmountOnBlur: true, // Unmount component when tab is not focused
                }}
            />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
};

export default MainNavigator;
