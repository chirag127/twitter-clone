import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Components
import Input from "../components/Input";
import Button from "../components/Button";

// Store
import { useTweetStore } from "../store/tweetStore";
import { useAuthStore } from "../store/authStore";

const MAX_TWEET_LENGTH = 280;

const NewTweetScreen = () => {
    const navigation = useNavigation();
    const { createTweet, isLoading } = useTweetStore();
    const { user } = useAuthStore();

    const [tweetContent, setTweetContent] = useState("");
    const [error, setError] = useState("");

    const charCount = tweetContent.length;
    const isOverLimit = charCount > MAX_TWEET_LENGTH;
    const isButtonDisabled = !tweetContent.trim() || isOverLimit || isLoading;

    const handleTweet = async () => {
        if (isButtonDisabled) return;

        setError("");
        const result = await createTweet(tweetContent);

        if (result.success) {
            setTweetContent("");
            navigation.navigate("Home");
        } else {
            setError("Failed to post tweet. Please try again.");
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={styles.cancelButton}
                    >
                        <Ionicons name="close" size={24} color="#1DA1F2" />
                    </TouchableOpacity>

                    <Button
                        title="Tweet"
                        onPress={handleTweet}
                        disabled={isButtonDisabled}
                        loading={isLoading}
                        style={styles.tweetButton}
                    />
                </View>

                <View style={styles.content}>
                    <Image
                        source={{
                            uri: `https://ui-avatars.com/api/?name=${user?.name}&background=random`,
                        }}
                        style={styles.avatar}
                    />

                    <View style={styles.inputContainer}>
                        <Input
                            placeholder="What's happening?"
                            value={tweetContent}
                            onChangeText={(text) => {
                                setTweetContent(text);
                                setError("");
                            }}
                            multiline
                            numberOfLines={5}
                            maxLength={MAX_TWEET_LENGTH + 20} // Allow typing a bit over to show error
                            style={styles.tweetInput}
                            error={error}
                        />

                        <View style={styles.charCountContainer}>
                            {isOverLimit ? (
                                <Text style={styles.charCountOverLimit}>
                                    {MAX_TWEET_LENGTH - charCount}
                                </Text>
                            ) : (
                                <Text style={styles.charCount}>
                                    {MAX_TWEET_LENGTH - charCount}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    cancelButton: {
        padding: 4,
    },
    tweetButton: {
        minWidth: 80,
        paddingHorizontal: 16,
    },
    content: {
        flexDirection: "row",
        padding: 16,
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    inputContainer: {
        flex: 1,
    },
    tweetInput: {
        borderWidth: 0,
        padding: 0,
        fontSize: 18,
        marginBottom: 8,
    },
    charCountContainer: {
        alignItems: "flex-end",
        padding: 8,
    },
    charCount: {
        color: "#657786",
    },
    charCountOverLimit: {
        color: "#E0245E",
    },
});

export default NewTweetScreen;
