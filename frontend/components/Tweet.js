import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";

// Store
import { useTweetStore } from "../store/tweetStore";
import { useAuthStore } from "../store/authStore";

const Tweet = ({ tweet, onPress }) => {
    const navigation = useNavigation();
    const { likeTweet, retweetTweet, deleteTweet } = useTweetStore();
    const { user } = useAuthStore();

    // Check if the tweet is a retweet
    const isRetweet =
        tweet.retweetData && Object.keys(tweet.retweetData).length > 0;
    const mainTweet = isRetweet ? tweet.retweetData : tweet;

    // Check if tweet is liked by current user
    const isLiked = mainTweet?.likes?.some((id) => id === user?.id);

    // Check if tweet is retweeted by current user
    const isRetweeted = mainTweet?.retweetedBy?.some((id) => id === user?.id);

    // Check if tweet is owned by current user
    const isOwner = mainTweet?.user?._id === user?.id;

    // Format date
    const formattedDate = mainTweet?.createdAt
        ? format(new Date(mainTweet.createdAt), "MMM d, yyyy · h:mm a")
        : "";

    const handleLike = async () => {
        await likeTweet(mainTweet._id);
    };

    const handleRetweet = async () => {
        await retweetTweet(mainTweet._id);
    };

    const handleProfilePress = () => {
        navigation.navigate("UserProfile", {
            userId: mainTweet.user._id,
            username: mainTweet.user.username,
        });
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Tweet",
            "Are you sure you want to delete this tweet?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteTweet(mainTweet._id);
                    },
                },
            ]
        );
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress && onPress(mainTweet)}
            activeOpacity={0.8}
        >
            {isRetweet && (
                <View style={styles.retweetLabel}>
                    <Ionicons name="repeat" size={14} color="#657786" />
                    <Text style={styles.retweetText}>
                        {tweet.user.name} Retweeted
                    </Text>
                </View>
            )}

            <View style={styles.tweetContent}>
                <TouchableOpacity onPress={handleProfilePress}>
                    <Image
                        source={{
                            uri: `https://ui-avatars.com/api/?name=${mainTweet.user.name}&background=random`,
                        }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>

                <View style={styles.tweetBody}>
                    <View style={styles.tweetHeader}>
                        <TouchableOpacity onPress={handleProfilePress}>
                            <Text style={styles.name}>
                                {mainTweet.user.name}
                            </Text>
                            <Text style={styles.username}>
                                @{mainTweet.user.username}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.content}>{mainTweet.content}</Text>

                    <Text style={styles.date}>{formattedDate}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleLike}
                        >
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={18}
                                color={isLiked ? "#E0245E" : "#657786"}
                            />
                            {mainTweet.likes?.length > 0 && (
                                <Text
                                    style={[
                                        styles.actionText,
                                        isLiked && styles.likedText,
                                    ]}
                                >
                                    {mainTweet.likes.length}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleRetweet}
                        >
                            <Ionicons
                                name={"repeat"}
                                size={18}
                                color={isRetweeted ? "#17BF63" : "#657786"}
                            />
                            {mainTweet.retweetedBy?.length > 0 && (
                                <Text
                                    style={[
                                        styles.actionText,
                                        isRetweeted && styles.retweetedText,
                                    ]}
                                >
                                    {mainTweet.retweetedBy.length}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {isOwner && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={handleDelete}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color="#657786"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
        backgroundColor: "#fff",
    },
    retweetLabel: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 30,
        marginBottom: 5,
    },
    retweetText: {
        fontSize: 12,
        color: "#657786",
        marginLeft: 5,
    },
    tweetContent: {
        flexDirection: "row",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    tweetBody: {
        flex: 1,
    },
    tweetHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    name: {
        fontWeight: "bold",
        fontSize: 15,
        marginRight: 5,
    },
    username: {
        color: "#657786",
        fontSize: 14,
    },
    content: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 8,
    },
    date: {
        color: "#657786",
        fontSize: 14,
        marginBottom: 8,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 8,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 24,
    },
    actionText: {
        fontSize: 12,
        marginLeft: 4,
        color: "#657786",
    },
    likedText: {
        color: "#E0245E",
    },
    retweetedText: {
        color: "#17BF63",
    },
});

export default Tweet;
