import React from 'react';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './screens/HomeScreen';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1A1A2E',
    secondary: '#6C6C80',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    onSurface: '#1A1A2E',
    onSurfaceVariant: '#9CA3AF',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <HomeScreen />
    </PaperProvider>
  );
}

