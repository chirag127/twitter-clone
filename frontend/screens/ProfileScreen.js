import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

// Components
import Tweet from "../components/Tweet";

// Store
import { useUserStore } from "../store/userStore";
import { useTweetStore } from "../store/tweetStore";
import { useAuthStore } from "../store/authStore";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IS_TABLET = SCREEN_WIDTH >= 768;

// Default header color (Twitter blue)
const DEFAULT_HEADER_COLOR = "#1DA1F2";

const ProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const { userId } = route?.params || {};
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
    const [activeTab, setActiveTab] = useState("tweets"); // tweets, replies, media, likes

    // Check if viewing own profile or other user's profile
    const isOwnProfile = !userId || userId === user?.id;

    // Get correct user ID to display
    const targetUserId = isOwnProfile ? user?.id : userId;

    useFocusEffect(
        useCallback(() => {
            if (targetUserId) {
                loadProfile();
            }
        }, [targetUserId])
    );

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
        if (isOwnProfile) {
            navigation.navigate("ProfileTweet", { tweetId: tweet._id });
        } else {
            navigation.navigate("Tweet", { tweetId: tweet._id });
        }
    };

    const handleFollowersPress = () => {
        navigation.navigate(isOwnProfile ? "ProfileFollow" : "Follow", {
            userId: targetUserId,
            title: "Followers",
            type: "followers",
        });
    };

    const handleFollowingPress = () => {
        navigation.navigate(isOwnProfile ? "ProfileFollow" : "Follow", {
            userId: targetUserId,
            title: "Following",
            type: "following",
        });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleShare = () => {
        // Share profile functionality would go here
    };

    // Render sidebar navigation item
    const renderSidebarItem = ({ icon, text, active, onPress }) => (
        <TouchableOpacity
            style={[styles.sidebarItem, active && styles.sidebarItemActive]}
            onPress={onPress}
        >
            <Ionicons
                name={icon}
                size={24}
                color={active ? "#1DA1F2" : "#333"}
            />
            {IS_TABLET && (
                <Text
                    style={[
                        styles.sidebarText,
                        active && styles.sidebarTextActive,
                    ]}
                >
                    {text}
                </Text>
            )}
        </TouchableOpacity>
    );

    // Tab content based on active tab
    const renderTabContent = () => {
        if (activeTab === "tweets") {
            return (
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
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="chatbubble-outline"
                                size={40}
                                color="#657786"
                            />
                            <Text style={styles.emptyText}>
                                {isOwnProfile
                                    ? "You haven't posted any tweets yet"
                                    : `${profileUser?.name} hasn't posted any tweets yet`}
                            </Text>
                        </View>
                    }
                />
            );
        } else if (activeTab === "replies") {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={40}
                        color="#657786"
                    />
                    <Text style={styles.emptyText}>No replies yet</Text>
                </View>
            );
        } else if (activeTab === "media") {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="image-outline" size={40} color="#657786" />
                    <Text style={styles.emptyText}>No media yet</Text>
                </View>
            );
        } else if (activeTab === "likes") {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={40} color="#657786" />
                    <Text style={styles.emptyText}>No likes yet</Text>
                </View>
            );
        }
    };

    // Check if current user is following this profile
    const isFollowing = user?.following?.includes(targetUserId);

    // Loading state
    if ((userLoading || tweetsLoading) && !refreshing) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1DA1F2" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                {/* Left Sidebar - Only on tablets */}
                {IS_TABLET && (
                    <View style={styles.leftSidebar}>
                        <View style={styles.logo}>
                            <Ionicons
                                name="logo-twitter"
                                size={30}
                                color="#1DA1F2"
                            />
                        </View>

                        {renderSidebarItem({
                            icon: "home",
                            text: "Home",
                            active: false,
                            onPress: () => navigation.navigate("Home"),
                        })}
                        {renderSidebarItem({
                            icon: "search",
                            text: "Explore",
                            active: false,
                            onPress: () => navigation.navigate("Search"),
                        })}
                        {renderSidebarItem({
                            icon: "notifications-outline",
                            text: "Notifications",
                            active: false,
                            onPress: () => navigation.navigate("Feed"),
                        })}
                        {renderSidebarItem({
                            icon: "mail-outline",
                            text: "Messages",
                            active: false,
                            onPress: () => navigation.navigate("Feed"),
                        })}
                        {renderSidebarItem({
                            icon: "bookmark-outline",
                            text: "Bookmarks",
                            active: false,
                            onPress: () =>
                                console.log("Bookmarks - feature coming soon"),
                        })}
                        {renderSidebarItem({
                            icon: "person",
                            text: "Profile",
                            active: true,
                            onPress: () => {},
                        })}

                        <TouchableOpacity
                            style={styles.tweetButton}
                            onPress={() => navigation.navigate("NewTweet")}
                        >
                            {IS_TABLET ? (
                                <Text style={styles.tweetButtonText}>
                                    Tweet
                                </Text>
                            ) : (
                                <Ionicons name="add" size={24} color="#fff" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => {}}
                        >
                            <Image
                                source={{
                                    uri:
                                        user?.profileImageUrl ||
                                        `https://ui-avatars.com/api/?name=${user?.name}&background=random`,
                                }}
                                style={styles.profileAvatar}
                            />
                            {IS_TABLET && (
                                <View style={styles.profileInfo}>
                                    <Text style={styles.profileName}>
                                        {user?.name}
                                    </Text>
                                    <Text style={styles.profileHandle}>
                                        @{user?.username}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* Profile Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={handleBack}
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={24}
                                    color="#000"
                                />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerName}>
                                    {profileUser?.name || "Profile"}
                                </Text>
                                <Text style={styles.tweetCount}>
                                    {userTweets?.length || 0}{" "}
                                    {userTweets?.length === 1
                                        ? "Tweet"
                                        : "Tweets"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Profile Content */}
                    <ScrollView
                        style={styles.scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={["#1DA1F2"]}
                            />
                        }
                    >
                        {/* Header Image */}
                        <View style={styles.headerImageContainer}>
                            {profileUser?.headerImageUrl ? (
                                <Image
                                    source={{ uri: profileUser.headerImageUrl }}
                                    style={styles.headerImage}
                                />
                            ) : (
                                <View
                                    style={[
                                        styles.headerImage,
                                        {
                                            backgroundColor:
                                                DEFAULT_HEADER_COLOR,
                                        },
                                    ]}
                                />
                            )}
                        </View>

                        {/* Profile Info */}
                        <View style={styles.profileContainer}>
                            <View style={styles.profileHeader}>
                                <Image
                                    source={{
                                        uri:
                                            profileUser?.profileImageUrl ||
                                            `https://ui-avatars.com/api/?name=${
                                                profileUser?.name || "User"
                                            }&background=random`,
                                    }}
                                    style={styles.avatar}
                                />

                                <View style={styles.buttonContainer}>
                                    {isOwnProfile ? (
                                        <TouchableOpacity
                                            style={styles.editButton}
                                            onPress={handleEditProfile}
                                        >
                                            <Text style={styles.editButtonText}>
                                                Edit profile
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity
                                                style={styles.iconButton}
                                            >
                                                <Ionicons
                                                    name="mail-outline"
                                                    size={20}
                                                    color="#000"
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.iconButton}
                                            >
                                                <Ionicons
                                                    name="notifications-outline"
                                                    size={20}
                                                    color="#000"
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    styles.followButton,
                                                    isFollowing &&
                                                        styles.followingButton,
                                                ]}
                                                onPress={handleFollow}
                                            >
                                                <Text
                                                    style={[
                                                        styles.followButtonText,
                                                        isFollowing &&
                                                            styles.followingButtonText,
                                                    ]}
                                                >
                                                    {isFollowing
                                                        ? "Following"
                                                        : "Follow"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <Text style={styles.name}>{profileUser?.name}</Text>
                            <Text style={styles.username}>
                                @{profileUser?.username}
                            </Text>

                            {profileUser?.bio && (
                                <Text style={styles.bio}>
                                    {profileUser.bio}
                                </Text>
                            )}

                            {(profileUser?.location ||
                                profileUser?.website) && (
                                <View style={styles.detailsContainer}>
                                    {profileUser?.location && (
                                        <View style={styles.detailItem}>
                                            <Ionicons
                                                name="location-outline"
                                                size={16}
                                                color="#657786"
                                            />
                                            <Text style={styles.detailText}>
                                                {profileUser.location}
                                            </Text>
                                        </View>
                                    )}
                                    {profileUser?.website && (
                                        <View style={styles.detailItem}>
                                            <Ionicons
                                                name="link-outline"
                                                size={16}
                                                color="#657786"
                                            />
                                            <Text
                                                style={[
                                                    styles.detailText,
                                                    styles.websiteText,
                                                ]}
                                            >
                                                {profileUser.website}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            <View style={styles.statsContainer}>
                                <TouchableOpacity
                                    style={styles.stat}
                                    onPress={handleFollowingPress}
                                >
                                    <Text style={styles.statCount}>
                                        {profileUser?.following?.length || 0}
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
                                        {profileUser?.followers?.length || 0}
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Followers
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Profile Tabs */}
                        <View style={styles.tabsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === "tweets" && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab("tweets")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "tweets" &&
                                            styles.activeTabText,
                                    ]}
                                >
                                    Tweets
                                </Text>
                                {activeTab === "tweets" && (
                                    <View style={styles.activeTabIndicator} />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === "replies" && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab("replies")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "replies" &&
                                            styles.activeTabText,
                                    ]}
                                >
                                    Replies
                                </Text>
                                {activeTab === "replies" && (
                                    <View style={styles.activeTabIndicator} />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === "media" && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab("media")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "media" &&
                                            styles.activeTabText,
                                    ]}
                                >
                                    Media
                                </Text>
                                {activeTab === "media" && (
                                    <View style={styles.activeTabIndicator} />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === "likes" && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab("likes")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "likes" &&
                                            styles.activeTabText,
                                    ]}
                                >
                                    Likes
                                </Text>
                                {activeTab === "likes" && (
                                    <View style={styles.activeTabIndicator} />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Tab Content */}
                        {renderTabContent()}
                    </ScrollView>
                </View>

                {/* Right Sidebar - Only on tablets */}
                {IS_TABLET && (
                    <View style={styles.rightSidebar}>
                        {/* This could contain trending topics or who to follow */}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    leftSidebar: {
        width: IS_TABLET ? 275 : 60,
        borderRightWidth: 1,
        borderRightColor: "#E1E8ED",
        padding: 16,
        alignItems: IS_TABLET ? "flex-start" : "center",
    },
    logo: {
        marginBottom: 20,
        padding: 8,
    },
    sidebarItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 30,
        marginBottom: 8,
    },
    sidebarItemActive: {
        backgroundColor: "rgba(29, 161, 242, 0.1)",
    },
    sidebarText: {
        marginLeft: 16,
        fontSize: 18,
        fontWeight: "500",
    },
    sidebarTextActive: {
        color: "#1DA1F2",
        fontWeight: "bold",
    },
    tweetButton: {
        backgroundColor: "#1DA1F2",
        borderRadius: 30,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        width: IS_TABLET ? "100%" : 50,
        height: IS_TABLET ? 50 : 50,
    },
    tweetButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    profileButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 30,
        marginTop: "auto",
    },
    profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    profileInfo: {
        marginLeft: 12,
    },
    profileName: {
        fontWeight: "bold",
    },
    profileHandle: {
        color: "#657786",
    },
    mainContent: {
        flex: 1,
        borderRightWidth: IS_TABLET ? 1 : 0,
        borderRightColor: "#E1E8ED",
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
        padding: 16,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: 24,
    },
    headerName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    tweetCount: {
        fontSize: 14,
        color: "#657786",
    },
    scrollView: {
        flex: 1,
    },
    headerImageContainer: {
        height: 150,
    },
    headerImage: {
        width: "100%",
        height: "100%",
    },
    profileContainer: {
        padding: 16,
    },
    profileHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: -40,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: "#fff",
    },
    buttonContainer: {
        alignSelf: "flex-start",
        marginTop: 8,
    },
    editButton: {
        borderWidth: 1,
        borderColor: "#E1E8ED",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    editButtonText: {
        fontWeight: "bold",
    },
    actionButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: "#E1E8ED",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    followButton: {
        backgroundColor: "#000",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    followingButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E1E8ED",
    },
    followButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    followingButtonText: {
        color: "#000",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 12,
    },
    username: {
        fontSize: 16,
        color: "#657786",
        marginTop: 2,
    },
    bio: {
        fontSize: 16,
        marginTop: 12,
        lineHeight: 22,
    },
    detailsContainer: {
        marginTop: 12,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 14,
        color: "#657786",
        marginLeft: 4,
    },
    websiteText: {
        color: "#1DA1F2",
    },
    statsContainer: {
        flexDirection: "row",
        marginTop: 16,
    },
    stat: {
        flexDirection: "row",
        marginRight: 20,
    },
    statCount: {
        fontWeight: "bold",
        marginRight: 4,
    },
    statLabel: {
        color: "#657786",
    },
    tabsContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 16,
        position: "relative",
    },
    activeTab: {
        fontWeight: "bold",
    },
    tabText: {
        fontSize: 16,
        color: "#657786",
    },
    activeTabText: {
        color: "#1DA1F2",
        fontWeight: "bold",
    },
    activeTabIndicator: {
        position: "absolute",
        bottom: 0,
        height: 4,
        width: 50,
        backgroundColor: "#1DA1F2",
        borderRadius: 2,
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
    rightSidebar: {
        width: 350,
        padding: 16,
    },
});

export default ProfileScreen;
