import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

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

// Home Stack Navigator
const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Feed"
                component={HomeScreen}
                options={{ headerTitle: "Home" }}
            />
            <Stack.Screen
                name="Tweet"
                component={TweetScreen}
                options={{ headerTitle: "Tweet" }}
            />
            <Stack.Screen
                name="UserProfile"
                component={ProfileScreen}
                options={({ route }) => ({
                    headerTitle: route.params?.username || "Profile",
                })}
            />
            <Stack.Screen
                name="Follow"
                component={FollowScreen}
                options={({ route }) => ({
                    headerTitle: route.params?.title || "Follow",
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
                options={{ headerTitle: "Search" }}
            />
            <Stack.Screen
                name="SearchTweet"
                component={TweetScreen}
                options={{ headerTitle: "Tweet" }}
            />
            <Stack.Screen
                name="SearchUserProfile"
                component={ProfileScreen}
                options={({ route }) => ({
                    headerTitle: route.params?.username || "Profile",
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
                options={{ headerTitle: "My Profile" }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ headerTitle: "Edit Profile" }}
            />
            <Stack.Screen
                name="ProfileTweet"
                component={TweetScreen}
                options={{ headerTitle: "Tweet" }}
            />
            <Stack.Screen
                name="ProfileFollow"
                component={FollowScreen}
                options={({ route }) => ({
                    headerTitle: route.params?.title || "Follow",
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
