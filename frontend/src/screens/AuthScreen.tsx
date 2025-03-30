import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Input from '../components/Input'; // Import Input component
import Button from '../components/Button'; // Import Button component

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const AuthScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [loading, setLoading] = useState(false); // Loading state for buttons
  const [error, setError] = useState<string | null>(null); // Error message state

  const handleAuth = () => {
    setLoading(true);
    setError(null);
    // Simulate API call
    console.log(`Attempting ${isLogin ? 'Login' : 'Register'} with:`, { email, password });
    setTimeout(() => {
      // Replace with actual API call logic
      // On success: navigate to Feed or Profile
      // On error: setError('Invalid credentials or user exists');
      setLoading(false);
      // Example error:
      // setError('Authentication failed. Please check your credentials.');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? 'Log In' : 'Sign Up'}</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          error={error && error.includes('email') ? error : undefined} // Example specific error handling
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          error={error && error.includes('password') ? error : undefined}
        />

        <Button
          title={isLogin ? 'Log In' : 'Sign Up'}
          onPress={handleAuth}
          loading={loading}
          disabled={loading || !email || !password} // Disable if loading or fields empty
        />

        <Button
          title={isLogin ? 'Need an account? Sign Up' : 'Have an account? Log In'}
          onPress={() => {
            setIsLogin(!isLogin);
            setError(null); // Clear errors on toggle
          }}
          variant="secondary"
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400, // Max width for larger screens
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14171A', // Twitter dark text
    marginBottom: 30,
  },
  errorText: {
      color: '#E0245E',
      marginBottom: 15,
      textAlign: 'center',
  }
});

export default AuthScreen;