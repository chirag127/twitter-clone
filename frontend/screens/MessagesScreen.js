import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

// Store
import { useAuthStore } from "../store/authStore";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IS_TABLET = SCREEN_WIDTH >= 768;

const MessagesScreen = ({ navigation }) => {
    const { user } = useAuthStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);

    useFocusEffect(
        useCallback(() => {
            loadConversations();
        }, [])
    );

    const loadConversations = async () => {
        setLoading(true);
        setError(null);

        try {
            // In a real app, fetch conversations from API
            // For now, use mock data
            setTimeout(() => {
                const mockConversations = [
                    {
                        id: 1,
                        user: {
                            id: 101,
                            name: "Peter Lowe",
                            username: "pgl",
                            profile_image_url:
                                "https://ui-avatars.com/api/?name=Peter+Lowe&background=random",
                            verified: false,
                        },
                        last_message: {
                            text: "Thanks! I'm glad you find it useful. :)",
                            timestamp: "Mar 28, 2024",
                        },
                    },
                    {
                        id: 2,
                        user: {
                            id: 102,
                            name: "88siteEnergy",
                            username: "88siteE",
                            profile_image_url:
                                "https://ui-avatars.com/api/?name=88site&background=random",
                            verified: false,
                        },
                        last_message: {
                            text: "I am not able to track how I'm doing.",
                            timestamp: "Mar 23, 2024",
                        },
                    },
                    {
                        id: 3,
                        user: {
                            id: 103,
                            name: "Kotak Mahindra Bank",
                            username: "KotakBank",
                            profile_image_url:
                                "https://ui-avatars.com/api/?name=Kotak&background=random",
                            verified: true,
                        },
                        last_message: {
                            text: "You shared a post",
                            timestamp: "Mar 18, 2024",
                        },
                    },
                    {
                        id: 4,
                        user: {
                            id: 104,
                            name: "Fanboy.nz",
                            username: "fanboynz",
                            profile_image_url:
                                "https://ui-avatars.com/api/?name=Fanboy&background=random",
                            verified: false,
                        },
                        last_message: {
                            text: "How is your cat?",
                            timestamp: "Mar 16, 2024",
                        },
                    },
                    {
                        id: 5,
                        user: {
                            id: 105,
                            name: "Swiggy Food",
                            username: "Swiggy",
                            profile_image_url:
                                "https://ui-avatars.com/api/?name=Swiggy&background=random",
                            verified: true,
                        },
                        last_message: {
                            text: "You reacted with ❤️: Hey Chirag! ^Aiswarya",
                            timestamp: "Mar 14, 2024",
                        },
                    },
                    {
                        id: 6,
                        user: {
                            id: 106,
                            name: "Flipkart",
                            username: "Flipkart",
                            profile_image_url:
                                "https://ui-avatars.com/api/?name=Flipkart&background=random",
                            verified: true,
                        },
                        last_message: {
                            text: "Hi",
                            timestamp: "Mar 14, 2024",
                        },
                    },
                    {
                        id: 7,
                        user: {
                            id: 107,
                            name: "Andrey Meshkov",
                            username: "ay_meshkov",
                            profile_image_url:
                                "https://ui-avatars.com/api/?name=Andrey&background=random",
                            verified: true,
                        },
                        last_message: {
                            text: "Big fan of adguard",
                            timestamp: "Mar 13, 2024",
                        },
                    },
                    {
                        id: 8,
                        user: {
                            id: 108,
                            name: "Matt Hurd",
                            username: "MattHurd",
                            profile_image_url:
                                "https://ui-avatars.com/api/?name=Matt&background=random",
                            verified: false,
                        },
                        last_message: {
                            text: "Sent a link",
                            timestamp: "Mar 13, 2024",
                        },
                    },
                ];

                setConversations(mockConversations);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to load conversations:", error);
            setError("Failed to load conversations. Please try again.");
            setLoading(false);
        }
    };

    const handleConversationPress = (conversation) => {
        setSelectedConversation(conversation);
        if (!IS_TABLET) {
            navigation.navigate("Conversation", {
                conversationId: conversation.id,
            });
        }
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

    // Render conversation item
    const renderConversationItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.conversationItem,
                selectedConversation?.id === item.id &&
                    styles.selectedConversation,
            ]}
            onPress={() => handleConversationPress(item)}
        >
            <Image
                source={{ uri: item.user.profile_image_url }}
                style={styles.conversationAvatar}
            />
            <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                    <View style={styles.conversationNameContainer}>
                        <Text style={styles.conversationName}>
                            {item.user.name}
                        </Text>
                        {item.user.verified && (
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color="#1D9BF0"
                                style={styles.verifiedIcon}
                            />
                        )}
                        <Text style={styles.conversationUsername}>
                            @{item.user.username}
                        </Text>
                    </View>
                    <Text style={styles.conversationTime}>
                        {item.last_message.timestamp}
                    </Text>
                </View>
                <Text style={styles.conversationText} numberOfLines={1}>
                    {item.last_message.text}
                </Text>
            </View>
        </TouchableOpacity>
    );

    // Render empty message placeholder for tablet view
    const renderEmptyConversation = () => (
        <View style={styles.emptyConversationContainer}>
            <Text style={styles.emptyConversationTitle}>Select a message</Text>
            <Text style={styles.emptyConversationText}>
                Choose from your existing conversations, start a new one, or
                just keep swimming.
            </Text>
            <TouchableOpacity
                style={styles.newMessageButton}
                onPress={() => {}}
            >
                <Text style={styles.newMessageButtonText}>New message</Text>
            </TouchableOpacity>
        </View>
    );

    // Render tablet-specific conversation view
    const renderConversationView = () => (
        <View style={styles.conversationContainer}>
            {selectedConversation ? (
                <>
                    <View style={styles.conversationViewHeader}>
                        <View style={styles.conversationViewUserInfo}>
                            <Image
                                source={{
                                    uri: selectedConversation.user
                                        .profile_image_url,
                                }}
                                style={styles.conversationViewAvatar}
                            />
                            <View>
                                <View style={styles.conversationViewNameRow}>
                                    <Text style={styles.conversationViewName}>
                                        {selectedConversation.user.name}
                                    </Text>
                                    {selectedConversation.user.verified && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={16}
                                            color="#1D9BF0"
                                            style={styles.verifiedIcon}
                                        />
                                    )}
                                </View>
                                <Text style={styles.conversationViewUsername}>
                                    @{selectedConversation.user.username}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.conversationViewInfoButton}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={22}
                                color="#1D9BF0"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.messagesContainer}>
                        <View style={styles.emptyMessagesContainer}>
                            <Text style={styles.emptyMessagesTitle}>
                                Start a new conversation
                            </Text>
                            <Text style={styles.emptyMessagesText}>
                                Drop a line, share Posts and more with private
                                conversations between you and others on X.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.messageInputContainer}>
                        <View style={styles.messageInputWrapper}>
                            <TextInput
                                style={styles.messageInput}
                                placeholder="Start a new message"
                                placeholderTextColor="#71767B"
                                multiline
                            />
                            <View style={styles.messageInputActions}>
                                <TouchableOpacity
                                    style={styles.messageInputAction}
                                >
                                    <Ionicons
                                        name="image-outline"
                                        size={20}
                                        color="#1D9BF0"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.messageInputAction}
                                >
                                    <Ionicons
                                        name="gift-outline"
                                        size={20}
                                        color="#1D9BF0"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </>
            ) : (
                renderEmptyConversation()
            )}
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
                            icon: "mail",
                            text: "Messages",
                            active: true,
                            onPress: () => console.log("Already on Messages"),
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
                            onPress={() => navigation.navigate("NewTweet")}
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

                {/* Messages List */}
                <View style={styles.messagesListContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        {!IS_TABLET && (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("Profile", {
                                        userId: user?.id,
                                    })
                                }
                                style={styles.headerProfileButton}
                            >
                                <Image
                                    source={{
                                        uri:
                                            user?.profileImageUrl ||
                                            `https://ui-avatars.com/api/?name=${
                                                user?.name || "User"
                                            }&background=random`,
                                    }}
                                    style={styles.headerProfileImage}
                                />
                            </TouchableOpacity>
                        )}
                        <Text style={styles.headerTitle}>Messages</Text>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerAction}>
                                <Ionicons
                                    name="settings-outline"
                                    size={20}
                                    color="#E7E9EA"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerAction}>
                                <Ionicons
                                    name="create-outline"
                                    size={20}
                                    color="#E7E9EA"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search Input */}
                    <View style={styles.searchContainer}>
                        <Ionicons
                            name="search"
                            size={16}
                            color="#71767B"
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Direct Messages"
                            placeholderTextColor="#71767B"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Conversations List */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1D9BF0" />
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={loadConversations}
                            >
                                <Text style={styles.retryButtonText}>
                                    Retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={conversations}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderConversationItem}
                            style={styles.conversationsList}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyTitle}>
                                        Welcome to your inbox!
                                    </Text>
                                    <Text style={styles.emptyText}>
                                        Drop a line, share posts and more with
                                        private conversations between you and
                                        others on X.
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.newConversationButton}
                                    >
                                        <Text
                                            style={
                                                styles.newConversationButtonText
                                            }
                                        >
                                            Write a message
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                    )}

                    {/* New Message Button - Mobile only */}
                    {!IS_TABLET && (
                        <TouchableOpacity
                            style={styles.floatingNewMessageButton}
                            onPress={() => {}}
                        >
                            <Ionicons name="create" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Conversation View - Only on tablets */}
                {IS_TABLET && renderConversationView()}
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
    messagesListContainer: {
        flex: IS_TABLET ? 0.4 : 1,
        borderRightWidth: IS_TABLET ? 1 : 0,
        borderRightColor: "#2F3336",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#2F3336",
    },
    headerProfileButton: {
        marginRight: 16,
    },
    headerProfileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        color: "#E7E9EA",
    },
    headerActions: {
        flexDirection: "row",
    },
    headerAction: {
        marginLeft: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#202327",
        margin: 16,
        borderRadius: 20,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: "#E7E9EA",
        height: 40,
        fontSize: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
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
    conversationsList: {
        flex: 1,
    },
    conversationItem: {
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2F3336",
    },
    selectedConversation: {
        backgroundColor: "#16181C",
    },
    conversationAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    conversationNameContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    conversationName: {
        color: "#E7E9EA",
        fontWeight: "bold",
        marginRight: 4,
    },
    verifiedIcon: {
        marginRight: 4,
    },
    conversationUsername: {
        color: "#71767B",
        marginLeft: 4,
    },
    conversationTime: {
        color: "#71767B",
        fontSize: 13,
    },
    conversationText: {
        color: "#71767B",
    },
    emptyContainer: {
        flex: 1,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyTitle: {
        color: "#E7E9EA",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    emptyText: {
        color: "#71767B",
        textAlign: "center",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
    },
    newConversationButton: {
        backgroundColor: "#1D9BF0",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    newConversationButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    floatingNewMessageButton: {
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
    conversationContainer: {
        flex: 0.6,
        backgroundColor: "#000",
    },
    emptyConversationContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    emptyConversationTitle: {
        color: "#E7E9EA",
        fontSize: 31,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    emptyConversationText: {
        color: "#71767B",
        textAlign: "center",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
    },
    newMessageButton: {
        backgroundColor: "#1D9BF0",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    newMessageButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    conversationViewHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2F3336",
    },
    conversationViewUserInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    conversationViewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    conversationViewNameRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    conversationViewName: {
        color: "#E7E9EA",
        fontWeight: "bold",
        fontSize: 16,
        marginRight: 4,
    },
    conversationViewUsername: {
        color: "#71767B",
        fontSize: 14,
    },
    conversationViewInfoButton: {
        padding: 8,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: "#000",
    },
    emptyMessagesContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    emptyMessagesTitle: {
        color: "#E7E9EA",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    emptyMessagesText: {
        color: "#71767B",
        textAlign: "center",
        fontSize: 15,
        lineHeight: 22,
    },
    messageInputContainer: {
        borderTopWidth: 1,
        borderTopColor: "#2F3336",
        padding: 16,
    },
    messageInputWrapper: {
        backgroundColor: "#202327",
        borderRadius: 20,
        padding: 12,
    },
    messageInput: {
        color: "#E7E9EA",
        fontSize: 16,
        minHeight: 40,
        maxHeight: 100,
    },
    messageInputActions: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 8,
    },
    messageInputAction: {
        marginRight: 16,
    },
});

export default MessagesScreen;
