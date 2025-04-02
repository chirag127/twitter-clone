import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

// Store
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

// Default header color (Twitter blue)
const DEFAULT_HEADER_COLOR = "#1DA1F2";

const EditProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const { user } = useAuthStore();
    const { updateUserProfile, isLoading } = useUserStore();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [website, setWebsite] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [headerImage, setHeaderImage] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Populate form with user data
        if (user) {
            setName(user.name || "");
            setBio(user.bio || "");
            setLocation(user.location || "");
            setWebsite(user.website || "");
            setProfileImage(user.profileImageUrl || null);
            setHeaderImage(user.headerImageUrl || null);
        }
    }, [user]);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = "Name is required";
        }
        if (bio.length > 160) {
            newErrors.bio = "Bio must be 160 characters or less";
        }
        if (
            website &&
            !website.match(
                /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
            )
        ) {
            newErrors.website = "Please enter a valid website URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            await updateUserProfile({
                name,
                bio,
                location,
                website,
                profileImageUrl: profileImage,
                headerImageUrl: headerImage,
            });

            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update profile. Please try again.");
        }
    };

    const pickProfileImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const pickHeaderImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setHeaderImage(result.assets[0].uri);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            onPress={handleCancel}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#000"
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit profile</Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            !validate() && styles.saveButtonDisabled,
                        ]}
                        onPress={handleSave}
                        disabled={isLoading || !validate()}
                    >
                        <Text
                            style={[
                                styles.saveButtonText,
                                !validate() && styles.saveButtonTextDisabled,
                            ]}
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView}>
                    {/* Header Image */}
                    <View style={styles.headerImageContainer}>
                        {headerImage ? (
                            <Image
                                source={{ uri: headerImage }}
                                style={styles.headerImage}
                            />
                        ) : (
                            <View
                                style={[
                                    styles.headerImage,
                                    { backgroundColor: DEFAULT_HEADER_COLOR },
                                ]}
                            />
                        )}
                        <View style={styles.headerImageOverlay}>
                            <TouchableOpacity
                                style={styles.imagePickerButton}
                                onPress={pickHeaderImage}
                            >
                                <Ionicons
                                    name="camera"
                                    size={24}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Profile Image */}
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={
                                profileImage
                                    ? { uri: profileImage }
                                    : {
                                          uri: `https://ui-avatars.com/api/?name=${name}&background=random`,
                                      }
                            }
                            style={styles.profileImage}
                        />
                        <TouchableOpacity
                            style={styles.profileImagePicker}
                            onPress={pickProfileImage}
                        >
                            <Ionicons name="camera" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <View style={styles.formField}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Add your name"
                                maxLength={50}
                            />
                            {errors.name && (
                                <Text style={styles.errorText}>
                                    {errors.name}
                                </Text>
                            )}
                            <Text style={styles.charCount}>
                                {name.length}/50
                            </Text>
                        </View>

                        <View style={styles.formField}>
                            <Text style={styles.label}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.bioInput]}
                                value={bio}
                                onChangeText={setBio}
                                placeholder="Add a bio to your profile"
                                multiline
                                maxLength={160}
                            />
                            {errors.bio && (
                                <Text style={styles.errorText}>
                                    {errors.bio}
                                </Text>
                            )}
                            <Text style={styles.charCount}>
                                {bio.length}/160
                            </Text>
                        </View>

                        <View style={styles.formField}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                value={location}
                                onChangeText={setLocation}
                                placeholder="Add your location"
                            />
                        </View>

                        <View style={styles.formField}>
                            <Text style={styles.label}>Website</Text>
                            <TextInput
                                style={styles.input}
                                value={website}
                                onChangeText={setWebsite}
                                placeholder="Add your website"
                                autoCapitalize="none"
                                keyboardType="url"
                            />
                            {errors.website && (
                                <Text style={styles.errorText}>
                                    {errors.website}
                                </Text>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#1DA1F2" />
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    saveButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#000",
    },
    saveButtonDisabled: {
        backgroundColor: "#CCCCCC",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    saveButtonTextDisabled: {
        color: "#666",
    },
    scrollView: {
        flex: 1,
    },
    headerImageContainer: {
        height: 150,
        position: "relative",
    },
    headerImage: {
        width: "100%",
        height: "100%",
    },
    headerImageOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    profileImageContainer: {
        marginTop: -50,
        marginLeft: 16,
        position: "relative",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#fff",
    },
    profileImagePicker: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    imagePickerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    formContainer: {
        padding: 16,
        paddingTop: 60, // Add space for profile image
    },
    formField: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#657786",
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#E1E8ED",
        paddingVertical: 8,
        fontSize: 16,
    },
    bioInput: {
        height: 80,
        textAlignVertical: "top",
    },
    errorText: {
        color: "#E0245E",
        fontSize: 12,
        marginTop: 4,
    },
    charCount: {
        textAlign: "right",
        color: "#657786",
        fontSize: 12,
        marginTop: 4,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default EditProfileScreen;
