import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
    SafeAreaView,
    StatusBar,
    FlatList,
    RefreshControl,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

// Components
import Tweet from "../components/Tweet";

// Store
import { useTweetStore } from "../store/tweetStore";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IS_TABLET = SCREEN_WIDTH >= 768;

// Default color (Twitter blue)
const DEFAULT_COLOR = "#1DA1F2";

const TweetScreen = ({ route, navigation }) => {
    const { tweetId } = route.params;
    const { user } = useAuthStore();
    const {
        getTweet,
        likeTweet,
        retweet,
        getReplies,
        addReply,
        currentTweet,
        isLoading,
        error,
    } = useTweetStore();
    const { getUserProfile } = useUserStore();

    const [refreshing, setRefreshing] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [repliesLoading, setRepliesLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (tweetId) {
                loadTweet();
                loadReplies();
            }
        }, [tweetId])
    );

    const loadTweet = async () => {
        await getTweet(tweetId);
        if (currentTweet?.user?._id) {
            await getUserProfile(currentTweet.user._id);
        }
    };

    const loadReplies = async () => {
        setRepliesLoading(true);
        try {
            const fetchedReplies = await getReplies(tweetId);
            setReplies(fetchedReplies || []);
        } catch (error) {
            console.error("Failed to load replies:", error);
        } finally {
            setRepliesLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadTweet();
        await loadReplies();
        setRefreshing(false);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleLike = async () => {
        try {
            await likeTweet(tweetId);
        } catch (error) {
            console.error("Failed to like tweet:", error);
        }
    };

    const handleRetweet = async () => {
        try {
            await retweet(tweetId);
        } catch (error) {
            console.error("Failed to retweet:", error);
        }
    };

    const handleProfilePress = (userId) => {
        navigation.navigate("Profile", { userId });
    };

    const submitReply = async () => {
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            await addReply(tweetId, replyText);
            setReplyText("");
            loadReplies(); // Reload replies after submitting
        } catch (error) {
            console.error("Failed to submit reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render sidebar navigation item - only for tablet
    const renderSidebarItem = ({ icon, text, active, onPress }) => (
        <TouchableOpacity
            style={[styles.sidebarItem, active && styles.sidebarItemActive]}
            onPress={onPress}
        >
            <Ionicons
                name={icon}
                size={24}
                color={active ? DEFAULT_COLOR : "#333"}
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

    if (isLoading && !refreshing) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={DEFAULT_COLOR} />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={handleBack}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#000"
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Tweet</Text>
                    </View>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentTweet) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={handleBack}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#000"
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Tweet</Text>
                    </View>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Tweet not found</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    const isLiked = currentTweet.likes?.includes(user?.id);
    const isRetweeted = currentTweet.retweets?.includes(user?.id);

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
                                color={DEFAULT_COLOR}
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
                            active: false,
                            onPress: () => navigation.navigate("Profile"),
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
                    </View>
                )}

                {/* Main Content */}
                <View style={styles.mainContent}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={handleBack}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#000"
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Tweet</Text>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[DEFAULT_COLOR]}
                            />
                        }
                    >
                        {/* Detailed Tweet View */}
                        <View style={styles.tweetDetailContainer}>
                            {/* Tweet Author Info */}
                            <View style={styles.tweetAuthorContainer}>
                                <TouchableOpacity
                                    onPress={() =>
                                        handleProfilePress(
                                            currentTweet.user._id
                                        )
                                    }
                                    style={styles.authorImageContainer}
                                >
                                    <Image
                                        source={{
                                            uri:
                                                currentTweet.user
                                                    .profileImageUrl ||
                                                `https://ui-avatars.com/api/?name=${currentTweet.user.name}&background=random`,
                                        }}
                                        style={styles.authorImage}
                                    />
                                </TouchableOpacity>
                                <View style={styles.authorInfo}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleProfilePress(
                                                currentTweet.user._id
                                            )
                                        }
                                    >
                                        <Text style={styles.authorName}>
                                            {currentTweet.user.name}
                                        </Text>
                                        <Text style={styles.authorUsername}>
                                            @{currentTweet.user.username}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.moreButton}>
                                    <Ionicons
                                        name="ellipsis-horizontal"
                                        size={20}
                                        color="#657786"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Tweet Content */}
                            <View style={styles.tweetContent}>
                                <Text style={styles.tweetText}>
                                    {currentTweet.text}
                                </Text>
                                {currentTweet.image && (
                                    <Image
                                        source={{ uri: currentTweet.image }}
                                        style={styles.tweetImage}
                                        resizeMode="cover"
                                    />
                                )}
                                <Text style={styles.tweetTime}>
                                    {new Date(
                                        currentTweet.createdAt
                                    ).toLocaleTimeString()}{" "}
                                    ·{" "}
                                    {new Date(
                                        currentTweet.createdAt
                                    ).toLocaleDateString()}
                                </Text>
                            </View>

                            {/* Tweet Stats */}
                            <View style={styles.tweetStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>
                                        {currentTweet.retweets?.length || 0}
                                    </Text>
                                    <Text style={styles.statLabel}>
                                        Retweets
                                    </Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>
                                        {currentTweet.likes?.length || 0}
                                    </Text>
                                    <Text style={styles.statLabel}>Likes</Text>
                                </View>
                            </View>

                            {/* Tweet Actions */}
                            <View style={styles.tweetActions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons
                                        name="chatbubble-outline"
                                        size={20}
                                        color="#657786"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleRetweet}
                                >
                                    <Ionicons
                                        name={
                                            isRetweeted
                                                ? "repeat"
                                                : "repeat-outline"
                                        }
                                        size={20}
                                        color={
                                            isRetweeted ? "#17BF63" : "#657786"
                                        }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleLike}
                                >
                                    <Ionicons
                                        name={
                                            isLiked ? "heart" : "heart-outline"
                                        }
                                        size={20}
                                        color={isLiked ? "#E0245E" : "#657786"}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons
                                        name="share-outline"
                                        size={20}
                                        color="#657786"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Reply Input */}
                        <View style={styles.replyInputContainer}>
                            <Image
                                source={{
                                    uri:
                                        user?.profileImageUrl ||
                                        `https://ui-avatars.com/api/?name=${
                                            user?.name || "User"
                                        }&background=random`,
                                }}
                                style={styles.replyAuthorImage}
                            />
                            <View style={styles.replyInputWrapper}>
                                <TextInput
                                    style={styles.replyInput}
                                    placeholder="Tweet your reply"
                                    multiline
                                    value={replyText}
                                    onChangeText={setReplyText}
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.replyButton,
                                        !replyText.trim() &&
                                            styles.replyButtonDisabled,
                                    ]}
                                    onPress={submitReply}
                                    disabled={!replyText.trim() || isSubmitting}
                                >
                                    <Text style={styles.replyButtonText}>
                                        {isSubmitting ? "Sending..." : "Reply"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Replies Section */}
                        <View style={styles.repliesContainer}>
                            <Text style={styles.repliesHeader}>Replies</Text>

                            {repliesLoading && !refreshing ? (
                                <ActivityIndicator
                                    size="small"
                                    color={DEFAULT_COLOR}
                                    style={styles.repliesLoading}
                                />
                            ) : replies.length > 0 ? (
                                replies.map((reply) => (
                                    <Tweet
                                        key={reply._id}
                                        tweet={reply}
                                        onPress={() =>
                                            navigation.navigate("Tweet", {
                                                tweetId: reply._id,
                                            })
                                        }
                                    />
                                ))
                            ) : (
                                <View style={styles.emptyRepliesContainer}>
                                    <Text style={styles.emptyRepliesText}>
                                        No replies yet
                                    </Text>
                                    <Text style={styles.emptyRepliesSubtext}>
                                        Be the first to reply!
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>

                {/* Right Sidebar - Only on tablets */}
                {IS_TABLET && (
                    <View style={styles.rightSidebar}>
                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Ionicons
                                name="search"
                                size={18}
                                color="#657786"
                                style={styles.searchIcon}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search Twitter"
                            />
                        </View>

                        {/* Trending Section */}
                        <View style={styles.trendingContainer}>
                            <Text style={styles.trendingHeader}>
                                What's happening
                            </Text>

                            {/* Trending Items would go here */}
                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingCategory}>
                                    Trending in US
                                </Text>
                                <Text style={styles.trendingTopic}>
                                    #TwitterClone
                                </Text>
                                <Text style={styles.trendingCount}>
                                    10.5K Tweets
                                </Text>
                            </View>

                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingCategory}>
                                    Sports · Trending
                                </Text>
                                <Text style={styles.trendingTopic}>NFL</Text>
                                <Text style={styles.trendingCount}>
                                    55.2K Tweets
                                </Text>
                            </View>

                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingCategory}>
                                    Technology · Trending
                                </Text>
                                <Text style={styles.trendingTopic}>
                                    React Native
                                </Text>
                                <Text style={styles.trendingCount}>
                                    25.3K Tweets
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.showMoreButton}>
                                <Text style={styles.showMoreText}>
                                    Show more
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Who to follow */}
                        <View style={styles.followContainer}>
                            <Text style={styles.followHeader}>
                                Who to follow
                            </Text>

                            {/* Follow suggestions would go here */}
                            <TouchableOpacity style={styles.showMoreButton}>
                                <Text style={styles.showMoreText}>
                                    Show more
                                </Text>
                            </TouchableOpacity>
                        </View>
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
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#E0245E",
        textAlign: "center",
        fontSize: 16,
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
        color: DEFAULT_COLOR,
        fontWeight: "bold",
    },
    tweetButton: {
        backgroundColor: DEFAULT_COLOR,
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
    mainContent: {
        flex: 1,
        borderRightWidth: IS_TABLET ? 1 : 0,
        borderRightColor: "#E1E8ED",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    scrollView: {
        flex: 1,
    },
    tweetDetailContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    tweetAuthorContainer: {
        flexDirection: "row",
        marginBottom: 12,
    },
    authorImageContainer: {
        marginRight: 12,
    },
    authorImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontWeight: "bold",
        fontSize: 16,
    },
    authorUsername: {
        color: "#657786",
        fontSize: 14,
    },
    moreButton: {
        padding: 4,
    },
    tweetContent: {
        marginBottom: 16,
    },
    tweetText: {
        fontSize: 22,
        lineHeight: 30,
        marginBottom: 16,
    },
    tweetImage: {
        width: "100%",
        height: 200,
        borderRadius: 16,
        marginBottom: 16,
    },
    tweetTime: {
        color: "#657786",
        fontSize: 14,
    },
    tweetStats: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#E1E8ED",
        paddingVertical: 12,
        marginBottom: 12,
    },
    statItem: {
        flexDirection: "row",
        marginRight: 16,
    },
    statNumber: {
        fontWeight: "bold",
        marginRight: 4,
    },
    statLabel: {
        color: "#657786",
    },
    statDivider: {
        width: 1,
        backgroundColor: "#E1E8ED",
        marginHorizontal: 16,
    },
    tweetActions: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    actionButton: {
        padding: 8,
    },
    replyInputContainer: {
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    replyAuthorImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    replyInputWrapper: {
        flex: 1,
    },
    replyInput: {
        minHeight: 60,
        maxHeight: 120,
        fontSize: 16,
        paddingTop: 8,
    },
    replyButton: {
        alignSelf: "flex-end",
        backgroundColor: DEFAULT_COLOR,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 8,
    },
    replyButtonDisabled: {
        backgroundColor: "#AAB8C2",
    },
    replyButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    repliesContainer: {
        padding: 16,
    },
    repliesHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    repliesLoading: {
        marginVertical: 20,
    },
    emptyRepliesContainer: {
        padding: 20,
        alignItems: "center",
    },
    emptyRepliesText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    emptyRepliesSubtext: {
        color: "#657786",
        fontSize: 14,
    },
    rightSidebar: {
        width: 350,
        padding: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EFF3F4",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
    },
    trendingContainer: {
        backgroundColor: "#F7F9FA",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
    },
    trendingHeader: {
        fontWeight: "bold",
        fontSize: 19,
        padding: 16,
    },
    trendingItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    trendingCategory: {
        fontSize: 13,
        color: "#657786",
    },
    trendingTopic: {
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 4,
    },
    trendingCount: {
        fontSize: 13,
        color: "#657786",
    },
    followContainer: {
        backgroundColor: "#F7F9FA",
        borderRadius: 16,
        overflow: "hidden",
    },
    followHeader: {
        fontWeight: "bold",
        fontSize: 19,
        padding: 16,
    },
    showMoreButton: {
        padding: 16,
    },
    showMoreText: {
        color: DEFAULT_COLOR,
    },
});

export default TweetScreen;
