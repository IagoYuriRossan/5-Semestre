import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export default function LoadingIndicator({ visible }) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator animating size="large" color="#4F46E5" />
      <Text style={styles.text}>Buscando endereço...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  text: {
    marginTop: 10,
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 14,
  },
});
