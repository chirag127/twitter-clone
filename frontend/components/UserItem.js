import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Components
import Button from "./Button";

// Store
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";

const UserItem = ({ user, showFollowButton = true }) => {
    const navigation = useNavigation();
    const { followUser } = useUserStore();
    const { user: currentUser } = useAuthStore();

    // Check if current user is following this user
    const isFollowing = currentUser?.following?.includes(user._id);

    // Check if this is the current user
    const isCurrentUser = currentUser?.id === user._id;

    const handleFollow = async () => {
        await followUser(user._id);
    };

    const handlePress = () => {
        navigation.navigate("UserProfile", {
            userId: user._id,
            username: user.username,
        });
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Image
                source={{
                    uri: `https://ui-avatars.com/api/?name=${user.name}&background=random`,
                }}
                style={styles.avatar}
            />

            <View style={styles.userInfo}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.username}>@{user.username}</Text>
                {user.bio && (
                    <Text style={styles.bio} numberOfLines={2}>
                        {user.bio}
                    </Text>
                )}
            </View>

            {showFollowButton && !isCurrentUser && (
                <Button
                    title={isFollowing ? "Following" : "Follow"}
                    onPress={handleFollow}
                    primary={!isFollowing}
                    outline={isFollowing}
                    style={styles.followButton}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontWeight: "bold",
        fontSize: 15,
    },
    username: {
        color: "#657786",
        fontSize: 14,
        marginBottom: 4,
    },
    bio: {
        fontSize: 14,
        color: "#14171A",
    },
    followButton: {
        minWidth: 80,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
});

export default UserItem;
