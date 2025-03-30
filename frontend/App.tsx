import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import RootNavigator from './src/navigation/RootNavigator';

// Optional: Define a custom theme or extend the default theme
// const theme = extendTheme({ colors: { ... } });

export default function App() {
  return (
    // Wrap the entire app with NativeBaseProvider
    // You can pass a custom theme object to the theme prop
    <NativeBaseProvider /* theme={theme} */>
      <RootNavigator />
    </NativeBaseProvider>
  );
}
