import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    autoCapitalize = "none",
    keyboardType = "default",
    style,
    error,
    multiline = false,
    numberOfLines = 1,
    maxLength,
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.multilineInput,
                    error && styles.errorInput,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                maxLength={maxLength}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#14171A",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E1E8ED",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#FFFFFF",
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: "top",
    },
    errorInput: {
        borderColor: "#E0245E",
    },
    errorText: {
        color: "#E0245E",
        fontSize: 12,
        marginTop: 4,
    },
});

export default Input;
