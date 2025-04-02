import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Keyboard,
    Image,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

// Components
import Tweet from "../components/Tweet";
import UserItem from "../components/UserItem";

// Store
import { useTweetStore } from "../store/tweetStore";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IS_TABLET = SCREEN_WIDTH >= 768;

const SearchScreen = ({ route }) => {
    const navigation = useNavigation();
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState(route?.params?.query || "");
    const [searchType, setSearchType] = useState("top"); // 'top', 'latest', 'people', 'photos', 'videos'
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [trendingTopics, setTrendingTopics] = useState([
        {
            id: 1,
            category: "Trending in Technology",
            topic: "ChatGPT",
            tweets: "125K",
        },
        {
            id: 2,
            category: "Trending in Sports",
            topic: "NBA Finals",
            tweets: "98K",
        },
        {
            id: 3,
            category: "Entertainment",
            topic: "New Movie Releases",
            tweets: "75K",
        },
        {
            id: 4,
            category: "Politics",
            topic: "Election Updates",
            tweets: "62K",
        },
        {
            id: 5,
            category: "Trending in Science",
            topic: "Mars Rover",
            tweets: "45K",
        },
    ]);
    const [newsStories, setNewsStories] = useState([
        {
            id: 1,
            title: "Tech giants announce new AI features",
            source: "Tech News",
            time: "2h",
            image: "https://picsum.photos/id/1/200/200",
        },
        {
            id: 2,
            title: "Global climate summit begins today",
            source: "World News",
            time: "4h",
            image: "https://picsum.photos/id/28/200/200",
        },
        {
            id: 3,
            title: "New breakthrough in quantum computing",
            source: "Science Daily",
            time: "6h",
            image: "https://picsum.photos/id/96/200/200",
        },
    ]);

    const { tweets, searchTweets, isLoading: tweetsLoading } = useTweetStore();
    const { users, getUsers, isLoading: usersLoading } = useUserStore();

    // Perform search when navigated with query param
    useEffect(() => {
        if (route?.params?.query) {
            setSearchQuery(route.params.query);
            performSearch();
        }
    }, [route?.params?.query]);

    useFocusEffect(
        useCallback(() => {
            // Load latest trends and news when screen is focused
            // In a real app, you would fetch this data from an API
        }, [])
    );

    const performSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setHasSearched(true);

        if (searchType === "people") {
            await getUsers(searchQuery);
        } else {
            await searchTweets(searchQuery);
        }

        setIsSearching(false);
    };

    const handleTweetPress = (tweet) => {
        navigation.navigate("SearchTweet", { tweetId: tweet._id });
    };

    const handleUserPress = (userId) => {
        navigation.navigate("SearchUserProfile", { userId });
    };

    const handleTopicPress = (topic) => {
        setSearchQuery(topic);
        performSearch();
    };

    const clearSearch = () => {
        setSearchQuery("");
        setHasSearched(false);
    };

    const isLoading = tweetsLoading || usersLoading || isSearching;

    // Render sidebar navigation item (same as in HomeScreen)
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

    // Render trending topic
    const renderTrendingTopic = ({ item }) => (
        <TouchableOpacity
            style={styles.trendingItem}
            onPress={() => handleTopicPress(item.topic)}
        >
            <View>
                <Text style={styles.trendingCategory}>{item.category}</Text>
                <Text style={styles.trendingTopic}>{item.topic}</Text>
                <Text style={styles.trendingCount}>{item.tweets} Tweets</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
                <Ionicons
                    name="ellipsis-horizontal"
                    size={16}
                    color="#657786"
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    // Render news story
    const renderNewsStory = ({ item }) => (
        <TouchableOpacity style={styles.newsItem}>
            <View style={styles.newsContent}>
                <Text style={styles.newsSource}>
                    {item.source} · {item.time}
                </Text>
                <Text style={styles.newsTitle}>{item.title}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.newsImage} />
        </TouchableOpacity>
    );

    // Render search results
    const renderSearchResults = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1DA1F2" />
                </View>
            );
        }

        if (!hasSearched) {
            return (
                <ScrollView>
                    {/* Trending Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Trends for you</Text>
                        <FlatList
                            data={trendingTopics}
                            renderItem={renderTrendingTopic}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                        />
                    </View>

                    {/* News Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            What's happening
                        </Text>
                        <FlatList
                            data={newsStories}
                            renderItem={renderNewsStory}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                        />
                    </View>
                </ScrollView>
            );
        }

        if (searchType === "people") {
            return (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <UserItem
                            user={item}
                            onPress={() => handleUserPress(item._id)}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                No users found matching "{searchQuery}"
                            </Text>
                        </View>
                    }
                />
            );
        }

        return (
            <View style={styles.resultsContainer}>
                {/* Search Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                >
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            searchType === "top" && styles.activeFilter,
                        ]}
                        onPress={() => setSearchType("top")}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                searchType === "top" && styles.activeFilterText,
                            ]}
                        >
                            Top
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            searchType === "latest" && styles.activeFilter,
                        ]}
                        onPress={() => setSearchType("latest")}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                searchType === "latest" &&
                                    styles.activeFilterText,
                            ]}
                        >
                            Latest
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            searchType === "people" && styles.activeFilter,
                        ]}
                        onPress={() => {
                            setSearchType("people");
                            performSearch();
                        }}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                searchType === "people" &&
                                    styles.activeFilterText,
                            ]}
                        >
                            People
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            searchType === "photos" && styles.activeFilter,
                        ]}
                        onPress={() => setSearchType("photos")}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                searchType === "photos" &&
                                    styles.activeFilterText,
                            ]}
                        >
                            Photos
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            searchType === "videos" && styles.activeFilter,
                        ]}
                        onPress={() => setSearchType("videos")}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                searchType === "videos" &&
                                    styles.activeFilterText,
                            ]}
                        >
                            Videos
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Tweet Results */}
                <FlatList
                    data={tweets}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Tweet tweet={item} onPress={handleTweetPress} />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                No tweets found matching "{searchQuery}"
                            </Text>
                        </View>
                    }
                />
            </View>
        );
    };

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
                            active: true,
                            onPress: () => {},
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
                            icon: "person-outline",
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

                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => navigation.navigate("Profile")}
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
                    {/* Search Header */}
                    <View style={styles.searchHeader}>
                        <View style={styles.searchBar}>
                            <Ionicons
                                name="search"
                                size={20}
                                color="#657786"
                                style={styles.searchIcon}
                            />
                            <TextInput
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search Twitter"
                                placeholderTextColor="#657786"
                                returnKeyType="search"
                                onSubmitEditing={() => {
                                    Keyboard.dismiss();
                                    performSearch();
                                }}
                                autoCapitalize="none"
                            />
                            {searchQuery ? (
                                <TouchableOpacity
                                    onPress={clearSearch}
                                    style={styles.clearButton}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={20}
                                        color="#657786"
                                    />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>

                    {/* Search Results or Explore Content */}
                    {renderSearchResults()}
                </View>

                {/* Right Sidebar - Only on tablets */}
                {IS_TABLET && hasSearched && (
                    <View style={styles.rightSidebar}>
                        <View style={styles.trendingContainer}>
                            <Text style={styles.sectionTitle}>
                                What's happening
                            </Text>
                            <FlatList
                                data={trendingTopics.slice(0, 3)}
                                renderItem={renderTrendingTopic}
                                keyExtractor={(item) => item.id.toString()}
                                scrollEnabled={false}
                            />
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
    searchHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EFF3F4",
        borderRadius: 20,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: "#14171A",
        fontSize: 16,
    },
    clearButton: {
        padding: 4,
    },
    filtersContainer: {
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 12,
        borderRadius: 20,
    },
    activeFilter: {
        backgroundColor: "rgba(29, 161, 242, 0.1)",
    },
    filterText: {
        fontSize: 14,
        color: "#657786",
    },
    activeFilterText: {
        color: "#1DA1F2",
        fontWeight: "bold",
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    trendingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    trendingCategory: {
        fontSize: 13,
        color: "#657786",
        marginBottom: 2,
    },
    trendingTopic: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 2,
    },
    trendingCount: {
        fontSize: 13,
        color: "#657786",
    },
    moreButton: {
        padding: 4,
    },
    newsItem: {
        flexDirection: "row",
        marginBottom: 20,
    },
    newsContent: {
        flex: 1,
        marginRight: 12,
    },
    newsSource: {
        fontSize: 13,
        color: "#657786",
        marginBottom: 4,
    },
    newsTitle: {
        fontSize: 15,
        fontWeight: "bold",
    },
    newsImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    resultsContainer: {
        flex: 1,
    },
    emptyContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        color: "#657786",
        fontSize: 16,
        textAlign: "center",
    },
    rightSidebar: {
        width: 350,
        padding: 16,
    },
    trendingContainer: {
        backgroundColor: "#F7F9FA",
        borderRadius: 16,
        padding: 16,
    },
    showMoreButton: {
        paddingVertical: 12,
    },
    showMoreText: {
        color: "#1DA1F2",
    },
});

export default SearchScreen;
