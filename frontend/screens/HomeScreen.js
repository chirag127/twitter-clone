import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Components
import Tweet from "../components/Tweet";

// Store
import { useTweetStore } from "../store/tweetStore";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IS_TABLET = SCREEN_WIDTH >= 768;

const HomeScreen = ({ navigation }) => {
    const { fetchTweets, tweets, isLoading, error } = useTweetStore();
    const { user } = useAuthStore();
    const { fetchRecommendedUsers } = useUserStore();

    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("for-you");
    const [searchQuery, setSearchQuery] = useState("");
    const [trendingTopics, setTrendingTopics] = useState([
        {
            id: 1,
            category: "Trending in US",
            topic: "#TwitterClone",
            tweets: "10.5K",
        },
        { id: 2, category: "Sports · Trending", topic: "NFL", tweets: "55.2K" },
        {
            id: 3,
            category: "Technology · Trending",
            topic: "React Native",
            tweets: "25.3K",
        },
        {
            id: 4,
            category: "Entertainment · Trending",
            topic: "#Sikandar",
            tweets: "45.1K",
        },
        {
            id: 5,
            category: "Trending in India",
            topic: "#ghiblistyle",
            tweets: "19.6K",
        },
    ]);
    const [recommendedUsers, setRecommendedUsers] = useState([
        {
            id: 1,
            name: "Reuters Tech News",
            username: "ReutersTech",
            verified: true,
        },
        {
            id: 2,
            name: "Ahmed Khaleel",
            username: "ahmedkhaleel04",
            verified: true,
        },
        {
            id: 3,
            name: "Grok",
            username: "grok",
            verified: false,
            premium: true,
        },
    ]);

    useFocusEffect(
        useCallback(() => {
            loadTweets();
            loadUsers();
        }, [])
    );

    const loadTweets = async () => {
        await fetchTweets();
    };

    const loadUsers = async () => {
        try {
            const users = await fetchRecommendedUsers();
            if (users && users.length > 0) {
                setRecommendedUsers(users);
            }
        } catch (error) {
            console.error("Failed to load recommended users:", error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([loadTweets(), loadUsers()]);
        setRefreshing(false);
    };

    const handleTweetPress = (tweetId) => {
        navigation.navigate("Tweet", { tweetId });
    };

    const handleProfilePress = (userId) => {
        navigation.navigate("Profile", { userId });
    };

    const handleNewTweet = () => {
        navigation.navigate("NewTweet");
    };

    const navigateToSearch = () => {
        navigation.navigate("Search");
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
                color={active ? "#fff" : "#71767B"}
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

    // Render trending item
    const renderTrendingItem = ({ category, topic, tweets }) => (
        <TouchableOpacity style={styles.trendingItem}>
            <Text style={styles.trendingCategory}>{category}</Text>
            <Text style={styles.trendingTopic}>{topic}</Text>
            <Text style={styles.trendingCount}>{tweets} posts</Text>
        </TouchableOpacity>
    );

    // Render user to follow
    const renderUserToFollow = ({ name, username, verified, premium }) => (
        <View style={styles.userToFollowItem}>
            <View style={styles.userToFollowLeft}>
                <Image
                    source={{
                        uri: `https://ui-avatars.com/api/?name=${name}&background=random`,
                    }}
                    style={styles.userToFollowImage}
                />
                <View style={styles.userToFollowInfo}>
                    <View style={styles.userToFollowNameRow}>
                        <Text style={styles.userToFollowName}>{name}</Text>
                        {verified && (
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color="#1D9BF0"
                                style={styles.verifiedIcon}
                            />
                        )}
                    </View>
                    <Text style={styles.userToFollowUsername}>@{username}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                {/* Left Sidebar - Only on tablets */}
                {IS_TABLET && (
                    <View style={styles.leftSidebar}>
                        <View style={styles.logo}>
                            <Text style={styles.logoText}>𝕏</Text>
                        </View>

                        {renderSidebarItem({
                            icon: "home",
                            text: "Home",
                            active: true,
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
                            icon: "people-outline",
                            text: "Communities",
                            active: false,
                            onPress: () =>
                                console.log(
                                    "Communities - feature coming soon"
                                ),
                        })}
                        {renderSidebarItem({
                            icon: "person",
                            text: "Profile",
                            active: false,
                            onPress: () => navigation.navigate("Profile"),
                        })}
                        {renderSidebarItem({
                            icon: "ellipsis-horizontal-circle-outline",
                            text: "More",
                            active: false,
                        })}

                        <TouchableOpacity
                            style={styles.tweetButton}
                            onPress={handleNewTweet}
                        >
                            {IS_TABLET ? (
                                <Text style={styles.tweetButtonText}>Post</Text>
                            ) : (
                                <Ionicons name="add" size={24} color="#fff" />
                            )}
                        </TouchableOpacity>

                        {IS_TABLET && (
                            <TouchableOpacity
                                style={styles.accountButton}
                                onPress={() =>
                                    navigation.navigate("Profile", {
                                        userId: user?.id,
                                    })
                                }
                            >
                                <Image
                                    source={{
                                        uri:
                                            user?.profileImageUrl ||
                                            `https://ui-avatars.com/api/?name=${
                                                user?.name || "User"
                                            }&background=random`,
                                    }}
                                    style={styles.accountButtonImage}
                                />
                                <View style={styles.accountInfo}>
                                    <Text
                                        style={styles.accountName}
                                        numberOfLines={1}
                                    >
                                        {user?.name || "User"}
                                    </Text>
                                    <Text
                                        style={styles.accountUsername}
                                        numberOfLines={1}
                                    >
                                        @{user?.username || "username"}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="ellipsis-horizontal"
                                    size={16}
                                    color="#71767B"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* Mobile Header - Only on mobile */}
                    {!IS_TABLET && (
                        <View style={styles.mobileHeader}>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("Profile", {
                                        userId: user?.id,
                                    })
                                }
                            >
                                <Image
                                    source={{
                                        uri:
                                            user?.profileImageUrl ||
                                            `https://ui-avatars.com/api/?name=${
                                                user?.name || "User"
                                            }&background=random`,
                                    }}
                                    style={styles.mobileHeaderProfileImage}
                                />
                            </TouchableOpacity>
                            <Text style={styles.logoText}>𝕏</Text>
                        </View>
                    )}

                    {/* Main Header */}
                    <View style={styles.header}>
                        {IS_TABLET ? (
                            <Text style={styles.headerTitle}>Home</Text>
                        ) : (
                            <View style={styles.tabsContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        activeTab === "for-you" &&
                                            styles.activeTab,
                                    ]}
                                    onPress={() => setActiveTab("for-you")}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab === "for-you" &&
                                                styles.activeTabText,
                                        ]}
                                    >
                                        For you
                                    </Text>
                                    {activeTab === "for-you" && (
                                        <View
                                            style={styles.activeTabIndicator}
                                        />
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.tab,
                                        activeTab === "following" &&
                                            styles.activeTab,
                                    ]}
                                    onPress={() => setActiveTab("following")}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab === "following" &&
                                                styles.activeTabText,
                                        ]}
                                    >
                                        Following
                                    </Text>
                                    {activeTab === "following" && (
                                        <View
                                            style={styles.activeTabIndicator}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Tabs - Only on tablet */}
                    {IS_TABLET && (
                        <View style={styles.tabsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === "for-you" && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab("for-you")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "for-you" &&
                                            styles.activeTabText,
                                    ]}
                                >
                                    For you
                                </Text>
                                {activeTab === "for-you" && (
                                    <View style={styles.activeTabIndicator} />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === "following" &&
                                        styles.activeTab,
                                ]}
                                onPress={() => setActiveTab("following")}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === "following" &&
                                            styles.activeTabText,
                                    ]}
                                >
                                    Following
                                </Text>
                                {activeTab === "following" && (
                                    <View style={styles.activeTabIndicator} />
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Today's News */}
                    <View style={styles.todaysNewsContainer}>
                        <Text style={styles.todaysNewsTitle}>Today's News</Text>

                        <TouchableOpacity style={styles.newsItem}>
                            <View style={styles.newsItemContent}>
                                <Text style={styles.newsItemTime}>
                                    16 hours ago · News · 201K posts
                                </Text>
                                <Text style={styles.newsItemTitle}>
                                    Marine Le Pen Convicted, Banned from 2027
                                    Election
                                </Text>
                            </View>
                            <Image
                                source={{ uri: "https://picsum.photos/60" }}
                                style={styles.newsItemImage}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.newsItem}>
                            <View style={styles.newsItemContent}>
                                <Text style={styles.newsItemTime}>
                                    20 hours ago · Entertainment · 327K posts
                                </Text>
                                <Text style={styles.newsItemTitle}>
                                    Kim Soohyun's Press Conference: Admission
                                    and Lawsuit
                                </Text>
                            </View>
                            <Image
                                source={{
                                    uri: "https://picsum.photos/60?random=1",
                                }}
                                style={styles.newsItemImage}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.newsItem}>
                            <View style={styles.newsItemContent}>
                                <Text style={styles.newsItemTime}>
                                    18 hours ago · Entertainment · 1.7K posts
                                </Text>
                                <Text style={styles.newsItemTitle}>
                                    Verdansk Returns: Call of Duty Warzone
                                    Community Reacts
                                </Text>
                            </View>
                            <Image
                                source={{
                                    uri: "https://picsum.photos/60?random=2",
                                }}
                                style={styles.newsItemImage}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Tweets List */}
                    <FlatList
                        data={tweets}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <Tweet
                                tweet={item}
                                onPress={() => handleTweetPress(item._id)}
                            />
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#1D9BF0"
                            />
                        }
                        ListHeaderComponent={<View style={styles.listHeader} />}
                        ListFooterComponent={<View style={styles.listFooter} />}
                        ListEmptyComponent={
                            !isLoading ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
                                        No tweets yet. Follow some users to see
                                        their tweets here!
                                    </Text>
                                </View>
                            ) : null
                        }
                    />

                    {/* Loading Indicator */}
                    {isLoading && !refreshing && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1D9BF0" />
                        </View>
                    )}

                    {/* Error Message */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={loadTweets}
                            >
                                <Text style={styles.retryButtonText}>
                                    Retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* New Tweet Button - Mobile only */}
                    {!IS_TABLET && (
                        <TouchableOpacity
                            style={styles.floatingTweetButton}
                            onPress={handleNewTweet}
                        >
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Right Sidebar - Only on tablets */}
                {IS_TABLET && (
                    <View style={styles.rightSidebar}>
                        {/* Search Bar */}
                        <TouchableOpacity
                            style={styles.searchContainer}
                            onPress={navigateToSearch}
                        >
                            <Ionicons
                                name="search"
                                size={16}
                                color="#71767B"
                                style={styles.searchIcon}
                            />
                            <Text style={styles.searchPlaceholder}>Search</Text>
                        </TouchableOpacity>

                        {/* What's happening section */}
                        <View style={styles.whatsHappeningContainer}>
                            <Text style={styles.whatsHappeningTitle}>
                                What's happening
                            </Text>
                            {trendingTopics.map((topic) => (
                                <View key={topic.id}>
                                    {renderTrendingItem(topic)}
                                </View>
                            ))}
                            <TouchableOpacity style={styles.showMoreButton}>
                                <Text style={styles.showMoreText}>
                                    Show more
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Who to follow section */}
                        <View style={styles.whoToFollowContainer}>
                            <Text style={styles.whoToFollowTitle}>
                                Who to follow
                            </Text>
                            {recommendedUsers.map((user) => (
                                <View key={user.id}>
                                    {renderUserToFollow(user)}
                                </View>
                            ))}
                            <TouchableOpacity style={styles.showMoreButton}>
                                <Text style={styles.showMoreText}>
                                    Show more
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View style={styles.footerLinks}>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}>
                                        Terms of Service
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}>
                                        Privacy Policy
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}>
                                        Cookie Policy
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.footerLinks}>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}>
                                        Accessibility
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}>
                                        Ads info
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}>
                                        More ···
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.footerCopyright}>
                                © 2023 X Corp.
                            </Text>
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
        backgroundColor: "#000",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#000",
    },
    leftSidebar: {
        width: IS_TABLET ? 275 : 60,
        borderRightWidth: 1,
        borderRightColor: "#2F3336",
        padding: 16,
        alignItems: IS_TABLET ? "flex-start" : "center",
    },
    logo: {
        marginVertical: 12,
        padding: 8,
    },
    logoText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
    },
    sidebarItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 30,
        marginBottom: 8,
        width: IS_TABLET ? "100%" : 50,
    },
    sidebarItemActive: {
        backgroundColor: "rgba(239, 243, 244, 0.1)",
    },
    sidebarText: {
        marginLeft: 16,
        fontSize: 20,
        fontWeight: "400",
        color: "#E7E9EA",
    },
    sidebarTextActive: {
        fontWeight: "700",
    },
    tweetButton: {
        backgroundColor: "#1D9BF0",
        borderRadius: 30,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        width: IS_TABLET ? "100%" : 50,
        height: IS_TABLET ? 52 : 50,
    },
    tweetButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 17,
    },
    accountButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: "auto",
        padding: 12,
        borderRadius: 30,
        marginTop: 20,
    },
    accountButtonImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    accountInfo: {
        marginLeft: 12,
        flex: 1,
    },
    accountName: {
        color: "#E7E9EA",
        fontWeight: "bold",
    },
    accountUsername: {
        color: "#71767B",
    },
    mainContent: {
        flex: 1,
        borderRightWidth: IS_TABLET ? 1 : 0,
        borderRightColor: "#2F3336",
    },
    mobileHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#2F3336",
    },
    mobileHeaderProfileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: IS_TABLET ? 1 : 0,
        borderBottomColor: "#2F3336",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#E7E9EA",
    },
    tabsContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#2F3336",
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
        color: "#71767B",
        fontSize: 15,
    },
    activeTabText: {
        color: "#E7E9EA",
        fontWeight: "bold",
    },
    activeTabIndicator: {
        position: "absolute",
        bottom: 0,
        width: 56,
        height: 4,
        backgroundColor: "#1D9BF0",
        borderRadius: 2,
    },
    todaysNewsContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#2F3336",
    },
    todaysNewsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#E7E9EA",
        marginHorizontal: 16,
        marginBottom: 12,
    },
    newsItem: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#2F3336",
    },
    newsItemContent: {
        flex: 1,
        marginRight: 12,
    },
    newsItemTime: {
        color: "#71767B",
        fontSize: 13,
        marginBottom: 4,
    },
    newsItemTitle: {
        color: "#E7E9EA",
        fontSize: 16,
        fontWeight: "bold",
    },
    newsItemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    listHeader: {
        height: 8,
    },
    listFooter: {
        height: 80,
    },
    emptyContainer: {
        padding: 24,
        alignItems: "center",
    },
    emptyText: {
        color: "#71767B",
        textAlign: "center",
        fontSize: 16,
    },
    loadingContainer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: "#2F3336",
    },
    errorContainer: {
        padding: 16,
        alignItems: "center",
    },
    errorText: {
        color: "#F4212E",
        textAlign: "center",
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: "#1D9BF0",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    retryButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    floatingTweetButton: {
        position: "absolute",
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#1D9BF0",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    rightSidebar: {
        width: 350,
        padding: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#202327",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchPlaceholder: {
        color: "#71767B",
        fontSize: 15,
    },
    searchInput: {
        flex: 1,
        color: "#E7E9EA",
        fontSize: 15,
    },
    whatsHappeningContainer: {
        backgroundColor: "#202327",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
    },
    whatsHappeningTitle: {
        color: "#E7E9EA",
        fontSize: 20,
        fontWeight: "bold",
        padding: 16,
    },
    trendingItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2F3336",
    },
    trendingCategory: {
        color: "#71767B",
        fontSize: 13,
    },
    trendingTopic: {
        color: "#E7E9EA",
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 4,
    },
    trendingCount: {
        color: "#71767B",
        fontSize: 13,
    },
    whoToFollowContainer: {
        backgroundColor: "#202327",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
    },
    whoToFollowTitle: {
        color: "#E7E9EA",
        fontSize: 20,
        fontWeight: "bold",
        padding: 16,
    },
    userToFollowItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2F3336",
    },
    userToFollowLeft: {
        flexDirection: "row",
        flex: 1,
    },
    userToFollowImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    userToFollowInfo: {
        flex: 1,
    },
    userToFollowNameRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    userToFollowName: {
        color: "#E7E9EA",
        fontSize: 15,
        fontWeight: "bold",
        marginRight: 4,
    },
    verifiedIcon: {
        marginRight: 4,
    },
    userToFollowUsername: {
        color: "#71767B",
        fontSize: 15,
    },
    followButton: {
        backgroundColor: "#E7E9EA",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    followButtonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 14,
    },
    showMoreButton: {
        padding: 16,
    },
    showMoreText: {
        color: "#1D9BF0",
        fontSize: 15,
    },
    footer: {
        marginBottom: 16,
    },
    footerLinks: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8,
    },
    footerLink: {
        color: "#71767B",
        fontSize: 13,
        marginRight: 12,
        marginBottom: 4,
    },
    footerCopyright: {
        color: "#71767B",
        fontSize: 13,
    },
});

export default HomeScreen;
