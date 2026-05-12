import { Ionicons } from '@expo/vector-icons';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Colors } from '../src/constants/theme';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textMuted,
            tabBarStyle: {
              backgroundColor: Colors.card,
              borderTopWidth: 0,
              height: 68,
              paddingBottom: 10,
              paddingTop: 6,
              elevation: 12,
              shadowColor: Colors.primary,
              shadowOpacity: 0.08,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: -6 },
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              letterSpacing: 0.3,
            },
            headerStyle: {
              backgroundColor: Colors.primary,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: Colors.textOnPrimary,
            headerTitleStyle: { fontWeight: '700', fontSize: 17, letterSpacing: 0.3 },
          }}
        >
          <Tabs.Screen
            name="cadastro"
            options={{
              title: 'Cadastro',
              tabBarLabel: 'Cadastro',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-add" size={size} color={color} />
              ),
              headerTitle: 'Cadastrar Usuário',
            }}
          />
          <Tabs.Screen
            name="lista"
            options={{
              title: 'Usuários',
              tabBarLabel: 'Usuários',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people" size={size} color={color} />
              ),
              headerTitle: 'Usuários Cadastrados',
            }}
          />
          <Tabs.Screen
            name="admin"
            options={{
              title: 'Admin',
              tabBarLabel: 'Admin',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="shield-checkmark" size={size} color={color} />
              ),
              headerTitle: 'Painel Administrativo',
            }}
          />
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen name="+not-found" options={{ href: null }} />
        </Tabs>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
