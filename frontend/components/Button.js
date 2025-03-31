import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

const Button = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false,
    loading = false,
    primary = true,
    outline = false,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                primary && !outline && styles.primaryButton,
                outline && styles.outlineButton,
                disabled && styles.disabledButton,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={outline ? "#1DA1F2" : "#FFFFFF"}
                />
            ) : (
                <Text
                    style={[
                        styles.buttonText,
                        primary && !outline && styles.primaryButtonText,
                        outline && styles.outlineButtonText,
                        disabled && styles.disabledButtonText,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
    },
    primaryButton: {
        backgroundColor: "#1DA1F2",
    },
    outlineButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#1DA1F2",
    },
    disabledButton: {
        backgroundColor: "#AAB8C2",
        borderColor: "#AAB8C2",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    primaryButtonText: {
        color: "#FFFFFF",
    },
    outlineButtonText: {
        color: "#1DA1F2",
    },
    disabledButtonText: {
        color: "#FFFFFF",
    },
});

export default Button;
