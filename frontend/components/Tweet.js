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
import { format, formatDistanceToNow } from "date-fns";
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

    // Format relative time (e.g., "2h", "3d")
    const relativeTime = mainTweet?.createdAt
        ? formatDistanceToNow(new Date(mainTweet.createdAt), {
              addSuffix: false,
          })
        : "";

    // Simplified relative time (e.g., "2h", "3d")
    const shortRelativeTime = relativeTime
        .replace(" seconds", "s")
        .replace(" minutes", "m")
        .replace(" minute", "m")
        .replace(" hours", "h")
        .replace(" hour", "h")
        .replace(" days", "d")
        .replace(" day", "d")
        .replace(" months", "mo")
        .replace(" month", "mo")
        .replace(" years", "y")
        .replace(" year", "y")
        .replace("about ", "")
        .replace("less than ", "<");

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
            activeOpacity={0.9}
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
                            uri:
                                mainTweet.user.profileImageUrl ||
                                `https://ui-avatars.com/api/?name=${mainTweet.user.name}&background=random`,
                        }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>

                <View style={styles.tweetBody}>
                    <View style={styles.tweetHeader}>
                        <View style={styles.userInfo}>
                            <TouchableOpacity onPress={handleProfilePress}>
                                <Text style={styles.name} numberOfLines={1}>
                                    {mainTweet.user.name}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleProfilePress}>
                                <Text style={styles.username} numberOfLines={1}>
                                    @{mainTweet.user.username}
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.dot}>·</Text>
                            <Text style={styles.timeAgo}>
                                {shortRelativeTime}
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.moreButton}>
                            <Ionicons
                                name="ellipsis-horizontal"
                                size={16}
                                color="#657786"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.content}>{mainTweet.content}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionIconContainer}>
                                <Ionicons
                                    name="chatbubble-outline"
                                    size={18}
                                    color="#657786"
                                />
                            </View>
                            <Text style={styles.actionText}>
                                {mainTweet.replies?.length || 0}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleRetweet}
                        >
                            <View
                                style={[
                                    styles.actionIconContainer,
                                    isRetweeted &&
                                        styles.retweetedIconContainer,
                                ]}
                            >
                                <Ionicons
                                    name={"repeat"}
                                    size={18}
                                    color={isRetweeted ? "#17BF63" : "#657786"}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.actionText,
                                    isRetweeted && styles.retweetedText,
                                ]}
                            >
                                {mainTweet.retweetedBy?.length || 0}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleLike}
                        >
                            <View
                                style={[
                                    styles.actionIconContainer,
                                    isLiked && styles.likedIconContainer,
                                ]}
                            >
                                <Ionicons
                                    name={isLiked ? "heart" : "heart-outline"}
                                    size={18}
                                    color={isLiked ? "#E0245E" : "#657786"}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.actionText,
                                    isLiked && styles.likedText,
                                ]}
                            >
                                {mainTweet.likes?.length || 0}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionIconContainer}>
                                <Ionicons
                                    name="share-outline"
                                    size={18}
                                    color="#657786"
                                />
                            </View>
                        </TouchableOpacity>

                        {isOwner && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={handleDelete}
                            >
                                <View style={styles.actionIconContainer}>
                                    <Ionicons
                                        name="trash-outline"
                                        size={18}
                                        color="#657786"
                                    />
                                </View>
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
        padding: 16,
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
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    tweetBody: {
        flex: 1,
    },
    tweetHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        flex: 1,
    },
    name: {
        fontWeight: "bold",
        fontSize: 15,
        marginRight: 4,
    },
    username: {
        color: "#657786",
        fontSize: 14,
    },
    dot: {
        color: "#657786",
        marginHorizontal: 4,
    },
    timeAgo: {
        color: "#657786",
        fontSize: 14,
    },
    moreButton: {
        padding: 4,
    },
    content: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 12,
    },
    date: {
        color: "#657786",
        fontSize: 14,
        marginBottom: 12,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        paddingRight: 48,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionIconContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
    },
    likedIconContainer: {
        backgroundColor: "rgba(224, 36, 94, 0.1)",
    },
    retweetedIconContainer: {
        backgroundColor: "rgba(23, 191, 99, 0.1)",
    },
    actionText: {
        fontSize: 13,
        marginLeft: 2,
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
