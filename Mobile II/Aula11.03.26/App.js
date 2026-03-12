import React from 'react';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './screens/HomeScreen';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    secondary: '#818CF8',
    background: '#F5F3FF',
    surface: '#FFFFFF',
    onSurface: '#1E1B4B',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <HomeScreen />
    </PaperProvider>
  );
}

