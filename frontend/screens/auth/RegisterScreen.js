import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import Input from "../../components/Input";
import Button from "../../components/Button";

// Store
import { useAuthStore } from "../../store/authStore";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const { register, isLoading, error, clearError } = useAuthStore();

    useEffect(() => {
        // Clear any previous errors when component mounts
        clearError();
    }, []);

    const validate = () => {
        const newErrors = {};

        if (!name) newErrors.name = "Name is required";
        if (!username) newErrors.username = "Username is required";
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        if (password !== confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (validate()) {
            const userData = {
                name,
                username,
                email,
                password,
            };

            const result = await register(userData);
            if (!result.success) {
                // If there was an error from the API, display it
                setErrors({ general: error });
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../assets/splash-icon.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Create your account</Text>
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <Input
                    label="Name"
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        setErrors({ ...errors, name: null, general: null });
                    }}
                    placeholder="Enter your name"
                    autoCapitalize="words"
                    error={errors.name}
                />

                <Input
                    label="Username"
                    value={username}
                    onChangeText={(text) => {
                        setUsername(text);
                        setErrors({ ...errors, username: null, general: null });
                    }}
                    placeholder="Enter a unique username"
                    error={errors.username}
                />

                <Input
                    label="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setErrors({ ...errors, email: null, general: null });
                    }}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    error={errors.email}
                />

                <Input
                    label="Password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setErrors({
                            ...errors,
                            password: null,
                            confirmPassword: null,
                            general: null,
                        });
                    }}
                    placeholder="Create a password (min. 6 characters)"
                    secureTextEntry
                    error={errors.password}
                />

                <Input
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        setErrors({
                            ...errors,
                            confirmPassword: null,
                            general: null,
                        });
                    }}
                    placeholder="Confirm your password"
                    secureTextEntry
                    error={errors.confirmPassword}
                />

                <Button
                    title="Sign up"
                    onPress={handleRegister}
                    loading={isLoading}
                    style={styles.button}
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.loginText}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#14171A",
    },
    errorText: {
        color: "#E0245E",
        marginBottom: 16,
        textAlign: "center",
    },
    button: {
        marginTop: 16,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 32,
    },
    footerText: {
        color: "#657786",
        marginRight: 4,
    },
    loginText: {
        color: "#1DA1F2",
        fontWeight: "bold",
    },
});

export default RegisterScreen;
