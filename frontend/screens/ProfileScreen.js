import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Components
import Button from "../components/Button";
import Tweet from "../components/Tweet";

// Store
import { useUserStore } from "../store/userStore";
import { useTweetStore } from "../store/tweetStore";
import { useAuthStore } from "../store/authStore";

const ProfileScreen = ({ route, navigation }) => {
    const { userId } = route.params || {};
    const { user } = useAuthStore();
    const {
        profileUser,
        getUserProfile,
        followUser,
        isLoading: userLoading,
    } = useUserStore();
    const {
        userTweets,
        getUserTweets,
        isLoading: tweetsLoading,
    } = useTweetStore();
    const [refreshing, setRefreshing] = useState(false);

    // Check if viewing own profile or other user's profile
    const isOwnProfile = !userId || userId === user?.id;

    // Get correct user ID to display
    const targetUserId = isOwnProfile ? user?.id : userId;

    useEffect(() => {
        if (targetUserId) {
            loadProfile();
        }
    }, [targetUserId]);

    const loadProfile = async () => {
        await getUserProfile(targetUserId);
        await getUserTweets(targetUserId);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadProfile();
        setRefreshing(false);
    };

    const handleFollow = async () => {
        await followUser(targetUserId);
    };

    const handleEditProfile = () => {
        navigation.navigate("EditProfile");
    };

    const handleTweetPress = (tweet) => {
        navigation.navigate("Tweet", { tweetId: tweet._id });
    };

    const handleFollowersPress = () => {
        navigation.navigate("Follow", {
            userId: targetUserId,
            title: "Followers",
            type: "followers",
        });
    };

    const handleFollowingPress = () => {
        navigation.navigate("Follow", {
            userId: targetUserId,
            title: "Following",
            type: "following",
        });
    };

    // Check if current user is following this profile
    const isFollowing = user?.following?.includes(targetUserId);

    // Loading state
    if ((userLoading || tweetsLoading) && !refreshing) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1DA1F2" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={userTweets}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <Tweet tweet={item} onPress={handleTweetPress} />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#1DA1F2"]}
                    />
                }
                ListHeaderComponent={
                    profileUser && (
                        <View style={styles.profileContainer}>
                            <View style={styles.headerContainer}>
                                <Image
                                    source={{
                                        uri: `https://ui-avatars.com/api/?name=${profileUser.name}&background=random`,
                                    }}
                                    style={styles.avatar}
                                />

                                <View style={styles.buttonContainer}>
                                    {isOwnProfile ? (
                                        <Button
                                            title="Edit Profile"
                                            onPress={handleEditProfile}
                                            outline
                                            style={styles.actionButton}
                                        />
                                    ) : (
                                        <Button
                                            title={
                                                isFollowing
                                                    ? "Following"
                                                    : "Follow"
                                            }
                                            onPress={handleFollow}
                                            primary={!isFollowing}
                                            outline={isFollowing}
                                            style={styles.actionButton}
                                        />
                                    )}
                                </View>
                            </View>

                            <Text style={styles.name}>{profileUser.name}</Text>
                            <Text style={styles.username}>
                                @{profileUser.username}
                            </Text>

                            {profileUser.bio && (
                                <Text style={styles.bio}>
                                    {profileUser.bio}
                                </Text>
                            )}

                            <View style={styles.statsContainer}>
                                <TouchableOpacity
                                    style={styles.stat}
                                    onPress={handleFollowingPress}
                                >
                                    <Text style={styles.statCount}>
                                        {profileUser.following?.length || 0}
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Following
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.stat}
                                    onPress={handleFollowersPress}
                                >
                                    <Text style={styles.statCount}>
                                        {profileUser.followers?.length || 0}
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Followers
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.tweetsHeader}>Tweets</Text>
                        </View>
                    )
                }
                ListEmptyComponent={
                    profileUser && (
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="ios-chatbubble-outline"
                                size={40}
                                color="#657786"
                            />
                            <Text style={styles.emptyText}>
                                {isOwnProfile
                                    ? "You haven't posted any tweets yet"
                                    : `${profileUser.name} hasn't posted any tweets yet`}
                            </Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    profileContainer: {
        padding: 16,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    buttonContainer: {
        alignItems: "flex-end",
    },
    actionButton: {
        minWidth: 100,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        color: "#657786",
        marginBottom: 12,
    },
    bio: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    stat: {
        flexDirection: "row",
        marginRight: 20,
        alignItems: "center",
    },
    statCount: {
        fontWeight: "bold",
        marginRight: 4,
    },
    statLabel: {
        color: "#657786",
    },
    divider: {
        height: 1,
        backgroundColor: "#E1E8ED",
        marginBottom: 16,
    },
    tweetsHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        color: "#657786",
        fontSize: 16,
        textAlign: "center",
        marginTop: 12,
    },
});

export default ProfileScreen;
