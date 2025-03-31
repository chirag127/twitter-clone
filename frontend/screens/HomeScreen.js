import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import Tweet from "../components/Tweet";

// Store
import { useTweetStore } from "../store/tweetStore";

const HomeScreen = ({ navigation }) => {
    const { tweets, getFeedTweets, isLoading, error } = useTweetStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadTweets();
    }, []);

    const loadTweets = async () => {
        await getFeedTweets();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadTweets();
        setRefreshing(false);
    };

    const handleTweetPress = (tweet) => {
        navigation.navigate("Tweet", { tweetId: tweet._id });
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1DA1F2" />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={tweets}
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
                            <Text style={styles.emptyText}>
                                No tweets yet. Follow users to see their tweets.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F8FA",
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
    emptyContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        height: 200,
    },
    emptyText: {
        color: "#657786",
        fontSize: 16,
        textAlign: "center",
    },
});

export default HomeScreen;
