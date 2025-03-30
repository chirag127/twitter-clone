import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeBaseProvider, Box, Spinner } from 'native-base'; // Import NativeBaseProvider here too

// Layout
import MainLayout from '../components/MainLayout';

// Screens
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/AuthScreen';
// Import other main screens here as they are created (e.g., Explore, Notifications)

// Define Param Lists for Stacks
export type AuthStackParamList = {
  Auth: undefined;
};

export type AppStackParamList = {
  Feed: undefined;
  Profile: { userId: string };
  // Add other main screens here
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

// Auth Navigator (only AuthScreen)
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Auth" component={AuthScreen} />
  </AuthStack.Navigator>
);

// Main App Navigator (screens wrapped in MainLayout)
const AppNavigator = () => (
  <MainLayout>
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Feed" component={FeedScreen} />
      <AppStack.Screen name="Profile" component={ProfileScreen} />
      {/* Add other main screens here */}
    </AppStack.Navigator>
  </MainLayout>
);


// Root Navigator decides which stack to show based on auth state
const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for token on app start
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setUserToken(token);
      } catch (e) {
        console.error("Failed to load auth token", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  if (isLoading) {
    // Show a loading spinner while checking token
    // Wrap with NativeBaseProvider if not already done in App.tsx
    // (Assuming App.tsx already has NativeBaseProvider)
    return (
       <Box flex={1} justifyContent="center" alignItems="center">
         <Spinner size="lg" />
       </Box>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;

// Note: We'll need a proper state management solution (Context/Zustand)
// to handle login/logout updates more effectively than this basic useEffect check.