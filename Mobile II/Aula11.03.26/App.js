import React from 'react';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './screens/HomeScreen';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563EB',
    secondary: '#6366F1',
    background: '#F0F4F8',
    surface: '#FFFFFF',
    onSurface: '#1E293B',
    onSurfaceVariant: '#94A3B8',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <HomeScreen />
    </PaperProvider>
  );
}

