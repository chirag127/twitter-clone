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

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const { login, isLoading, error, clearError } = useAuthStore();

    useEffect(() => {
        // Clear any previous errors when component mounts
        clearError();
    }, []);

    const validate = () => {
        const newErrors = {};

        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (validate()) {
            const result = await login(email, password);
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
                    <Text style={styles.title}>Log in to Twitter</Text>
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

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
                        setErrors({ ...errors, password: null, general: null });
                    }}
                    placeholder="Enter your password"
                    secureTextEntry
                    error={errors.password}
                />

                <Button
                    title="Log in"
                    onPress={handleLogin}
                    loading={isLoading}
                    style={styles.button}
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Don't have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.signupText}>Sign up</Text>
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
    signupText: {
        color: "#1DA1F2",
        fontWeight: "bold",
    },
});

export default LoginScreen;
