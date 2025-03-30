import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../navigation/RootNavigator'; // Import correct ParamList
import Input from '../components/Input';
import Button from '../components/Button';
import { signupUser, loginUser } from '../services/api'; // Import API functions

type Props = NativeStackScreenProps<AuthStackParamList, 'Auth'>; // Use correct ParamList

const AuthScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Add username for signup
  const [name, setName] = useState(''); // Optional name for signup
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isLogin) {
        if (!email || !password) {
          setError('Email and password are required.');
          setLoading(false);
          return;
        }
        response = await loginUser({ email, password });
      } else {
        if (!email || !password || !username) {
          setError('Username, email, and password are required for signup.');
          setLoading(false);
          return;
        }
        response = await signupUser({ email, password, username, name });
      }

      const { token, data } = response.data;

      // Store the token securely
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user)); // Store user data if needed
// Navigate to the main part of the app (e.g., Feed)
// The RootNavigator will automatically switch stacks when the token is set.
// navigation.replace('Feed'); // No need to call this directly here

} catch (err: any) {
console.error("Authentication Error:", err.response?.data || err.message);
      console.error("Authentication Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? 'Log In' : 'Sign Up'}</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!isLogin && (
          <>
            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
            />
             <Input
              label="Name (Optional)"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </>
        )}

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button
          title={isLogin ? 'Log In' : 'Sign Up'}
          onPress={handleAuth}
          loading={loading}
          disabled={loading || !email || !password || (!isLogin && !username)}
        />

        <Button
          title={isLogin ? 'Need an account? Sign Up' : 'Have an account? Log In'}
          onPress={() => {
            setIsLogin(!isLogin);
            setError(null);
            // Clear fields on toggle? Optional.
            // setEmail('');
            // setPassword('');
            // setUsername('');
            // setName('');
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
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14171A',
    marginBottom: 30,
  },
  errorText: {
      color: '#E0245E',
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 14,
  }
});

export default AuthScreen;