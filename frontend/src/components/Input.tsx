import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string; // Optional error message
  multiline?: boolean;
  numberOfLines?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : {},
          multiline ? styles.multilineInput : {}
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#AAB8C2" // Lighter placeholder text
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        textAlignVertical={multiline ? 'top' : 'center'} // Align text top for multiline
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%', // Ensure input takes full width available
  },
  label: {
    fontSize: 14,
    color: '#657786', // Twitter grey for label
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8ED', // Light border
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F5F8FA', // Very light background
    color: '#14171A', // Dark text color
  },
  multilineInput: {
      height: 100, // Default height for multiline
  },
  inputError: {
    borderColor: '#E0245E', // Red border for error
  },
  errorText: {
    color: '#E0245E', // Red text for error message
    fontSize: 12,
    marginTop: 5,
  },
});

export default Input;