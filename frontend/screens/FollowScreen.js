import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

// Components
import UserItem from "../components/UserItem";

// Store
import { useUserStore } from "../store/userStore";

const FollowScreen = ({ route }) => {
    const navigation = useNavigation();
    const { userId, type = "followers" } = route.params || {};
    const {
        getUserFollowers,
        getUserFollowing,
        profileUser,
        followUser,
        isLoading,
    } = useUserStore();

    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadUsers = async () => {
        setError(null);
        try {
            let result;
            if (type === "followers") {
                result = await getUserFollowers(userId);
            } else {
                result = await getUserFollowing(userId);
            }

            if (result && result.success) {
                setUsers(result.data || []);
            } else {
                setError("Failed to load users");
            }
        } catch (err) {
            setError("An error occurred while loading users");
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (userId) {
                loadUsers();
            }
        }, [userId, type])
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadUsers();
        setRefreshing(false);
    };

    const handleFollow = async (targetUserId) => {
        await followUser(targetUserId);
    };

    const handleUserPress = (user) => {
        navigation.navigate("UserProfile", {
            userId: user._id,
            username: user.username,
        });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    // Render each user item
    const renderUserItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.userItemContainer}
                onPress={() => handleUserPress(item)}
                activeOpacity={0.7}
            >
                <Image
                    source={{
                        uri:
                            item.profileImageUrl ||
                            `https://ui-avatars.com/api/?name=${item.name}&background=random`,
                    }}
                    style={styles.avatar}
                />

                <View style={styles.userInfo}>
                    <Text style={styles.name} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.username} numberOfLines={1}>
                        @{item.username}
                    </Text>
                    {item.bio && (
                        <Text style={styles.bio} numberOfLines={2}>
                            {item.bio}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.followButton,
                        item.isFollowing && styles.followingButton,
                    ]}
                    onPress={() => handleFollow(item._id)}
                >
                    <Text
                        style={[
                            styles.followButtonText,
                            item.isFollowing && styles.followingButtonText,
                        ]}
                    >
                        {item.isFollowing ? "Following" : "Follow"}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.headerTitles}>
                        <Text style={styles.headerTitle}>
                            {profileUser ? profileUser.name : "User"}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            {type === "followers" ? "Followers" : "Following"}
                        </Text>
                    </View>
                </View>

                {/* Followers/Following tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            type === "followers" && styles.activeTab,
                        ]}
                        onPress={() =>
                            navigation.setParams({
                                type: "followers",
                            })
                        }
                    >
                        <Text
                            style={[
                                styles.tabText,
                                type === "followers" && styles.activeTabText,
                            ]}
                        >
                            Followers
                        </Text>
                        {type === "followers" && (
                            <View style={styles.activeTabIndicator} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            type === "following" && styles.activeTab,
                        ]}
                        onPress={() =>
                            navigation.setParams({
                                type: "following",
                            })
                        }
                    >
                        <Text
                            style={[
                                styles.tabText,
                                type === "following" && styles.activeTabText,
                            ]}
                        >
                            Following
                        </Text>
                        {type === "following" && (
                            <View style={styles.activeTabIndicator} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {isLoading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1DA1F2" />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={loadUsers}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={users}
                        renderItem={renderUserItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContainer}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons
                                    name="people-outline"
                                    size={40}
                                    color="#657786"
                                />
                                <Text style={styles.emptyText}>
                                    {type === "followers"
                                        ? "No followers yet"
                                        : "Not following anyone yet"}
                                </Text>
                            </View>
                        }
                    />
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
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    backButton: {
        marginRight: 24,
    },
    headerTitles: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    headerSubtitle: {
        fontSize: 14,
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
    listContainer: {
        flexGrow: 1,
    },
    userItemContainer: {
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
        alignItems: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    username: {
        fontSize: 14,
        color: "#657786",
        marginTop: 2,
    },
    bio: {
        fontSize: 14,
        marginTop: 4,
        color: "#14171A",
        lineHeight: 18,
    },
    followButton: {
        backgroundColor: "#000",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginLeft: 12,
    },
    followingButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E1E8ED",
    },
    followButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    followingButtonText: {
        color: "#000",
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
        marginBottom: 12,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#1DA1F2",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    retryButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyText: {
        color: "#657786",
        fontSize: 16,
        textAlign: "center",
        marginTop: 12,
    },
});

export default FollowScreen;
