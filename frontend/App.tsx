import React from 'react';
import { NativeBaseProvider, extendTheme, StorageManager, ColorMode } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigator from './src/navigation/RootNavigator';

// Define the color mode manager to persist the theme
const colorModeManager: StorageManager = {
  get: async () => {
    try {
      let val = await AsyncStorage.getItem('@color-mode');
      return val === 'dark' ? 'dark' : 'light';
    } catch (e) {
      console.log(e);
      return 'dark'; // Default to dark if error
    }
  },
  set: async (value: ColorMode) => {
    try {
      if (value) { // Ensure value is not null or undefined
        await AsyncStorage.setItem('@color-mode', value);
      }
    } catch (e) {
      console.log(e);
    }
  },
};

// Define a theme configuration forcing dark mode
const config = {
  useSystemColorMode: false, // Don't use system theme
  initialColorMode: 'dark', // Set initial mode to dark
};

// Extend the theme
const customTheme = extendTheme({ config });


export default function App() {
  return (
    // Pass the custom theme and color mode manager
    <NativeBaseProvider theme={customTheme} colorModeManager={colorModeManager}>
      <RootNavigator />
    </NativeBaseProvider>
  );
}
