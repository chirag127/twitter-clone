import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Components
import Tweet from "../components/Tweet";
import UserItem from "../components/UserItem";

// Store
import { useTweetStore } from "../store/tweetStore";
import { useUserStore } from "../store/userStore";

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("tweets"); // 'tweets' or 'users'
    const [isSearching, setIsSearching] = useState(false);

    const { tweets, searchTweets, isLoading: tweetsLoading } = useTweetStore();
    const { users, getUsers, isLoading: usersLoading } = useUserStore();

    useEffect(() => {
        // Perform search when query changes, but add a slight delay
        const delaySearch = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch();
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery, searchType]);

    const performSearch = async () => {
        setIsSearching(true);
        if (searchType === "tweets") {
            await searchTweets(searchQuery);
        } else {
            await getUsers(searchQuery);
        }
        setIsSearching(false);
    };

    const handleTweetPress = (tweet) => {
        navigation.navigate("SearchTweet", { tweetId: tweet._id });
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const isLoading = tweetsLoading || usersLoading || isSearching;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
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
                        placeholder={`Search ${
                            searchType === "tweets" ? "tweets" : "people"
                        }`}
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

                <View style={styles.segmentedControl}>
                    <TouchableOpacity
                        style={[
                            styles.segmentButton,
                            searchType === "tweets" && styles.activeSegment,
                        ]}
                        onPress={() => setSearchType("tweets")}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                searchType === "tweets" &&
                                    styles.activeSegmentText,
                            ]}
                        >
                            Tweets
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.segmentButton,
                            searchType === "users" && styles.activeSegment,
                        ]}
                        onPress={() => setSearchType("users")}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                searchType === "users" &&
                                    styles.activeSegmentText,
                            ]}
                        >
                            People
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1DA1F2" />
                </View>
            ) : searchQuery.trim() ? (
                <View style={styles.resultsContainer}>
                    {searchType === "tweets" ? (
                        <FlatList
                            data={tweets}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Tweet
                                    tweet={item}
                                    onPress={handleTweetPress}
                                />
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
                                        No tweets found
                                    </Text>
                                </View>
                            }
                        />
                    ) : (
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => <UserItem user={item} />}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
                                        No users found
                                    </Text>
                                </View>
                            }
                        />
                    )}
                </View>
            ) : (
                <View style={styles.emptySearchContainer}>
                    <Ionicons name="search" size={50} color="#AAB8C2" />
                    <Text style={styles.emptySearchText}>
                        Search for tweets or people
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    searchContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E1E8ED",
        borderRadius: 20,
        paddingHorizontal: 12,
        marginBottom: 16,
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
    segmentedControl: {
        flexDirection: "row",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#1DA1F2",
        overflow: "hidden",
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
    },
    activeSegment: {
        backgroundColor: "#1DA1F2",
    },
    segmentText: {
        color: "#1DA1F2",
        fontWeight: "bold",
    },
    activeSegmentText: {
        color: "#FFFFFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    resultsContainer: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        marginTop: 40,
    },
    emptyText: {
        color: "#657786",
        fontSize: 16,
        textAlign: "center",
    },
    emptySearchContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptySearchText: {
        color: "#657786",
        fontSize: 18,
        textAlign: "center",
        marginTop: 16,
    },
});

export default SearchScreen;
